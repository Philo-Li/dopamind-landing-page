import { apiClient } from '../lib/api';
import { Habit, HabitStats, CreateHabitRequest } from '@/types/habit';

const API_URL = '/habits';

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const response = await apiClient.get(API_URL);
    if (!response.success) {
      throw new Error(response.error?.message || '获取习惯列表失败');
    }

    return response.data as Habit[];
  } catch (error: any) {
    console.error('[HabitService] 获取习惯列表失败:', error);
    throw new Error(error.message || '获取习惯列表失败');
  }
};

export const getHabit = async (id: number): Promise<Habit> => {
  try {
    const response = await apiClient.get(`${API_URL}/${id}`);

    if (!response.success) {
      throw new Error(response.error?.message || '获取习惯详情失败');
    }

    return response.data as Habit;
  } catch (error: any) {
    console.error('[HabitService] 获取习惯详情失败:', {
      error: error.message,
      habitId: id
    });
    throw new Error(error.message || '获取习惯详情失败');
  }
};

export const logHabit = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.post(`${API_URL}/${id}/log`);
    if (!response.success) {
      throw new Error(response.error?.message || '打卡失败');
    }
  } catch (error: any) {
    console.error('[HabitService] 打卡失败:', error);
    throw new Error(error.message || '打卡失败');
  }
};

export const decrementHabitLog = async (id: number): Promise<void> => {
  try {
    const response = await apiClient.post(`${API_URL}/${id}/log/decrement`);
    if (!response.success) {
      throw new Error(response.error?.message || '减少打卡失败');
    }
  } catch (error: any) {
    console.error('[HabitService] 减少打卡失败:', error);
    throw new Error(error.message || '减少打卡失败');
  }
};

export const getHabitStats = async (id: number): Promise<HabitStats> => {
  try {
    const response = await apiClient.get(`${API_URL}/${id}/stats`);
    if (!response.success) {
      throw new Error(response.error?.message || '获取习惯统计失败');
    }

    const heatmapData = response.data;

    const dates = Object.keys(heatmapData as Record<string, number>).sort();
    const completedDays = dates.length;

    let currentStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const checkDate = new Date(today);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if ((heatmapData as Record<string, number>)[dateStr]) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    let longestStreak = 0;
    let tempStreak = 0;

    if (dates.length > 0) {
      const startDate = new Date(dates[0]);
      const endDate = new Date(dates[dates.length - 1]);

      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if ((heatmapData as Record<string, number>)[dateStr]) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
    }

    const completionRate = completedDays > 0 ? Math.round((completedDays / Math.max(completedDays, 1)) * 100) : 0;

    return {
      completedDays,
      currentStreak,
      longestStreak,
      completionRate,
      heatmap: heatmapData as Record<string, number>
    };
  } catch (error: any) {
    console.error('[HabitService] 获取习惯统计失败:', error);
    throw new Error(error.message || '获取习惯统计失败');
  }
};

export const createHabit = async (habitData: CreateHabitRequest): Promise<Habit> => {
  try {
    const response = await apiClient.post(API_URL, habitData);
    if (!response.success) {
      throw new Error(response.error?.message || '创建习惯失败');
    }

    return response.data as Habit;
  } catch (error: any) {
    console.error('[HabitService] 创建习惯失败:', error);
    throw new Error(error.message || '创建习惯失败');
  }
};

export const getAllHabitsStats = async (): Promise<Record<number, HabitStats>> => {
  try {
    const response = await apiClient.get(`${API_URL}/stats/all`);
    if (!response.success) {
      throw new Error(response.error?.message || '批量获取习惯统计失败');
    }

    const allStats = response.data;
    const processedStats: Record<number, HabitStats> = {};

    Object.keys(allStats as Record<string, Record<string, number>>).forEach(habitIdStr => {
      const habitId = parseInt(habitIdStr);
      const heatmapData = (allStats as Record<string, Record<string, number>>)[habitId];

      const dates = Object.keys(heatmapData).sort();
      const completedDays = dates.length;

      let currentStreak = 0;
      const today = new Date().toISOString().split('T')[0];
      const checkDate = new Date(today);

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (heatmapData[dateStr]) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      let longestStreak = 0;
      let tempStreak = 0;

      if (dates.length > 0) {
        const startDate = new Date(dates[0]);
        const endDate = new Date(dates[dates.length - 1]);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          if (heatmapData[dateStr]) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
          } else {
            tempStreak = 0;
          }
        }
      }

      const completionRate = completedDays > 0 ? Math.round((completedDays / Math.max(completedDays, 1)) * 100) : 0;

      processedStats[habitId] = {
        completedDays,
        currentStreak,
        longestStreak,
        completionRate,
        heatmap: heatmapData
      };
    });

    return processedStats;
  } catch (error: any) {
    console.error('[HabitService] 批量获取习惯统计失败:', error);
    throw new Error(error.message || '批量获取习惯统计失败');
  }
};
