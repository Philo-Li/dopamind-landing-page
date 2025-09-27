'use client'

import React, { useState, useEffect } from 'react'
import { useLocalization } from '@/hooks/useLocalization'
import {
  CreateTaskRequest,
  Task,
  TaskStatus,
  TaskPriority,
  PRIORITY_CONFIG,
  TASK_STATUS_CONFIG
} from '@/types/task'
import { DateTimeSelector, extractDueDateParts, combineDateTimeValues } from '@/components/ui/DateTimeSelector'


const resolveDueDateValue = (task?: Task, defaultDueDate?: string) => {
  if (task?.dueDateLocal) {
    return task.dueDateLocal
  }

  if (task?.dueDate) {
    return task.dueDate
  }

  return task ? '' : (defaultDueDate || '')
}

interface TaskFormModalProps {
  task?: Task
  onClose: () => void
  onSubmit: (taskData: CreateTaskRequest | (CreateTaskRequest & { status?: TaskStatus })) => Promise<void>
  isSubmitting: boolean
  defaultDueDate?: string
  onDelete?: () => void | Promise<void>
}

export function TaskFormModal({
  task,
  onClose,
  onSubmit,
  isSubmitting,
  defaultDueDate,
  onDelete,
}: TaskFormModalProps) {
  const { t } = useLocalization()

  const initialDueDateParts = extractDueDateParts(resolveDueDateValue(task, defaultDueDate))

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: (task?.priority || 'MEDIUM') as TaskPriority,
    status: (task?.status || 'PENDING') as TaskStatus,
    dueDate: initialDueDateParts.dueDate,
    dueTime: initialDueDateParts.dueTime
  })

  useEffect(() => {
    const { dueDate, dueTime } = extractDueDateParts(resolveDueDateValue(task, defaultDueDate))

    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: (task.priority || 'MEDIUM') as TaskPriority,
        status: (task.status || 'PENDING') as TaskStatus,
        dueDate,
        dueTime
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      dueDate,
      dueTime
    }))
  }, [task, defaultDueDate])

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, isSubmitting])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || isSubmitting) return

    // Combine date and time if both are provided
    const combinedDueDate = combineDateTimeValues(formData.dueDate, formData.dueTime)

    const taskData: any = {
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      status: formData.status,
      dueDate: combinedDueDate
    }

    await onSubmit(taskData)
  }

  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: 'LOW', label: t('task_form.priority.low') },
    { value: 'MEDIUM', label: t('task_form.priority.medium') },
    { value: 'HIGH', label: t('task_form.priority.high') },
    { value: 'URGENT', label: t('task_form.priority.urgent') }
  ]

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'PENDING', label: t('task_form.status.pending') },
    { value: 'IN_PROGRESS', label: t('task_form.status.in_progress') },
    { value: 'COMPLETED', label: t('task_form.status.completed') },
    { value: 'CANCELLED', label: t('task_form.status.cancelled') }
  ]

  const baseTagButtonClasses = [
    'inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium transition-colors border',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dopamind-500',
    'disabled:opacity-60 disabled:cursor-not-allowed'
  ].join(' ')

  const getActiveTagStyle = (color: string) => ({
    backgroundColor: `${color}20`,
    color,
    borderColor: 'transparent'
  } as React.CSSProperties)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
              {task ? t('task_form.title_edit') : t('task_form.title_new')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={isSubmitting}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('task_form.task_title_required')}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-dopamind-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={t('task_form.task_title_placeholder')}
                required
                disabled={isSubmitting}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('task_form.task_description')}
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-dopamind-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={t('task_form.task_description_placeholder')}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Priority and Status in same row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('task_form.priority_label')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {priorityOptions.map((option) => {
                    const isActive = formData.priority === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: option.value }))}
                        disabled={isSubmitting}
                        aria-pressed={isActive}
                        className={`${baseTagButtonClasses} ${isActive
                          ? 'shadow-sm border-transparent'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700'
                        }`}
                        style={isActive ? getActiveTagStyle(PRIORITY_CONFIG[option.value].color) : undefined}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('task_form.status_label')}
                </label>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => {
                    const isActive = formData.status === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, status: option.value }))}
                        disabled={isSubmitting}
                        aria-pressed={isActive}
                        className={`${baseTagButtonClasses} ${isActive
                          ? 'shadow-sm border-transparent'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800/70 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700'
                        }`}
                        style={isActive ? getActiveTagStyle(TASK_STATUS_CONFIG[option.value].color) : undefined}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Due Date and Time Selector */}
            <DateTimeSelector
              dueDate={formData.dueDate}
              dueTime={formData.dueTime}
              onDateChange={(date) => setFormData(prev => ({ ...prev, dueDate: date }))}
              onTimeChange={(time) => setFormData(prev => ({ ...prev, dueTime: time }))}
              disabled={isSubmitting}
              showOptionalText={true}
            />

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={task && onDelete ? onDelete : onClose}
                disabled={isSubmitting}
                className={`${task && onDelete
                  ? 'flex-1 px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/40 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10'
                  : 'flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700'
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                {task && onDelete ? t('tasks.actions.delete') : t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="flex-1 px-4 py-2 bg-dopamind-500 text-white rounded-lg hover:bg-dopamind-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {task ? t('task_form.save_button_saving') : t('task_form.save_button_creating')}
                  </>
                ) : (
                  task ? t('task_form.save_button_update') : t('task_form.save_button_create')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
