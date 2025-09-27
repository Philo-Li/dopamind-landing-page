'use client'

import React from 'react'
import { Task } from '@/types/task'
import { useThemeColors } from '@/hooks/useThemeColor'

interface CalendarDayProps {
  date: {
    day: number
    dateString: string
    month: number
    year: number
  }
  state: 'disabled' | 'today' | ''
  marking?: {
    selected?: boolean
    marked?: boolean
    selectedColor?: string
  }
  tasksForDay: Task[]
  onPress: (date: any) => void
  onTaskPress?: (task: Task) => void
  selectedDate: string
}

export const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  state,
  marking,
  tasksForDay,
  onPress,
  onTaskPress,
}) => {
  const colors = useThemeColors()

  // 定义优先级颜色映射 - 使用应用标准颜色
  const priorityColors = {
    URGENT: colors.status?.error || '#EF4444',
    HIGH: colors.primary || '#F97316',
    MEDIUM: colors.status?.warning || '#F59E0B',
    LOW: colors.textSecondary || '#6B7280',
  }

  // 计算容器高度 - 根据任务数量自适应
  const taskCount = tasksForDay.length

  // 根据需求设置固定高度：翻倍当前高度 - 0-1个任务为64px，2个任务为92px，3个及以上任务为120px
  const containerHeight = taskCount <= 1 ? 64 : taskCount === 2 ? 92 : 120

  // 根据状态和选中状态确定日期文字颜色
  const getDateTextColor = () => {
    if (marking?.selected) {
      return '#FFFFFF' // 选中状态使用白色
    }
    if (state === 'today') {
      return colors.primary || '#F97316' // 今天使用主题色
    }
    if (state === 'disabled') {
      return (colors.textSecondary || '#6B7280') + '80' // 禁用状态使用次要文本色加透明度
    }
    return colors.text || '#111827' // 其他情况使用主要文本色
  }

  // 根据选中状态确定日期数字的样式
  const getDateContainerStyle = () => {
    if (marking?.selected) {
      return {
        backgroundColor: colors.primary || '#F97316',
        borderRadius: '18px' // 增大圆角以适应更大的容器
      }
    }
    return {}
  }

  return (
    <div
      className="flex flex-col justify-start items-center relative cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      style={{
        height: containerHeight,
        width: 32,
        paddingTop: 2
      }}
      onClick={() => onPress(date)}
    >
      {/* 日期数字 - 增大尺寸以适应翻倍的高度 */}
      <div
        className="flex justify-center items-center mb-1"
        style={{
          height: 36, // 从28增加到36
          width: 36,  // 从28增加到36
          ...getDateContainerStyle()
        }}
      >
        <span
          className="text-sm font-normal text-center leading-7"
          style={{
            color: getDateTextColor(),
            fontSize: 16, // 从14增加到16
            fontWeight: '500' // 从400增加到500，让文字更清晰
          }}
        >
          {date.day}
        </span>
      </div>

      {/* 任务横条容器 - 与日期数字分离，调整位置适应新高度 */}
      {tasksForDay.length > 0 && (
        <div
          className="absolute flex flex-col justify-start"
          style={{
            top: 45, // 从31调整到45，为更大的日期数字区域留出空间
            left: 1,
            right: 1
          }}
        >
          {tasksForDay.slice(0, 3).map((task, index) => {
            const priorityColor = priorityColors[task.priority] || colors.textSecondary || '#6B7280'
            // 根据主题调整背景透明度和文字颜色以提高对比度
            const backgroundColor = priorityColor + '80' // 提高背景透明度
            const textColor = colors.text // 使用主要文本颜色（浅色模式为黑色，深色模式为白色）

            return (
              <div
                key={`${task.id}-${index}`}
                className="flex justify-center items-center mb-0.5"
                style={{
                  height: 14,
                  borderRadius: 3,
                  backgroundColor,
                  // 添加轻微的边框以提高浅色模式下的可见性
                  borderWidth: 0.5,
                  borderColor: priorityColor + '20',
                }}
                title={task.title}
              >
                <span
                  className="text-center truncate px-1"
                  style={{
                    fontSize: 9,
                    fontWeight: '700',
                    color: textColor
                  }}
                >
                  {task.title ? task.title.substring(0, 3) : '•••'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* 如果有超过3个任务，显示更多指示器 */}
      {tasksForDay.length > 3 && (
        <div
          className="absolute"
          style={{
            bottom: 1,
            right: 1
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: 3,
              height: 3,
              backgroundColor: colors.textSecondary || '#6B7280'
            }}
          />
        </div>
      )}
    </div>
  )
}