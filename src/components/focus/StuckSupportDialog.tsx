'use client'

import React from 'react'
import { X, MessageCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

interface StuckSupportDialogProps {
  visible: boolean
  taskTitle: string
  supportText: string
  isLoading?: boolean
  onClose: () => void
  onChatAboutStuck: () => void
}

export const StuckSupportDialog: React.FC<StuckSupportDialogProps> = ({
  visible,
  taskTitle,
  supportText,
  isLoading = false,
  onClose,
  onChatAboutStuck,
}) => {
  const colors = useThemeColors()
  const { t } = useLocalization()

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold" style={{ color: colors.text }}>
            {t('focus.dialogs.stuck_support.title')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
          </button>
        </div>

        {/* Task Section */}
        <div className="mb-6">
          <div className="text-sm font-medium mb-2" style={{ color: colors.textSecondary }}>
            {t('focus.current_task')}
          </div>
          <div className="text-base font-semibold line-clamp-2" style={{ color: colors.text }}>
            {taskTitle}
          </div>
        </div>

        {/* AI Chat Bubble */}
        <div className="flex items-start gap-3 mb-6">
          {/* AI Avatar - 使用与聊天页面相同的头像 */}
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
            <div className="w-full h-full bg-white flex items-center justify-center p-0.5">
              <Image
                src="/dopamind-logo-bw.jpg"
                alt="Dopamind AI"
                width={31}
                height={31}
                className="rounded-full object-cover"
              />
            </div>
          </div>

          {/* Chat Bubble */}
          <div
            className="flex-1 rounded-2xl rounded-bl-md p-4"
            style={{ backgroundColor: colors.card.background }}
          >
            <div className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
              {t('focus.dialogs.stuck_support.ai_coach')}
            </div>
            {isLoading ? (
              <div className="flex items-center py-2">
                <Loader2 className="w-4 h-4 animate-spin mr-2" style={{ color: colors.tint }} />
                <div className="text-sm italic" style={{ color: colors.textSecondary }}>
                  {t('focus.dialogs.stuck_support.loading')}
                </div>
              </div>
            ) : (
              <div className="text-sm leading-relaxed font-medium" style={{ color: colors.text }}>
                {supportText}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md'
            }`}
            style={{
              backgroundColor: colors.button.secondary,
              color: colors.text,
            }}
          >
            {t('focus.dialogs.stuck_support.close_button')}
          </button>

          <button
            onClick={onChatAboutStuck}
            disabled={isLoading}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
              isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
            }`}
            style={{
              backgroundColor: isLoading ? colors.button.disabled : colors.button.primary,
              color: colors.button.text,
            }}
          >
            <MessageCircle className="w-4 h-4" />
            {t('focus.dialogs.stuck_support.chat_button')}
          </button>
        </div>
      </div>
    </div>
  )
}