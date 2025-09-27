import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Task } from '@/types/task'
import type { SubscriptionTracker } from '@/types/subscriptionTracker'

const AUTH_COOKIE_KEYS = new Set([
  'token',
  'refreshToken',
  'user',
  'premiumStatus',
])

const getCookieValue = (key: string): string | null => {
  if (typeof document === 'undefined') return null
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escapedKey}=([^;]*)`))
  return match ? match[1] : null
}

const resolveCookieDomain = (): string => {
  if (typeof window === 'undefined') return ''
  const hostname = window.location.hostname
  return hostname.endsWith('dopamind.app') ? '.dopamind.app' : ''
}

const setAuthCookie = (key: string, value: string, days = 30): void => {
  if (!AUTH_COOKIE_KEYS.has(key) || typeof document === 'undefined') return

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  const domain = resolveCookieDomain()
  const domainPart = domain ? `;Domain=${domain}` : ''
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const securePart = isSecure ? ';Secure' : ''

  document.cookie = `${key}=${value};Expires=${expires};Path=/${domainPart}${securePart};SameSite=Lax`
}

const removeAuthCookie = (key: string): void => {
  if (!AUTH_COOKIE_KEYS.has(key) || typeof document === 'undefined') return

  const domain = resolveCookieDomain()
  const domainPart = domain ? `;Domain=${domain}` : ''
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:'
  const securePart = isSecure ? ';Secure' : ''

  document.cookie = `${key}=;Expires=Thu, 01 Jan 1970 00:00:00 GMT;Path=/${domainPart}${securePart};SameSite=Lax`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// User interface matching mobile app
export interface User {
  id: string
  email?: string
  phoneNumber?: string
  nickname?: string
  avatarUrl?: string
  pushToken?: string
  emailVerified?: boolean
  phoneVerified?: boolean
  hasEverPaid?: boolean
  preferredLanguage?: string
  timezone?: string
  createdAt?: string
  updatedAt?: string
}

// 格式化日期
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short') {
  const d = new Date(date)

  if (format === 'relative') {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return '今天'
    if (days === 1) return '昨天'
    if (days === -1) return '明天'
    if (days > 0) return `${days}天前`
    return `${Math.abs(days)}天后`
  }

  if (format === 'long') {
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return d.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 格式化时长（秒转换为可读格式）
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? `${minutes}分钟` : ''}`
  }
  if (minutes > 0) {
    return `${minutes}分钟${remainingSeconds > 0 ? `${remainingSeconds}秒` : ''}`
  }
  return `${remainingSeconds}秒`
}

