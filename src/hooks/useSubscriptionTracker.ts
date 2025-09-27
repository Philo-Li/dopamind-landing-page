import { useState, useCallback, useEffect } from 'react'
import { getSubscriptions, toggleSubscriptionStatus } from '@/services/subscriptionTrackerService'
import { storage } from '@/lib/utils'
import type { SubscriptionTracker } from '@/types/subscriptionTracker'

export const useSubscriptionTracker = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionTracker[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasTriedOnce, setHasTriedOnce] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载订阅数据 - 缓存优先策略
  const fetchSubscriptions = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      setError(null) // 清除之前的错误

      // 如果不是强制刷新，先尝试从缓存加载
      if (!forceRefresh) {
        const cachedData = storage.getSubscriptionsCache?.()
        if (cachedData) {
          console.log('[useSubscriptions] 使用缓存订阅数据，共', cachedData.length, '条')
          setSubscriptions(cachedData)
          setLoading(false)
          return cachedData
        }
      }

      // 从 API 获取数据
      console.log('[useSubscriptions] 开始从API获取订阅数据...')
      const data = await getSubscriptions()
      console.log('[useSubscriptions] API返回数据:', data)
      setSubscriptions(data)
      setHasTriedOnce(true)
      return data
    } catch (error: any) {
      console.error('[useSubscriptions] 获取订阅数据失败，错误详情:', error)

      // 详细的错误分析
      let errorMessage = '获取订阅数据失败'
      if (error.response) {
        // 服务器响应了错误状态码
        errorMessage = `服务器错误 (${error.response.status}): ${error.response.data?.message || error.message}`
      } else if (error.request) {
        // 请求已发出，但没有收到响应
        errorMessage = '无法连接到服务器，请检查网络连接'
      } else {
        // 其他错误
        errorMessage = error.message || '未知错误'
      }

      const isNetworkError = error.message?.includes('网络请求被暂停') ||
        error.message?.includes('Network Error') ||
        error.message?.includes('NETWORK_ERROR') ||
        !error.response

      if (!isNetworkError || !hasTriedOnce) {
        setError(errorMessage)
        setHasTriedOnce(true)
      }

      // API 失败时，尝试从缓存加载
      const cachedData = storage.getSubscriptionsCache?.()
      if (cachedData && cachedData.length > 0) {
        console.log('[useSubscriptions] API 失败，使用缓存订阅数据，共', cachedData.length, '条')
        setSubscriptions(cachedData)
        // 如果有缓存数据，显示提示但不阻止用户使用
        setError('使用离线数据，网络连接异常')
        return cachedData
      }

      // 只有在没有缓存数据且非网络错误时才抛出错误
      if (!isNetworkError) {
        throw new Error(errorMessage)
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [hasTriedOnce])

  // 自动加载订阅数据
  useEffect(() => {
    if (!hasTriedOnce) {
      fetchSubscriptions(false)
    }
  }, [fetchSubscriptions, hasTriedOnce])

  // 刷新订阅数据
  const refreshSubscriptions = useCallback(() => {
    return fetchSubscriptions(true)
  }, [fetchSubscriptions])

  // 切换订阅状态
  const handleToggleStatus = useCallback(async (id: number) => {
    try {
      const updatedSubscription = await toggleSubscriptionStatus(id)

      // 更新本地状态
      setSubscriptions(prev =>
        prev.map(sub => sub.id === id ? updatedSubscription : sub)
      )

      // 更新缓存
      storage.saveSubscriptionsCache?.(
        subscriptions.map(sub => sub.id === id ? updatedSubscription : sub)
      )

      return updatedSubscription
    } catch (error) {
      console.error('切换订阅状态失败:', error)
      throw error
    }
  }, [subscriptions])

  return {
    subscriptions,
    setSubscriptions,
    loading,
    refreshing,
    error,
    fetchSubscriptions,
    refreshSubscriptions,
    handleToggleStatus,
  }
}