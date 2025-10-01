import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { storage } from './utils'
import type { FocusSession, FocusStats, TodayFocusStats } from '@/types/focus'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
}

class ApiClient {
  private client: AxiosInstance
  private refreshPromise: Promise<string> | null = null

  constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured')
    }

    this.client = axios.create({
      baseURL: `${apiUrl}/api`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // 请求拦截器 - 添加认证头
    this.client.interceptors.request.use(
      (config) => {
        const token = storage.get('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // 响应拦截器 - 处理错误和token刷新
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          // 只有在存在 token 的情况下才尝试刷新
          const currentToken = storage.get('token')
          if (currentToken) {
            try {
              const newToken = await this.refreshToken()
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            } catch (refreshError) {
              // 刷新token失败，跳转到登录页
              storage.remove('token')
              storage.remove('refreshToken')
              storage.remove('user')
              if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login'
              }
              return Promise.reject(refreshError)
            }
          } else {
            // 没有token，直接返回401错误
            return Promise.reject(error)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private async refreshToken(): Promise<string> {
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performTokenRefresh()
    
    try {
      const token = await this.refreshPromise
      return token
    } finally {
      this.refreshPromise = null
    }
  }

  private async performTokenRefresh(): Promise<string> {
    const currentToken = storage.get('token')
    if (!currentToken) {
      throw new Error('No token available for refresh')
    }

    const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
    if (!apiUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL is not configured')
    }

    // 后端的 /auth/refresh 端点需要在 Header 中提供当前 token
    const response = await axios.post(
      `${apiUrl}/api/auth/refresh`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      }
    )

    if (response.data.success && response.data.data) {
      const { token, refreshToken, user } = response.data.data
      storage.set('token', token)
      storage.set('refreshToken', refreshToken)
      storage.set('user', user)
      return token
    } else {
      throw new Error('Token refresh failed')
    }
  }

  // 通用请求方法
  async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.client(config)
      
      // 检查成功响应的格式是否符合 ApiResponse 接口
      const responseData = response.data as any
      
      if (responseData.success !== undefined) {
        // 后端返回的是标准 ApiResponse 格式
        return responseData
      } else if (responseData.token && responseData.user) {
        // 后端返回的是登录成功的特殊格式，转换为标准格式
        return {
          success: true,
          data: {
            token: responseData.token,
            refreshToken: responseData.refreshToken || responseData.token, // 如果没有refreshToken，使用token
            user: responseData.user,
          } as T,
          message: responseData.message
        }
      } else {
        // 其他成功响应格式，包装为标准格式
        return {
          success: true,
          data: responseData as T,
        }
      }
    } catch (error: any) {
      console.error('API Request Error:', error)
      
      if (error.response?.data) {
        // 检查后端返回的数据格式是否符合 ApiResponse 接口
        const responseData = error.response.data
        
        if (responseData.success !== undefined) {
          // 后端返回的是标准 ApiResponse 格式
          return responseData
        } else if (responseData.message) {
          // 后端返回的是简单的 {message: "..."} 格式，转换为标准格式
          return {
            success: false,
            error: {
              code: 'API_ERROR',
              message: responseData.message,
            },
          }
        } else {
          // 其他格式的错误响应
          return {
            success: false,
            error: {
              code: 'API_ERROR',
              message: typeof responseData === 'string' ? responseData : 'API request failed',
            },
          }
        }
      }

      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: error.message || 'Network error occurred',
        },
      }
    }
  }

  // GET 请求
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url })
  }

  // POST 请求
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data })
  }

  // PUT 请求
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data })
  }

  // DELETE 请求
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url })
  }

  // PATCH 请求
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data })
  }
}

// 导出单例实例
export const apiClient = new ApiClient()

