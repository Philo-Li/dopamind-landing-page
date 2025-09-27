'use client'

import React, { useState, useMemo, useCallback, useEffect } from 'react'
import Calendar from 'react-calendar'
import type { CalendarProps } from 'react-calendar'
import { format, isSameDay, parseISO, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns'
import { CalendarDay } from './CalendarDay'
import { Task, TaskStatus, Priority } from '@/types/task'
import { useTasks } from '@/hooks/useTasks'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { ChevronLeft, ChevronRight, FileText, Plus, CheckCircle } from 'lucide-react'
import TaskItem from '@/components/tasks/TaskItem'
import 'react-calendar/dist/Calendar.css'

interface CalendarTaskViewProps {
  onTaskPress?: (task: Task) => void
  onTaskEdit?: (task: Task) => void
  onTaskDelete?: (taskId: number) => void
  onTaskToggle?: (taskId: number, status: TaskStatus) => Promise<void>
  onCreateTask?: (selectedDate?: string) => void
}

export const CalendarTaskView: React.FC<CalendarTaskViewProps> = ({
  onTaskPress,
  onTaskEdit,
  onTaskDelete,
  onTaskToggle,
  onCreateTask,
}) => {
  const colors = useThemeColors()
  const { tasks, loading, loadTasks } = useTasks()
  const { t, language } = useLocalization()
  const calendarLocale = language === 'zh' ? 'zh-CN' : language
  const isChinese = language.startsWith('zh')

  // 用户当前选中的日期 - 使用字符串格式与移动端保持一致
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )

  // 当前显示的月份 - 使用字符串格式与移动端保持一致
  const [currentMonth, setCurrentMonth] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )

  // 每日报告相关状态
  const [reportExists, setReportExists] = useState<boolean>(false)
  const [reportLoading, setReportLoading] = useState<boolean>(false)
  const [reportCheckLoading, setReportCheckLoading] = useState<boolean>(false)

  // 组件首次加载时获取当月数据
  useEffect(() => {
    const now = new Date()
    const startDate = format(startOfMonth(now), 'yyyy-MM-dd')
    const endDate = format(endOfMonth(now), 'yyyy-MM-dd')

    console.log('[CalendarTaskView] 初次加载，获取当月数据:', startDate, 'to', endDate)
    loadTasks(1, {
      dueDate: startDate,
      dueDateRange: `${startDate},${endDate}`
    })
  }, [loadTasks])

  // 根据 tasks 和 selectedDate 筛选出当天需要显示的任务列表
  const tasksForSelectedDay = useMemo(() => {
    if (!tasks.length || !selectedDate) return []

    const selectedDateObj = parseISO(selectedDate)

    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = parseISO(task.dueDate)
      return isSameDay(taskDate, selectedDateObj)
    })
  }, [tasks, selectedDate])

  // 获取指定日期的任务
  const getTasksForDate = useCallback((dateString: string) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = parseISO(task.dueDate)
      const currentDate = parseISO(dateString)
      return isSameDay(taskDate, currentDate)
    })
  }, [tasks])

  // 处理月份变化
  const handleMonthChange = useCallback((month: { dateString: string }) => {
    // 更新当前月份状态
    setCurrentMonth(month.dateString)

    // 加载新月份的任务数据
    const startDate = format(startOfMonth(parseISO(month.dateString)), 'yyyy-MM-dd')
    const endDate = format(endOfMonth(parseISO(month.dateString)), 'yyyy-MM-dd')

    loadTasks(1, {
      dueDate: startDate,
      dueDateRange: `${startDate},${endDate}`
    })
  }, [loadTasks])

  // 月份导航函数
  const navigateMonth = useCallback((direction: number) => {
    const currentDate = parseISO(currentMonth)
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    const newMonthString = format(newDate, 'yyyy-MM-dd')

    setCurrentMonth(newMonthString)

    // 加载新月份的任务数据
    const startDate = format(startOfMonth(newDate), 'yyyy-MM-dd')
    const endDate = format(endOfMonth(newDate), 'yyyy-MM-dd')

    loadTasks(1, {
      dueDate: startDate,
      dueDateRange: `${startDate},${endDate}`
    })
  }, [currentMonth, loadTasks])

  // 自定义日期组件渲染函数 - 与移动端保持一致
  const renderDayComponent = useCallback(({ date, state, marking }: any) => {
    // 根据日期筛选出当天的所有任务
    const tasksForDay = getTasksForDate(date.dateString)

    // 检查是否为选中日期
    const isSelected = date.dateString === selectedDate

    // 构建标记对象
    const dayMarking = {
      ...marking,
      selected: isSelected,
    }

    return (
      <CalendarDay
        date={date}
        state={state}
        marking={dayMarking}
        tasksForDay={tasksForDay}
        onPress={(d) => setSelectedDate(d.dateString)}
        onTaskPress={onTaskPress}
        selectedDate={selectedDate}
      />
    )
  }, [getTasksForDate, selectedDate, onTaskPress])

  // 自定义箭头渲染函数
  const renderArrow = useCallback((direction: 'left' | 'right') => {
    const IconComponent = direction === 'left' ? ChevronLeft : ChevronRight
    return (
      <IconComponent
        className="w-6 h-6"
        style={{ color: colors.primary }}
      />
    )
  }, [colors.primary])

  // 自定义头部渲染函数
  const renderHeader = useCallback((date: any) => {
    // 使用当前月份状态来显示标题
    const displayDate = parseISO(currentMonth)
    const monthYear = format(displayDate, isChinese ? 'yyyy年 M月' : 'MMMM yyyy')

    return (
      <div className="flex items-center justify-between px-4 py-2 mb-1">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => navigateMonth(-1)}
        >
          <ChevronLeft
            className="w-6 h-6"
            style={{ color: colors.primary }}
          />
        </button>

        <h3 className="text-lg font-bold text-center flex-1 mx-4" style={{ color: colors.text }}>
          {monthYear}
        </h3>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => navigateMonth(1)}
        >
          <ChevronRight
            className="w-6 h-6"
            style={{ color: colors.primary }}
          />
        </button>
      </div>
    )
  }, [colors.primary, colors.text, currentMonth, navigateMonth, isChinese])

  // 处理任务点击跳转
  const handleTaskPress = useCallback((task: Task) => {
    onTaskPress?.(task)
  }, [onTaskPress])

  // 处理生成每日报告
  const handleGenerateReport = useCallback(async () => {
    if (!selectedDate) return

    setReportLoading(true)
    try {
      console.log('[CalendarTaskView] 开始生成每日报告:', selectedDate)
      // TODO: 实现每日报告生成功能
      setReportExists(true)
    } catch (error) {
      console.error('[CalendarTaskView] 生成报告失败:', error)
    } finally {
      setReportLoading(false)
    }
  }, [selectedDate])

  // 处理查看每日报告
  const handleViewReport = useCallback(async () => {
    if (!selectedDate) return

    try {
      console.log('[CalendarTaskView] 查看每日报告:', selectedDate)
      // TODO: 实现查看报告功能
    } catch (error: any) {
      console.error('[CalendarTaskView] 查看报告失败:', error)
    }
  }, [selectedDate])

  // 渲染任务项 - 使用容器包裹以匹配移动端样式
  const renderTaskItem = useCallback((task: Task) => (
    <div key={task.id} className="px-4">
      <TaskItem
        task={task}
        onPress={() => handleTaskPress(task)}
        onEdit={() => onTaskEdit?.(task)}
        onDelete={() => onTaskDelete?.(task.id)}
        onToggleStatus={(taskId: number, status: TaskStatus) => onTaskToggle?.(taskId, status) || Promise.resolve()}
      />
    </div>
  ), [handleTaskPress, onTaskEdit, onTaskDelete, onTaskToggle])

  // 渲染空状态 - 与移动端保持一致
  const renderEmptyState = useCallback(() => {
    if (loading) return null

    return (
      <div className="flex-1 flex flex-col justify-center items-center py-10 px-4">
        <CheckCircle
          className="w-12 h-12 mb-4"
          style={{ color: colors.textSecondary }}
        />
        <h4 className="text-base font-medium mb-2" style={{ color: colors.text }}>
          {t('calendar.no_tasks_today')}
        </h4>
        <p className="text-sm text-center leading-5" style={{ color: colors.textSecondary }}>
          {t('calendar.enjoy_moment')}
        </p>
      </div>
    )
  }, [loading, colors.text, colors.textSecondary, t])

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
          {t('navigation.calendar')}
        </h1>

        <div className="flex items-center gap-3">
          {/* Selected date display */}
          <div className="text-sm" style={{ color: colors.textSecondary }}>
            {format(parseISO(selectedDate), isChinese ? 'yyyy年 M月d日' : 'MMM d, yyyy')}
          </div>

          {/* Create task button */}
          <button
            onClick={() => onCreateTask?.(selectedDate)}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-all duration-200 bg-dopamind-500 hover:bg-dopamind-600 active:bg-dopamind-700 shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t('tasks.create_task')}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: colors.background }}>
        {/* 整个页面内容容器 - 可滚动 */}
        <div className="min-h-full pb-5">
        {/* 日历卡片作为头部 - 完全复制移动端样式 */}
        <div
          className="m-4 rounded-2xl p-2"
          style={{
            backgroundColor: colors.card.background,
            borderWidth: 1,
            borderColor: colors.card.border,
            // Web shadow
            boxShadow: `0 2px 4px ${colors.text}20`
          }}
        >
          {/* 自定义头部 */}
          {renderHeader(null)}

          {/* 模拟 react-native-calendars 的自定义日历 */}
          <div className="px-2">
            {/* 星期标题 */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {[
                isChinese ? '周一' : 'Mon',
                isChinese ? '周二' : 'Tue',
                isChinese ? '周三' : 'Wed',
                isChinese ? '周四' : 'Thu',
                isChinese ? '周五' : 'Fri',
                isChinese ? '周六' : 'Sat',
                isChinese ? '周日' : 'Sun'
              ].map((day, index) => (
                <div key={index} className="flex justify-center items-center py-2">
                  <span
                    className="text-xs font-semibold text-center"
                    style={{
                      color: colors.textSecondary,
                      width: 32
                    }}
                  >
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* 日期网格 - 确保与星期标题完全对齐 */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }, (_, index) => {
                const currentDate = parseISO(currentMonth)
                const firstDay = startOfMonth(currentDate)
                const startDate = new Date(firstDay)
                startDate.setDate(startDate.getDate() - firstDay.getDay() + 1 + index) // 周一开始

                const dateString = format(startDate, 'yyyy-MM-dd')
                const tasksForDay = getTasksForDate(dateString)

                return (
                  <div key={index} className="flex justify-center">
                    {renderDayComponent({
                      date: {
                        day: startDate.getDate(),
                        dateString,
                        month: startDate.getMonth() + 1,
                        year: startDate.getFullYear()
                      },
                      state: startDate.getMonth() !== currentDate.getMonth() ? 'disabled' :
                             isSameDay(startDate, new Date()) ? 'today' : '',
                      marking: {
                        selected: dateString === selectedDate
                      }
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 任务列表标题 - 与移动端保持一致 */}
        <div className="px-4 pb-3">
          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
            {t('calendar.tasks_for_date', { date: format(parseISO(selectedDate), isChinese ? 'M月d日' : 'MMM d') })}
          </h3>
        </div>

        {/* 每日报告按钮 - 与移动端保持一致 */}
        <div className="px-4 pb-4">
          {reportCheckLoading ? (
            <div
              className="flex items-center justify-center py-3 px-5 rounded-xl border opacity-70"
              style={{ backgroundColor: colors.card.background, borderColor: colors.card.border }}
            >
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-2" style={{ borderColor: colors.textSecondary }} />
              <span className="text-base font-semibold" style={{ color: colors.textSecondary }}>
                {t('calendar.checking')}
              </span>
            </div>
          ) : reportExists ? (
            <button
              className="w-full flex items-center justify-center py-3 px-5 rounded-xl"
              style={{ backgroundColor: colors.primary }}
              onClick={handleViewReport}
              disabled={reportLoading}
            >
              <FileText className="w-5 h-5 mr-2" color="white" />
              <span className="text-base font-semibold text-white">
                {t('calendar.view_report', { date: format(parseISO(selectedDate), isChinese ? 'M月d日' : 'MMM d') })}
              </span>
            </button>
          ) : (
            <button
              className="w-full flex items-center justify-center py-3 px-5 rounded-xl border-2"
              style={{ backgroundColor: colors.card.background, borderColor: colors.primary }}
              onClick={handleGenerateReport}
              disabled={reportLoading}
            >
              {reportLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 mr-2" style={{ borderColor: colors.primary }} />
                  <span className="text-base font-semibold" style={{ color: colors.primary }}>
                    {t('calendar.generating_report')}
                  </span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" style={{ color: colors.primary }} />
                  <span className="text-base font-semibold" style={{ color: colors.primary }}>
                    {t('calendar.generate_report', { date: format(parseISO(selectedDate), isChinese ? 'M月d日' : 'MMM d') })}
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* 任务列表区域 - 不再独立滚动 */}
        <div className="px-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.primary }} />
              <span className="ml-3 text-sm" style={{ color: colors.textSecondary }}>
                {t('calendar.loading_tasks')}
              </span>
            </div>
          ) : tasksForSelectedDay.length > 0 ? (
            <div className="space-y-2">
              {tasksForSelectedDay.map(renderTaskItem)}
            </div>
          ) : (
            renderEmptyState()
          )}
        </div>
        </div>
      </div>
    </div>
  )
}
