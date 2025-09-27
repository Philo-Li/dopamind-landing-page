'use client'

import { useState, useEffect, useCallback } from 'react'
import { focusApi } from '@/lib/api'
import { FocusStats } from '@/types/focus'

const FOCUS_DATA_KEY = 'focus_data'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const DEFAULT_WEEKLY_GOAL = 20 // 20 hours

interface CachedFocusData {
  data: FocusStats
  timestamp: number
}

// 全局状态管理避免多次初始化
let globalFocusData: FocusStats | null = null
let globalLoading = false
let globalInitialized = false

// 清除全局状态的函数（用于登出）
export const clearGlobalFocusData = () => {
  globalFocusData = null
  globalLoading = false
  globalInitialized = false
}

export const useFocusData = () => {
  const [focusData, setFocusData] = useState<FocusStats>(() => {
    // 如果已有全局数据，使用全局数据初始化
    return globalFocusData || {
      totalFocusTime: 0,
      completedSessions: 0,
      currentStreak: 0,
      weeklyGoal: DEFAULT_WEEKLY_GOAL,
      lastFocusDate: null,
      weeklyFocusTime: 0,
      settings: {
        autoStartBreaks: false,
        autoStartFocus: false,
        soundEnabled: true,
        vibrationEnabled: true,
      }
    }
  })

  const [loading, setLoading] = useState(() => globalLoading)
  const [error, setError] = useState<string | null>(null)

  // 从本地缓存加载数据
  const loadCachedData = useCallback((): FocusStats | null => {
    try {
      const cached = localStorage.getItem(FOCUS_DATA_KEY)
      if (cached) {
        const parsedCache: CachedFocusData = JSON.parse(cached)
        const now = Date.now()

        // 检查缓存是否仍然有效（5分钟内）
        if (now - parsedCache.timestamp < CACHE_DURATION) {
          return parsedCache.data
        }
      }
    } catch (error) {
      console.error('Failed to load cached focus data:', error)
    }
    return null
  }, [])

  // 保存数据到本地缓存
  const saveCachedData = useCallback((data: FocusStats) => {
    try {
      const cacheData: CachedFocusData = {
        data,
        timestamp: Date.now()
      }
      localStorage.setItem(FOCUS_DATA_KEY, JSON.stringify(cacheData))
    } catch (error) {
      console.error('Failed to save cached focus data:', error)
    }
  }, [])

  // 从后端同步数据到本地缓存
  const syncFromBackend = useCallback(async (forceSync = false) => {
    // 如果不是强制同步且已经初始化过，跳过同步
    if (!forceSync && globalInitialized) {
      return
    }

    try {
      const response = await focusApi.getStats()

      if (response.success && response.data) {
        const backendData = response.data

        // 将后端数据转换为本地格式
        const localData: FocusStats = {
          totalFocusTime: backendData.totalFocusTime,
          completedSessions: backendData.completedSessions,
          currentStreak: backendData.currentStreak,
          weeklyGoal: backendData.weeklyGoal / 3600, // 后端存储的是秒，转换为小时
          lastFocusDate: backendData.lastFocusDate,
          weeklyFocusTime: backendData.weeklyFocusTime,
          settings: backendData.settings,
        }

        // 保存到本地缓存和全局状态
        saveCachedData(localData)
        globalFocusData = localData
        globalInitialized = true
        setFocusData(localData)
        setError(null)
      } else {
        console.error('[useFocusData] API 响应失败:', response.error?.message)
        setError(response.error?.message || '获取专注数据失败')
      }
    } catch (error) {
      console.error('[useFocusData] 从后端同步数据失败:', error)
      setError('网络连接失败')
      // 如果后端同步失败，继续使用本地数据
    }
  }, [saveCachedData])

  // 加载数据
  const loadFocusData = useCallback(async () => {
    // 如果全局已经初始化且有数据，直接返回
    if (globalInitialized && globalFocusData) {
      setFocusData(globalFocusData)
      setLoading(false)
      return
    }

    try {
      globalLoading = true
      setLoading(true)
      setError(null)

      // 1. 先加载缓存数据以提供即时反馈
      const cachedData = loadCachedData()
      if (cachedData) {
        globalFocusData = cachedData
        setFocusData(cachedData)
        setLoading(false) // 有缓存数据时先停止加载状态
      }

      // 2. 只在全局首次加载时从后端同步数据
      if (!globalInitialized) {
        await syncFromBackend()
      }
    } catch (error) {
      console.error('加载专注数据失败:', error)
      setError('加载数据失败')
    } finally {
      globalLoading = false
      setLoading(false)
    }
  }, [syncFromBackend, loadCachedData])

  // 乐观更新本地数据
  const updateFocusDataOptimistically = useCallback((updater: (data: FocusStats) => FocusStats) => {
    const newData = updater(focusData)
    globalFocusData = newData
    setFocusData(newData)
    saveCachedData(newData)
    return newData
  }, [focusData, saveCachedData])

  // 添加专注时间
  const addFocusTime = useCallback(async (seconds: number) => {
    const today = new Date().toDateString()
    const isNewDay = focusData.lastFocusDate !== today

    // 乐观更新
    const optimisticData = updateFocusDataOptimistically((data) => ({
      ...data,
      totalFocusTime: data.totalFocusTime + seconds,
      completedSessions: data.completedSessions + 1,
      lastFocusDate: today,
      weeklyFocusTime: data.weeklyFocusTime + seconds,
      currentStreak: isNewDay ? data.currentStreak + 1 : data.currentStreak,
    }))

    try {
      // 发送到后端（假设有对应的API）
      const response = await focusApi.updateStats({
        totalFocusTime: optimisticData.totalFocusTime,
        completedSessions: optimisticData.completedSessions,
        currentStreak: optimisticData.currentStreak,
        weeklyFocusTime: optimisticData.weeklyFocusTime,
        lastFocusDate: optimisticData.lastFocusDate,
      })

      if (response.success && response.data) {
        // 用服务器返回的实际数据替换乐观更新
        const serverData = response.data
        const finalData: FocusStats = {
          ...optimisticData,
          ...serverData,
          weeklyGoal: serverData.weeklyGoal / 3600, // 转换为小时
        }

        globalFocusData = finalData
        setFocusData(finalData)
        saveCachedData(finalData)
      }
    } catch (error) {
      console.error('更新专注时间失败:', error)
      // 失败时回滚乐观更新，重新加载数据
      await syncFromBackend(true)
      throw error
    }
  }, [focusData, updateFocusDataOptimistically, syncFromBackend, saveCachedData])

  // 更新设置
  const updateSettings = useCallback(async (settings: Partial<FocusStats['settings']>) => {
    // 乐观更新
    const optimisticData = updateFocusDataOptimistically((data) => ({
      ...data,
      settings: {
        autoStartBreaks: settings?.autoStartBreaks ?? data.settings?.autoStartBreaks ?? false,
        autoStartFocus: settings?.autoStartFocus ?? data.settings?.autoStartFocus ?? false,
        soundEnabled: settings?.soundEnabled ?? data.settings?.soundEnabled ?? true,
        vibrationEnabled: settings?.vibrationEnabled ?? data.settings?.vibrationEnabled ?? true,
      }
    }))

    try {
      // 发送到后端
      const response = await focusApi.updateSettings({
        autoStartBreaks: settings?.autoStartBreaks ?? false,
        autoStartFocus: settings?.autoStartFocus ?? false,
        soundEnabled: settings?.soundEnabled ?? true,
        vibrationEnabled: settings?.vibrationEnabled ?? true,
        ...settings
      })

      if (response.success && response.data) {
        const finalData: FocusStats = {
          ...optimisticData,
          settings: {
            autoStartBreaks: (response.data as any)?.autoStartBreaks ?? false,
            autoStartFocus: (response.data as any)?.autoStartFocus ?? false,
            soundEnabled: (response.data as any)?.soundEnabled ?? true,
            vibrationEnabled: (response.data as any)?.vibrationEnabled ?? true
          },
        }

        globalFocusData = finalData
        setFocusData(finalData)
        saveCachedData(finalData)
      }
    } catch (error) {
      console.error('更新设置失败:', error)
      // 失败时回滚乐观更新
      await syncFromBackend(true)
      throw error
    }
  }, [updateFocusDataOptimistically, syncFromBackend, saveCachedData])

  // 更新周目标
  const updateWeeklyGoal = useCallback(async (goal: number) => {
    // 乐观更新
    const optimisticData = updateFocusDataOptimistically((data) => ({
      ...data,
      weeklyGoal: goal,
    }))

    try {
      // 发送到后端（目标以秒为单位）
      const response = await focusApi.updateWeeklyGoal(goal * 3600)

      if (response.success) {
        // 保持乐观更新的数据
        globalFocusData = optimisticData
        setFocusData(optimisticData)
        saveCachedData(optimisticData)
      }
    } catch (error) {
      console.error('更新周目标失败:', error)
      // 失败时回滚乐观更新
      await syncFromBackend(true)
      throw error
    }
  }, [updateFocusDataOptimistically, syncFromBackend, saveCachedData])

  // 强制刷新数据的函数
  const forceRefresh = useCallback(async () => {
    setLoading(true)
    try {
      await syncFromBackend(true) // 强制同步
    } finally {
      setLoading(false)
    }
  }, [syncFromBackend])

  // 刷新任务数据（用于下拉刷新）
  const refreshTasks = useCallback(async () => {
    await forceRefresh()
  }, [forceRefresh])

  // 初始化时加载数据
  useEffect(() => {
    loadFocusData()
  }, [loadFocusData])

  return {
    focusData,
    loading,
    error,
    addFocusTime,
    updateSettings,
    updateWeeklyGoal,
    loadFocusData,
    forceRefresh,
    refreshTasks, // 保持与移动端接口一致
    syncFromBackend, // 导出同步函数，供外部调用
  }
}