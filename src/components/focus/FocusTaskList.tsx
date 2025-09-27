'use client'

import React, { useState, useEffect } from 'react'
import { Play, Clock, ChevronRight } from 'lucide-react'
import { useLocalization } from '@/hooks/useLocalization'
import { Task } from '@/types/task'
import { tasksApi } from '@/lib/api'

interface FocusTaskListProps {
  currentTask: Task | null
  onTaskSelect: (task: Task) => void
}

export const FocusTaskList: React.FC<FocusTaskListProps> = ({
  currentTask,
  onTaskSelect
}) => {
  const { t } = useLocalization()
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadInProgressTasks = async () => {
    try {
      setLoading(true)
      const response = await tasksApi.getTasks({
        status: 'IN_PROGRESS',
        limit: 5
      })

      if (response.success && response.data) {
        const data = response.data as any
        setInProgressTasks(data.tasks || [])
      } else {
        setInProgressTasks([])
      }
    } catch (error) {
      console.error('[FocusTaskList] 加载进行中任务失败:', error)
      setInProgressTasks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInProgressTasks()
  }, [])

  if (loading) {
    return null // 加载时不显示任何内容
  }

  if (inProgressTasks.length === 0) {
    return null
  }

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate)
    const now = new Date()
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return t('common.today')
    if (diffInDays === 1) return t('common.tomorrow')
    if (diffInDays === -1) return t('common.yesterday')
    if (diffInDays > 0) return t('common.days_later', { days: diffInDays })
    return t('common.days_ago', { days: Math.abs(diffInDays) })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm m-4">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
          <Play className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 ml-2">{t('focus.in_progress_tasks')}</h3>
      </div>
      {inProgressTasks.map((task, index) => (
        <button
          key={task.id}
          className={`w-full text-left py-3 px-4 rounded-lg mb-1 last:mb-0 transition-colors ${
            currentTask?.id === task.id
              ? 'bg-orange-50 border border-orange-200'
              : 'hover:bg-gray-50'
          } ${index !== inProgressTasks.length - 1 ? 'border-b border-gray-100' : ''}`}
          onClick={() => onTaskSelect(task)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <div className="flex items-center mb-1">
                <h4 className={`text-base font-medium truncate ${
                  currentTask?.id === task.id ? 'text-orange-600' : 'text-gray-900'
                }`}>
                  {task.title}
                </h4>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {task.priority === 'URGENT' && (
                <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-semibold rounded">
                  {t('tasks.priority.URGENT')}
                </span>
              )}
              {currentTask?.id === task.id ? (
                <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-white" />
                </div>
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-500" />
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}