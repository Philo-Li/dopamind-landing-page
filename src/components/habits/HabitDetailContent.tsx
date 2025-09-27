'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import { Habit, HabitStats } from '@/types/habit'
import { getHabits, getAllHabitsStats } from '@/services/habitService'
import { getEmojiFromIcon } from '@/constants/emojiIcons'
import { HabitHeatmap } from './HabitHeatmap'
import { WeeklyHeatmap } from './WeeklyHeatmap'
import { MonthlyHeatmap } from './MonthlyHeatmap'
import { ArrowLeft, RefreshCw, Edit2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function HabitDetailContent() {
  const params = useParams()
  const router = useRouter()
  const colors = useThemeColors()
  const { t } = useLocalization()

  const habitId = React.useMemo(() => {
    const id = params?.id
    return typeof id === 'string' ? parseInt(id, 10) : NaN
  }, [params?.id])

  // 获取月份名称
  const getMonthName = useCallback((monthNumber: number) => {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    return monthNames[monthNumber - 1] || monthNumber.toString()
  }, [])

  const [habit, setHabit] = useState<Habit | null>(null)
  const [stats, setStats] = useState<HabitStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 月份和周选择状态
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
  })

  const [selectedWeek, setSelectedWeek] = useState(() => {
    const now = new Date()
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7)
    return `${now.getFullYear()}-${weekNumber.toString().padStart(2, '0')}`
  })

  // 加载习惯数据和统计
  const loadHabitData = useCallback(async (showRefresh = false) => {
    if (isNaN(habitId)) {
      router.push('/habits')
      return
    }

    try {
      if (showRefresh) setRefreshing(true)
      setError(null)

      const [habitsData, statsData] = await Promise.all([
        getHabits(),
        getAllHabitsStats()
      ])

      const habitData = habitsData.find(h => h.id === habitId)

      if (!habitData) {
        setError(t('habits.detail.habit_not_found'))
        return
      }

      setHabit(habitData)
      setStats(statsData[habitId] || null)
    } catch (error) {
      console.error('加载习惯详情失败:', error)
      setError(error instanceof Error ? error.message : t('habits.detail.loading_error'))
    } finally {
      setLoading(false)
      if (showRefresh) setRefreshing(false)
    }
  }, [habitId, router, t])

  useEffect(() => {
    loadHabitData()
  }, [loadHabitData])

  // 处理下拉刷新
  const handleRefresh = useCallback(() => {
    loadHabitData(true)
  }, [loadHabitData])

  const handleBack = () => {
    router.push('/habits')
  }

  // 导航月份
  const navigateMonth = (direction: 'prev' | 'next') => {
    const currentMonth = new Date(selectedMonth)
    if (direction === 'prev') {
      currentMonth.setMonth(currentMonth.getMonth() - 1)
    } else {
      currentMonth.setMonth(currentMonth.getMonth() + 1)
      const now = new Date()
      if (currentMonth > now) return
    }
    setSelectedMonth(currentMonth.toISOString().slice(0, 7))
  }

  // 导航周
  const navigateWeek = (direction: 'prev' | 'next') => {
    const [year, week] = selectedWeek.split('-').map(Number)
    let newWeek = week
    let newYear = year

    if (direction === 'next') {
      newWeek++
      if (newWeek > 52) {
        newWeek = 1
        newYear++
      }
    } else {
      newWeek--
      if (newWeek < 1) {
        newWeek = 52
        newYear--
      }
    }

    const now = new Date()
    const currentYear = now.getFullYear()
    const startOfYear = new Date(currentYear, 0, 1)
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000))
    const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7)

    if (newYear > currentYear || (newYear === currentYear && newWeek > currentWeek)) {
      return
    }

    setSelectedWeek(`${newYear}-${newWeek.toString().padStart(2, '0')}`)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full" style={{ backgroundColor: colors.background }}>
        <div className="text-center">
          <RefreshCw className="animate-spin" size={24} color={colors.tint} />
          <p className="mt-2" style={{ color: colors.text }}>{t('habits.detail.loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !habit) {
    return (
      <div className="flex-1 flex flex-col h-full" style={{ backgroundColor: colors.background }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 border-b h-[64px]" style={{ borderColor: colors.border }}>
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black mr-2"
              style={{ color: colors.text }}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold" style={{ color: colors.text }}>
              {t('habits.detail.title')}
            </h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: colors.text }}>
              {error || t('habits.detail.habit_not_found')}
            </h2>
            <button
              onClick={handleBack}
              className="px-4 py-2 rounded-lg transition-colors duration-200 mt-4"
              style={{
                backgroundColor: colors.tint,
                color: 'white'
              }}
            >
              {t('habits.detail.back_to_habits')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 border-b h-[64px]" style={{ borderColor: colors.border }}>
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black mr-2"
            style={{ color: colors.text }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold" style={{ color: colors.text }}>
            {habit.title}
          </h1>
        </div>
        <button
          className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105"
          style={{ backgroundColor: colors.tint + '20' }}
        >
          <Edit2 size={20} color={colors.tint} />
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF3CD', borderColor: '#FFECB3' }}>
          <p className="text-sm" style={{ color: '#856404' }}>
            {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs underline"
            style={{ color: '#856404' }}
          >
            {t('habits.detail.close')}
          </button>
        </div>
      )}

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 space-y-6 pb-8">
          {/* Habit Header */}
          <div className="text-center">
            <div
              className="w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto mb-4"
              style={{ borderColor: habit.color }}
            >
              <span className="text-3xl">{getEmojiFromIcon(habit.icon)}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: colors.text }}>
              {habit.title}
            </h2>
            <p className="text-base opacity-80" style={{ color: colors.textSecondary }}>
              {t('habits.detail.daily_habit')}
            </p>
          </div>

          {/* Statistics Row */}
          {stats && (
            <div className="flex justify-around py-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {stats.completedDays || 0}
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  {t('habits.detail.stats.total_checkins')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {stats.currentStreak || 0}
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  {t('habits.detail.stats.current_streak')}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                  {stats.longestStreak || 0}
                </div>
                <div className="text-sm" style={{ color: colors.textSecondary }}>
                  {t('habits.detail.stats.longest_streak')}
                </div>
              </div>
            </div>
          )}

          {/* Weekly History Card */}
          {stats?.heatmap && (
            <div
              className="rounded-2xl p-4 border shadow-sm"
              style={{ backgroundColor: colors.card?.background || colors.background, borderColor: `${colors.text}20` }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold" style={{ color: colors.text }}>
                  {t('habits.detail.sections.weekly_history')}
                </h3>
                <div className="flex items-center">
                  <button
                    className="p-2"
                    onClick={() => navigateWeek('prev')}
                    style={{ color: colors.text }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm min-w-[80px] text-center font-medium" style={{ color: colors.text }}>
                    {t('habits.detail.week_label', { year: selectedWeek.split('-')[0], week: selectedWeek.split('-')[1] })}
                  </span>
                  <button
                    className="p-2"
                    onClick={() => navigateWeek('next')}
                    style={{ color: colors.text }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <WeeklyHeatmap data={stats.heatmap} color={habit.color} week={selectedWeek} />
            </div>
          )}

          {/* Monthly History Card */}
          {stats?.heatmap && (
            <div
              className="rounded-2xl p-4 border shadow-sm"
              style={{ backgroundColor: colors.card?.background || colors.background, borderColor: `${colors.text}20` }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold" style={{ color: colors.text }}>
                  {t('habits.detail.sections.monthly_history')}
                </h3>
                <div className="flex items-center">
                  <button
                    className="p-2"
                    onClick={() => navigateMonth('prev')}
                    style={{ color: colors.text }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm min-w-[80px] text-center font-medium" style={{ color: colors.text }}>
                    {t('habits.detail.month_format', {
                      year: selectedMonth.split('-')[0],
                      month: parseInt(selectedMonth.split('-')[1]),
                      monthName: getMonthName(parseInt(selectedMonth.split('-')[1]))
                    })}
                  </span>
                  <button
                    className="p-2"
                    onClick={() => navigateMonth('next')}
                    style={{ color: colors.text }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
              <MonthlyHeatmap data={stats.heatmap} color={habit.color} month={selectedMonth} />
            </div>
          )}

          {/* Annual History Card */}
          <div
            className="rounded-2xl p-4 border shadow-sm"
            style={{ backgroundColor: colors.card?.background || colors.background, borderColor: `${colors.text}20` }}
          >
            <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
              {t('habits.detail.sections.annual_history')}
            </h3>
            <HabitHeatmap
              data={stats?.heatmap || {}}
              color={habit.color}
              compact={false}
              showCompletionCount={true}
            />
          </div>
          </div>
        </div>
      </div>

      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-20">
          <RefreshCw className="animate-spin" size={20} color={colors.tint} />
        </div>
      )}
    </div>
  )
}