// 任务优先级颜色
export function getPriorityColor(priority: 'low' | 'medium' | 'high') {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// 验证邮箱格式
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 截断文本
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// 生成随机ID
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// 防抖函数
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 本地存储工具
export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null

    const localValue = window.localStorage.getItem(key)
    if (localValue !== null) {
      try {
        return JSON.parse(localValue)
      } catch {
        return localValue
      }
    }

    if (AUTH_COOKIE_KEYS.has(key)) {
      const rawCookie = getCookieValue(key)
      if (rawCookie !== null) {
        let decoded = rawCookie
        try {
          decoded = decodeURIComponent(rawCookie)
        } catch {
          decoded = rawCookie
        }

        let parsed: unknown = decoded
        try {
          parsed = JSON.parse(decoded)
        } catch {
          parsed = decoded
        }

        try {
          window.localStorage.setItem(key, typeof parsed === 'string' ? parsed : JSON.stringify(parsed))
        } catch (error) {
          console.warn('Failed to persist auth cookie to localStorage:', error)
        }

        return parsed
      }
    }

    return null
  },
  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return

    let serialized: string | null = null
    try {
      serialized = typeof value === 'string' ? value : JSON.stringify(value)
      window.localStorage.setItem(key, serialized)
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }

    if (AUTH_COOKIE_KEYS.has(key)) {
      const cookieValue = serialized ?? String(value)
      setAuthCookie(key, encodeURIComponent(cookieValue))
    }
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(key)
    removeAuthCookie(key)
  },

  // Task-specific storage methods
  async saveTasksCache(tasks: Task[]): Promise<void> {
    this.set('tasks_cache', tasks)
  },

  async getTasksCache(): Promise<Task[] | null> {
    return this.get('tasks_cache')
  },

  async saveTasksByStatusCache(tasks: Task[], status: string): Promise<void> {
    this.set(`tasks_status_${status}`, tasks)
  },

  async getTasksByStatusCache(status: string): Promise<Task[] | null> {
    return this.get(`tasks_status_${status}`)
  },

  async saveTasksByAllStatusCache(tasks: Task[]): Promise<void> {
    const statusGroups = tasks.reduce((acc, task) => {
      if (!acc[task.status]) acc[task.status] = []
      acc[task.status].push(task)
      return acc
    }, {} as Record<string, Task[]>)

    for (const [status, statusTasks] of Object.entries(statusGroups)) {
      await this.saveTasksByStatusCache(statusTasks, status)
    }
  },

  async saveTaskDetailCache(task: Task): Promise<void> {
    this.set(`task_detail_${task.id}`, task)
  },

  async getTaskDetailCache(taskId: number): Promise<Task | null> {
    return this.get(`task_detail_${taskId}`)
  },

  async clearTaskDetailCache(taskId: number): Promise<void> {
    this.remove(`task_detail_${taskId}`)
  },

  async saveHeatmapCache(data: Record<string, number>): Promise<void> {
    this.set('heatmap_data', data)
  },

  async getHeatmapCache(): Promise<Record<string, number> | null> {
    return this.get('heatmap_data')
  },

  // 订阅缓存方法
  getSubscriptionsCache: (): SubscriptionTracker[] | null => {
    const cached = storage.get('subscriptions_cache')
    const timestamp = storage.get('subscriptions_cache_timestamp')

    if (!cached || !timestamp) return null

    // 缓存过期时间：1小时
    const cacheExpiry = 60 * 60 * 1000
    if (Date.now() - timestamp > cacheExpiry) {
      storage.remove('subscriptions_cache')
      storage.remove('subscriptions_cache_timestamp')
      return null
    }

    return cached
  },

  saveSubscriptionsCache: (subscriptions: SubscriptionTracker[]): void => {
    try {
      storage.set('subscriptions_cache', subscriptions)
      storage.set('subscriptions_cache_timestamp', Date.now())
    } catch (error) {
      console.error('保存订阅缓存失败:', error)
    }
  },

  clearSubscriptionsCache: (): void => {
    storage.remove('subscriptions_cache')
    storage.remove('subscriptions_cache_timestamp')
  },

  // User-related storage methods
  saveUser(user: User): void {
    this.set('user', user)
  },

  getUser(): User | null {
    return this.get('user')
  },

  removeUser(): void {
    this.remove('user')
  },

  // Get user's preferred language
  getUserLanguage(): string {
    const user = this.getUser()
    return user?.preferredLanguage || 'zh' // Default to Chinese
  },

  // Update user's preferred language
  updateUserLanguage(language: string): void {
    const user = this.getUser()
    if (user) {
      user.preferredLanguage = language
      this.saveUser(user)
    }
  },

  // Clear all user-specific cache data
  async clearAllCache(): Promise<void> {
    if (typeof window === 'undefined') return

    try {
      const keysToRemove = [
        // Authentication data
        'token',
        'refreshToken',
        'user',
        'premiumStatus',
        // Task-related cache
        'tasks_cache',
        'tasks_status_PENDING',
        'tasks_status_IN_PROGRESS',
        'tasks_status_COMPLETED',
        'tasks_status_CANCELLED',
        // Statistics cache
        'task_stats_cache',
        // Chat storage (primary key)
        'dopamind-chat-storage-v2',
        // Heatmap cache
        'heatmap_data',
        // Subscription cache
        'subscriptions_cache',
        'subscriptions_cache_timestamp',
        // Language settings
        'dopamind-language',
        // Sidebar state (optional, might want to keep for UX)
        'sidebarCollapsed'
      ]

      // Remove known cache keys
      keysToRemove.forEach(key => {
        if (localStorage.getItem(key) !== null) {
          this.remove(key)
        }
      })

      // Also remove any pattern-matched cache entries
      const allKeys = Object.keys(localStorage)
      allKeys.forEach(key => {
        if (key.startsWith('task_detail_') ||
            key.startsWith('tasks_status_') ||
            key.startsWith('dopamind-') ||
            key.startsWith('chat_') ||
            key.includes('cache') ||
            key.includes('-storage')) {
          this.remove(key)
        }
      })
    } catch (error) {
      console.error('Error clearing cache during logout:', error)
    }
  }
}
