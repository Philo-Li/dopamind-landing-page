'use client'

import React, { useState, useCallback } from 'react'
import { CalendarTaskView } from '@/components/calendar/CalendarTaskView'
import { Task, TaskStatus, CreateTaskRequest } from '@/types/task'
import { useRouter } from 'next/navigation'
import { useLocalization } from '@/hooks/useLocalization'
import { useTasks } from '@/hooks/useTasks'
import { TaskFormModal } from '@/components/tasks/TaskFormModal'

export const CalendarPage: React.FC = () => {
  const router = useRouter()
  const { t } = useLocalization()
  const { createTask, refreshTasksWithStats } = useTasks()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [defaultDueDate, setDefaultDueDate] = useState<string | undefined>(undefined)

  const handleTaskPress = (task: Task) => {
    router.push(`/tasks/${task.id}`)
  }

  const handleTaskEdit = (task: Task) => {
    // TODO: 实现任务编辑功能
    console.log('Edit task:', task.id)
  }

  const handleTaskDelete = async (taskId: number) => {
    // TODO: 实现任务删除功能
    console.log('Delete task:', taskId)
  }

  const handleTaskToggle = async (taskId: number, status: TaskStatus) => {
    // TODO: 实现任务状态切换功能
    console.log('Toggle task status:', taskId, status)
  }

  const handleCreateTask = useCallback((selectedDate?: string) => {
    setDefaultDueDate(selectedDate)
    setShowTaskForm(true)
  }, [])

  const handleTaskFormClose = useCallback(() => {
    setShowTaskForm(false)
    setDefaultDueDate(undefined)
  }, [])

  const handleTaskFormSubmit = useCallback(async (taskData: CreateTaskRequest) => {
    setIsSubmitting(true)
    try {
      await createTask(taskData)
      setShowTaskForm(false)
      setDefaultDueDate(undefined)
      // Refresh data after successful creation
      await refreshTasksWithStats()
    } catch (error) {
      console.error('Failed to save task:', error)
      alert(`${t('task_form.save_failed')}: ${error instanceof Error ? error.message : t('errors.unknown')}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [createTask, refreshTasksWithStats, t])

  return (
    <div className="h-full">
      <CalendarTaskView
        onTaskPress={handleTaskPress}
        onTaskEdit={handleTaskEdit}
        onTaskDelete={handleTaskDelete}
        onTaskToggle={handleTaskToggle}
        onCreateTask={handleCreateTask}
      />

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskFormModal
          onClose={handleTaskFormClose}
          onSubmit={handleTaskFormSubmit}
          isSubmitting={isSubmitting}
          defaultDueDate={defaultDueDate}
        />
      )}
    </div>
  )
}