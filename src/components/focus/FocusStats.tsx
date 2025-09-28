'use client'

import React from 'react'
import { Clock, CheckCircle, Flame } from 'lucide-react'
import { useLocalization } from '@/hooks/useLocalization'
import { useThemeColors } from '@/hooks/useThemeColor'
import { TodayFocusStats } from '@/types/focus'

interface FocusStatsProps {
  focusData: TodayFocusStats
}

export const FocusStats: React.FC<FocusStatsProps> = ({ focusData }) => {
  const { t } = useLocalization()
  const colors = useThemeColors()
  return (
    <div
      className="rounded-2xl p-6 shadow-sm m-4 border transition-colors"
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.card.border
      }}
    >
      <div className="flex items-center mb-4">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
          style={{ backgroundColor: `${colors.accent.blue}1f` }}
        >
          <Clock className="w-4 h-4" style={{ color: colors.accent.blue }} />
        </div>
        <h3 className="text-xl font-semibold ml-2" style={{ color: colors.text }}>
          {t('focus.stats.today_focus')}
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ backgroundColor: `${colors.accent.blue}1f` }}
          >
            <Clock className="w-3.5 h-3.5" style={{ color: colors.accent.blue }} />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
            {Math.floor(focusData.todayFocusTime / 60)}
          </div>
          <div className="text-xs font-medium" style={{ color: colors.textSecondary }}>
            {t('focus.stats.minutes')}
          </div>
        </div>
        <div className="text-center">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ backgroundColor: `${colors.status.success}1f` }}
          >
            <CheckCircle className="w-3.5 h-3.5" style={{ color: colors.status.success }} />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
            {focusData.todayCompletedSessions}
          </div>
          <div className="text-xs font-medium" style={{ color: colors.textSecondary }}>
            {t('focus.stats.sessions')}
          </div>
        </div>
        <div className="text-center">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ backgroundColor: '#a78bfa1f' }}
          >
            <Flame className="w-3.5 h-3.5" style={{ color: '#A78BFA' }} />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
            {Math.round(focusData.todayGoalProgress)}%
          </div>
          <div className="text-xs font-medium" style={{ color: colors.textSecondary }}>
            {t('focus.stats.goal')}
          </div>
        </div>
      </div>
    </div>
  )
}
