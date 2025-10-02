import { useState, useEffect, useCallback } from 'react'
import { focusApi } from '@/lib/api'
import { TodayFocusStats } from '@/types/focus'

interface UseTodayFocusDataResult {
  data: TodayFocusStats | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

const CACHE_KEY = 'today_focus_data'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

interface CachedData {
  data: TodayFocusStats
  timestamp: number
}

export const useTodayFocusData = (): UseTodayFocusDataResult => {
  const [data, setData] = useState<TodayFocusStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load cached data from localStorage
  const loadCachedData = useCallback((): TodayFocusStats | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const parsedCache: CachedData = JSON.parse(cached)
        const now = Date.now()

        // Check if cache is still valid (within 5 minutes)
        if (now - parsedCache.timestamp < CACHE_DURATION) {
          return parsedCache.data
        }
      }
    } catch (error) {
      console.error('Failed to load cached focus data:', error)
    }
    return null
  }, [])

  // Save data to localStorage cache
  const saveCachedData = useCallback((focusData: TodayFocusStats) => {
    try {
      const cacheData: CachedData = {
        data: focusData,
        timestamp: Date.now()
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Failed to save cached focus data:', error)
    }
  }, [])

  // Fetch data from API
  const fetchTodayStats = useCallback(async (): Promise<TodayFocusStats | null> => {
    try {
      // 使用与移动端相同的 API 端点
      const response = await focusApi.getTodayStats()

      if (response.success && response.data) {
        const statsData = response.data

        const todayStats: TodayFocusStats = {
          todayFocusTime: statsData.todayFocusTime ?? 0,
          todayCompletedSessions: statsData.todayCompletedSessions ?? 0,
          todayGoalProgress: statsData.todayGoalProgress ?? 0,
          settings: statsData.settings,
        }

        return todayStats
      }

      // 如果 API 返回失败，返回默认值（与移动端一致）
      return {
        todayFocusTime: 0,
        todayCompletedSessions: 0,
        todayGoalProgress: 0,
        settings: {
          autoStartBreaks: false,
          autoStartFocus: false,
          soundEnabled: true,
          vibrationEnabled: true,
        }
      }
    } catch (error) {
      console.error('Failed to fetch today stats:', error)
      // 与移动端一致，发生错误时返回默认值而不是抛出异常
      return {
        todayFocusTime: 0,
        todayCompletedSessions: 0,
        todayGoalProgress: 0,
        settings: {
          autoStartBreaks: false,
          autoStartFocus: false,
          soundEnabled: true,
          vibrationEnabled: true,
        }
      }
    }
  }, [])

  // Main data loading function
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Load cached data immediately for better UX
      const cachedData = loadCachedData()
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
      }

      // 2. Fetch fresh data from API (always returns valid data)
      const freshData = await fetchTodayStats()

      if (freshData) {
        setData(freshData)
        saveCachedData(freshData)
      }
    } catch (err) {
      console.error('Failed to load today focus data:', err)
      setError('加载统计数据失败')
    } finally {
      setLoading(false)
    }
  }, [loadCachedData, saveCachedData, fetchTodayStats])

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    setLoading(true)
    await loadData()
  }, [loadData])

  // Load data on mount
  useEffect(() => {
    loadData()
  }, [loadData])

  return {
    data,
    loading,
    error,
    refetch
  }
}
