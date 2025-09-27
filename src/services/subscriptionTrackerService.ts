import { apiClient, subscriptionsApi } from '@/lib/api'
import { storage } from '@/lib/utils'
import type {
  SubscriptionTracker,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionListResponse,
  SubscriptionResponse
} from '@/types/subscriptionTracker'

// 获取所有订阅 - 使用正确的API路径
export const getSubscriptions = async (): Promise<SubscriptionTracker[]> => {
  try {
    console.log('[SubscriptionService] 开始获取订阅列表...')
    console.log('[SubscriptionService] API URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/subscription-tracker`)

    const response = await apiClient.get<SubscriptionListResponse>('/subscription-tracker')
    console.log('[SubscriptionService] 原始API响应:', response)

    if (response.success && response.data) {
      const subscriptions = response.data.data || response.data
      console.log(`[SubscriptionService] 成功获取 ${subscriptions.length} 个订阅`)
      console.log('[SubscriptionService] 订阅数据样本:', subscriptions.slice(0, 2))

      // 后台异步更新缓存，不阻塞主流程
      if (subscriptions.length > 0) {
        try {
          await storage.saveSubscriptionsCache?.(subscriptions)
        } catch (err: any) {
          console.error("[Cache] 后台更新订阅缓存失败:", err)
        }
      }

      return subscriptions
    } else {
      console.error('[SubscriptionService] API返回success=false:', response)
      throw new Error(response.error?.message || '获取订阅列表失败')
    }
  } catch (error: any) {
    console.error('[SubscriptionService] 获取订阅列表失败，完整错误信息:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    })
    throw error
  }
}

// 获取单个订阅详情
export const getSubscription = async (id: number): Promise<SubscriptionTracker> => {
  try {
    console.log(`[SubscriptionService] 开始获取订阅详情 ID: ${id}`)
    const response = await apiClient.get<SubscriptionResponse>(`/subscription-tracker/${id}`)

    if (response.success && response.data) {
      const subscription = response.data.data || response.data
      console.log(`[SubscriptionService] 成功获取订阅详情: ${subscription.name}`)
      return subscription
    } else {
      throw new Error('获取订阅详情失败')
    }
  } catch (error: any) {
    console.error('[SubscriptionService] 获取订阅详情失败:', error)
    throw error
  }
}

// 创建订阅 - 使用正确的API路径
export const createSubscription = async (data: CreateSubscriptionRequest): Promise<SubscriptionTracker> => {
  try {
    console.log('[SubscriptionService] 开始创建订阅:', data)
    const response = await apiClient.post<SubscriptionResponse>('/subscription-tracker', data)

    if (response.success && response.data) {
      const subscription = response.data.data || response.data
      console.log(`[SubscriptionService] 成功创建订阅: ${subscription.name}`)
      return subscription
    } else {
      throw new Error('创建订阅失败')
    }
  } catch (error: any) {
    console.error('[SubscriptionService] 创建订阅失败:', error)
    throw error
  }
}

// 更新订阅 - 使用正确的API路径
export const updateSubscription = async (id: number, data: UpdateSubscriptionRequest): Promise<SubscriptionTracker> => {
  try {
    console.log(`[SubscriptionService] 开始更新订阅 ID: ${id}`, data)
    const response = await apiClient.put<SubscriptionResponse>(`/subscription-tracker/${id}`, data)

    if (response.success && response.data) {
      const subscription = response.data.data || response.data
      console.log(`[SubscriptionService] 成功更新订阅: ${subscription.name}`)
      return subscription
    } else {
      throw new Error('更新订阅失败')
    }
  } catch (error: any) {
    console.error('[SubscriptionService] 更新订阅失败:', error)
    throw error
  }
}

// 删除订阅 - 使用正确的API路径
export const deleteSubscription = async (id: number): Promise<void> => {
  try {
    console.log(`[SubscriptionService] 开始删除订阅 ID: ${id}`)
    const response = await apiClient.delete(`/subscription-tracker/${id}`)

    if (response.success) {
      console.log(`[SubscriptionService] 成功删除订阅 ID: ${id}`)
    } else {
      throw new Error('删除订阅失败')
    }
  } catch (error: any) {
    console.error('[SubscriptionService] 删除订阅失败:', error)
    throw error
  }
}

// 切换订阅状态（激活/取消）
export const toggleSubscriptionStatus = async (id: number): Promise<SubscriptionTracker> => {
  try {
    console.log(`[SubscriptionService] 开始切换订阅状态 ID: ${id}`)
    const response = await apiClient.patch<SubscriptionResponse>(`/subscription-tracker/${id}/toggle`)

    if (response.success && response.data) {
      const subscription = response.data.data || response.data
      const status = subscription.isActive ? '激活' : '取消'
      console.log(`[SubscriptionService] 成功${status}订阅: ${subscription.name}`)
      return subscription
    } else {
      throw new Error('切换订阅状态失败')
    }
  } catch (error: any) {
    console.error('[SubscriptionService] 切换订阅状态失败:', error)
    throw error
  }
}