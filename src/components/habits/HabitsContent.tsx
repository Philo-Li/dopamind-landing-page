'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { useRouter } from 'next/navigation';
import { Habit, HabitStats, CreateHabitRequest } from '@/types/habit';
import { getHabits, getAllHabitsStats, logHabit, decrementHabitLog, createHabit } from '@/services/habitService';
import HabitItem from './HabitItem';
import CreateHabitForm from './CreateHabitForm';
import { Plus, RefreshCw } from 'lucide-react';

export default function HabitsContent() {
  const colors = useThemeColors();
  const { t } = useLocalization();
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [allHabitsStats, setAllHabitsStats] = useState<Record<number, HabitStats>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const hasLoadedInitially = useRef(false);

  // 加载习惯数据
  const loadHabits = useCallback(async () => {
    try {
      setError(null);
      const [habitsData, statsData] = await Promise.all([
        getHabits(),
        getAllHabitsStats()
      ]);
      setHabits(habitsData);
      setAllHabitsStats(statsData);
    } catch (error) {
      console.error('加载习惯失败:', error);
      setError(error instanceof Error ? error.message : '加载习惯失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    if (!hasLoadedInitially.current) {
      loadHabits();
      hasLoadedInitially.current = true;
    }
  }, [loadHabits]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadHabits();
  }, [loadHabits]);

  // 处理增加打卡
  const handleIncrement = useCallback(async (habitId: number) => {
    // 乐观更新UI状态
    const originalHabits = habits;
    setHabits(prev => prev.map(h =>
      h.id === habitId ? {
        ...h,
        todayCount: (h.todayCount || 0) + 1,
        isCompletedToday: true
      } : h
    ));

    try {
      await logHabit(habitId);

      // 刷新热力图数据
      const updatedStatsData = await getAllHabitsStats();
      setAllHabitsStats(updatedStatsData);

      console.log(`习惯 ${habitId} 打卡成功`);
    } catch (err) {
      console.error('打卡失败', err);
      // 回滚乐观更新
      setHabits(originalHabits);
      setError(err instanceof Error ? err.message : '打卡失败');
    }
  }, [habits]);

  // 处理减少打卡
  const handleDecrement = useCallback(async (habitId: number) => {
    // 乐观更新UI状态
    const originalHabits = habits;
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const newCount = Math.max(0, (h.todayCount || 0) - 1);
        return {
          ...h,
          todayCount: newCount,
          isCompletedToday: newCount > 0
        };
      }
      return h;
    }));

    try {
      await decrementHabitLog(habitId);

      // 刷新热力图数据
      const updatedStatsData = await getAllHabitsStats();
      setAllHabitsStats(updatedStatsData);

      console.log(`习惯 ${habitId} 打卡减少成功`);
    } catch (err) {
      console.error('减少打卡失败', err);
      // 回滚乐观更新
      setHabits(originalHabits);
      setError(err instanceof Error ? err.message : '减少打卡失败');
    }
  }, [habits]);

  const handleHabitPress = useCallback((habit: Habit) => {
    console.log('点击习惯:', habit.title);
    router.push(`/habits/${habit.id}`);
  }, [router]);

  const handleAddHabit = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  const handleCreateHabit = useCallback(async (habitData: CreateHabitRequest) => {
    try {
      await createHabit(habitData);
      setShowCreateForm(false);
      // 刷新习惯列表
      await loadHabits();
    } catch (error) {
      console.error('创建习惯失败:', error);
      throw error; // 让表单处理错误显示
    }
  }, [loadHabits]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <RefreshCw className="animate-spin" size={24} color={colors.tint} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.background }}>
      {/* 头部 */}
      <div className="flex items-center justify-between px-6 border-b h-[64px]" style={{ borderColor: colors.border }}>
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
          {t('habits.title')}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black disabled:opacity-50"
            style={{ color: colors.tint }}
          >
            <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleAddHabit}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black"
            style={{ color: colors.tint }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mx-6 mt-4 p-3 rounded-lg" style={{ backgroundColor: '#FFF3CD', borderColor: '#FFECB3' }}>
          <p className="text-sm" style={{ color: '#856404' }}>
            {error}
          </p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-xs underline"
            style={{ color: '#856404' }}
          >
            关闭
          </button>
        </div>
      )}

      {/* 内容区域 */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {habits.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-8">
              <span className="text-6xl mb-4 opacity-50">⭐️</span>
              <h3 className="text-lg font-medium mb-2" style={{ color: colors.textSecondary }}>
                {t('habits.empty_title')}
              </h3>
              <p className="text-sm text-center opacity-50" style={{ color: colors.textSecondary }}>
                {t('habits.empty_subtitle')}
              </p>
            </div>
          ) : (
            <div className="py-3">
              {habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onPress={() => handleHabitPress(habit)}
                  stats={allHabitsStats[habit.id]}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 创建习惯表单 */}
      {showCreateForm && (
        <CreateHabitForm
          onSubmit={handleCreateHabit}
          onCancel={() => setShowCreateForm(false)}
          loading={false}
        />
      )}

      {/* 下拉刷新指示器 */}
      {refreshing && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
          <RefreshCw className="animate-spin" size={20} color={colors.tint} />
        </div>
      )}
    </div>
  );
}
