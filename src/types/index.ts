// 用户相关类型
export interface User {
  id: number
  email: string
  nickname?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// 任务相关类型
export interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'completed' | 'deleted'
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  parentId?: string
  subTasks: Task[]
  focusTime: number // 累计专注时间（秒）
}

export interface TaskFilters {
  status?: 'pending' | 'completed' | 'deleted'
  priority?: 'low' | 'medium' | 'high'
  search?: string
  dueDate?: 'today' | 'week' | 'month'
  parentId?: string
}

export interface TasksResponse {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// AI对话相关类型
export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
  sessionId?: string
  metadata?: {
    actions?: ChatAction[]
    context?: any
  }
}

export interface ChatAction {
  type: 'createTask' | 'updateTask' | 'deleteTask' | 'startFocus' | 'createSubscription'
  data: any
}

export interface ChatResponse {
  reply: string
  actions?: ChatAction[]
  sessionId: string
}

// 专注模式相关类型
export interface FocusSession {
  id: string
  userId: number
  taskId?: string
  duration: number // 计划时长（秒）
  actualDuration?: number // 实际时长（秒）
  type: 'focus' | 'shortBreak' | 'longBreak'
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  startTime: string
  endTime?: string
  summary?: string
  interrupted: boolean
  pepTalk?: string
  createdAt: string
}

export interface FocusStats {
  totalSessions: number
  totalFocusTime: number // 总专注时间（秒）
  averageSessionLength: number
  completionRate: number // 完成率 (0-1)
  focusStreak: number // 连续专注天数
  dailyStats: Array<{
    date: string
    sessions: number
    focusTime: number
    completedSessions: number
  }>
  weeklyTrend: Array<{
    week: string
    focusTime: number
  }>
}

// 订阅管理相关类型
export interface Subscription {
  id: string
  name: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  nextBillingDate: string
  category?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionSummary {
  monthlyTotal: number
  yearlyTotal: number
  activeCount: number
  categories: Record<string, number>
}

export interface SubscriptionsResponse {
  subscriptions: Subscription[]
  summary: SubscriptionSummary
}

// 分析数据相关类型
export interface DashboardData {
  taskStats: {
    totalTasks: number
    completedTasks: number
    completionRate: number
    overdueTasks: number
  }
  focusStats: {
    totalSessions: number
    totalFocusTime: number
    averageSessionLength: number
    focusStreak: number
  }
  productivityTrend: Array<{
    date: string
    completed: number
    created: number
  }>
  categoryBreakdown: Array<{
    category: string
    count: number
    percentage: number
  }>
}

// 用户设置相关类型
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    taskReminders: boolean
    focusReminders: boolean
    dailySummary: boolean
  }
  focus: {
    defaultDuration: number // 默认专注时长（秒）
    breakDuration: number // 休息时长（秒）
    longBreakInterval: number // 长休息间隔（番茄钟个数）
  }
}

export interface UserSettings {
  preferences: UserPreferences
  shortcuts: Record<string, string>
}

// WebSocket 消息类型
export interface WebSocketMessage {
  type: 'taskUpdate' | 'taskCreate' | 'taskDelete' | 'focusStart' | 'focusEnd' | 'notification'
  data: any
  timestamp: string
}

// API 响应类型
export interface ApiError {
  code: string
  message: string
  details?: any
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
}

// 表单相关类型
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  nickname?: string
}

export interface TaskFormData {
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: Date
  parentId?: string
}

export interface SubscriptionFormData {
  name: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  startDate: Date
  category?: string
}

// 组件 Props 类型
export interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onStartFocus: (task: Task) => void
}

export interface ChatMessageProps {
  message: ChatMessage
  isLast?: boolean
}

export interface FocusTimerProps {
  session: FocusSession
  onComplete: (summary?: string) => void
  onPause: (reason?: string) => void
  onCancel: () => void
}

// 状态管理类型
export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface TasksState {
  tasks: Task[]
  currentTask: Task | null
  isLoading: boolean
  filters: TaskFilters
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  currentSessionId: string | null
}

export interface FocusState {
  currentSession: FocusSession | null
  isActive: boolean
  timeRemaining: number
  stats: FocusStats | null
}

export interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    timestamp: string
  }>
}