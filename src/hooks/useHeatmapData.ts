import { useState, useCallback, useEffect } from 'react'
import { getHeatmapData } from '@/lib/api'

export const useHeatmapData = () => {
  const [heatmapData, setHeatmapData] = useState<Record<string, number> | null>(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasTriedOnce, setHasTriedOnce] = useState(false)

  // Load heatmap data - cache-first strategy
  const fetchHeatmapData = useCallback(async (forceRefresh: boolean = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      // TODO: Implement cache strategy if needed
      // For now, always fetch from API

      // Fetch from API
      const data = await getHeatmapData()
      setHeatmapData(data)
      setHasTriedOnce(true)
      return data
    } catch (error: any) {
      const isNetworkError = error.message?.includes('网络请求被暂停') ||
                            error.message?.includes('Network Error')

      if (!isNetworkError || !hasTriedOnce) {
        console.error('[useHeatmapData] 获取热力图数据失败:', error)
        setHasTriedOnce(true)
      }

      // Only throw error if not a network error
      if (!isNetworkError) {
        throw error
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [hasTriedOnce])

  // Auto-load heatmap data
  useEffect(() => {
    if (!hasTriedOnce) {
      fetchHeatmapData(false)
    }
  }, [fetchHeatmapData, hasTriedOnce])

  const refreshHeatmapData = useCallback(() => {
    return fetchHeatmapData(true)
  }, [fetchHeatmapData])

  return {
    heatmapData,
    loading,
    refreshing,
    fetchHeatmapData,
    refreshHeatmapData,
  }
}