// 认证相关API - 匹配后端API结构
export const authApi = {
  login: (credentials: { email: string; password: string }): Promise<ApiResponse<{ token: string; refreshToken: string; user: any }>> =>
    apiClient.post('/auth/login', credentials),

  register: (userData: { email: string; password: string; nickname: string }): Promise<ApiResponse<{ token: string; refreshToken: string; user: any }>> =>
    apiClient.post('/auth/register', userData),
  
  logout: async () => {
    // Also clear chat storage using its dedicated clear method
    try {
      const { chatStorage } = await import('@/lib/chatStorage')
      chatStorage.clearAll()
    } catch (error) {
      console.error('Error clearing chat storage:', error)
    }

    // 清除本地存储的认证信息和所有缓存数据
    await storage.clearAllCache()

    return Promise.resolve({ success: true })
  },
  
  getProfile: (): Promise<ApiResponse<any>> => apiClient.get('/auth/profile'),

  updateProfile: (data: {
    nickname?: string
    email?: string
    avatarUrl?: string
    preferredLanguage?: string
    timezone?: string
    pushToken?: string
  }): Promise<ApiResponse<any>> => apiClient.put('/auth/profile', data),

  deleteUser: (): Promise<ApiResponse<void>> => apiClient.delete('/auth/user'),
}

// 任务相关API
export const tasksApi = {
  getTasks: (params?: {
    page?: number
    limit?: number
    status?: string
    priority?: string
    search?: string
    dueDate?: string
    parentId?: string | number
    sortBy?: string
    sortOrder?: string
    timeRange?: string
    todayDate?: string
  }) => apiClient.get('/tasks', { params }),

  getTask: (id: string | number) => apiClient.get(`/tasks/${id}`),

  getSubtasks: (parentId: string | number) => apiClient.get(`/tasks/${parentId}/subtasks`),

  getTaskStats: () => apiClient.get('/tasks/stats'),

  getTaskStatssummary: () => apiClient.get('/tasks/stats/summary'),

  createTask: (task: {
    title: string
    description?: string
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
    parentId?: number
  }) => apiClient.post('/tasks', task),

  updateTask: (id: string | number, updates: {
    title?: string
    description?: string
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    dueDate?: string
  }) => apiClient.put(`/tasks/${id}`, updates),

  deleteTask: (id: string | number) => apiClient.delete(`/tasks/${id}`),

  deleteAllSubtasks: (parentId: string | number) => apiClient.delete(`/tasks/${parentId}/subtasks`),

  batchUpdate: (action: string, taskIds: string[], data?: any) =>
    apiClient.post('/tasks/batch', { action, taskIds, data }),

  getHeatmap: (): Promise<ApiResponse<Record<string, number>>> =>
    apiClient.get('/tasks/stats/heatmap'),
}

