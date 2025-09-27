'use client'

import React, { useMemo } from 'react'
import { useThemeColors } from '@/hooks/useThemeColor'

interface MonthlyHeatmapProps {
  data: Record<string, number>
  color: string
  month: string // Format: 'YYYY-MM'
}

export const MonthlyHeatmap: React.FC<MonthlyHeatmapProps> = ({ data, color, month }) => {
  const colors = useThemeColors()

  const monthData = useMemo(() => {
    const [year, monthNum] = month.split('-').map(Number)
    const daysInMonth = new Date(year, monthNum, 0).getDate()
    const days = []

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${monthNum.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`
      days.push({
        date: dateStr,
        value: data[dateStr] || 0,
        dayOfMonth: i
      })
    }

    return days
  }, [data, month])

  const getColor = (value: number) => {
    // 与年度热力图保持一致的颜色策略
    const isDark = colors.background === '#000000' || colors.background.includes('#1a') || colors.background.includes('#111')

    if (value === 0) {
      return isDark ? '#374151' : colors.border
    }
    return color
  }

  const isToday = (dateStr: string) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const date = new Date(dateStr)
    return date.getTime() === today.getTime()
  }

  const cellSize = useMemo(() => {
    // 动态计算单元格大小，确保所有日期能在一行显示
    const containerWidth = Math.min(window?.innerWidth - 100 || 800, 800) // 减去padding和边距
    const maxCells = 31 // 一个月最多31天
    const spacing = 2 // 方块之间的间距
    const totalSpacing = spacing * (maxCells - 1)
    return Math.max(Math.floor((containerWidth - totalSpacing) / maxCells), 16) // 最小16px
  }, [])

  return (
    <div className="py-2">
      <div
        className="flex items-center gap-0.5 overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400"
        style={{ paddingBottom: '8px' }}
      >
        {monthData.map((day) => (
          <div
            key={day.date}
            className={`flex-shrink-0 rounded flex items-center justify-center text-xs font-medium border transition-all duration-200 ${
              isToday(day.date) ? 'ring-1 ring-blue-500' : ''
            }`}
            style={{
              width: `${cellSize}px`,
              height: `${cellSize}px`,
              backgroundColor: getColor(day.value),
              borderColor: isToday(day.date) ? colors.tint : 'transparent',
              color: colors.textSecondary,
              fontSize: `${cellSize * 0.4}px`,
              minWidth: `${cellSize}px`
            }}
          >
            {day.dayOfMonth}
          </div>
        ))}
      </div>
    </div>
  )
}