'use client'

import React, { useRef, useEffect, useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';

// 定义布局的固定参数
const CELL_MARGIN = 1;
const NUMBER_OF_WEEKS = 53;

interface HabitHeatmapProps {
  data: Record<string, number>;
  color?: string;
  compact?: boolean;
  showCompletionCount?: boolean;
}

// 将一维的日期数组转换为二维的按周分组的数组
const groupDaysByWeek = (days: Date[]): Date[][] => {
  if (!days.length) return [];
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];

  days.forEach(day => {
    if (day.getDay() === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

// 生成从 start 到 end 的所有日期
const eachDayOfInterval = (start: Date, end: Date): Date[] => {
  const dates = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
};

// 获取周的开始日期（周日）
const startOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// 获取周的结束日期（周六）
const endOfWeek = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  return new Date(d.setDate(diff));
};

// 格式化日期为 YYYY-MM-DD
const format = (date: Date, formatStr: string): string => {
  if (formatStr === 'yyyy-MM-dd') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return date.toISOString().split('T')[0];
};

// 检查两个日期是否是同一天
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const HabitHeatmap: React.FC<HabitHeatmapProps> = ({
  data,
  color = '#FF9500',
  compact = false,
  showCompletionCount = false
}) => {
  const colors = useThemeColors();
  const { t } = useLocalization();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(300); // 设置一个合理的初始值

  // 监听容器大小变化
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width > 0) {
          setContainerWidth(width);
        }
      }
    };

    // 使用 setTimeout 确保在DOM渲染后获取宽度
    const timeoutId = setTimeout(updateWidth, 0);

    window.addEventListener('resize', updateWidth);

    // 使用 MutationObserver 来监听DOM变化
    const observer = new MutationObserver(updateWidth);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        attributes: true,
        childList: true,
        subtree: true
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateWidth);
      observer.disconnect();
    };
  }, []);

  // 计算完成天数
  const completedDays = Object.keys(data).filter(date => data[date] > 0).length;

  // 根据容器宽度和模式计算单元格大小
  const getCellSize = () => {
    if (compact) {
      // 紧凑模式：基于实际容器宽度计算
      let size = (containerWidth / NUMBER_OF_WEEKS) - (CELL_MARGIN * 2);
      // 确保最小尺寸，避免太小不可见
      size = Math.max(size, 2);
      return Math.floor(size);
    } else {
      // 非紧凑模式：使用稍大的尺寸
      let size = (containerWidth / NUMBER_OF_WEEKS) - (CELL_MARGIN * 2);
      size = Math.max(size, 4);
      return Math.floor(size);
    }
  };

  const cellSize = getCellSize();

  // 为浅色和深色模式定义不同的颜色梯度
  const getHeatmapColors = (baseColor: string) => ({
    light: [
      colors.border,  // 未打卡
      baseColor,      // 已打卡
    ],
    dark: [
      '#374151',     // 未打卡
      baseColor,     // 已打卡
    ],
  });

  const heatmapColors = getHeatmapColors(color);
  const isDark = colors.background === '#000000' || colors.background.includes('#1a') || colors.background.includes('#111');
  const currentColors = isDark ? heatmapColors.dark : heatmapColors.light;

  const getColor = (count: number) => {
    return count > 0 ? currentColors[1] : currentColors[0];
  };

  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  // 获取从一年前的周日开始，到今天的所有日期
  const days = eachDayOfInterval(
    startOfWeek(oneYearAgo),
    endOfWeek(today)
  );

  // 将日期按周分组
  const weeks = groupDaysByWeek(days);

  return (
    <div ref={containerRef} className="w-full relative">
      <div className="flex flex-row">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="flex flex-col" style={{ flex: '1 1 0' }}>
            {/* 为每周的第一天前面补上空白格，以对齐星期 */}
            {weekIndex === 0 && Array(week[0].getDay()).fill(null).map((_, i) => (
              <div
                key={`empty-${i}`}
                style={{
                  height: cellSize,
                  width: cellSize,
                  borderRadius: '2px',
                  margin: CELL_MARGIN,
                  backgroundColor: 'transparent'
                }}
              />
            ))}

            {week.map((day) => {
              const dateString = format(day, 'yyyy-MM-dd');
              const count = data[dateString] || 0;
              const isToday = isSameDay(day, today);

              return (
                <div
                  key={dateString}
                  style={{
                    height: cellSize,
                    width: cellSize,
                    borderRadius: '2px',
                    margin: CELL_MARGIN,
                    backgroundColor: getColor(count),
                    borderColor: isToday ? color : 'transparent',
                    borderWidth: isToday ? '1px' : '0',
                    borderStyle: 'solid'
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* 完成天数标签 - 仅在紧凑模式且启用时显示 */}
      {compact && showCompletionCount && (
        <div className="flex flex-row items-center justify-end mt-1 gap-1">
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {t('habits.detail.checkin_count', { count: completedDays })}
          </span>
        </div>
      )}

      {/* 在紧凑模式下隐藏图例 */}
      {!compact && (
        <div className="flex flex-row items-center justify-end mt-2 gap-1">
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {t('habits.detail.legend.not_checked')}
          </span>
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: currentColors[0] }}
          />
          <div
            className="w-2.5 h-2.5 rounded-sm"
            style={{ backgroundColor: currentColors[1] }}
          />
          <span className="text-xs" style={{ color: colors.textSecondary }}>
            {t('habits.detail.legend.checked')}
          </span>
        </div>
      )}
    </div>
  );
};