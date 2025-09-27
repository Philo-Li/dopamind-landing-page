'use client'

import React, { memo } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { Habit, HabitStats } from '@/types/habit';
import { getEmojiFromIcon } from '@/constants/emojiIcons';
import { HabitHeatmap } from './HabitHeatmap';
import { Plus, Minus } from 'lucide-react';

interface HabitItemProps {
  habit: Habit;
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onPress: () => void;
  stats?: HabitStats;
}

const HabitItem = memo(function HabitItem({
  habit,
  onIncrement,
  onDecrement,
  onPress,
  stats
}: HabitItemProps) {
  const colors = useThemeColors();
  const { t } = useLocalization();

  // 基本数据验证 - 如果习惯数据无效，不渲染
  if (!habit || !habit.id || !habit.title) {
    return null;
  }

  return (
    <div
      onClick={onPress}
      className="flex flex-col p-3 mx-4 my-1.5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: colors.card.background,
        borderColor: habit.color + '40'
      }}
    >
      <div className="flex flex-row items-center mb-2">
        <div
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center mr-3"
          style={{ borderColor: habit.color, padding: '2px' }}
        >
          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
            <span className="text-lg">{getEmojiFromIcon(habit.icon)}</span>
          </div>
        </div>

        <span className="flex-1 text-base font-medium" style={{ color: colors.text }}>
          {habit.title}
        </span>

        {/* 计数器组件 */}
        <div className="flex items-center">
          <div className="flex flex-row items-center">
            {/* 减号按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDecrement(habit.id);
              }}
              disabled={(habit.todayCount || 0) === 0}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center bg-transparent transition-opacity duration-200 hover:bg-opacity-10 hover:bg-black active:scale-95"
              style={{
                borderColor: habit.color,
                opacity: (habit.todayCount || 0) === 0 ? 0.3 : 1
              }}
            >
              <Minus size={14} color={habit.color} strokeWidth={2.5} />
            </button>

            {/* 计数显示 */}
            <div
              className="min-w-8 h-7 rounded-full border-2 flex items-center justify-center mx-2 bg-transparent"
              style={{ borderColor: habit.color }}
            >
              <span className="text-sm font-semibold" style={{ color: colors.text }}>
                {habit.todayCount || 0}
              </span>
            </div>

            {/* 加号按钮 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onIncrement(habit.id);
              }}
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center bg-transparent transition-all duration-200 hover:bg-opacity-10 hover:bg-black active:scale-95"
              style={{ borderColor: habit.color }}
            >
              <Plus size={14} color={habit.color} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* 年度热力图 */}
      <div className="mt-1">
        <HabitHeatmap
          data={stats?.heatmap || {}}
          color={habit.color}
          compact={true}
          showCompletionCount={true}
        />
      </div>
    </div>
  );
});

export default HabitItem;