'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useThemeColors } from '@/hooks/useThemeColor'
import { User, Settings, Bell, Info, FileText, LogOut, CreditCard, Snowflake, Target, Star, Flame, Clock, Trophy, CheckCircle, Gift, Globe } from 'lucide-react'
import { ProfileHeatmap } from './ProfileHeatmap'
import { TimezoneSettings } from './TimezoneSettings'
import { useHeatmapData } from '@/hooks/useHeatmapData'
import { useFocusData } from '@/hooks/useFocusData'
import { useTasks } from '@/hooks/useTasks'
import { useLocalization } from '@/hooks/useLocalization'
import { storage } from '@/lib/utils'
import { settingsApi, authApi } from '@/lib/api'

export default function ProfileContent() {
  const colors = useThemeColors()
  const router = useRouter()
  const { t, language, supportedLanguages, changeLanguage } = useLocalization()
  const [joinDays, setJoinDays] = useState(0)

  // 使用真实数据的 hooks
  const { focusData, loading: focusLoading, error: focusError, forceRefresh: refreshFocusData } = useFocusData()
  const { taskStats, loading: tasksLoading, loadTaskStats, refreshTasksWithStats } = useTasks()
  const {
    heatmapData,
    loading: isLoadingHeatmap,
    refreshHeatmapData,
  } = useHeatmapData()

  // 当语言发生变化时，更新选中的语言
  useEffect(() => {
    const user = storage.getUser()
    const currentLang = user?.preferredLanguage || language
    setSelectedLanguage(currentLang)
  }, [language])

  // 初始化时区设置
  useEffect(() => {
    console.log('Initializing timezone settings...')

    const initializeTimezone = async () => {
      try {
        // 首先尝试从服务器获取用户设置
        console.log('Fetching timezone from server...')
        const response = await settingsApi.getSettings()

        if (response.success && (response.data as any)?.preferences?.timezone) {
          const serverTimezone = (response.data as any).preferences.timezone
          console.log('Server timezone:', serverTimezone)
          setCurrentTimezone(serverTimezone)

          // 同步到本地用户存储
          const user = storage.getUser()
          if (user && user.timezone !== serverTimezone) {
            const updatedUser = { ...user, timezone: serverTimezone }
            storage.saveUser(updatedUser)
          }

          console.log(`Loaded timezone from server: ${serverTimezone}`)
          return
        } else {
          console.log('No timezone in server response, using local fallback')
        }
      } catch (error) {
        console.error('Failed to load timezone from server:', error)
      }

      // 如果服务器获取失败，使用本地存储的时区
      const user = storage.getUser()
      const userTimezone = user?.timezone || 'Asia/Shanghai'
      setCurrentTimezone(userTimezone)
      console.log(`Using local timezone: ${userTimezone}`)
    }

    initializeTimezone()
  }, []) // 确保只在组件初始化时运行

  // 加载任务统计数据
  useEffect(() => {
    loadTaskStats()
  }, [loadTaskStats])

  // 获取用户信息
  const user = storage.getUser()

  // 计算加入天数
  useEffect(() => {
    if (user?.createdAt) {
      const joinDate = new Date(user.createdAt)
      const today = new Date()
      const daysDiff = Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24))
      setJoinDays(daysDiff)
    } else {
      setJoinDays(7) // Default
    }
  }, [user?.createdAt])

  const getUserDisplayName = () => {
    if (!user) return '新用户'

    const { nickname, email, phoneNumber } = user

    if (nickname?.trim()) {
      return nickname.trim()
    }

    if (email) {
      return email.split('@')[0]
    }

    if (phoneNumber) {
      return phoneNumber
    }

    return '新用户'
  }

  const formatFocusTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    return `${hours}h`
  }

  // 获取当前语言的显示名称
  const getCurrentLanguageDisplay = () => {
    // 首先检查用户缓存中的preferredLanguage
    const user = storage.getUser()
    const userLang = user?.preferredLanguage || language

    const langInfo = supportedLanguages.find(lang => lang.code === userLang)
    return langInfo?.nativeName || '简体中文'
  }

  // Handle language selection (只是暂存，不立即应用)
  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    const user = storage.getUser()
    const currentLang = user?.preferredLanguage || language
    setHasLanguageChanges(currentLang !== languageCode)
  }

  // Handle language save (保存到本地和后端)
  const handleLanguageSave = async () => {
    if (!hasLanguageChanges) {
      setShowLanguageModal(false)
      return
    }

    setIsSaving(true)
    try {
      // 1. 应用语言设置到本地 - 这会触发i18n的全局更新
      await changeLanguage(selectedLanguage)

      // 2. changeLanguage已经处理了localStorage保存，但我们确保用户设置也被更新
      storage.updateUserLanguage(selectedLanguage)

      // 3. 同步偏好语言到后端，确保跨端保持一致
      try {
        const response = await authApi.updateProfile({ preferredLanguage: selectedLanguage })

        if (response.success && response.data) {
          storage.saveUser(response.data)
        }
      } catch (apiError) {
        console.error('Failed to persist language preference to server:', apiError)
      }

      console.log(`Language saved: ${selectedLanguage}`)
      setHasLanguageChanges(false)
      setShowLanguageModal(false)
    } catch (error) {
      console.error('Failed to save language:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle modal close
  const handleModalClose = () => {
    setShowLanguageModal(false)
    setHasLanguageChanges(false)
    // 重置到当前语言
    const user = storage.getUser()
    const currentLang = user?.preferredLanguage || language
    setSelectedLanguage(currentLang)
  }

  // 获取时区显示名称 - 与移动端保持一致
  const getTimezoneDisplayName = (timezone: string) => {
    try {
      // 使用descriptions字段，显示如"GMT+8 北京, 上海"的格式
      return t(`timezone.descriptions.${timezone}`) || timezone
    } catch (error) {
      return timezone
    }
  }

  // Handle timezone save
  const handleTimezoneSave = async (timezone: string) => {
    console.log('handleTimezoneSave called with:', timezone)

    try {
      // 先更新本地状态，提供更好的用户体验
      setCurrentTimezone(timezone)
      console.log('Updated local state immediately')

      // 更新本地用户设置
      const user = storage.getUser()
      if (user) {
        const updatedUser = { ...user, timezone }
        storage.saveUser(updatedUser)
        console.log('Updated local user storage with timezone:', timezone)
      }

      // 尝试调用API更新服务器设置
      console.log('Calling API to update timezone...')
      const response = await settingsApi.updateSettings({
        preferences: {
          timezone
        }
      })

      console.log('API response:', response)

      if (response.success) {
        console.log(`Timezone saved to server successfully: ${timezone}`)
      } else {
        console.warn('API returned success=false, but local state is already updated')
        // 不抛出错误，因为本地状态已更新
      }

    } catch (error) {
      console.error('API调用失败，但本地状态已更新:', error)

      // 即使API失败，也不抛出错误，因为本地状态已经更新
      // 这样用户界面能正常工作，时区设置会在本地生效
      console.log('Continuing with local-only timezone change')
    }
  }

  // Handle logout
  const handleLogout = () => {
    console.log('Logout clicked')
    // TODO: 实现退出登录功能
    // 清除token，跳转到登录页
  }

  // Handle quick action clicks - simplified since menu moved to sidebar
  const handleQuickAction = (action: string) => {
    console.log(`Quick action clicked: ${action}`)
    if (action === 'subscriptions') {
      // 导航到订阅追踪页面
      router.push('/subscription-tracker')
    } else if (action === 'referral') {
      // 导航到推荐页面
      router.push('/referral')
    }
    // TODO: 实现其他快捷功能导航
  }

  // 下拉刷新处理函数
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // 并行刷新所有数据
      await Promise.all([
        refreshFocusData(),
        refreshHeatmapData(),
        refreshTasksWithStats(),
      ])
    } catch (error) {
      console.error('刷新 profile 数据失败:', error)
      // TODO: 显示错误提示
    } finally {
      setIsRefreshing(false)
    }
  }

  // 添加加载和刷新状态
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isLoading = focusLoading || tasksLoading

  // Language selection modal state
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [hasLanguageChanges, setHasLanguageChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Timezone settings state
  const [showTimezoneModal, setShowTimezoneModal] = useState(false)
  const [currentTimezone, setCurrentTimezone] = useState('Asia/Shanghai')

  // Handle settings clicks - simplified since menu moved to sidebar
  const handleSettingsClick = (setting: string) => {
    console.log(`Settings clicked: ${setting}`)
    if (setting === 'language') {
      // 获取当前实际使用的语言，优先从用户设置中读取
      const user = storage.getUser()
      const currentLang = user?.preferredLanguage || language
      setSelectedLanguage(currentLang)
      setHasLanguageChanges(false)
      setShowLanguageModal(true)
    } else if (setting === 'timezone') {
      // 使用组件状态中的当前时区，而不是每次从存储读取
      setShowTimezoneModal(true)
    } else if (setting === 'about') {
      // 导航到 about 页面
      router.push('/about')
    } else if (setting === 'changelog') {
      // 导航到 changelog 页面
      router.push('/changelog')
    }
    // TODO: 实现其他设置页面导航
  }

  if (isLoading && !focusData && !taskStats) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse text-lg" style={{ color: colors.textSecondary }}>
          加载中...
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* Header with title */}
      <div
        className="flex items-center justify-between px-6 border-b h-[64px]"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border
        }}
      >
        <h1 className="text-xl font-semibold" style={{ color: colors.text }}>
          {t('profile.title')}
        </h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
        {/* 用户头部信息 */}
        <div className="p-6 text-center" style={{ borderColor: colors.card.border }}>
          <div className="mb-4">
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt="头像"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full mx-auto object-cover"
                unoptimized
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                style={{ backgroundColor: colors.card.background }}
              >
                <User size={40} style={{ color: colors.tint }} />
              </div>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
            {getUserDisplayName()}
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            {t('profile.join_days', { days: joinDays })}
          </p>
        </div>

        {/* 热力图 */}
        {isLoadingHeatmap ? (
          <div className="px-6 pb-6">
            <div
              className="h-32 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: colors.card.background }}
            >
              <div className="animate-pulse" style={{ color: colors.textSecondary }}>
                加载热力图...
              </div>
            </div>
          </div>
        ) : (
          <div className="px-6 pb-6">
            <ProfileHeatmap data={heatmapData || {}} />
          </div>
        )}

        {/* 成就卡片 - 完全照搬 app 端设计 */}
        <div className="px-6 pb-6">
          <div
            className="p-5 rounded-2xl border shadow-lg"
            style={{
              backgroundColor: colors.card.background,
              borderColor: colors.card.border,
              boxShadow: `0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)`
            }}
          >
            {/* 成就标题区域 */}
            <div className="flex items-center mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                style={{ backgroundColor: colors.accent.blue + '20' }}
              >
                <Target size={18} style={{ color: colors.accent.blue }} />
              </div>
              <h2 className="text-lg font-bold" style={{ color: colors.text }}>
                {t('profile.achievements_title')}
              </h2>
            </div>

            {/* 成就网格 */}
            <div className="mt-2">
              {/* 第一行 */}
              <div className="flex justify-between mb-3 gap-3">
                {/* 连续天数卡片 */}
                <button
                  className="w-[48%] h-[120px] relative rounded-2xl overflow-hidden active:scale-95 transition-transform"
                  style={{
                    backgroundColor: colors.card.background,
                    boxShadow: `0 4px 12px rgba(59, 130, 246, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)`
                  }}
                >
                  {/* 背景渐变 */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-80"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent.blue}15 0%, ${colors.accent.blue}25 100%)`
                    }}
                  />

                  {/* 右上角图标 */}
                  <div
                    className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: colors.accent.blue }}
                  >
                    <Flame size={20} color="white" />
                  </div>

                  {/* 内容区域 */}
                  <div className="absolute top-4 left-4 right-[74px] bottom-4 flex flex-col justify-center">
                    <div
                      className="text-2xl font-bold mb-1 leading-7"
                      style={{ color: colors.text }}
                    >
                      {focusData.currentStreak}
                    </div>
                    <div
                      className="text-xs leading-4 font-semibold opacity-80"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('profile.achievement_streak')}
                    </div>
                  </div>

                  {/* 底部装饰条 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: colors.accent.blue }}
                  />
                </button>

                {/* 专注时间卡片 */}
                <button
                  className="w-[48%] h-[120px] relative rounded-2xl overflow-hidden active:scale-95 transition-transform"
                  style={{
                    backgroundColor: colors.card.background,
                    boxShadow: `0 4px 12px rgba(16, 185, 129, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)`
                  }}
                >
                  {/* 背景渐变 */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-80"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent.mint}15 0%, ${colors.accent.mint}25 100%)`
                    }}
                  />

                  {/* 右上角图标 */}
                  <div
                    className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: colors.accent.mint }}
                  >
                    <Clock size={20} color="white" />
                  </div>

                  {/* 内容区域 */}
                  <div className="absolute top-4 left-4 right-[74px] bottom-4 flex flex-col justify-center">
                    <div
                      className="text-2xl font-bold mb-1 leading-7"
                      style={{ color: colors.text }}
                    >
                      {formatFocusTime(focusData.totalFocusTime)}
                    </div>
                    <div
                      className="text-xs leading-4 font-semibold opacity-80"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('profile.achievement_focus_time')}
                    </div>
                  </div>

                  {/* 底部装饰条 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: colors.accent.mint }}
                  />
                </button>
              </div>

              {/* 第二行 */}
              <div className="flex justify-between gap-3">
                {/* 完成任务卡片 */}
                <button
                  className="w-[48%] h-[120px] relative rounded-2xl overflow-hidden active:scale-95 transition-transform"
                  style={{
                    backgroundColor: colors.card.background,
                    boxShadow: `0 4px 12px rgba(147, 51, 234, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)`
                  }}
                >
                  {/* 背景渐变 */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-80"
                    style={{
                      background: `linear-gradient(135deg, ${colors.accent.purple}15 0%, ${colors.accent.purple}25 100%)`
                    }}
                  />

                  {/* 右上角图标 */}
                  <div
                    className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: colors.accent.purple }}
                  >
                    <Trophy size={20} color="white" />
                  </div>

                  {/* 内容区域 */}
                  <div className="absolute top-4 left-4 right-[74px] bottom-4 flex flex-col justify-center">
                    <div
                      className="text-2xl font-bold mb-1 leading-7"
                      style={{ color: colors.text }}
                    >
                      {taskStats?.completed || 0}
                    </div>
                    <div
                      className="text-xs leading-4 font-semibold opacity-80"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('profile.achievement_completed_tasks')}
                    </div>
                  </div>

                  {/* 底部装饰条 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: colors.accent.purple }}
                  />
                </button>

                {/* 专注会话卡片 */}
                <button
                  className="w-[48%] h-[120px] relative rounded-2xl overflow-hidden active:scale-95 transition-transform"
                  style={{
                    backgroundColor: colors.card.background,
                    boxShadow: `0 4px 12px rgba(34, 197, 94, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08)`
                  }}
                >
                  {/* 背景渐变 */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-80"
                    style={{
                      background: `linear-gradient(135deg, ${colors.status.success}15 0%, ${colors.status.success}25 100%)`
                    }}
                  />

                  {/* 右上角图标 */}
                  <div
                    className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                    style={{ backgroundColor: colors.status.success }}
                  >
                    <CheckCircle size={20} color="white" />
                  </div>

                  {/* 内容区域 */}
                  <div className="absolute top-4 left-4 right-[74px] bottom-4 flex flex-col justify-center">
                    <div
                      className="text-2xl font-bold mb-1 leading-7"
                      style={{ color: colors.text }}
                    >
                      {focusData.completedSessions}
                    </div>
                    <div
                      className="text-xs leading-4 font-semibold opacity-80"
                      style={{ color: colors.textSecondary }}
                    >
                      {t('profile.achievement_focus_sessions')}
                    </div>
                  </div>

                  {/* 底部装饰条 */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: colors.status.success }}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 快捷功能区域 */}
        <div className="px-6 pb-6">
          <h2 className="text-sm font-medium mb-3 opacity-60" style={{ color: colors.text }}>
            {t('profile.section_quick_actions')}
          </h2>
          <div
            className="p-5 rounded-xl"
            style={{ backgroundColor: colors.card.background, borderColor: colors.card.border }}
          >
            <div className="flex justify-between">
              <button
                className="flex flex-col items-center p-3 flex-1 hover:bg-opacity-10 rounded-lg transition-colors"
                onClick={() => handleQuickAction('subscriptions')}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  <CreditCard size={28} style={{ color: colors.text }} />
                </div>
                <span className="text-xs font-medium text-center" style={{ color: colors.text }}>
                  {t('profile.menu_subscriptions')}
                </span>
              </button>

              <button
                className="flex flex-col items-center p-3 flex-1 hover:bg-opacity-10 rounded-lg transition-colors"
                onClick={() => handleQuickAction('habits')}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  <Star size={28} style={{ color: colors.text }} />
                </div>
                <span className="text-xs font-medium text-center" style={{ color: colors.text }}>
                  {t('profile.menu_habits')}
                </span>
              </button>

              <button
                className="flex flex-col items-center p-3 flex-1 hover:bg-opacity-10 rounded-lg transition-colors"
                onClick={() => handleQuickAction('fridge')}
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  <Snowflake size={28} style={{ color: colors.text }} />
                </div>
                <span className="text-xs font-medium text-center" style={{ color: colors.text }}>
                  {t('profile.menu_fridge')}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 外观设置 */}
        <div className="px-6 pb-6">
          <h2 className="text-sm font-medium mb-3 opacity-60" style={{ color: colors.text }}>
            {t('profile.section_appearance')}
          </h2>
          <div style={{ backgroundColor: colors.card.background }}>
            <button
              className="w-full flex items-center justify-between p-4 border-b hover:bg-opacity-10 transition-colors"
              style={{ borderColor: colors.card.border }}
              onClick={() => handleSettingsClick('language')}
            >
              <div className="flex items-center">
                <Globe size={20} style={{ color: colors.text }} className="mr-3" />
                <span style={{ color: colors.text }}>{t('profile.menu_language')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2" style={{ color: colors.textSecondary }}>
                  {getCurrentLanguageDisplay()}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 hover:bg-opacity-10 transition-colors"
              style={{ borderColor: colors.card.border }}
              onClick={() => handleSettingsClick('timezone')}
            >
              <div className="flex items-center">
                <Clock size={20} style={{ color: colors.text }} className="mr-3" />
                <span style={{ color: colors.text }}>{t('profile.menu_timezone')}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm mr-2" style={{ color: colors.textSecondary }}>
                  {getTimezoneDisplayName(currentTimezone)}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* 系统设置 */}
        <div className="px-6 pb-6">
          <h2 className="text-sm font-medium mb-3 opacity-60" style={{ color: colors.text }}>
            ⚙️ {t('profile.section_settings')}
          </h2>
          <div style={{ backgroundColor: colors.card.background }}>
            <button
              className="w-full flex items-center justify-between p-4 border-b hover:bg-opacity-10 transition-colors"
              style={{ borderColor: colors.card.border }}
              onClick={() => handleSettingsClick('focus')}
            >
              <div className="flex items-center">
                <Settings size={20} style={{ color: colors.text }} className="mr-3" />
                <span style={{ color: colors.text }}>{t('profile.menu_focus')}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: colors.tint }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 border-b hover:bg-opacity-10 transition-colors"
              style={{ borderColor: colors.card.border }}
              onClick={() => handleSettingsClick('notifications')}
            >
              <div className="flex items-center">
                <Bell size={20} style={{ color: colors.text }} className="mr-3" />
                <span style={{ color: colors.text }}>{t('profile.menu_notifications')}</span>
              </div>
              <div className="w-10 h-6 bg-gray-300 rounded-full relative">
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 transition-transform"></div>
              </div>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 border-b hover:bg-opacity-10 transition-colors"
              style={{ borderColor: colors.card.border }}
              onClick={() => handleSettingsClick('about')}
            >
              <div className="flex items-center">
                <Info size={20} style={{ color: colors.text }} className="mr-3" />
                <span style={{ color: colors.text }}>{t('profile.menu_about')}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: colors.tint }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className="w-full flex items-center justify-between p-4 hover:bg-opacity-10 transition-colors"
              style={{ borderColor: colors.card.border }}
              onClick={() => handleSettingsClick('changelog')}
            >
              <div className="flex items-center">
                <FileText size={20} style={{ color: colors.text }} className="mr-3" />
                <span style={{ color: colors.text }}>{t('profile.menu_changelog')}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: colors.tint }}>
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 退出登录 */}
        <div className="px-6 pb-8">
          <button
            className="w-full p-4 rounded-lg flex items-center justify-center hover:bg-opacity-10 transition-colors"
            style={{ backgroundColor: colors.card.background }}
            onClick={handleLogout}
          >
            <LogOut size={20} style={{ color: colors.status.error }} className="mr-2" />
            <span style={{ color: colors.status.error }} className="font-medium">
              {t('profile.btn_logout')}
            </span>
          </button>
        </div>
        </div>
      </div>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleModalClose}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ backgroundColor: colors.card.background }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4 text-center" style={{ color: colors.text }}>
              {t('profile.select_language')}
            </h2>

            <div className="space-y-2">
              {supportedLanguages.map((lang) => {
                const isSelected = selectedLanguage === lang.code
                return (
                  <button
                    key={lang.code}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-opacity-10 transition-colors"
                    style={{
                      backgroundColor: isSelected ? colors.tint + '20' : 'transparent',
                    }}
                    onClick={() => handleLanguageSelect(lang.code)}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium" style={{ color: colors.text }}>
                        {lang.nativeName}
                      </span>
                      <span className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
                        {lang.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: colors.tint }}
                      >
                        <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                          <path
                            d="M1 4.5L4.5 8L11 1.5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t" style={{ borderColor: colors.card.border }}>
              <p className="text-sm text-center opacity-70 mb-4" style={{ color: colors.textSecondary }}>
                {t('profile.language_description')}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  className="flex-1 py-3 px-4 rounded-xl border transition-colors"
                  style={{
                    borderColor: colors.card.border,
                    color: colors.text
                  }}
                  onClick={handleModalClose}
                  disabled={isSaving}
                >
                  {t('common.cancel')}
                </button>

                <button
                  className="flex-1 py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
                  style={{
                    backgroundColor: hasLanguageChanges ? colors.tint : colors.textSecondary,
                    color: 'white'
                  }}
                  onClick={handleLanguageSave}
                  disabled={isSaving || !hasLanguageChanges}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('common.saving')}
                    </div>
                  ) : (
                    t('common.save')
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timezone Settings Modal */}
      <TimezoneSettings
        isOpen={showTimezoneModal}
        onClose={() => setShowTimezoneModal(false)}
        currentTimezone={currentTimezone}
        onTimezoneChange={handleTimezoneSave}
      />
    </div>
  )
}
