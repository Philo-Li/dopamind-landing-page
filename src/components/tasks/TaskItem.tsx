'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Task, PRIORITY_CONFIG, TASK_STATUS_CONFIG } from '@/types/task'
import {
  Check,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus,
  ListTodo,
  PlayCircle,
  Circle
} from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { useLocalization } from '@/hooks/useLocalization'
import { useThemeColors } from '@/hooks/useThemeColor'
import { taskStore } from '@/stores/taskStore'

interface TaskItemProps {
  task: Task
  onToggleStatus: (taskId: number, newStatus: Task['status']) => Promise<void>
  onEdit: (task: Task) => void
  onDelete: (taskId: number) => void
  onPress?: (task: Task) => void
  showActionButtons?: boolean
  compact?: boolean
}

// Get priority border color matching mobile app
const getPriorityBorderColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'URGENT': return '#FF4757' // Red
    case 'HIGH': return '#FFA502'   // Orange
    case 'MEDIUM': return '#3742FA' // Blue
    case 'LOW': return '#747D8C'    // Gray
    default: return '#E5E7EB'       // Default gray
  }
}

export default function TaskItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
  onPress,
  showActionButtons = false,
  compact = false
}: TaskItemProps) {
  const { t } = useLocalization()
  const router = useRouter()
  const colors = useThemeColors()
  const [localStatus, setLocalStatus] = useState<Task['status']>(task.status)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const isCompleted = localStatus === 'COMPLETED'
  const statusConfig = TASK_STATUS_CONFIG[localStatus]

  const handleStatusToggle = async () => {
    const newStatus = localStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED'
    const originalStatus = localStatus

    // Optimistic update
    setLocalStatus(newStatus)

    try {
      await onToggleStatus(task.id, newStatus)
    } catch (error) {
      // Rollback on error
      setLocalStatus(originalStatus)
      console.error('Failed to toggle task status:', error)
    }
  }

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    setShowDeleteConfirm(false)
    onDelete(task.id)
  }

  const handleTaskClick = () => {
    if (onPress) {
      onPress(task)
    } else {
      // Default behavior: navigate to task detail view within the same layout
      router.push(`/tasks/${task.id}`)
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'URGENT': return AlertTriangle
      case 'HIGH': return ArrowUp
      case 'MEDIUM': return Minus
      case 'LOW': return ArrowDown
      default: return Minus
    }
  }

  const isOverdue = task.dueDateLocal && !isCompleted &&
    new Date(task.dueDateLocal) < new Date()

  const hasSubtasks = task._count && task._count.subTasks > 0
  const subtaskProgress = hasSubtasks
    ? `${task._count?.completedSubTasks}/${task._count?.subTasks}`
    : ''

  const calculateProgress = (): number => {
    if (task.status === 'COMPLETED') return 100

    if (hasSubtasks && task._count!.subTasks > 0) {
      return Math.round((task._count!.completedSubTasks / task._count!.subTasks) * 100)
    }

    switch (task.status) {
      case 'PENDING': return 0
      case 'IN_PROGRESS': return 50
      case 'CANCELLED': return 0
      default: return 0
    }
  }

  const progress = calculateProgress()
  const priorityConfig = PRIORITY_CONFIG[task.priority]
  const PriorityIcon = getPriorityIcon(task.priority)

  const formatDate = (dateString: string | null, isCompact = false) => {
    if (!dateString) return ''
    try {
      return format(parseISO(dateString), isCompact ? 'MM/dd' : 'MM/dd', { locale: zhCN })
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
        return compact ? t('tasks.date_format.completed_today') : t('tasks.date_format.completed_today')
      } else {
        return compact ? formatDate(dateString, true) : `${format(date, 'MM/dd', { locale: zhCN })} ${t('tasks.actions.complete')}`
      }
    } catch {
      return dateString
    }
  }

  // Compact layout (matching mobile TaskItemCompact)
  if (compact) {
    return (
      <>
        <div
          className="mb-2 rounded-xl overflow-hidden shadow-sm border text-card-foreground transition-colors"
          style={{
            backgroundColor: isHovered ? colors.border : colors.card.background,
            borderColor: colors.card.border,
            opacity: isCompleted ? 0.6 : 1,
            borderLeft: `3px solid ${getPriorityBorderColor(task.priority)}`
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="flex items-center py-3 px-4 min-h-[56px] cursor-pointer transition-colors"
            onClick={handleTaskClick}
          >
            {/* Status Button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleStatusToggle()
              }}
              className={`
                w-7 h-7 rounded-full border-2 flex items-center justify-center mr-3
                transition-colors duration-200
                ${isCompleted
                  ? `bg-[${statusConfig.color}20] border-[${statusConfig.color}]`
                  : 'border-border hover:border-primary/60 dark:hover:border-primary/50'
                }
              `}
              style={{
                backgroundColor: isCompleted ? statusConfig.color + '20' : 'transparent',
                borderColor: isCompleted ? statusConfig.color : 'hsl(var(--border))'
              }}
            >
              {isCompleted ? (
                <CheckCircle className="w-[18px] h-[18px]" style={{ color: statusConfig.color }} />
              ) : (
                <Circle className="w-[18px] h-[18px] text-muted-foreground" />
              )}
            </button>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <div
                className={`
                  text-[15px] font-semibold leading-5 mb-0.5
                  ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}
                `}
              >
                {task.title}
              </div>

              {(() => {
                const progressNode = hasSubtasks ? (
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    ✓ {subtaskProgress}
                  </span>
                ) : null

                const completedNode = (task.completedAtLocal || task.updatedAtLocal) ? (
                  <span className="inline-flex items-center gap-1 text-green-500">
                    <CheckCircle className="w-3 h-3" />
                    {formatCompletedDate((task.completedAtLocal || task.updatedAtLocal) as string)}
                  </span>
                ) : null

                const dueNode = task.dueDateLocal ? (
                  <span
                    className={`inline-flex items-center gap-1 ${
                      isOverdue ? 'text-red-500' : 'text-muted-foreground'
                    }`}
                  >
                    {isOverdue && <AlertTriangle className="w-3 h-3" />}
                    <Clock className="w-3 h-3" />
                    {formatDate(task.dueDateLocal, true)}
                  </span>
                ) : null

                const timeNode = isCompleted ? completedNode : dueNode

                if (!progressNode && !timeNode) return null

                return (
                  <div className="flex items-center gap-3 text-[11px] font-medium mb-1">
                    {progressNode}
                    {timeNode}
                  </div>
                )
              })()}
            </div>

            {/* Action Area */}
            <div className="flex items-center gap-1.5 ml-2">
              {showActionButtons ? (
                // Detailed mode: show edit and delete buttons
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(task)
                    }}
                    className="w-6 h-6 rounded-xl bg-muted/70 dark:bg-muted/40 hover:bg-muted flex items-center justify-center transition-colors"
                  >
                    <Edit className="w-3 h-3 text-muted-foreground" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete()
                    }}
                    className="w-6 h-6 rounded-xl bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                  </button>
                </>
              ) : (
                // Compact mode: show focus button for non-completed tasks
                !isCompleted && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // 将任务存储到全局缓存
                      taskStore.setTask(task)
                      router.push(`/focus?taskId=${task.id}`)
                    }}
                    className="p-1 ml-2"
                  >
                    {/* 创建橙色圆形背景，中间白色三角形的专注按钮 */}
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
                )
              )}
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div
            className="h-0.5 bg-current"
            style={{
              backgroundColor: statusConfig.color,
              width: `${progress}%`,
              borderBottomLeftRadius: '12px',
              borderBottomRightRadius: '12px'
            }}
          />
        </div>

        {/* Delete confirmation modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-card text-card-foreground rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">{t('tasks.actions.confirm_delete_title')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('tasks.actions.confirm_delete_message', { title: task.title })}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-muted-foreground border border-border/60 rounded-lg hover:bg-muted/50"
                >
                  {t('tasks.actions.cancel')}
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  {t('tasks.actions.delete')}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Detailed layout (matching mobile TaskItem)
  return (
    <>
      <div
        className={`
          text-card-foreground rounded-xl border overflow-hidden mb-2 shadow-sm
          hover:shadow-md cursor-pointer transition-all duration-200
          ${isCompleted ? 'opacity-70' : ''}
        `}
        onClick={handleTaskClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundColor: isHovered ? colors.border : colors.card.background,
          borderColor: colors.card.border,
          borderLeft: `3px solid ${getPriorityBorderColor(task.priority)}`
        }}
      >
        <div className="flex items-start p-3">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleStatusToggle()
            }}
            className={`
              w-5 h-5 rounded border-2 flex items-center justify-center mr-3 mt-0.5
              transition-colors duration-200
              ${isCompleted
                ? 'bg-green-500 border-green-500'
                : 'border-border hover:border-green-400'
              }
            `}
          >
            {isCompleted && <Check className="w-3 h-3 text-white" />}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={`
                text-base font-medium mb-2 leading-tight
                ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}
              `}
            >
              {task.title}
            </h3>

            <div className="flex flex-wrap gap-2 mb-2">
              {/* Date info */}
              {isCompleted ? (
                // Show completion date
                (task.completedAtLocal || task.updatedAtLocal) && (
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium gap-1"
                    style={{ backgroundColor: statusConfig.color + '20', color: statusConfig.color }}
                  >
                    <CheckCircle className="w-3 h-3" />
                    {formatCompletedDate((task.completedAtLocal || task.updatedAtLocal) as string)}
                  </span>
                )
              ) : (
                // Show due date
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
                    <Clock className="w-3 h-3" />
                    {formatDate(task.dueDateLocal)}
                  </span>
                )
              )}

              {/* Subtasks progress */}
              {hasSubtasks && (
                <span className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium bg-muted/60 text-muted-foreground gap-1">
                  <ListTodo className="w-3 h-3" />
                  {subtaskProgress}
                </span>
              )}

              {/* Priority */}
              {task.priority !== 'MEDIUM' && (
                <span
                  className="inline-flex items-center px-2 py-1 rounded-xl text-xs font-medium gap-1"
                  style={{
                    backgroundColor: priorityConfig.color + '20',
                    color: priorityConfig.color
                  }}
                >
                  <PriorityIcon className="w-3 h-3" />
                  {t('tasks.priority.' + task.priority)}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          {showActionButtons && (
            <div className="flex flex-col gap-2 ml-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
                className="w-8 h-8 rounded-2xl bg-muted/70 dark:bg-muted/40 hover:bg-muted flex items-center justify-center transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete()
                }}
                className="w-8 h-8 rounded-2xl bg-red-500/15 hover:bg-red-500/25 flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progress > 0 && progress < 100 && (
          <div className="flex items-center px-3 pb-3 gap-2">
            <div className="flex-1 bg-muted/60 rounded-full h-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: '#007AFF' // Blue progress color
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground min-w-[32px]">{progress}%</span>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card text-card-foreground rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">{t('tasks.actions.confirm_delete_title')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('tasks.actions.confirm_delete_message', { title: task.title })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-muted-foreground border border-border/60 rounded-lg hover:bg-muted/50"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
