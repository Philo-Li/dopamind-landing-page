'use client'

import React, { useMemo } from 'react'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

interface WeeklyHeatmapProps {
  data: Record<string, number>
  color: string
  week: string // Format: 'YYYY-WW'
}

export const WeeklyHeatmap: React.FC<WeeklyHeatmapProps> = ({ data, color, week }) => {
  const colors = useThemeColors()
  const { t } = useLocalization()

  const weekData = useMemo(() => {
    const [year, weekNum] = week.split('-').map(Number)
    const days = []

    // Get the start date for the specified week
    const startDate = new Date(year, 0, 1 + (weekNum - 1) * 7)
    while (startDate.getDay() !== 1) { // Adjust to Monday
      startDate.setDate(startDate.getDate() - 1)
    }

    const dayNames = [
      t('habits.detail.weekdays.1'), // Monday
      t('habits.detail.weekdays.2'), // Tuesday
      t('habits.detail.weekdays.3'), // Wednesday
      t('habits.detail.weekdays.4'), // Thursday
      t('habits.detail.weekdays.5'), // Friday
      t('habits.detail.weekdays.6'), // Saturday
      t('habits.detail.weekdays.0')  // Sunday
    ]

    // Generate week data
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      const dateStr = currentDate.toISOString().split('T')[0]

      days.push({
        date: dateStr,
        value: data[dateStr] || 0,
        dayName: dayNames[i]
      })
    }

    return days
  }, [data, week, t])

  const getColor = (value: number) => {
    // 与年度热力图保持一致的颜色策略
    const isDark = colors.background === '#000000' || colors.background.includes('#1a') || colors.background.includes('#111')

    if (value === 0) {
      return isDark ? '#374151' : colors.border
    }
    return color
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        {weekData.map((day, index) => (
          <div key={day.date} className="text-center flex-1">
            <div className="text-xs mb-1" style={{ color: colors.textSecondary }}>
              {day.dayName}
            </div>
            <div
              className="w-8 h-8 rounded-md mx-auto flex items-center justify-center border"
              style={{
                backgroundColor: getColor(day.value),
                borderColor: colors.border
              }}
            >
              {day.value > 0 && (
                <span className="text-xs font-medium" style={{ color: colors.text }}>
                  {day.value}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}