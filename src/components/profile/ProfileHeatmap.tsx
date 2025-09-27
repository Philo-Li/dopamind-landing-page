'use client'

import React from 'react'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { eachDayOfInterval, startOfWeek, endOfWeek, format, getDay, isSameDay } from 'date-fns'

interface ProfileHeatmapProps {
  data: Record<string, number>
}

// 将一维的日期数组转换为二维的按周分组的数组
const groupDaysByWeek = (days: Date[]): Date[][] => {
  if (!days.length) return []
  const weeks: Date[][] = []
  let currentWeek: Date[] = []

  days.forEach(day => {
    // getDay() 返回 0 (周日) 到 6 (周六)
    if (getDay(day) === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    currentWeek.push(day)
  })

  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  return weeks
}

const ProfileHeatmap: React.FC<ProfileHeatmapProps> = ({ data }) => {
  const colors = useThemeColors()
  const { t } = useLocalization()

  // 为浅色和深色模式定义不同的颜色梯度
  const heatmapColors = {
    light: [
      colors.card.border,       // Level 0: 与卡片边框色一致
      '#FFEBE0',               // Level 1: 非常淡的橙色
      '#FFCFA9',               // Level 2: 柔和的橙色
      '#FFA96B',               // Level 3: 明亮的橙色
      colors.tint,             // Level 4: 主品牌色
    ],
    dark: [
      '#374151',               // Level 0: 比卡片背景稍亮的深灰色
      '#FFF2E8',               // Level 1: 低饱和度浅橙色
      '#FFCFA9',               // Level 2: 柔和的橙色
      '#FFA96B',               // Level 3: 明亮的橙色
      colors.tint,             // Level 4: 主品牌色
    ],
  }

  // 检测当前主题模式
  const isDark = colors.background === '#1A1A1A' || colors.background === '#000000'
  const currentColors = isDark ? heatmapColors.dark : heatmapColors.light

  const getColor = (count: number) => {
    if (count === 0) return currentColors[0]
    if (count <= 2) return currentColors[1]
    if (count <= 5) return currentColors[2]
    if (count <= 9) return currentColors[3]
    return currentColors[4]
  }

  const today = new Date()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(today.getFullYear() - 1)

  // 获取从一年前的周日开始，到今天的所有日期
  const days = eachDayOfInterval({
    start: startOfWeek(oneYearAgo, { weekStartsOn: 0 }),
    end: endOfWeek(today, { weekStartsOn: 0 }),
  })

  // 将日期按周分组
  const weeks = groupDaysByWeek(days)

  return (
    <div
      className="p-4 rounded-2xl border"
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.card.border
      }}
    >
      <h3
        className="text-base font-semibold mb-3"
        style={{ color: colors.text }}
      >
        {t('profile.heatmap.title')}
      </h3>

      <div className="flex items-start gap-1">
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-0.5 min-w-max">
            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="flex flex-col gap-0.5">
                {/* 为每周的第一天前面补上空白格，以对齐星期 */}
                {weekIndex === 0 && Array(getDay(week[0])).fill(null).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-3 h-3 bg-transparent"
                  />
                ))}

                {week.map((day) => {
                  const dateString = format(day, 'yyyy-MM-dd')
                  const count = data[dateString] || 0
                  const isToday = isSameDay(day, today)

                  return (
                    <div
                      key={dateString}
                      className="w-3 h-3 border"
                      style={{
                        backgroundColor: getColor(count),
                        borderColor: isToday ? colors.tint : 'transparent',
                        borderWidth: isToday ? 1 : 0,
                      }}
                      title={`${dateString}: ${count} 个任务`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-2 gap-1">
        <span className="text-xs" style={{ color: colors.textSecondary }}>
          {t('profile.heatmap.less')}
        </span>
        {currentColors.map((color, index) => (
          <div
            key={index}
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-xs" style={{ color: colors.textSecondary }}>
          {t('profile.heatmap.more')}
        </span>
      </div>
    </div>
  )
}

export { ProfileHeatmap }