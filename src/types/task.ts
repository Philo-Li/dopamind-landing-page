// Task status enumeration
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Priority enumeration
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TaskPriority = Priority;

// Task interface
export interface Task {
  id: number;
  userId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  dueDate?: string;
  completedAt?: string;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    subTasks: number;
    completedSubTasks: number;
  };
  _isOptimistic?: boolean;

  // Timezone-aware computed properties
  dueDateLocal?: string | null;
  completedAtLocal?: string | null;
  createdAtLocal?: string;
  updatedAtLocal?: string;

  // Time category info
  timeCategory?: {
    isDueToday?: boolean;
    isDueThisWeek?: boolean;
    wasCompletedToday?: boolean;
    wasCompletedThisWeek?: boolean;
    completedTimeRange?: 'today' | 'yesterday' | 'thisWeek' | 'older' | null;
  };
}

// Create task request
export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

// Update task request
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  dueDate?: string;
}

// Task query parameters
export interface TaskQueryParams {
  status?: TaskStatus | string;
  priority?: Priority;
  dueDate?: string;
  dueDateRange?: string;
  search?: string;
  parentId?: number | null;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'dueDate' | 'priority' | 'completedAt';
  sortOrder?: 'asc' | 'desc';
  timeRange?: 'recent_7_days' | 'recent_30_days' | 'this_week' | 'this_month';
  todayDate?: string;
}

// Task list response
export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Task status configuration
export const TASK_STATUS_CONFIG = {
  PENDING: { labelKey: 'tasks.status.PENDING', color: '#FFA500' },
  IN_PROGRESS: { labelKey: 'tasks.status.IN_PROGRESS', color: '#007AFF' },
  COMPLETED: { labelKey: 'tasks.status.COMPLETED', color: '#34C759' },
  CANCELLED: { labelKey: 'tasks.status.CANCELLED', color: '#FF3B30' }
} as const;

// Priority configuration
export const PRIORITY_CONFIG = {
  LOW: { labelKey: 'tasks.priority.LOW', color: '#34C759' },
  MEDIUM: { labelKey: 'tasks.priority.MEDIUM', color: '#FFA500' },
  HIGH: { labelKey: 'tasks.priority.HIGH', color: '#FF3B30' },
  URGENT: { labelKey: 'tasks.priority.URGENT', color: '#FF0000' }
} as const;

// Task statistics interface
export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  cancelled: number;
  completionRate: number;
  thisWeekCompleted: number;
  thisWeekTotal: number;
  todayTasksCount: number;
}