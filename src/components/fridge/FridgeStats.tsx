'use client'

import React, { memo } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { FridgeStatsData } from '@/services/fridgeService';
import { Trophy, TrendingUp, Calendar, Lightbulb } from 'lucide-react';

interface FridgeStatsProps {
  data: FridgeStatsData;
}

const FridgeStats = memo(function FridgeStats({ data }: FridgeStatsProps) {
  const colors = useThemeColors();
  const { t } = useLocalization();

  // 生成有趣的描述文案
  const generateFunDescription = (item: { name: string; quantity: number }) => {
    const descriptions = [
      t('fridge.stats.consumption_description_1', { quantity: item.quantity, name: item.name, defaultValue: 'Consumed {{quantity}} {{name}}' }),
      t('fridge.stats.consumption_description_2', { name: item.name, quantity: item.quantity, defaultValue: '{{name}} consumed {{quantity}} times' }),
      t('fridge.stats.consumption_description_3', { quantity: item.quantity, name: item.name, defaultValue: '{{quantity}} servings of {{name}}' }),
      t('fridge.stats.consumption_description_4', { name: item.name, quantity: item.quantity, defaultValue: '{{name}} enjoyed {{quantity}} times' }),
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  };

  const renderStatCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    color: string,
    subtitle?: string
  ) => (
    <div
      className="flex p-4 mx-4 my-2 rounded-xl border"
      style={{
        backgroundColor: color + '15',
        borderColor: color + '30'
      }}
    >
      <div
        className="w-12 h-12 rounded-full border-2 flex items-center justify-center mr-4"
        style={{ borderColor: color, padding: '2px' }}
      >
        <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <p className="text-2xl font-bold" style={{ color: colors.text }}>{value}</p>
        <p className="text-sm" style={{ color: colors.textSecondary }}>{title}</p>
        {subtitle && <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>{subtitle}</p>}
      </div>
    </div>
  );

  const renderTopItem = (item: { name: string; quantity: number }, index: number) => {
    const rankColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const color = rankColors[index % rankColors.length];

    return (
      <div
        key={`${item.name}-${index}`}
        className="flex p-3 mx-4 my-1.5 rounded-xl border"
        style={{
          backgroundColor: color + '15',
          borderColor: color + '30'
        }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3"
          style={{ borderColor: color, padding: '2px' }}
        >
          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: color }}>{index + 1}</span>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold" style={{ color: colors.text }}>{item.name}</h4>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {generateFunDescription(item)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold" style={{ color: color }}>{item.quantity}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="py-3">
      {/* 年度总览 */}
      <div className="px-6 pb-3">
        <h2 className="text-lg font-bold mb-4" style={{ color: colors.text }}>
          {t('fridge.stats.year_overview', { year: data.year, defaultValue: '{{year}} Overview' })}
        </h2>
      </div>

      <div className="mb-6">
        {renderStatCard(
          t('fridge.stats.total_consumptions', 'Total Consumptions'),
          data.totalConsumptions,
          <TrendingUp size={20} color="#FF6B6B" />,
          '#FF6B6B',
          t('fridge.stats.total_consumptions_subtitle', 'Items consumed this year')
        )}

        {renderStatCard(
          t('fridge.stats.monthly_consumption', 'Monthly Average'),
          data.monthlyTotal,
          <Calendar size={20} color="#4ECDC4" />,
          '#4ECDC4',
          t('fridge.stats.monthly_different_items', { count: data.monthlyItems, defaultValue: '{{count}} different items' })
        )}
      </div>

      {/* 消耗排行榜 */}
      {data.topItems.length > 0 && (
        <div>
          <div className="flex items-center px-6 mb-3">
            <Trophy size={18} color="#FFD700" className="mr-2" />
            <h2 className="text-lg font-bold" style={{ color: colors.text }}>
              {t('fridge.stats.consumption_leaderboard', 'Consumption Leaderboard')}
            </h2>
          </div>

          <div className="px-6 pb-3">
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              {t('fridge.stats.leaderboard_subtitle', 'Your most consumed items this year')}
            </p>
          </div>

          <div className="mb-6">
            {data.topItems.slice(0, 5).map((item, index) => renderTopItem(item, index))}
          </div>
        </div>
      )}

      {/* 有趣的统计 */}
      <div
        className="flex flex-col p-4 mx-4 my-2 rounded-xl border"
        style={{
          backgroundColor: colors.tint + '15',
          borderColor: colors.tint + '30'
        }}
      >
        <div className="flex items-center mb-3">
          <Lightbulb size={18} color={colors.tint} className="mr-2" />
          <h3 className="text-lg font-bold" style={{ color: colors.text }}>
            {t('fridge.stats.fun_stats', 'Fun Stats')}
          </h3>
        </div>

        <div className="text-center py-4">
          <Lightbulb size={32} color={colors.tint} className="mx-auto mb-3" />
          <p className="text-base" style={{ color: colors.text }}>
            {data.totalConsumptions > 100 ?
              t('fridge.stats.master_level', {
                total: data.totalConsumptions,
                daily: Math.round(data.totalConsumptions / 365 * 10) / 10,
                defaultValue: 'You\'re a fridge master! {{total}} items consumed ({{daily}} per day)'
              }) :
              data.totalConsumptions > 50 ?
                t('fridge.stats.good_level', { total: data.totalConsumptions, defaultValue: 'Great job! {{total}} items consumed this year' }) :
                data.totalConsumptions > 10 ?
                  t('fridge.stats.starter_level', 'You\'re getting started with fridge tracking!') :
                  t('fridge.stats.beginner_level', 'Welcome to fridge tracking!')
            }
          </p>
        </div>
      </div>
    </div>
  );
});

export default FridgeStats;