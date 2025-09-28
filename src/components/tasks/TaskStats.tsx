'use client'

import React from 'react'
import { TaskStats as TaskStatsType } from '@/types/task'
import { useLocalization } from '@/hooks/useLocalization'
import { useThemeColors } from '@/hooks/useThemeColor'
import { BarChart3, Calendar, Clock, Play, CheckCircle2, Target, Check } from 'lucide-react'

interface TaskStatsProps extends TaskStatsType {
  onFilterChange?: (status: 'ALL' | 'COMPLETED' | 'PENDING' | 'IN_PROGRESS' | 'TODAY') => void
}

export default function TaskStats({
  total,
  completed,
  pending,
  inProgress,
  completionRate,
  thisWeekCompleted,
  thisWeekTotal,
  todayTasksCount,
  onFilterChange
}: TaskStatsProps) {
  const { t } = useLocalization()
  const colors = useThemeColors()
  const weeklyCompleted = thisWeekCompleted ?? completed

  const stats = [
    {
      label: t('tasks.stats.today_tasks'),
      value: todayTasksCount || 0,
      icon: Calendar,
      color: '#FF6B35', // Orange
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      status: 'TODAY' as const
    },
    {
      label: t('tasks.stats.this_week_completed'),
      value: thisWeekTotal || 0,
      icon: Target,
      color: '#6B7280', // Gray
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      status: 'ALL' as const
    },
    {
      label: t('tasks.stats.in_progress'),
      value: inProgress,
      icon: Play,
      color: '#007AFF', // Blue
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      status: 'IN_PROGRESS' as const
    },
    {
      label: t('tasks.stats.pending'),
      value: pending,
      icon: Clock,
      color: '#FFA500', // Yellow/Orange
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      status: 'PENDING' as const
    },
    {
      label: t('tasks.stats.completed'),
      value: thisWeekCompleted || 0,
      icon: CheckCircle2,
      color: '#34C759', // Green
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      status: 'COMPLETED' as const
    }
  ]

  const handleStatClick = (status: 'ALL' | 'COMPLETED' | 'PENDING' | 'IN_PROGRESS' | 'TODAY') => {
    if (onFilterChange) {
      try {
        onFilterChange(status)
      } catch (error) {
        console.error('[TaskStats] 调用 onFilterChange 时出错:', error)
      }
    }
  }

  return (
    <div
      className="rounded-2xl p-5 shadow-sm border mb-0 transition-all duration-200"
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.card.border
      }}
    >
      {/* Achievement section with circular progress - matching mobile design */}
      <div
        className="flex items-center mb-5 pb-3 border-b"
        style={{ borderColor: colors.card.border }}
      >
        <div className="mr-5">
          <div
            className="w-[70px] h-[70px] rounded-full border-[3px] flex items-center justify-center relative"
            style={{
              borderColor: '#34C759',
              backgroundColor: completionRate > 0 ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.05)'
            }}
          >
            <div className="text-center">
              <div
                className="text-sm font-bold leading-4"
                style={{
                  color: '#34C759',
                  fontSize: completionRate >= 100 ? '14px' : '16px'
                }}
              >
                {completionRate}%
              </div>
              <div className="text-[9px] text-muted-foreground leading-tight mt-0.5">
                {t('tasks.stats.completion_rate')}
              </div>
            </div>
            {completionRate >= 100 && (
              <div
                className="absolute top-2 right-2 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#34C759' }}
              >
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-[15px] font-bold text-foreground mb-1">
            {t('tasks.stats.week_progress')}
          </h3>
          <p className="text-[13px] font-semibold text-muted-foreground mb-0.5">
            {t('tasks.stats.tasks_completed', { count: weeklyCompleted })}
          </p>
          {total > 0 ? (
            <p className="text-[11px] text-muted-foreground">
              {t('tasks.stats.week_completion_rate', { rate: Math.round((weeklyCompleted / total) * 100) })}
            </p>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              {t('tasks.stats.no_tasks_yet')}
            </p>
          )}
        </div>
      </div>

      {/* Stats grid - compact layout matching mobile */}
      <div className="flex gap-2">
        {stats.map((stat) => {
          const IconComponent = stat.icon
          const isWeeklyStat = stat.status === 'ALL'
          return (
            <button
              key={stat.label}
              onClick={() => handleStatClick(stat.status)}
              className={`
                flex-1 flex flex-col items-center py-3 px-2 rounded-xl border transition-all duration-200
                hover:shadow-lg hover:scale-105 active:scale-95 h-[90px] justify-center
              `}
              style={{
                backgroundColor: `${stat.color}14`,
                borderColor: `${stat.color}28`,
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-2.5 shadow-sm"
                style={{
                  backgroundColor: isWeeklyStat ? 'rgba(255, 255, 255, 0.15)' : stat.color + '15',
                  border: `1px solid ${isWeeklyStat ? 'rgba(255, 255, 255, 0.25)' : stat.color + '25'}`
                }}
              >
                <IconComponent
                  className="w-4 h-4"
                  style={{ color: isWeeklyStat ? '#FFFFFF' : stat.color }}
                />
              </div>
              <div
                className="text-lg font-bold mb-1 leading-[20px]"
                style={{ color: isWeeklyStat ? '#FFFFFF' : stat.color }}
              >
                {stat.value}
              </div>
              <div
                className="text-[11px] font-medium text-center leading-[13px] text-muted-foreground"
                style={{ lineHeight: '13px' }}
              >
                {stat.label}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
