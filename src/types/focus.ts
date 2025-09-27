// src/types/focus.ts

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'countup';
export type TimerState = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerConfig {
  duration: number;
  label: string;
  color: string;
  icon: string;
  statusText: string;
}

export interface FocusSession {
  id?: number;
  duration: number;
  mode: TimerMode;
  taskId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FocusStats {
  totalFocusTime: number;
  completedSessions: number;
  currentStreak: number;
  weeklyFocusTime: number;
  weeklyGoal: number;
  lastFocusDate: string | null;
  settings?: {
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
}

export interface TodayFocusStats {
  todayFocusTime: number;
  todayCompletedSessions: number;
  todayGoalProgress: number;
  settings?: {
    autoStartBreaks: boolean;
    autoStartFocus: boolean;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
}