// AI对话相关API
export const chatApi = {
  sendMessage: (message: string, sessionId?: string, contextMessages?: any[], clientMessageId?: string) => {
    // 获取用户时区和本地时间，参考移动端实现
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const userLocalTime = new Date()

    const requestData: any = {
      message,
      sessionId,
      timestamp: userLocalTime.toString(), // 发送用户本地时间字符串
      userTimezone // 添加用户时区到请求体中
    }

    // 添加客户端消息ID，参考移动端实现
    if (clientMessageId) {
      requestData.clientMessageId = clientMessageId
    }

    // 如果提供了上下文历史，将其转换为后端期望的格式
    if (contextMessages && contextMessages.length > 0) {
      requestData.contextHistory = contextMessages.map(msg => ({
        role: msg.isUser ? 'user' : 'model',
        parts: [{ text: msg.content }]
        // 注意：历史消息只包含必需的字段，不包含 timestamp 和 metadata（减少数据传输）
      })).reverse() // 反转使得最早的消息在前
    }

    return apiClient.post('/ai/chat', requestData)
  },

  getHistory: (page = 1, limit = 20): Promise<ApiResponse<any>> =>
    apiClient.get('/ai/chat/history', { params: { page, limit } }),

  decomposeTask: (taskId: string, taskTitle: string) =>
    apiClient.post('/ai/decompose', { taskId, taskTitle }),

  transcribeAudio: async (audioBlob: Blob): Promise<ApiResponse<{ transcript: string }>> => {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'voice.webm')

    return apiClient.request({
      method: 'POST',
      url: '/ai/transcribe',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// 专注模式相关API
export const focusApi = {
  startSession: (data: {
    taskId?: string
    duration: number
    type: 'focus' | 'shortBreak' | 'longBreak'
  }) => apiClient.post<FocusSession & { sessionId?: string }>('/focus/sessions', data),

  completeSession: (sessionId: string, data: {
    actualDuration: number
    summary?: string
    interrupted: boolean
  }) => apiClient.put<FocusSession>(`/focus/sessions/${sessionId}/complete`, data),

  pauseSession: (sessionId: string, reason?: string) =>
    apiClient.post(`/focus/sessions/${sessionId}/pause`, { reason }),

  getStats: (period?: string, startDate?: string, endDate?: string) =>
    apiClient.get<FocusStats>('/focus/stats', { params: { period, startDate, endDate } }),

  getTodayStats: () => apiClient.get<TodayFocusStats>('/focus/stats/today'),

  updateStats: (data: {
    totalFocusTime?: number
    completedSessions?: number
    currentStreak?: number
    weeklyFocusTime?: number
    lastFocusDate?: string | null
  }) => apiClient.put<FocusStats>('/focus/stats', data),

  updateSettings: (settings: {
    autoStartBreaks?: boolean
    autoStartFocus?: boolean
    soundEnabled?: boolean
    vibrationEnabled?: boolean
  }) => apiClient.put('/focus/settings', settings),

  updateWeeklyGoal: (goalInSeconds: number) =>
    apiClient.put('/focus/weekly-goal', { weeklyGoal: goalInSeconds }),

  saveSummary: (sessionId: string, summary: string) =>
    apiClient.post<FocusSession>(`/focus/sessions/${sessionId}/save-summary`, { summary }),

  getPepTalk: (taskTitle: string, userLanguage = 'en', recentMessages?: any[], subtaskInfo?: any) =>
    apiClient.post<{ pep_talk: string }>('/ai/focus/pep-talk', {
      taskTitle,
      userLanguage,
      recentMessages,
      subtaskInfo
    }),

  getStuckSupport: (taskTitle: string, userLanguage = 'en') =>
    apiClient.post<{ support_text: string }>('/ai/focus/stuck-support', {
      taskTitle,
      userLanguage
    }),
}

// 订阅管理相关API
export const subscriptionsApi = {
  getSubscriptions: () => apiClient.get('/subscriptions'),
  
  createSubscription: (data: {
    name: string
    price: number
    currency: string
    billingCycle: 'monthly' | 'yearly'
    startDate: string
    category?: string
  }) => apiClient.post('/subscriptions', data),
  
  updateSubscription: (id: string, updates: any) =>
    apiClient.put(`/subscriptions/${id}`, updates),
  
  deleteSubscription: (id: string) => apiClient.delete(`/subscriptions/${id}`),
}

// 分析数据相关API
export const analyticsApi = {
  getDashboard: (period = 'month') =>
    apiClient.get('/analytics/dashboard', { params: { period } }),
  
  exportData: (format: 'csv' | 'json' | 'xlsx', type: string, startDate?: string, endDate?: string) =>
    apiClient.get('/analytics/export', {
      params: { format, type, startDate, endDate },
      responseType: 'blob',
    }),
}

// 用户设置相关API
export const settingsApi = {
  getSettings: () => apiClient.get('/settings'),

  updateSettings: (settings: any) => apiClient.put('/settings', settings),
}

// 价格相关API
export const pricingApi = {
  getPrices: async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!apiUrl) {
        console.error('NEXT_PUBLIC_BACKEND_URL is not configured, using fallback prices')
        return {
          success: true,
          data: {
            monthly: { id: 'monthly', amount: 2900, currency: 'usd', interval: 'month' },
            yearly: { id: 'yearly', amount: 29900, currency: 'usd', interval: 'year' }
          }
        }
      }

      // 使用与 landing page 相同的 Stripe 价格获取端点
      const response = await fetch(`${apiUrl}/api/stripe/prices`);

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.prices) {
          // 转换格式以匹配现有的数据结构
          return {
            success: true,
            data: {
              monthly: data.prices.monthly,
              yearly: data.prices.yearly
            }
          };
        }
      }

      // 如果API调用失败，返回后备价格
      return {
        success: true,
        data: {
          monthly: { id: 'monthly', amount: 2900, currency: 'usd', interval: 'month' },
          yearly: { id: 'yearly', amount: 29900, currency: 'usd', interval: 'year' }
        }
      };
    } catch (error) {
      console.error('Failed to fetch Stripe prices:', error);

      // 返回后备价格
      return {
        success: true,
        data: {
          monthly: { id: 'monthly', amount: 2900, currency: 'usd', interval: 'month' },
          yearly: { id: 'yearly', amount: 29900, currency: 'usd', interval: 'year' }
        }
      };
    }
  },
  getPlans: () => apiClient.get('/pricing/plans'),
}

