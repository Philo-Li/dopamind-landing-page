'use client'

import React, { useState, useCallback } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { useRouter } from 'next/navigation';
import { addFridgeItem, FridgeItemInput } from '@/services/fridgeService';
import AppLayout from '@/components/AppLayout';
import {
  Plus,
  X,
  ChevronDown,
  Calendar,
  Package2,
  Utensils,
  Coffee,
  Apple,
  Carrot,
  Beef,
  Sandwich,
  Candy,
  Grid3X3
} from 'lucide-react';

interface FridgeFormProps {
  initialSidebarCollapsed: boolean;
}

const CATEGORIES = [
  { key: 'food', icon: Utensils, color: '#FF9500', label: '食物' },
  { key: 'beverages', icon: Coffee, color: '#007AFF', label: '饮品' },
  { key: 'fruits', icon: Apple, color: '#FF6B35', label: '水果' },
  { key: 'vegetables', icon: Carrot, color: '#34C759', label: '蔬菜' },
  { key: 'meat', icon: Beef, color: '#FF3B30', label: '肉类' },
  { key: 'fast_food', icon: Sandwich, color: '#AF52DE', label: '速食' },
  { key: 'snacks', icon: Candy, color: '#FFCC00', label: '零食' },
  { key: 'other', icon: Grid3X3, color: '#8E8E93', label: '其他' },
];

const UNITS = ['个', '斤', 'kg', 'g', 'L', 'ml', '包', '盒', '瓶'];

const QUICK_QUANTITIES = [1, 2, 3, 5, 10, 20, 50, 100];

