'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Task, TaskListResponse, TASK_STATUS_CONFIG, PRIORITY_CONFIG } from '@/types/task'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { useTheme } from '@/contexts/ThemeContext'
import { useToast } from '@/contexts/ToastContext'
import {
  Check,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  Play,
  BarChart3,
  Sparkles,
  RefreshCw,
  List,
  Grid3X3,
  X,
  MoreVertical
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { taskStore } from '@/stores/taskStore'
import { TaskFormModal } from './TaskFormModal'
import { CreateTaskRequest, UpdateTaskRequest } from '@/types/task'
import { tasksApi, chatApi } from '@/lib/api'

interface TaskDetailProps {
  taskId: number
  onBack: () => void
  onStartFocus?: (taskId: number, taskTitle: string) => void
}

// Get priority border color matching mobile app
const getPriorityBorderColor = (priority: Task['priority']): string => {
  return PRIORITY_CONFIG[priority]?.color || '#E5E7EB' // Use PRIORITY_CONFIG colors or default gray
}

export default function TaskDetail({ taskId, onBack, onStartFocus }: TaskDetailProps) {
  console.log('TaskDetail component rendered with taskId:', taskId)
  const colors = useThemeColors()
  const { t } = useLocalization()
  const { showSuccess, showError, showInfo } = useToast()
  const { actualTheme } = useTheme()
  const pageBackgroundStyle = { backgroundColor: colors.background }
  const [task, setTask] = useState<Task | null>(null)
  const [subtasks, setSubtasks] = useState<Task[]>([])
  const [loadingTask, setLoadingTask] = useState(true)
  const [loadingSubtasks, setLoadingSubtasks] = useState(false)
  const [decomposing, setDecomposing] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [subtaskViewMode, setSubtaskViewMode] = useState<'compact' | 'detailed'>('compact')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingTask, setDeletingTask] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDecomposeConfirm, setShowDecomposeConfirm] = useState(false)
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false)
  const [clearingAllSubtasks, setClearingAllSubtasks] = useState(false)
  const [showDeleteSubtaskConfirm, setShowDeleteSubtaskConfirm] = useState<number | null>(null)
  const [deletingSubtaskId, setDeletingSubtaskId] = useState<number | null>(null)
  const [editingSubtask, setEditingSubtask] = useState<Task | null>(null)
  const [isSubmittingSubtask, setIsSubmittingSubtask] = useState(false)

  // 加载子任务的独立函数
  const loadTaskSubtasks = useCallback(async (taskId: number) => {
    setLoadingSubtasks(true)
    try {
      const response = await tasksApi.getTasks({
        parentId: taskId,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'asc'
      })

      if (response.success && response.data) {
        const data = response.data as TaskListResponse | Task[]

        if (Array.isArray(data)) {
          setSubtasks(data)
        } else if (Array.isArray(data.tasks)) {
          setSubtasks(data.tasks)
        } else {
          setSubtasks([])
        }
      } else {
        setSubtasks([])
      }
    } catch (error) {
      console.error('Failed to load subtasks:', error)
      setSubtasks([])
    } finally {
      setLoadingSubtasks(false)
    }
  }, [])

  // Load task details from taskStore first, then fallback to API if needed
  const loadTaskDetail = useCallback(async () => {
    setLoadingTask(true)

    let resolvedTask: Task | null = null

    try {
      const cachedTask = taskStore.getTask(taskId)

      if (cachedTask) {
        console.log('Found cached task:', cachedTask)
        resolvedTask = cachedTask
      } else {
        const response = await tasksApi.getTask(taskId)

        if (response.success && response.data) {
          const fetchedTask = response.data as Task
          resolvedTask = fetchedTask
          taskStore.setTask(fetchedTask)
        } else {
          const errorMessage = typeof response.error === 'string'
            ? response.error
            : response.message || 'Failed to fetch task detail'
          throw new Error(errorMessage)
        }
      }

      setTask(resolvedTask)
    } catch (error) {
      console.error('Failed to load task detail:', error)
      setTask(null)
    } finally {
      setLoadingTask(false)
    }

    if (!resolvedTask) {
      setSubtasks([])
      return
    }

    // 加载子任务
    await loadTaskSubtasks(resolvedTask.id)
  }, [taskId, loadTaskSubtasks])

  useEffect(() => {
    if (taskId) {
      loadTaskDetail()
    }
  }, [taskId, loadTaskDetail])

  // Format date helpers
  const formatDate = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      return format(parseISO(dateString), 'MM/dd HH:mm', { locale: zhCN })
    } catch {
      return dateString
    }
  }

  const formatCompletedDate = (dateString: string | null) => {
    if (!dateString) return ''
    try {
      const date = parseISO(dateString)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

      if (taskDate.getTime() === today.getTime()) {
        return t('tasks.date_format.completed_today')
      } else {
        return `${format(date, 'MM/dd', { locale: zhCN })} ${t('tasks.actions.complete')}`
      }
    } catch {
      return dateString
    }
  }

  // Check if task is overdue
  const isOverdue = task?.dueDateLocal && task.status !== 'COMPLETED' &&
    new Date(task.dueDateLocal) < new Date()

  // Calculate progress
  const calculateProgress = (): number => {
    if (task?.status === 'COMPLETED') return 100

    const hasSubtasks = task?._count && task._count.subTasks > 0
    if (hasSubtasks && task?._count!.subTasks > 0) {
      return Math.round((task._count!.completedSubTasks / task._count!.subTasks) * 100)
    }

    switch (task?.status) {
      case 'PENDING': return 0
      case 'IN_PROGRESS': return 50
      case 'CANCELLED': return 0
      default: return 0
    }
  }

  // Handler functions
  const handleToggleStatus = async () => {
    if (!task) return
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    setTask({ ...task, status: newStatus })
  }

  const handleEditSubmit = async (taskData: CreateTaskRequest & { status?: Task['status'] }) => {
    if (!task) return

    try {
      setIsSubmitting(true)

      // 乐观更新：立即更新本地状态
      const optimisticTask = {
        ...task,
        ...taskData,
        _isOptimistic: true,
        updatedAt: new Date().toISOString(),
        updatedAtLocal: new Date().toISOString()
      }
      setTask(optimisticTask)
      taskStore.setTask(optimisticTask)

      // 关闭 modal
      setShowEditModal(false)

      // 调用实际的API更新任务
      const response = await tasksApi.updateTask(task.id, {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate
      })

      if (response.success && response.data) {
        // API 调用成功，使用服务器返回的数据更新本地状态
        const updatedTask = {
          ...optimisticTask,
          ...response.data,
          _isOptimistic: false
        }
        setTask(updatedTask)
        taskStore.setTask(updatedTask)
      } else {
        // API 调用失败，恢复原始任务状态
        console.error('Failed to update task:', response.error?.message)
        setTask(task)
        taskStore.setTask(task)

        // 重新打开 modal 让用户重试
        setShowEditModal(true)
      }

    } catch (error) {
      console.error('Failed to update task:', error)
      // 如果API调用失败，恢复原始任务状态
      setTask(task)
      taskStore.setTask(task)

      // 重新打开 modal 让用户重试
      setShowEditModal(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditClose = () => {
    if (!isSubmitting) {
      setShowEditModal(false)
    }
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (!task || deletingTask) return

    try {
      setDeletingTask(true)

      const response = await tasksApi.deleteTask(task.id)

      if (!response.success) {
        const errorMessage = typeof response.error === "string"
          ? response.error
          : response.error?.message || response.message || t('tasks.delete_failed_desc')
        throw new Error(errorMessage)
      }

      const currentFocusTask = taskStore.getCurrentFocusTask()
      const isCurrentFocusTask = currentFocusTask?.id === task.id

      taskStore.removeTask(task.id)
      if (isCurrentFocusTask) {
        taskStore.clearCurrentFocusTask()
      }

      setShowDeleteConfirm(false)
      setShowEditModal(false)
      setTask(null)
      setSubtasks([])

      showSuccess(t('tasks.actions.delete_success'), t('tasks.delete_success_desc'))

      onBack()
    } catch (error) {
      console.error('Failed to delete task:', error)
      const message = error instanceof Error ? error.message : t('tasks.delete_failed_desc')
      showError(t('tasks.actions.delete_error'), message)
    } finally {
      setDeletingTask(false)
    }
  }
  const handleStartFocus = () => {
    if (task) {
      // 将任务存储到全局缓存
      taskStore.setTask(task)
      window.location.href = `/focus?taskId=${task.id}`
    }
  }

  const handleDecomposeTask = async () => {
    if (!task) return

    // 前端预检查：如果已有子任务，提示用户
    if (subtasks.length > 0) {
      showInfo(t('tasks.detail.task_already_decomposed'), t('tasks.detail.no_subtasks_desc'))
      return
    }

    // 显示确认弹窗
    setShowDecomposeConfirm(true)
  }

  // 确认执行AI拆解
  const confirmDecomposeTask = async () => {
    if (!task) return

    try {
      setDecomposing(true)
      setShowDecomposeConfirm(false)

      // 调用AI拆解API
      const response = await chatApi.decomposeTask(task.id.toString(), task.title)

      if (response.success && response.data && Array.isArray(response.data)) {
        // 更新子任务列表
        setSubtasks(response.data)
        showSuccess(t('tasks.detail.decompose_complete'), t('tasks.detail.decompose_result', { count: response.data.length }))
        console.log(`AI decomposition successful: Created ${response.data.length} subtasks`)
      } else {
        // 处理API返回的错误
        const errorMessage = response.error?.message || t('tasks.detail.decompose_error')
        showError(t('tasks.detail.decompose_failed'), errorMessage)
        console.error('AI decomposition failed:', errorMessage)
      }
    } catch (error: any) {
      console.error('AI decomposition request failed:', error)

      // 处理特定的错误类型
      if (error.response?.status === 409) {
        // 任务已经被拆解过了
        showInfo(t('tasks.detail.task_already_decomposed'), t('tasks.detail.task_already_decomposed'))
        await loadTaskSubtasks(task.id)
      } else if (error.response?.data?.error) {
        showError(t('tasks.detail.decompose_failed'), error.response.data.error)
      } else {
        showError(t('tasks.detail.decompose_failed'), t('tasks.detail.decompose_error'))
      }
    } finally {
      setDecomposing(false)
    }
  }

  const handleSubtaskToggle = async (subtaskId: number, currentStatus: Task['status']) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    const previousSubtasks = subtasks

    const applyCounts = (list: Task[]) => {
      const total = list.length
      const completed = list.filter(subtask => subtask.status === 'COMPLETED').length

      setTask(prev => {
        if (!prev) return prev
        const updated = {
          ...prev,
          _count: {
            subTasks: total,
            completedSubTasks: completed
          }
        }
        taskStore.setTask(updated)
        return updated
      })

    }

    const optimisticSubtasks = previousSubtasks.map(subtask =>
      subtask.id === subtaskId ? { ...subtask, status: newStatus, _isOptimistic: true } : subtask
    )

    setSubtasks(optimisticSubtasks)
    applyCounts(optimisticSubtasks)

    try {
      const response = await tasksApi.updateTask(subtaskId, { status: newStatus })

      if (!response.success || !response.data) {
        throw new Error(typeof response.error === 'string' ? response.error : response.error?.message)
      }

      const updatedSubtask = response.data as Task
      const syncedSubtasks = optimisticSubtasks.map(subtask =>
        subtask.id === subtaskId ? updatedSubtask : subtask
      )

      setSubtasks(syncedSubtasks)
      applyCounts(syncedSubtasks)
    } catch (error) {
      console.error('Failed to toggle subtask status:', error)
      setSubtasks(previousSubtasks)
      applyCounts(previousSubtasks)
      showError(
        t('tasks.actions.update_failed'),
        error instanceof Error ? error.message : t('errors.unknown')
      )
    }
  }

  const handleClearAllSubtasks = () => {
    setShowClearAllConfirm(true)
  }

  const confirmClearAllSubtasks = async () => {
    if (subtasks.length === 0 || !task) return

    try {
      setClearingAllSubtasks(true)

      // Call the correct backend API to delete all subtasks
      const response = await tasksApi.deleteAllSubtasks(task.id)

      if (response.success) {
        // Successfully deleted - clear local state
        setSubtasks([])
        setShowClearAllConfirm(false)
        showSuccess(t('tasks.detail.clear_all_success'))

        // Refresh the subtasks to ensure we have the latest state
        await loadTaskSubtasks(task.id)
      } else {
        // API returned error
        console.error('Failed to clear all subtasks:', response.error?.message)
        showError(t('tasks.detail.clear_all_error'), response.error?.message || t('tasks.detail.clear_all_error'))
        setShowClearAllConfirm(false)
      }
    } catch (error: any) {
      console.error('Failed to clear all subtasks:', error)
      showError(t('tasks.detail.clear_all_error'), error.message || t('tasks.detail.clear_all_error'))
      setShowClearAllConfirm(false)
    } finally {
      setClearingAllSubtasks(false)
    }
  }

  const handleDeleteSubtask = (subtaskId: number) => {
    setShowDeleteSubtaskConfirm(subtaskId)
  }

  const handleEditSubtaskSubmit = async (taskData: CreateTaskRequest & { status?: Task['status'] }) => {
    if (!editingSubtask) return

    try {
      setIsSubmittingSubtask(true)

      // 乐观更新：立即更新本地状态
      const optimisticSubtask = {
        ...editingSubtask,
        ...taskData,
        _isOptimistic: true,
        updatedAt: new Date().toISOString(),
        updatedAtLocal: new Date().toISOString()
      }

      setSubtasks(prev => prev.map(subtask =>
        subtask.id === editingSubtask.id ? optimisticSubtask : subtask
      ))

      // 关闭 modal
      setEditingSubtask(null)

      // 调用实际的API更新子任务
      const response = await tasksApi.updateTask(editingSubtask.id, {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        status: taskData.status,
        dueDate: taskData.dueDate
      })

      if (response.success && response.data) {
        // API 调用成功，使用服务器返回的数据更新本地状态
        const updatedSubtask = {
          ...optimisticSubtask,
          ...response.data,
          _isOptimistic: false
        }
        setSubtasks(prev => prev.map(subtask =>
          subtask.id === editingSubtask.id ? updatedSubtask : subtask
        ))
        showSuccess(t('tasks.actions.update_success'))
      } else {
        // API 调用失败，恢复原始子任务状态
        console.error('Failed to update subtask:', response.error?.message)
        setSubtasks(prev => prev.map(subtask =>
          subtask.id === editingSubtask.id ? editingSubtask : subtask
        ))
        showError(t('tasks.actions.update_error'), response.error?.message || t('tasks.actions.update_error'))

        // 重新打开 modal 让用户重试
        setEditingSubtask(editingSubtask)
      }

    } catch (error) {
      console.error('Failed to update subtask:', error)
      // 如果API调用失败，恢复原始子任务状态
      setSubtasks(prev => prev.map(subtask =>
        subtask.id === editingSubtask.id ? editingSubtask : subtask
      ))
      showError(t('tasks.actions.update_error'), error instanceof Error ? error.message : t('tasks.actions.update_error'))

      // 重新打开 modal 让用户重试
      setEditingSubtask(editingSubtask)
    } finally {
      setIsSubmittingSubtask(false)
    }
  }

  const handleEditSubtaskClose = () => {
    if (!isSubmittingSubtask) {
      setEditingSubtask(null)
    }
  }

  const confirmDeleteSubtask = async () => {
    const subtaskId = showDeleteSubtaskConfirm
    if (!subtaskId || !task) return

    try {
      setDeletingSubtaskId(subtaskId)

      // Call the backend API to delete the specific subtask
      const response = await tasksApi.deleteTask(subtaskId)

      if (response.success) {
        // Successfully deleted - remove from local state
        setSubtasks(prev => prev.filter(subtask => subtask.id !== subtaskId))
        setShowDeleteSubtaskConfirm(null)
        showSuccess(t('tasks.actions.delete_success'))

        // Refresh the subtasks to ensure we have the latest state
        await loadTaskSubtasks(task.id)
      } else {
        // API returned error
        console.error('Failed to delete subtask:', response.error?.message)
        showError(t('tasks.actions.delete_error'), response.error?.message || t('tasks.actions.delete_error'))
        setShowDeleteSubtaskConfirm(null)
      }
    } catch (error: any) {
      console.error('Failed to delete subtask:', error)
      showError(t('tasks.actions.delete_error'), error.message || t('tasks.actions.delete_error'))
      setShowDeleteSubtaskConfirm(null)
    } finally {
      setDeletingSubtaskId(null)
    }
  }

  const progress = calculateProgress()
  const statusConfig = task ? TASK_STATUS_CONFIG[task.status] : null
  const priorityConfig = task ? PRIORITY_CONFIG[task.priority] : null

  // Calculate subtask statistics
  const subtaskStats = {
    total: subtasks.length,
    completed: subtasks.filter(st => st.status === 'COMPLETED').length,
    pending: subtasks.filter(st => st.status === 'PENDING').length,
    inProgress: subtasks.filter(st => st.status === 'IN_PROGRESS').length,
  }

  const completionRate = subtaskStats.total > 0
    ? Math.round((subtaskStats.completed / subtaskStats.total) * 100)
    : 0

  if (loadingTask) {
    return (
      <div className="h-full flex items-center justify-center" style={pageBackgroundStyle}>
        <div className="text-center text-card-foreground">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('tasks.detail.loading')}...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="h-full flex items-center justify-center" style={pageBackgroundStyle}>
        <div className="text-center text-card-foreground">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">{t('tasks.detail.task_not_found')}</h3>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t('tasks.detail.back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" style={pageBackgroundStyle}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 border-b flex-shrink-0 h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: colors.textSecondary }} />
          </button>
          <h1 className="text-xl font-semibold" style={{ color: colors.text }}>{t('tasks.detail.title')}</h1>
        </div>
        <button
          onClick={handleEdit}
          className="p-2.5 rounded-lg transition-colors"
          style={{
            backgroundColor: 'rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
        >
          <Edit className="w-[18px] h-[18px]" style={{ color: colors.button?.primary || '#3B82F6' }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-lg mx-auto p-4 space-y-3 sm:max-w-2xl lg:max-w-4xl sm:p-6 sm:space-y-6">
          {/* Main Task Card */}
          <div
            className="bg-white dark:bg-gray-700 text-card-foreground rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden shadow-sm mb-2 sm:mb-0"
            style={{
              borderLeft: `3px solid ${getPriorityBorderColor(task.priority)}`
            }}
          >
            <div className="flex items-start p-3 sm:p-4">
              {/* Status Toggle */}
              <button
                onClick={handleToggleStatus}
                className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 mt-0.5
                  transition-colors duration-200
                  ${task.status === 'COMPLETED' ? '' : 'hover:border-green-400'}
                `}
                style={{
                  borderColor: task.status === 'COMPLETED'
                    ? '#22c55e'
                    : actualTheme === 'dark'
                      ? '#FFFFFF'
                      : colors.border,
                  backgroundColor: task.status === 'COMPLETED' ? '#22c55e' : 'transparent'
                }}
              >
                {task.status === 'COMPLETED' && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1 min-w-0">
                <h2 className={`
                  text-base font-medium mb-2 leading-tight
                  ${task.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}
                `}>
                  {task.title}
                </h2>

                {/* Task Description */}
                {task.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {task.description}
                  </p>
                )}

                {/* Status and Priority Badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Status Badge */}
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium"
                    style={{
                      backgroundColor: statusConfig!.color + '20',
                      color: statusConfig!.color
                    }}
                  >
                    {task.status === 'COMPLETED' ? t('tasks.status.COMPLETED') :
                     task.status === 'IN_PROGRESS' ? t('tasks.status.IN_PROGRESS') :
                     task.status === 'PENDING' ? t('tasks.status.PENDING') : t('tasks.status.CANCELLED')}
                  </span>

                  {/* Priority Badge */}
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium"
                    style={{
                      backgroundColor: priorityConfig!.color + '20',
                      color: priorityConfig!.color
                    }}
                  >
                    {t('tasks.priority.' + task.priority)}
                  </span>

                  {/* Due Date */}
                  {task.status === 'COMPLETED' ? (
                    task.completedAtLocal && (
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium gap-1"
                        style={{ backgroundColor: statusConfig!.color + '20', color: statusConfig!.color }}
                      >
                        <CheckCircle className="w-3 h-3" />
                        {formatCompletedDate(task.completedAtLocal)}
                      </span>
                    )
                  ) : (
                    task.dueDateLocal && (
                      <span
                        className={`
                          inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium gap-1
                          ${isOverdue
                            ? 'bg-red-500/15 text-red-600'
                            : 'bg-muted/60 text-muted-foreground'
                          }
                        `}
                      >
                        {isOverdue && <AlertTriangle className="w-3 h-3" />}
                        <Clock className="w-3 h-3" />
                        {formatDate(task.dueDateLocal)}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Focus Button */}
              {task.status !== 'COMPLETED' && (
                <button
                  onClick={handleStartFocus}
                  className="p-1 ml-2"
                >
                  {/* Orange circular background with white triangle focus button matching mobile */}
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F97316' }}>
                    <div
                      className="w-0 h-0 ml-0.5"
                      style={{
                        borderLeft: '14px solid white',
                        borderTop: '8.1px solid transparent',
                        borderBottom: '8.1px solid transparent'
                      }}
                    />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Subtask Statistics */}
          <div className="bg-white dark:bg-gray-700 text-card-foreground rounded-xl border border-gray-200 dark:border-gray-600 p-4 shadow-sm mb-2 sm:mb-0 sm:p-6">
            <h3 className="text-base font-semibold text-foreground mb-3">{t('tasks.detail.subtask_progress')}</h3>
            <div className="grid grid-cols-4 gap-3 mb-3">
              <div className="text-center">
                <div className="text-lg font-bold text-foreground">{subtaskStats.total}</div>
                <div className="text-xs text-muted-foreground">{t('tasks.stats.total')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: '#10B981' }}>{subtaskStats.completed}</div>
                <div className="text-xs text-muted-foreground">{t('tasks.status.COMPLETED')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: '#3B82F6' }}>{subtaskStats.inProgress}</div>
                <div className="text-xs text-muted-foreground">{t('tasks.status.IN_PROGRESS')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>{subtaskStats.pending}</div>
                <div className="text-xs text-muted-foreground">{t('tasks.status.PENDING')}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-muted/60 rounded-full h-1 overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${completionRate}%`,
                  backgroundColor: '#10B981' // Green color matching mobile
                }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">{t('tasks.stats.completion_rate')}: {completionRate}%</p>
          </div>

          {/* AI Decompose Button */}
          <button
            onClick={handleDecomposeTask}
            disabled={decomposing || showDecomposeConfirm}
            className={`
              w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors
              ${subtasks.length > 0
                ? 'bg-muted/60 text-muted-foreground border border-gray-200 dark:border-gray-600'
                : 'text-white hover:opacity-90 shadow-sm'
              }
              ${(decomposing || showDecomposeConfirm) ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            style={{
              backgroundColor: subtasks.length > 0 ? undefined : '#F97316' // Orange color matching mobile
            }}
          >
            {decomposing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {decomposing ? t('tasks.detail.decomposing') : (subtasks.length > 0 ? t('tasks.detail.already_decomposed') : t('tasks.detail.ai_decompose'))}
          </button>

          {/* Subtasks List */}
          <div className="bg-white dark:bg-gray-700 text-card-foreground rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm mb-2 sm:mb-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-600 sm:p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-foreground">{t('tasks.detail.subtask_list')}</h3>
                <div className="flex items-center gap-2">
                  {/* Clear All Button - only show in detailed view when there are subtasks */}
                  {subtasks.length > 0 && subtaskViewMode === 'detailed' && (
                    <button
                      onClick={handleClearAllSubtasks}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-500/10 border border-red-200 dark:border-red-500/40 rounded-lg hover:bg-red-500/15 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      {t('tasks.detail.clear_all')}
                    </button>
                  )}

                  {subtasks.length > 0 && (
                    <button
                      onClick={() => setSubtaskViewMode(subtaskViewMode === 'detailed' ? 'compact' : 'detailed')}
                      className="p-1.5 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      {subtaskViewMode === 'detailed' ? (
                        <List className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Grid3X3 className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {subtasks.length === 0 ? (
                <div className="text-center py-8 text-card-foreground">
                  <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h4 className="text-base font-medium text-foreground mb-2">{t('tasks.detail.no_subtasks')}</h4>
                  <p className="text-sm text-muted-foreground">{t('tasks.detail.no_subtasks_desc')}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {subtasks
                    .sort((a, b) => {
                      // Extract order number from title for sorting
                      const getOrderNumber = (title: string) => {
                        const match = title.match(/^(\d+)\./);
                        return match ? parseInt(match[1]) : 999;
                      };
                      return getOrderNumber(a.title) - getOrderNumber(b.title);
                    })
                    .map((subtask) => (
                      <div
                        key={subtask.id}
                        className={`
                          rounded-lg p-3 transition-colors border
                          ${subtask.status === 'COMPLETED'
                            ? 'bg-muted/40 border-gray-200 dark:border-gray-600'
                            : 'bg-white dark:bg-gray-600/60 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          {/* Status Toggle */}
                          <button
                            onClick={() => handleSubtaskToggle(subtask.id, subtask.status)}
                            className={`
                              w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5
                              ${subtask.status === 'COMPLETED' ? '' : 'hover:border-green-400'}
                            `}
                            style={{
                              borderColor: subtask.status === 'COMPLETED'
                                ? '#22c55e'
                                : actualTheme === 'dark'
                                  ? '#FFFFFF'
                                  : colors.border,
                              backgroundColor: subtask.status === 'COMPLETED' ? '#22c55e' : 'transparent'
                            }}
                          >
                            {subtask.status === 'COMPLETED' && (
                              <Check className="w-2.5 h-2.5 text-white" />
                            )}
                          </button>

                          {/* Subtask Content */}
                          <div className="flex-1 min-w-0 text-card-foreground">
                            <h4 className={`
                              text-sm font-medium mb-1
                              ${subtask.status === 'COMPLETED' ? 'line-through text-muted-foreground' : 'text-foreground'}
                            `}>
                              {subtask.title}
                            </h4>
                            {subtask.description && (
                              <p className="text-sm text-muted-foreground">
                                {subtask.description}
                              </p>
                            )}
                          </div>

                          {/* Action buttons for detailed view */}
                          {subtaskViewMode === 'detailed' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => setEditingSubtask(subtask)}
                                className="p-1 hover:bg-muted/50 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubtask(subtask.id)}
                                disabled={deletingSubtaskId === subtask.id}
                                className="p-1 hover:bg-red-500/15 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-4 h-4 text-red-400" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Subtask Confirmation Modal */}
      {showDeleteSubtaskConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          {/* 调整弹窗定位：排除左侧sidebar (256px) */}
          <div
            className="flex items-center justify-center h-full"
            style={{
              marginLeft: '256px', // 排除左侧sidebar宽度
              width: 'calc(100vw - 256px)' // 在剩余空间内居中
            }}
          >
            <div className="bg-white dark:bg-gray-800 text-card-foreground rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg">
              {/* 标题 - 居中显示 */}
              <h3 className="text-lg font-semibold text-foreground text-center mb-3">
                {t('tasks.actions.confirm_delete_title')}
              </h3>

              {/* 消息内容 - 居中显示 */}
              <p className="text-sm text-muted-foreground text-center leading-5 mb-6">
                {t('tasks.actions.confirm_delete_subtask')}
              </p>

              {/* 按钮组 - 水平排列 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteSubtaskConfirm(null)}
                  disabled={deletingSubtaskId !== null}
                  className="flex-1 px-6 py-3 text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('tasks.actions.cancel')}
                </button>
                <button
                  onClick={confirmDeleteSubtask}
                  disabled={deletingSubtaskId !== null}
                  className="flex-1 px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deletingSubtaskId ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t('tasks.actions.deleting')}
                    </>
                  ) : (
                    t('tasks.actions.delete')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 text-card-foreground rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-foreground">{t('tasks.actions.confirm_delete_title')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('tasks.actions.confirm_delete_message', { title: task.title })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deletingTask}
                className="px-4 py-2 text-muted-foreground border border-border/60 rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('tasks.actions.cancel')}
              </button>
              <button
                onClick={confirmDelete}
                disabled={deletingTask}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deletingTask ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    {t('tasks.actions.deleting')}
                  </>
                ) : (
                  t('tasks.actions.delete')
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Decompose Confirmation Modal */}
      {showDecomposeConfirm && task && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          {/* 调整弹窗定位：排除左侧sidebar (256px) */}
          <div
            className="flex items-center justify-center h-full"
            style={{
              marginLeft: '256px', // 排除左侧sidebar宽度
              width: 'calc(100vw - 256px)' // 在剩余空间内居中
            }}
          >
            <div className="bg-white dark:bg-gray-800 text-card-foreground rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg">
              {/* 标题 - 居中显示 */}
              <h3 className="text-lg font-semibold text-foreground text-center mb-3">
                {t('tasks.detail.ai_decompose_title')}
              </h3>

              {/* 消息内容 - 居中显示 */}
              <p className="text-sm text-muted-foreground text-center leading-5 mb-6">
                {t('tasks.detail.ai_decompose_message', { title: task.title })}
              </p>

              {/* 按钮组 - 水平排列 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDecomposeConfirm(false)}
                  className="flex-1 px-6 py-3 text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center font-semibold"
                >
                  {t('tasks.actions.cancel')}
                </button>
                <button
                  onClick={confirmDecomposeTask}
                  disabled={decomposing}
                  className="flex-1 px-6 py-3 text-white rounded-lg transition-colors text-center font-semibold flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: '#F97316',
                    opacity: decomposing ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !decomposing && (e.currentTarget.style.backgroundColor = '#EA580C')}
                  onMouseLeave={(e) => !decomposing && (e.currentTarget.style.backgroundColor = '#F97316')}
                >
                  {decomposing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t('tasks.detail.decomposing')}
                    </>
                  ) : (
                    t('tasks.detail.start_decompose')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Subtasks Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          {/* 调整弹窗定位：排除左侧sidebar (256px) */}
          <div
            className="flex items-center justify-center h-full"
            style={{
              marginLeft: '256px', // 排除左侧sidebar宽度
              width: 'calc(100vw - 256px)' // 在剩余空间内居中
            }}
          >
            <div className="bg-white dark:bg-gray-800 text-card-foreground rounded-2xl p-6 max-w-sm w-full mx-4 shadow-lg">
              {/* 标题 - 居中显示 */}
              <h3 className="text-lg font-semibold text-foreground text-center mb-3">
                {t('tasks.detail.clear_all_title')}
              </h3>

              {/* 消息内容 - 居中显示 */}
              <p className="text-sm text-muted-foreground text-center leading-5 mb-6">
                {t('tasks.detail.clear_all_message', {
                  count: subtasks.length
                })}
              </p>

              {/* 按钮组 - 水平排列 */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearAllConfirm(false)}
                  disabled={clearingAllSubtasks}
                  className="flex-1 px-6 py-3 text-muted-foreground bg-muted/50 rounded-lg hover:bg-muted transition-colors text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('tasks.actions.cancel')}
                </button>
                <button
                  onClick={confirmClearAllSubtasks}
                  disabled={clearingAllSubtasks}
                  className="flex-1 px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-center font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {clearingAllSubtasks ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t('tasks.detail.clearing')}
                    </>
                  ) : (
                    t('tasks.detail.clear_all')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtask Edit Modal */}
      {editingSubtask && (
        <TaskFormModal
          task={editingSubtask}
          onClose={handleEditSubtaskClose}
          onSubmit={handleEditSubtaskSubmit}
          isSubmitting={isSubmittingSubtask}
        />
      )}

      {/* Task Edit Modal */}
      {showEditModal && task && (
        <TaskFormModal
          task={task}
          onClose={handleEditClose}
          onSubmit={handleEditSubmit}
          isSubmitting={isSubmitting}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
