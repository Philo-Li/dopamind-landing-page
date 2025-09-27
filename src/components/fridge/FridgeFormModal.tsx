'use client'

import React, { useState, useCallback, useEffect } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { addFridgeItem, updateFridgeItem, FridgeItemInput, FridgeItem } from '@/services/fridgeService';
import { DateTimeSelector } from '@/components/ui/DateTimeSelector';
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
  Ham,
  Pizza,
  Candy,
  Grid3x3
} from 'lucide-react';

interface FridgeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editItem?: FridgeItem | null;
}

const CATEGORIES = [
  { key: 'food', icon: Utensils, color: '#FF9500' },
  { key: 'beverages', icon: Coffee, color: '#007AFF' },
  { key: 'fruits', icon: Apple, color: '#FF6B35' },
  { key: 'vegetables', icon: Carrot, color: '#34C759' },
  { key: 'meat', icon: Ham, color: '#FF3B30' },
  { key: 'fast_food', icon: Pizza, color: '#AF52DE' },
  { key: 'snacks', icon: Candy, color: '#FFCC00' },
  { key: 'other', icon: Grid3x3, color: '#8E8E93' },
];

const UNITS = [
  { key: 'item', value: 'item' },
  { key: 'piece', value: 'piece' },
  { key: 'box', value: 'box' },
  { key: 'bottle', value: 'bottle' },
  { key: 'bag', value: 'bag' },
  { key: 'jin', value: 'jin' },
  { key: 'kg', value: 'kg' },
  { key: 'gram', value: 'gram' },
  { key: 'liter', value: 'liter' },
  { key: 'ml', value: 'ml' },
  { key: 'pack', value: 'pack' },
  { key: 'can', value: 'can' }
];

const QUICK_QUANTITIES = [1, 2, 3, 5, 10, 20, 50, 100];

