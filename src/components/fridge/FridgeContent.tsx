'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { useRouter } from 'next/navigation';
import { FridgeItem, FridgeStatsData, getFridgeItems, getFridgeStats } from '@/services/fridgeService';
import FridgeItemCard from './FridgeItemCard';
import FridgeStats from './FridgeStats';
import FridgeFormModal from './FridgeFormModal';
import { Plus, RefreshCw, Package, BarChart3 } from 'lucide-react';

type ViewMode = 'inventory' | 'stats';

export default function FridgeContent() {
  const colors = useThemeColors();
  const { t } = useLocalization();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('inventory');
  const [fridgeItems, setFridgeItems] = useState<FridgeItem[]>([]);
  const [fridgeStats, setFridgeStats] = useState<FridgeStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<FridgeItem | null>(null);
  const hasLoadedInitially = useRef(false);

  // 加载冰箱数据
  const loadFridgeData = useCallback(async () => {
    try {
      setError(null);
      if (viewMode === 'inventory') {
        const items = await getFridgeItems();
        setFridgeItems(items);
      } else {
        const stats = await getFridgeStats();
        setFridgeStats(stats);
      }
    } catch (error) {
      console.error('加载冰箱数据失败:', error);
      setError(error instanceof Error ? error.message : '加载冰箱数据失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [viewMode]);

  // 初始加载
  useEffect(() => {
    if (!hasLoadedInitially.current) {
      loadFridgeData();
      hasLoadedInitially.current = true;
    }
  }, [loadFridgeData]);

  // 视图模式切换时重新加载
  useEffect(() => {
    if (hasLoadedInitially.current) {
      setLoading(true);
      loadFridgeData();
    }
  }, [viewMode, loadFridgeData]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadFridgeData();
  }, [loadFridgeData]);

  // 处理物品消耗
  const handleItemConsume = useCallback(() => {
    // 重新加载数据以反映更改
    loadFridgeData();
  }, [loadFridgeData]);

  const handleItemEdit = useCallback((itemId: number) => {
    const item = fridgeItems.find(item => item.id === itemId);
    if (item) {
      setEditingItem(item);
      setShowFormModal(true);
    }
  }, [fridgeItems]);

  const handleAddItem = useCallback(() => {
    setEditingItem(null);
    setShowFormModal(true);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setEditingItem(null);
    loadFridgeData();
  }, [loadFridgeData]);

  const handleFormClose = useCallback(() => {
    setEditingItem(null);
    setShowFormModal(false);
  }, []);

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
          {t('fridge.title', 'Smart Fridge')}
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
            onClick={handleAddItem}
            className="w-11 h-11 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black"
            style={{ color: colors.tint }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* 分段控制器 */}
      <div className="px-6 py-4 border-b" style={{ borderColor: colors.border }}>
        <div className="flex rounded-lg p-1" style={{ backgroundColor: colors.card.background }}>
          <button
            onClick={() => setViewMode('inventory')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${
              viewMode === 'inventory' ? 'font-medium' : ''
            }`}
            style={{
              backgroundColor: viewMode === 'inventory' ? colors.tint : 'transparent',
              color: viewMode === 'inventory' ? 'white' : colors.textSecondary
            }}
          >
            <Package size={16} />
            {t('fridge.current_inventory', 'Current Inventory')}
          </button>

          <button
            onClick={() => setViewMode('stats')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all duration-200 ${
              viewMode === 'stats' ? 'font-medium' : ''
            }`}
            style={{
              backgroundColor: viewMode === 'stats' ? colors.tint : 'transparent',
              color: viewMode === 'stats' ? 'white' : colors.textSecondary
            }}
          >
            <BarChart3 size={16} />
            {t('fridge.consumption_stats', 'Consumption Stats')}
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
          {viewMode === 'inventory' ? (
            fridgeItems.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                <span className="text-6xl mb-4 opacity-50">❄️</span>
                <h3 className="text-lg font-medium mb-2" style={{ color: colors.textSecondary }}>
                  {t('fridge.empty_fridge_title', 'Your fridge is empty')}
                </h3>
                <p className="text-sm text-center opacity-50" style={{ color: colors.textSecondary }}>
                  {t('fridge.empty_fridge_subtitle', 'Start tracking your food items')}
                </p>
              </div>
            ) : (
              <div className="py-3">
                <div className="px-6 pb-3">
                  <p className="text-sm" style={{ color: colors.textSecondary }}>
                    {t('fridge.total_items', { count: fridgeItems.length, defaultValue: '{{count}} items total' })}
                  </p>
                </div>
                {fridgeItems.map((item) => (
                  <FridgeItemCard
                    key={item.id}
                    item={item}
                    onConsume={handleItemConsume}
                    onEdit={() => handleItemEdit(item.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="py-3">
              {fridgeStats ? (
                <FridgeStats data={fridgeStats} />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-8">
                  <span className="text-6xl mb-4 opacity-50">📊</span>
                  <h3 className="text-lg font-medium mb-2" style={{ color: colors.textSecondary }}>
                    {t('fridge.empty_stats_title', 'No stats available')}
                  </h3>
                  <p className="text-sm text-center opacity-50" style={{ color: colors.textSecondary }}>
                    {t('fridge.empty_stats_subtitle', 'Start consuming items to see statistics')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 下拉刷新指示器 */}
      {refreshing && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-10">
          <RefreshCw className="animate-spin" size={20} color={colors.tint} />
        </div>
      )}

      {/* 添加物品模态框 */}
      <FridgeFormModal
        isOpen={showFormModal}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editItem={editingItem}
      />
    </div>
  );
}