export default function FridgeForm({ initialSidebarCollapsed }: FridgeFormProps) {
  const colors = useThemeColors();
  const { t } = useLocalization();
  const router = useRouter();

  const [formData, setFormData] = useState<FridgeItemInput>({
    name: '',
    category: 'other',
    quantity: 1,
    unit: '个',
    expiryDate: undefined
  });

  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [loading, setSaving] = useState(false);
  const [nameLength, setNameLength] = useState(0);

  const handleInputChange = useCallback((field: keyof FridgeItemInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'name') {
      setNameLength(value.length);
    }
  }, []);

  const handleCategorySelect = useCallback((category: string) => {
    handleInputChange('category', category);
  }, [handleInputChange]);

  const handleQuantitySelect = useCallback((quantity: number) => {
    handleInputChange('quantity', quantity);
    setShowQuantityModal(false);
  }, [handleInputChange]);

  const handleUnitSelect = useCallback((unit: string) => {
    handleInputChange('unit', unit);
    setShowUnitModal(false);
  }, [handleInputChange]);

  const handleDateChange = useCallback((date: string | undefined) => {
    handleInputChange('expiryDate', date);
  }, [handleInputChange]);

  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      await addFridgeItem({
        ...formData,
        name: formData.name.trim()
      });
      router.push('/fridge');
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  }, [formData, router]);

  const canSave = formData.name.trim().length > 0 && formData.quantity > 0;

  return (
    <AppLayout initialSidebarCollapsed={initialSidebarCollapsed}>
      <div className="flex flex-col h-full" style={{ backgroundColor: colors.background }}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 border-b h-[64px]" style={{ borderColor: colors.border }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black"
              style={{ color: colors.text }}
            >
              <X size={20} />
            </button>
            <h1 className="text-lg font-semibold" style={{ color: colors.text }}>
              {t('fridge.add_item', 'Add Item')}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={!canSave || loading}
            className="px-4 py-2 rounded-full font-medium transition-all duration-200 min-w-[70px] disabled:opacity-50"
            style={{
              backgroundColor: canSave ? '#3B82F6' : colors.card.border,
              color: canSave ? 'white' : colors.textSecondary
            }}
          >
            {loading ? '...' : t('common.save', 'Save')}
          </button>
        </div>

        {/* 表单内容 */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-6 space-y-6">

            {/* 基本信息卡片 */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                基本信息
              </h3>

              {/* 名称输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  物品名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入物品名称"
                  maxLength={50}
                  className="w-full p-3 rounded-xl border-2 transition-colors duration-200 focus:outline-none focus:border-opacity-80"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.card.border,
                    color: colors.text
                  }}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    {nameLength}/50
                  </span>
                </div>
              </div>
            </div>

            {/* 分类选择卡片 */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                分类
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  const isSelected = formData.category === category.key;
                  return (
                    <button
                      key={category.key}
                      onClick={() => handleCategorySelect(category.key)}
                      className="flex flex-col items-center p-3 rounded-xl transition-all duration-200 transform active:scale-95"
                      style={{
                        backgroundColor: isSelected
                          ? `${category.color}20`
                          : colors.background,
                        borderWidth: '2px',
                        borderColor: isSelected ? category.color : colors.card.border
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center mb-2"
                        style={{ backgroundColor: category.color }}
                      >
                        <Icon size={22} color="white" />
                      </div>
                      <span className="text-xs font-medium" style={{ color: colors.text }}>
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 数量和单位卡片 */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                数量和单位
              </h3>

              <div className="flex gap-3">
                {/* 数量 */}
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    数量
                  </label>
                  <button
                    onClick={() => setShowQuantityModal(true)}
                    className="w-full p-3 rounded-xl border-2 flex items-center justify-between transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.card.border,
                      color: colors.text
                    }}
                  >
                    <span>{formData.quantity}</span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* 单位 */}
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    单位
                  </label>
                  <button
                    onClick={() => setShowUnitModal(true)}
                    className="w-full p-3 rounded-xl border-2 flex items-center justify-between transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.card.border,
                      color: colors.text
                    }}
                  >
                    <span>{formData.unit}</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* 过期日期卡片 */}
            <div className="rounded-2xl p-4" style={{ backgroundColor: colors.card.background, borderColor: colors.card.border, borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                过期日期（可选）
              </h3>

              <div className="flex gap-3">
                <input
                  type="date"
                  value={formData.expiryDate || ''}
                  onChange={(e) => handleDateChange(e.target.value || undefined)}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  className="flex-1 p-3 rounded-xl border-2 transition-colors duration-200 focus:outline-none focus:border-opacity-80"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.card.border,
                    color: colors.text
                  }}
                />
                {formData.expiryDate && (
                  <button
                    onClick={() => handleDateChange(undefined)}
                    className="w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors duration-200"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.card.border,
                      color: colors.textSecondary
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 数量选择模态框 */}
        {showQuantityModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl p-6 w-full max-w-sm" style={{ backgroundColor: colors.card.background }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                选择数量
              </h3>

              <div className="grid grid-cols-4 gap-3 mb-4">
                {QUICK_QUANTITIES.map((qty) => (
                  <button
                    key={qty}
                    onClick={() => handleQuantitySelect(qty)}
                    className="p-3 rounded-xl border-2 transition-all duration-200 transform active:scale-95"
                    style={{
                      backgroundColor: formData.quantity === qty ? '#3B82F6' : colors.background,
                      borderColor: formData.quantity === qty ? '#3B82F6' : colors.card.border,
                      color: formData.quantity === qty ? 'white' : colors.text
                    }}
                  >
                    {qty}
                  </button>
                ))}
              </div>

              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                min={1}
                className="w-full p-3 rounded-xl border-2 mb-4 transition-colors duration-200 focus:outline-none focus:border-opacity-80"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.card.border,
                  color: colors.text
                }}
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowQuantityModal(false)}
                  className="flex-1 p-3 rounded-xl border-2 transition-colors duration-200"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.card.border,
                    color: colors.text
                  }}
                >
                  取消
                </button>
                <button
                  onClick={() => setShowQuantityModal(false)}
                  className="flex-1 p-3 rounded-xl transition-colors duration-200"
                  style={{
                    backgroundColor: '#3B82F6',
                    color: 'white'
                  }}
                >
                  确认
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 单位选择模态框 */}
        {showUnitModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl p-6 w-full max-w-sm" style={{ backgroundColor: colors.card.background }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
                选择单位
              </h3>

              <div className="space-y-2 mb-4 max-h-60 overflow-auto">
                {UNITS.map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleUnitSelect(unit)}
                    className="w-full p-3 rounded-xl text-left transition-all duration-200"
                    style={{
                      backgroundColor: formData.unit === unit ? '#3B82F6' : colors.background,
                      color: formData.unit === unit ? 'white' : colors.text
                    }}
                  >
                    {unit}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowUnitModal(false)}
                className="w-full p-3 rounded-xl border-2 transition-colors duration-200"
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.card.border,
                  color: colors.text
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}