'use client'

import React, { useState } from 'react';
import { useThemeColors } from '@/hooks/useThemeColor';
import { QUICK_EMOJIS, EMOJI_CATEGORIES } from '@/constants/emojiIcons';
import { X, Check } from 'lucide-react';

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  visible,
  onClose,
  onSelect,
  selectedEmoji,
}) => {
  const colors = useThemeColors();
  const [activeCategory, setActiveCategory] = useState<string>('快速选择');

  if (!visible) return null;

  const renderEmojiButton = (emoji: string, isSelected: boolean = false) => (
    <button
      key={emoji}
      onClick={() => {
        onSelect(emoji);
        onClose();
      }}
      className="relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 hover:scale-105"
      style={{
        backgroundColor: isSelected ? colors.tint + '20' : 'transparent',
        border: isSelected ? `2px solid ${colors.tint}` : '2px solid transparent',
      }}
    >
      <span className="text-2xl">{emoji}</span>
      {isSelected && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full"
          style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
        >
          <Check size={16} color={colors.tint} strokeWidth={3} />
        </div>
      )}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:items-center">
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-md md:max-h-[80vh] overflow-hidden animate-slide-up"
        style={{ backgroundColor: colors.background }}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.border }}>
          <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
            选择图标
          </h3>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 hover:bg-opacity-10 hover:bg-black"
            style={{ color: colors.textSecondary }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 分类标签 */}
        <div className="flex overflow-x-auto px-4 py-3 gap-2 scrollbar-hide border-b" style={{ borderColor: colors.border }}>
          <button
            onClick={() => setActiveCategory('快速选择')}
            className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
            style={{
              backgroundColor: activeCategory === '快速选择' ? colors.tint + '20' : 'transparent',
              color: activeCategory === '快速选择' ? colors.tint : colors.textSecondary,
            }}
          >
            快速选择
          </button>
          {EMOJI_CATEGORIES.map(category => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap"
              style={{
                backgroundColor: activeCategory === category.name ? colors.tint + '20' : 'transparent',
                color: activeCategory === category.name ? colors.tint : colors.textSecondary,
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Emoji 网格 */}
        <div className="p-4 max-h-80 overflow-y-auto">
          <div className="grid grid-cols-6 gap-2">
            {activeCategory === '快速选择'
              ? QUICK_EMOJIS.map(emoji =>
                  renderEmojiButton(emoji, emoji === selectedEmoji)
                )
              : EMOJI_CATEGORIES.find(c => c.name === activeCategory)?.emojis.map(emoji =>
                  renderEmojiButton(emoji, emoji === selectedEmoji)
                )}
          </div>
        </div>
      </div>
    </div>
  );
};