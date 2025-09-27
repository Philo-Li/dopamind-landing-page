'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, Target, X } from 'lucide-react'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

interface FocusCompletionDialogProps {
  visible: boolean
  onClose: () => void
  onSubmit: (summary: string) => void
  taskTitle: string
  isLoading?: boolean
  duration: number // 专注时长（秒）
}

export const FocusCompletionDialog: React.FC<FocusCompletionDialogProps> = ({
  visible,
  onClose,
  onSubmit,
  taskTitle,
  isLoading = false,
  duration
}) => {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const [summary, setSummary] = useState('')

  // 清空输入框当弹窗显示时
  useEffect(() => {
    if (visible) {
      setSummary('')
    }
  }, [visible])

  const handleSubmit = () => {
    if (summary.trim()) {
      onSubmit(summary.trim())
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return t('common.minutes_format', { minutes })
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300"
        style={{
          backgroundColor: colors.card.background,
          borderColor: colors.border,
          border: `1px solid ${colors.border}`
        }}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          style={{
            color: colors.textSecondary
          }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 庆祝图标 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
            {t('focus.completion.title')}
          </h3>
          <p className="text-gray-500">
            {t('focus.completion.congratulations', { duration: formatDuration(duration) })}
          </p>
        </div>

        {/* 任务信息 */}
        <div
          className="flex items-center p-3 rounded-lg mb-6"
          style={{
            backgroundColor: 'rgba(255, 107, 107, 0.1)',
            borderColor: 'rgba(255, 107, 107, 0.2)',
            border: `1px solid rgba(255, 107, 107, 0.2)`
          }}
        >
          <Target className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
          <span className="font-semibold text-gray-900 line-clamp-2">
            {taskTitle}
          </span>
        </div>

        {/* 输入框 */}
        <div className="mb-6">
          <label className="block text-base font-semibold mb-2" style={{ color: colors.text }}>
            {t('focus.completion.share_label')}
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={t('focus.completion.summary_placeholder')}
            className="w-full p-3 border rounded-lg resize-none"
            style={{
              backgroundColor: colors.input.background,
              borderColor: colors.input.border,
              color: colors.input.text,
              minHeight: '80px'
            }}
            rows={3}
            autoFocus
          />
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 border rounded-lg font-semibold transition-colors"
            style={{
              borderColor: colors.border,
              color: colors.textSecondary,
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.border}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {t('focus.completion.skip')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!summary.trim() || isLoading}
            className="flex-2 py-3 px-6 rounded-lg font-semibold transition-all"
            style={{
              backgroundColor: summary.trim() ? '#FF6B6B' : colors.button.disabled,
              color: summary.trim() ? '#ffffff' : colors.textSecondary,
              minWidth: '120px'
            }}
          >
            {isLoading ? t('focus.completion.submitting') : t('focus.completion.share_button')}
          </button>
        </div>
      </div>
    </div>
  )
}