'use client'

import React, { memo } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { FridgeItem, consumeFridgeItem } from '@/services/fridgeService';
import { Minus } from 'lucide-react';
import {
  Coffee, Apple, Carrot, Sandwich, Candy, Grid3X3, Wine, Beef, Utensils
} from 'lucide-react';

interface FridgeItemCardProps {
  item: FridgeItem;
  onConsume: () => void;
  onEdit: () => void;
}

const FridgeItemCard = memo(function FridgeItemCard({
  item,
  onConsume,
  onEdit,
}: FridgeItemCardProps) {
  const colors = useThemeColors();
  const { t } = useLocalization();

  // 基本数据验证
  if (!item || !item.id || !item.name) {
    return null;
  }

  // 计算过期状态 - 完全按照移动端逻辑
  const getExpiryInfo = () => {
    if (!item.expiryDate) {
      return { text: t('fridge.item.no_expiry', 'No expiry'), color: colors.textSecondary, urgent: false };
    }

    const now = new Date();
    const expiry = new Date(item.expiryDate);
    const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining < 0) {
      return {
        text: t('fridge.item.expired_days', { days: Math.abs(daysRemaining), defaultValue: 'Expired {{days}} days ago' }),
        color: '#FF3B30',
        urgent: true
      };
    } else if (daysRemaining === 0) {
      return { text: t('fridge.item.expires_today', 'Expires today'), color: '#FF9500', urgent: true };
    } else if (daysRemaining === 1) {
      return { text: t('fridge.item.expires_tomorrow', 'Expires tomorrow'), color: '#FF9500', urgent: true };
    } else if (daysRemaining <= 3) {
      return {
        text: t('fridge.item.expires_in_days', { days: daysRemaining, defaultValue: 'Expires in {{days}} days' }),
        color: '#FF9500',
        urgent: true
      };
    } else if (daysRemaining <= 7) {
      return {
        text: t('fridge.item.expires_in_days', { days: daysRemaining, defaultValue: 'Expires in {{days}} days' }),
        color: '#FF9500',
        urgent: false
      };
    } else {
      return {
        text: t('fridge.item.expires_in_days', { days: daysRemaining, defaultValue: 'Expires in {{days}} days' }),
        color: colors.textSecondary,
        urgent: false
      };
    }
  };

  // 获取分类图标信息 - 使用英文key映射（与移动端fridge-form.tsx一致）
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'food': <Utensils size={24} />,       // rice -> Utensils
      'beverages': <Coffee size={24} />,    // cup -> Coffee
      'fruits': <Apple size={24} />,        // fruit-watermelon -> Apple
      'vegetables': <Carrot size={24} />,   // carrot -> Carrot
      'meat': <Beef size={24} />,           // food-drumstick -> Beef
      'fast_food': <Sandwich size={24} />,  // hamburger -> Sandwich
      'snacks': <Candy size={24} />,        // candy -> Candy
      'other': <Grid3X3 size={24} />,       // grid -> Grid3X3
    };
    return iconMap[category] || <Grid3X3 size={24} />;
  };

  // 获取分类颜色 - 使用英文key映射（与移动端fridge-form.tsx完全一致）
  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'food': '#FF9500',        // 食物 - 橙色
      'beverages': '#007AFF',   // 饮品 - 蓝色
      'fruits': '#FF6B35',      // 水果 - 橙红色
      'vegetables': '#34C759',  // 蔬菜 - 绿色
      'meat': '#FF3B30',        // 肉类 - 红色
      'fast_food': '#AF52DE',   // 速食 - 紫色
      'snacks': '#FFCC00',      // 零食 - 黄色
      'other': '#8E8E93',       // 其他 - 灰色
    };
    return colorMap[category] || '#8E8E93';
  };

  const expiryInfo = getExpiryInfo();
  const categoryColor = getCategoryColor(item.category);

  const handleConsume = async () => {
    try {
      await consumeFridgeItem(item.id, 1);
      // 延迟调用onConsume，给optimistic update一些时间 - 按照移动端逻辑
      setTimeout(() => {
        onConsume();
      }, 100);
    } catch (error: any) {
      // 失败时立即更新界面以反映回滚 - 按照移动端逻辑
      onConsume();
      console.error('消耗物品失败:', error);
    }
  };

  return (
    <div
      onClick={onEdit}
      className="my-1.5 mx-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md overflow-hidden"
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.card.border,
        boxShadow: `0 2px 4px ${colors.text}10`
      }}
    >
      {/* 紧急状态指示条 - 完全按照移动端 */}
      {expiryInfo.urgent && (
        <div
          className="h-[3px] w-full"
          style={{ backgroundColor: expiryInfo.color }}
        />
      )}

      <div className="flex flex-row items-center p-4">
        {/* 左侧图标和信息 - 完全按照移动端布局 */}
        <div className="flex-1 flex flex-row items-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: categoryColor + '20' }}
          >
            <div style={{ color: categoryColor }}>
              {getCategoryIcon(item.category)}
            </div>
          </div>

          <div className="flex-1">
            <div
              className="text-base font-semibold mb-0.5"
              style={{ color: colors.text }}
            >
              {item.name}
            </div>
            <div
              className="text-sm mb-0.5"
              style={{ color: colors.textSecondary }}
            >
              {item.quantity} {t(`fridge.units.${item.unit}`) || item.unit}
            </div>
            <div
              className="text-xs font-medium"
              style={{ color: categoryColor }}
            >
              {t(`fridge.categories.${item.category}`) || item.category}
            </div>
          </div>
        </div>

        {/* 右侧信息和操作 - 完全按照移动端布局 */}
        <div className="flex flex-col items-end">
          <div className="mb-2">
            <div
              className="text-xs font-medium text-right"
              style={{ color: expiryInfo.color }}
            >
              {expiryInfo.text}
            </div>
          </div>

          <div className="flex flex-row justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleConsume();
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: colors.accent?.blue || '#007AFF',
                borderColor: 'transparent'
              }}
            >
              <Minus size={12} color="white" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FridgeItemCard;