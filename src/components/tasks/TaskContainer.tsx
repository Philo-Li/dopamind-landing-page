'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import TaskList from './TaskList'
import { Task } from '@/types/task'
import { Plus, Calendar, List as ListIcon } from 'lucide-react'
import { TaskFormModal } from './TaskFormModal'

type ViewMode = 'list' | 'calendar'

export default function TaskContainer() {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const {
    tasks,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    taskStats,
    loadTasks,
    refreshTasksWithStats,
    loadMoreTasks,
    updateFilters,
    toggleTaskStatus,
    removeTask,
    loadTaskStats,
    createTask,
    updateTask
  } = useTasks()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const hasLoadedInitially = useRef(false)

  // Initial load
  useEffect(() => {
    if (!hasLoadedInitially.current) {
      const initializeData = async () => {
        try {
          await Promise.all([
            loadTasks(1, {}, false),
            loadTaskStats(false)
          ])
        } catch (error) {
          console.error('Failed to initialize task data:', error)
        }
      }

      initializeData()
      hasLoadedInitially.current = true
    }
  }, [loadTasks, loadTaskStats])

  const handleEdit = useCallback((task: Task) => {
    setEditingTask(task)
    setShowTaskForm(true)
  }, [])

  const handleDelete = useCallback(async (taskId: number) => {
    try {
      await removeTask(taskId)
      // Show success message if needed
    } catch (error) {
      console.error('Failed to delete task:', error)
      // Show error message if needed
    }
  }, [removeTask])

  const toggleViewMode = useCallback(() => {
    setViewMode(prev => prev === 'list' ? 'calendar' : 'list')
  }, [])

  const handleCreateTask = useCallback(() => {
    setEditingTask(null)
    setShowTaskForm(true)
  }, [])

  const handleTaskFormClose = useCallback(() => {
    setShowTaskForm(false)
    setEditingTask(null)
  }, [])

  const handleTaskFormDelete = useCallback(async () => {
    if (!editingTask) {
      return
    }

    const confirmMessage = t('tasks.actions.confirm_delete_message', { title: editingTask.title })
    const confirmed = window.confirm(confirmMessage)

    if (!confirmed) {
      return
    }

    try {
      await removeTask(editingTask.id)
      handleTaskFormClose()
      await refreshTasksWithStats()
    } catch (error) {
      console.error('Failed to delete task:', error)
      alert(`${t('tasks.delete_failed')}: ${error instanceof Error ? error.message : t('errors.unknown')}`)
    }
  }, [editingTask, handleTaskFormClose, refreshTasksWithStats, removeTask, t])

  const handleTaskFormSubmit = useCallback(async (taskData: any) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData)
      } else {
        await createTask(taskData)
      }
      handleTaskFormClose()
      // Refresh data after successful creation/update
      await refreshTasksWithStats()
    } catch (error) {
      console.error('Failed to save task:', error)
      // Error is already handled in the useTasks hook, just log it here
      // The form will stay open so user can retry
      alert(`${t('task_form.save_failed')}: ${error instanceof Error ? error.message : t('errors.unknown')}`)
    }
  }, [editingTask, updateTask, createTask, handleTaskFormClose, refreshTasksWithStats, t])

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
          {viewMode === 'list' ? t('tasks.list_view') : t('tasks.calendar_view')}
        </h1>

        <div className="flex items-center gap-3">
            {/* View mode toggle */}
            <button
              onClick={toggleViewMode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-gray-100"
              title={viewMode === 'list' ? t('tasks.calendar_view') : t('tasks.list_view')}
            >
              {viewMode === 'list' ? (
                <>
                  <Calendar className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('navigation.calendar')}</span>
                </>
              ) : (
                <>
                  <ListIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">{t('tasks.list_view')}</span>
                </>
              )}
            </button>

            {/* Create task button */}
            <button
              onClick={handleCreateTask}
              className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-all duration-200 bg-dopamind-500 hover:bg-dopamind-600 active:bg-dopamind-700 shadow-sm hover:shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">{t('tasks.create_task')}</span>
            </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {viewMode === 'list' ? (
          <TaskList
            tasks={tasks}
            loading={loading}
            refreshing={refreshing}
            loadingMore={loadingMore}
            onRefresh={refreshTasksWithStats}
            onLoadMore={loadMoreTasks}
            onToggleStatus={toggleTaskStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onFilterChange={updateFilters}
            hasMore={hasMore}
            showStats={true}
            taskStats={taskStats}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t('tasks.calendar_view')}</h3>
              <p className="text-gray-600">{t('tasks.calendar_view_coming_soon')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskFormModal
          task={editingTask || undefined}
          onClose={handleTaskFormClose}
          onSubmit={handleTaskFormSubmit}
          isSubmitting={false}
          onDelete={editingTask ? handleTaskFormDelete : undefined}
        />
      )}
    </div>
  )
}
