export interface Habit {
  id: number;
  userId: string;
  title: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetDays?: number | null;
  reminderTime?: string | null;
  createdAt: string;
  updatedAt: string;
  isCompletedToday?: boolean;
  todayCount?: number;
}

export type CreateHabitRequest = Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type UpdateHabitRequest = Partial<CreateHabitRequest>;

// API 响应类型
export interface HabitListResponse {
  success: boolean;
  data: Habit[];
}

export interface HabitResponse {
  success: boolean;
  data: Habit;
  message?: string;
}

// 打卡记录类型
export interface HabitLog {
  id: number;
  habitId: number;
  date: string; // ISO 格式的日期字符串 YYYY-MM-DD
  createdAt: string;
}

// 习惯统计数据类型
export interface HabitStats {
  completedDays: number; // 总完成天数
  currentStreak: number; // 当前连续天数
  longestStreak: number; // 最长连续天数
  completionRate: number; // 完成率
  heatmap: Record<string, number>; // 热力图数据，key 为日期，value 为完成次数
}