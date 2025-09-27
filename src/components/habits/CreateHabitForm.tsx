'use client'

import React, { useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { useLocalization } from '@/hooks/useLocalization';
import { CreateHabitRequest } from '@/types/habit';
import { createHabit } from '@/services/habitService';
import { getEmojiFromIcon, getIconFromEmoji } from '@/constants/emojiIcons';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { X, Check, Plus, Minus } from 'lucide-react';

const HABIT_ICONS = [
  'fitness', 'book', 'water', 'heart', 'leaf', 'flash', 'star', 'moon',
  'sun', 'fire', 'target', 'music', 'coffee', 'apple', 'run', 'sleep',
  'meditation', 'writing', 'guitar', 'code'
];

// 移动端的颜色配置
const HABIT_COLORS = [
  '#4A90E2', '#50E3C2', '#F5A623', '#F8E71C', '#BD10E0', '#9013FE',
  '#D0021B', '#417505', '#2c3e50', '#FF6F61', '#00B8D9', '#FFB300'
];

interface CreateHabitFormProps {
  onSubmit: (habit: CreateHabitRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function CreateHabitForm({ onSubmit, onCancel, loading = false }: CreateHabitFormProps) {
  const colors = useThemeColors();
  const { t } = useLocalization();

  const [formData, setFormData] = useState<CreateHabitRequest>({
    title: '',
    icon: '⭐',  // 直接使用emoji作为icon
    color: HABIT_COLORS[0],
    frequency: 'daily',
    targetDays: null,
    reminderTime: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [targetDays, setTargetDays] = useState<string>('1');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '请输入习惯名称';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const finalFormData = {
        ...formData,
        targetDays: formData.frequency === 'weekly' ? parseInt(targetDays) : null
      };
      await onSubmit(finalFormData);
    } catch (error) {
      console.error('创建习惯失败:', error);
    }
  };

  const handleIconSelect = (emoji: string) => {
    setFormData(prev => ({ ...prev, icon: emoji }));
  };

  const handleColorSelect = (color: string) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleFrequencyChange = (newFrequency: 'daily' | 'weekly') => {
    setFormData(prev => ({ ...prev, frequency: newFrequency }));
    if (newFrequency === 'weekly' && !targetDays) {
      setTargetDays('1');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center md:p-4">
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-md md:max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{ backgroundColor: colors.background }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.border }}>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black"
            style={{ color: colors.textSecondary }}
          >
            <X size={20} />
          </button>
          <h2 className="text-lg font-semibold" style={{ color: colors.text }}>
            创建新习惯
          </h2>
          <button
            onClick={handleSubmit}
            disabled={loading || !formData.title.trim()}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black disabled:opacity-50"
            style={{ color: loading || !formData.title.trim() ? colors.textSecondary : colors.tint }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Check size={20} />
            )}
          </button>
        </div>

        {/* 表单内容 */}
        <div className="p-6 space-y-6">
          {/* 习惯名称 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              习惯名称
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="请输入习惯名称"
              disabled={loading}
              className="w-full px-4 py-4 rounded-xl border transition-colors duration-200 focus:outline-none focus:ring-0 text-base"
              style={{
                backgroundColor: colors.input.background,
                borderColor: errors.title ? '#D0021B' : colors.input.border,
                color: colors.input.text,
                height: '50px',
                fontSize: '16px'
              }}
            />
            {errors.title && (
              <p className="mt-2 text-sm" style={{ color: '#D0021B' }}>
                {errors.title}
              </p>
            )}
          </div>

          {/* 图标选择 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              选择图标
            </label>
            <button
              onClick={() => setShowEmojiPicker(true)}
              disabled={loading}
              className="w-12 h-12 rounded-lg border transition-all duration-200 hover:shadow-md flex items-center justify-center"
              style={{
                backgroundColor: colors.input.background,
                borderColor: colors.input.border
              }}
            >
              <span className="text-2xl">{formData.icon}</span>
            </button>
          </div>

          {/* 颜色选择 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              选择颜色
            </label>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {HABIT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  disabled={loading}
                  className={`w-8 h-8 rounded-full transition-all duration-200 relative ${
                    formData.color === color
                      ? 'ring-2 ring-white shadow-lg scale-110'
                      : 'hover:scale-105 shadow-md'
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow: formData.color === color
                      ? `0 0 0 3px ${color}40, 0 4px 8px rgba(0,0,0,0.2)`
                      : '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {formData.color === color && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-15 rounded-full">
                      <Check size={16} color="white" strokeWidth={3} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 频率选择 */}
          <div>
            <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
              频率设置
            </label>
            <div className="flex rounded-xl border overflow-hidden" style={{
              backgroundColor: colors.input.background,
              borderColor: colors.input.border
            }}>
              <button
                onClick={() => handleFrequencyChange('daily')}
                disabled={loading}
                className={`flex-1 py-4 px-4 transition-all duration-200 font-semibold`}
                style={{
                  backgroundColor: formData.frequency === 'daily' ? colors.tint : 'transparent',
                  color: formData.frequency === 'daily' ? 'white' : colors.text
                }}
              >
                每日
              </button>
              <div className="w-px" style={{ backgroundColor: colors.input.border }}></div>
              <button
                onClick={() => handleFrequencyChange('weekly')}
                disabled={loading}
                className={`flex-1 py-4 px-4 transition-all duration-200 font-semibold`}
                style={{
                  backgroundColor: formData.frequency === 'weekly' ? colors.tint : 'transparent',
                  color: formData.frequency === 'weekly' ? 'white' : colors.text
                }}
              >
                每周
              </button>
            </div>

            {formData.frequency === 'weekly' && (
              <div className="mt-6">
                <label className="block text-base font-semibold mb-3" style={{ color: colors.text }}>
                  每周目标天数
                </label>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      const current = parseInt(targetDays) || 2;
                      if (current > 1) {
                        const newValue = String(current - 1);
                        setTargetDays(newValue);
                        setFormData(prev => ({ ...prev, targetDays: parseInt(newValue) }));
                      }
                    }}
                    disabled={loading || targetDays === '1'}
                    className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:shadow-md disabled:opacity-50"
                    style={{
                      backgroundColor: colors.input.background,
                      borderColor: colors.input.border,
                      color: colors.text
                    }}
                  >
                    <Minus size={20} strokeWidth={2} />
                  </button>
                  <div
                    className="px-6 py-3 rounded-full min-w-20 text-center"
                    style={{
                      backgroundColor: colors.input.background,
                      color: colors.text
                    }}
                  >
                    <span className="text-base font-semibold">{targetDays || '1'} 天</span>
                  </div>
                  <button
                    onClick={() => {
                      const current = parseInt(targetDays) || 0;
                      if (current < 7) {
                        const newValue = String(current + 1);
                        setTargetDays(newValue);
                        setFormData(prev => ({ ...prev, targetDays: parseInt(newValue) }));
                      }
                    }}
                    disabled={loading || targetDays === '7'}
                    className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:shadow-md disabled:opacity-50"
                    style={{
                      backgroundColor: colors.input.background,
                      borderColor: colors.input.border,
                      color: colors.text
                    }}
                  >
                    <Plus size={20} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 主要保存按钮 */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.title.trim()}
              className="w-full py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              style={{
                backgroundColor: colors.tint,
                color: 'white'
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check size={20} />
                  创建习惯
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Emoji 选择器 */}
      <EmojiPicker
        visible={showEmojiPicker}
        onClose={() => setShowEmojiPicker(false)}
        onSelect={handleIconSelect}
        selectedEmoji={formData.icon}
      />
    </div>
  );
}