export default function FridgeFormModal({ isOpen, onClose, onSuccess, editItem }: FridgeFormModalProps) {
  const colors = useThemeColors();
  const { t } = useLocalization();

  const [formData, setFormData] = useState<FridgeItemInput>({
    name: '',
    category: 'other',
    quantity: 1,
    unit: 'item',
    expiryDate: undefined
  });

  // For DateTimeSelector component
  const [expiryTime, setExpiryTime] = useState('');

  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [loading, setSaving] = useState(false);
  const [nameLength, setNameLength] = useState(0);

  const isEditMode = Boolean(editItem);

  // Populate form when editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        category: editItem.category,
        quantity: editItem.quantity,
        unit: editItem.unit,
        expiryDate: editItem.expiryDate
      });
      setNameLength(editItem.name.length);
      setExpiryTime('');
    } else {
      setFormData({
        name: '',
        category: 'other',
        quantity: 1,
        unit: 'item',
        expiryDate: undefined
      });
      setNameLength(0);
      setExpiryTime('');
    }
  }, [editItem]);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      category: 'other',
      quantity: 1,
      unit: 'item',
      expiryDate: undefined
    });
    setNameLength(0);
    setExpiryTime('');
  }, []);

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

  const handleDateChange = useCallback((date: string) => {
    handleInputChange('expiryDate', date || undefined);
  }, [handleInputChange]);

  const handleTimeChange = useCallback((time: string) => {
    setExpiryTime(time);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) return;

    setSaving(true);
    try {
      const itemData = {
        ...formData,
        name: formData.name.trim()
      };

      if (isEditMode && editItem) {
        await updateFridgeItem(editItem.id, itemData);
      } else {
        await addFridgeItem(itemData);
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('保存失败:', error);
    } finally {
      setSaving(false);
    }
  }, [formData, resetForm, onSuccess, onClose, isEditMode, editItem]);

  const canSave = formData.name.trim().length > 0 && formData.quantity > 0;

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        {/* 模态框容器 */}
        <div
          className="w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: colors.background }}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-4">
              <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black"
                style={{ color: colors.text }}
              >
                <X size={20} />
              </button>
              <h1 className="text-lg font-semibold" style={{ color: colors.text }}>
                {isEditMode ? t('fridge.form.edit_title', 'Edit Item') : t('fridge.form.add_title', 'Add Item')}
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

          {/* 表单内容 - 可滚动 */}
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* 基本信息卡片 */}
            <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: colors.card.background, borderColor: 'rgba(0,0,0,0.05)', borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                {t('fridge.form.basic_info', 'Basic Information')}
              </h3>

              {/* 名称输入 */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                  {t('fridge.form.item_name_required', 'Item Name *')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('fridge.form.item_name_placeholder', 'Enter item name')}
                  maxLength={50}
                  className="w-full p-3 rounded-xl border transition-colors duration-200 focus:outline-none focus:border-opacity-80"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    borderColor: colors.card.border,
                    color: colors.text,
                    borderWidth: '1.5px'
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
            <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: colors.card.background, borderColor: 'rgba(0,0,0,0.05)', borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                {t('fridge.form.category', 'Category')}
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
                          : colors.card.background,
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
                        {t(`fridge.categories.${category.key}`, category.key)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 数量和单位卡片 */}
            <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: colors.card.background, borderColor: 'rgba(0,0,0,0.05)', borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                {t('fridge.form.quantity_and_unit', 'Quantity and Unit')}
              </h3>

              <div className="flex gap-3">
                {/* 数量 */}
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    {t('fridge.form.quantity_required', 'Quantity *')}
                  </label>
                  <button
                    onClick={() => setShowQuantityModal(true)}
                    className="w-full p-3 rounded-xl border flex items-center justify-between transition-colors duration-200"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderColor: colors.card.border,
                      color: colors.text,
                      borderWidth: '1.5px'
                    }}
                  >
                    <span>{formData.quantity}</span>
                    <ChevronDown size={16} />
                  </button>
                </div>

                {/* 单位 */}
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                    {t('fridge.form.unit', 'Unit')}
                  </label>
                  <button
                    onClick={() => setShowUnitModal(true)}
                    className="w-full p-3 rounded-xl border flex items-center justify-between transition-colors duration-200"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderColor: colors.card.border,
                      color: colors.text,
                      borderWidth: '1.5px'
                    }}
                  >
                    <span>{t(`fridge.units.${formData.unit}`, formData.unit)}</span>
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* 过期日期卡片 */}
            <div className="rounded-2xl p-4 shadow-sm" style={{ backgroundColor: colors.card.background, borderColor: 'rgba(0,0,0,0.05)', borderWidth: '1px' }}>
              <h3 className="text-base font-semibold mb-4" style={{ color: colors.text }}>
                {t('fridge.form.expiry_date', 'Expiry Date (Optional)')}
              </h3>

              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <DateTimeSelector
                    dueDate={formData.expiryDate || ''}
                    dueTime={expiryTime}
                    onDateChange={handleDateChange}
                    onTimeChange={handleTimeChange}
                    disabled={loading}
                    dateOnly={true}
                    showOptionalText={false}
                    dateLabel=""
                    minDate={new Date().toISOString().split('T')[0]}
                    maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    customStyles={{
                      backgroundColor: colors.input.background,
                      borderColor: colors.input.border,
                      textColor: colors.input.text
                    }}
                  />
                </div>
                {formData.expiryDate && (
                  <button
                    onClick={() => handleDateChange('')}
                    className="w-12 h-12 rounded-xl border flex items-center justify-center transition-colors duration-200 mt-6"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.02)',
                      borderColor: colors.card.border,
                      color: colors.textSecondary,
                      borderWidth: '1.5px'
                    }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 数量选择模态框 */}
      {showQuantityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="rounded-2xl p-6 w-full max-w-sm" style={{ backgroundColor: colors.background }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
              {t('fridge.form.select_quantity', 'Select Quantity')}
            </h3>

            <div className="grid grid-cols-4 gap-3 mb-4">
              {QUICK_QUANTITIES.map((qty) => (
                <button
                  key={qty}
                  onClick={() => handleQuantitySelect(qty)}
                  className="p-3 rounded-xl border transition-all duration-200 transform active:scale-95"
                  style={{
                    backgroundColor: formData.quantity === qty ? '#3B82F6' : 'rgba(0,0,0,0.02)',
                    borderColor: formData.quantity === qty ? '#3B82F6' : colors.card.border,
                    color: formData.quantity === qty ? 'white' : colors.text,
                    borderWidth: '1.5px'
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
                className="flex-1 p-3 rounded-xl border transition-colors duration-200"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderColor: colors.card.border,
                  color: colors.text,
                  borderWidth: '1.5px'
                }}
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={() => setShowQuantityModal(false)}
                className="flex-1 p-3 rounded-xl transition-colors duration-200"
                style={{
                  backgroundColor: '#3B82F6',
                  color: 'white'
                }}
              >
                {t('common.confirm', 'Confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 单位选择模态框 */}
      {showUnitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="rounded-2xl p-6 w-full max-w-sm" style={{ backgroundColor: colors.background }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
              {t('fridge.form.select_unit', 'Select Unit')}
            </h3>

            <div className="space-y-2 mb-4 max-h-60 overflow-auto">
              {UNITS.map((unit) => (
                <button
                  key={unit.value}
                  onClick={() => handleUnitSelect(unit.value)}
                  className="w-full p-3 rounded-xl text-left transition-all duration-200"
                  style={{
                    backgroundColor: formData.unit === unit.value ? '#3B82F6' : 'rgba(0,0,0,0.02)',
                    color: formData.unit === unit.value ? 'white' : colors.text
                  }}
                >
                  {t(`fridge.units.${unit.key}`, unit.value)}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowUnitModal(false)}
              className="w-full p-3 rounded-xl border transition-colors duration-200"
              style={{
                backgroundColor: 'rgba(0,0,0,0.02)',
                borderColor: colors.card.border,
                color: colors.text,
                borderWidth: '1.5px'
              }}
            >
              {t('common.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}