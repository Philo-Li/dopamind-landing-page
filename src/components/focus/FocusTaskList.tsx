'use client'

import React, { useState, useEffect } from 'react'
import { Play, Clock, ChevronRight, ListTodo } from 'lucide-react'
import { useLocalization } from '@/hooks/useLocalization'
import { useThemeColors } from '@/hooks/useThemeColor'
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
  const colors = useThemeColors()
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
    <div
      className="rounded-2xl p-6 shadow-sm m-4 border transition-colors"
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.card.border
      }}
    >
      <div className="flex items-center mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
          style={{ backgroundColor: `${colors.accent.orange}1f` }}
        >
          <Play className="w-4 h-4" style={{ color: colors.accent.orange }} />
        </div>
        <h3 className="text-xl font-semibold ml-2" style={{ color: colors.text }}>
          {t('focus.in_progress_tasks')}
        </h3>
      </div>
      {inProgressTasks.map((task) => {
        const hasSubtasks = task._count?.subTasks && task._count.subTasks > 0
        const completedSubtasks = task._count?.completedSubTasks || 0
        const totalSubtasks = task._count?.subTasks || 0
        const subtaskPercent = hasSubtasks
          ? Math.round((completedSubtasks / totalSubtasks) * 100)
          : 0

        return (
        <button
          key={task.id}
          className="w-full text-left py-3 px-4 rounded-lg mb-2 transition-colors border"
          onClick={() => onTaskSelect(task)}
          style={{
            backgroundColor: currentTask?.id === task.id
              ? `${colors.accent.orange}1a`
              : colors.card.background,
            borderColor: currentTask?.id === task.id
              ? `${colors.accent.orange}66`
              : colors.card.border,
            boxShadow: currentTask?.id === task.id ? `0 6px 16px ${colors.accent.orange}1f` : 'none'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-3">
              <div className="flex items-center mb-1">
                <h4
                  className="text-base font-medium truncate"
                  style={{
                    color: currentTask?.id === task.id ? colors.accent.orange : colors.text
                  }}
                >
                  {task.title}
                </h4>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" style={{ color: colors.textSecondary }} />
                  <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                    {formatDueDate(task.dueDate)}
                  </span>
                </div>
              )}

              {hasSubtasks && (
                <div className="mt-1">
                  <div className="flex items-center gap-1 text-xs font-medium" style={{ color: colors.textSecondary }}>
                    <ListTodo className="w-3 h-3" style={{ color: colors.textSecondary }} />
                    <span>
                      {completedSubtasks}/{totalSubtasks} {t('focus.subtasks')}
                    </span>
                    <span className="text-[11px]">{subtaskPercent}%</span>
                  </div>
                  <div className="h-1 mt-1 rounded-full" style={{ backgroundColor: colors.card.border }}>
                    <div
                      className="h-1 rounded-full transition-all"
                      style={{
                        width: `${subtaskPercent}%`,
                        backgroundColor: colors.accent.orange
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {task.priority === 'URGENT' && (
                <span className="px-1.5 py-0.5 text-xs font-semibold rounded" style={{ backgroundColor: '#f87171', color: '#ffffff' }}>
                  {t('tasks.priority.URGENT')}
                </span>
              )}
              {currentTask?.id === task.id ? (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent.orange }}
                >
                  <Play className="w-3 h-3 text-white" />
                </div>
              ) : (
                <ChevronRight className="w-3 h-3" style={{ color: colors.textSecondary }} />
              )}
            </div>
          </div>
        </button>
        )
      })}
    </div>
  )
}