// 推荐系统相关API
export const referralApi = {
  getReferralInfo: () => apiClient.get('/referral/info'),

  validateReferralCode: (code: string) => apiClient.get(`/referral/validate/${code}`),

  applyReferralCode: (referralCode: string) => apiClient.post('/referral/apply', { referralCode }),
}

// 礼品码相关API
export const promoCodeApi = {
  // 兑换礼品码
  redeemCode: (code: string) =>
    apiClient.post('/promo-code/redeem', { code }),

  // 获取兑换历史
  getHistory: (page = 1, limit = 10) =>
    apiClient.get('/promo-code/history', { params: { page, limit } }),

  // 验证礼品码有效性（可选，用于实时验证）
  validateCode: (code: string) =>
    apiClient.get(`/promo-code/validate/${code}`),
}

// Helper function for heatmap data
export const getHeatmapData = async (): Promise<Record<string, number>> => {
  const response = await tasksApi.getHeatmap()

  if (!response.success) {
    throw new Error(response.error?.message || '获取热力图数据失败')
  }

  return response.data || {}
}

// 冰箱相关API
export const fridgeApi = {
  getItems: () => apiClient.get('/fridge/items'),

  addItem: (itemData: {
    name: string
    icon?: string
    category?: string
    quantity: number
    unit?: string
    expiryDate?: string
  }) => apiClient.post('/fridge/items', itemData),

  updateItem: (itemId: number, itemData: any) =>
    apiClient.put(`/fridge/items/${itemId}`, itemData),

  consumeItem: (itemId: number, quantity: number = 1) =>
    apiClient.post(`/fridge/items/${itemId}/consume`, { quantity }),

  deleteItem: (itemId: number) => apiClient.delete(`/fridge/items/${itemId}`),

  getStats: () => apiClient.get('/fridge/stats'),
}
const LEGACY_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export interface LoginResponse {
  message?: string;
  token: string;
  user: {
    id: string;
    email: string;
    nickname: string;
    avatarUrl?: string;
    phoneNumber?: string;
    phoneVerified?: boolean;
    emailVerified?: boolean;
    preferredLanguage?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface RegisterResponse extends LoginResponse {}

export interface ProfileResponse {
  user: LoginResponse["user"];
}

export interface LegacyPremiumStatus {
  isPremium: boolean;
  expiresAt: string | null;
  store: string | null;
  type: string | null;
  willRenew: boolean;
  referralCreditDays?: number;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export type PremiumStatus = LegacyPremiumStatus;

class LegacyApiService {
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = LEGACY_API_BASE_URL?.replace(/\/$/, "") ?? "";
    const url = `${baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Unexpected response type from backend at ${url}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error ${response.status}`);
      }

      return data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`Unable to reach backend service at ${LEGACY_API_BASE_URL}`);
      }
      throw error;
    }
  }

  login(email: string, password: string, preferredLanguage?: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, preferredLanguage }),
    });
  }

  register(
    email: string,
    password: string,
    nickname: string,
    referralCode?: string,
    preferredLanguage?: string,
  ): Promise<RegisterResponse> {
    return this.makeRequest<RegisterResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, nickname, referralCode, preferredLanguage }),
    });
  }

  getProfile(token: string): Promise<ProfileResponse> {
    return this.makeRequest<ProfileResponse>("/api/auth/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  refreshToken(token: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>("/api/auth/refresh", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getPremiumStatus(token: string): Promise<LegacyPremiumStatus> {
    return this.makeRequest<LegacyPremiumStatus>("/api/user-premium-status/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return this.makeRequest<ForgotPasswordResponse>("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    return this.makeRequest<ResetPasswordResponse>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  }
}

export const apiService = new LegacyApiService();
