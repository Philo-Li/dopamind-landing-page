'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { memo } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { storage } from '@/lib/utils'
import { useTheme } from '@/contexts/ThemeContext'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'
import {
  MessageCircle,
  Home,
  Settings,
  Menu,
  Shield,
  FileText,
  CreditCard,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  CheckSquare,
  Timer,
  User,
  LogOut,
  Keyboard,
  Palette,
  Sun,
  Moon,
  Monitor,
  Gift,
  Ticket,
  Star,
  Calendar,
  Target,
  Refrigerator
} from 'lucide-react'

export type AppView =
  | 'chat'
  | 'dashboard'
  | 'tasks'
  | 'focus'
  | 'profile'
  | 'calendar'
  | 'habits'
  | 'fridge'
  | 'task-detail'
  | 'about'
  | 'changelog'
  | 'subscription-tracker'
  | 'referral'
  | 'gift-code'
  | 'account'
  | 'plans'
  | 'daily-report'

interface ChatSidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
  currentView: AppView
  onNavigate: (view: AppView) => void
}

const ChatSidebar = memo(function ChatSidebar({ isCollapsed = false, onToggle, currentView, onNavigate }: ChatSidebarProps) {
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  const { theme, setTheme } = useTheme()
  const colors = useThemeColors()
  const { t } = useLocalization()
  const router = useRouter()

  // Get user information
  const user = storage.getUser()

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

  const handleLogout = async () => {
    try {
      await authApi.logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout API fails, clear local storage and redirect
      router.push('/login')
    }
  }

  // Profile related handlers
  const handleAccountInfo = () => {
    console.log('Navigate to account info')
    router.push('/account')
  }

  const handleReferFriends = () => {
    console.log('Navigate to referral')
    router.push('/referral')
  }

  const handleGiftCode = () => {
    console.log('Navigate to gift code')
    onNavigate('gift-code' as AppView)
  }

  const getThemeIcon = (themeType: 'light' | 'dark' | 'auto') => {
    switch (themeType) {
      case 'light':
        return <Sun className="w-3 h-3" />
      case 'dark':
        return <Moon className="w-3 h-3" />
      case 'auto':
        return <Monitor className="w-3 h-3" />
      default:
        return <Sun className="w-3 h-3" />
    }
  }

  // 创建导航按钮组件
  const NavButton = ({
    view,
    icon: Icon,
    label,
    onClick
  }: {
    view: string,
    icon: any,
    label: string,
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`w-full rounded-lg transition-colors flex items-center gap-3 ${
        isCollapsed ? 'p-3 justify-center' : 'p-3'
      }`}
      style={{
        backgroundColor: currentView === view ? colors.primary : 'transparent',
        color: currentView === view ? '#FFFFFF' : colors.textSecondary
      }}
      onMouseEnter={(e) => {
        if (currentView !== view) {
          e.currentTarget.style.backgroundColor = colors.border
          e.currentTarget.style.color = colors.text
        }
      }}
      onMouseLeave={(e) => {
        if (currentView !== view) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = colors.textSecondary
        }
      }}
    >
      <Icon className="flex-shrink-0" style={{ width: '30px', height: '30px' }} />
      {!isCollapsed && (
        <span className="text-xl font-medium">{label}</span>
      )}
    </button>
  )

  // Global keyboard shortcut for help
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+/ or Cmd+/ to toggle help
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault()
        setShowKeyboardHelp(!showKeyboardHelp)
      }

      // ESC to close help
      if (event.key === 'Escape' && showKeyboardHelp) {
        event.preventDefault()
        setShowKeyboardHelp(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showKeyboardHelp])

  return (
    <div
      className={`border-r h-full flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-24' : 'w-64'
      }`}
      style={{
        backgroundColor: colors.card.background,
        borderColor: colors.border
      }}
    >
      {/* 头部 */}
      <div
        className="p-3 h-16 flex items-center"
      >
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <Image
              src="/dopamind-logo.png"
              alt="Dopamind Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            {!isCollapsed && (
              <span>
                <h1 className="text-2xl font-semibold" style={{ color: colors.text }}>Dopamind</h1>
              </span>
            )}
          </Link>

          <button
            onClick={onToggle}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: colors.textSecondary,
              backgroundColor: 'transparent'
            }}
          >
            {isCollapsed ? (
              <ChevronRight style={{ width: '30px', height: '30px', color: colors.textSecondary }} />
            ) : (
              <ChevronLeft style={{ width: '30px', height: '30px', color: colors.textSecondary }} />
            )}
          </button>
        </div>
      </div>

      {/* AI 助手按钮 */}
      <div className={`${isCollapsed ? 'p-1' : 'px-3 pt-3 pb-1'}`}>
        <NavButton
          view="chat"
          icon={MessageCircle}
          label={t('navigation.chat')}
          onClick={() => onNavigate('chat')}
        />
      </div>

      {/* 功能菜单 */}
      <div className="flex-1 overflow-y-auto">
        <div className={`${isCollapsed ? 'p-1' : 'px-3 pt-1 pb-3'} space-y-1`}>
          <NavButton
            view="tasks"
            icon={CheckSquare}
            label={t('navigation.tasks')}
            onClick={() => onNavigate('tasks')}
          />

          <NavButton
            view="calendar"
            icon={Calendar}
            label={t('navigation.calendar')}
            onClick={() => onNavigate('calendar')}
          />

          <NavButton
            view="focus"
            icon={Timer}
            label={t('navigation.focus')}
            onClick={() => onNavigate('focus')}
          />

          <NavButton
            view="fridge"
            icon={Refrigerator}
            label={t('navigation.fridge')}
            onClick={() => onNavigate('fridge')}
          />

          <NavButton
            view="habits"
            icon={Target}
            label={t('navigation.habits')}
            onClick={() => onNavigate('habits')}
          />
        </div>
      </div>

      {/* 底部导航 */}
      <div
        className="border-t p-3"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.card.background
        }}
      >
        <div
          className="space-y-1"
          style={{ backgroundColor: colors.card.background }}
        >
          <NavButton
            view="dashboard"
            icon={Home}
            label={t('navigation.dashboard')}
            onClick={() => onNavigate('dashboard')}
          />

          {/* 设置菜单 */}
          <div className="relative group">
            <button
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                isCollapsed ? 'justify-center' : 'justify-between'
              }`}
              style={{
                color: colors.textSecondary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.border
                e.currentTarget.style.color = colors.text
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = colors.textSecondary
              }}
            >
              <div className="flex items-center gap-3">
                <Settings style={{ width: '30px', height: '30px' }} />
                {!isCollapsed && <span className="text-xl" style={{ color: colors.text }}>{t('common.settings')}</span>}
              </div>
              {!isCollapsed && <ChevronRight className="w-8 h-8" />}
            </button>

            {/* 悬浮设置子菜单 */}
            <div
              className={`absolute ${isCollapsed ? 'left-full bottom-0 ml-2' : 'left-full bottom-0 ml-1'} w-48 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}
              style={{
                backgroundColor: colors.card.background,
                borderColor: colors.border,
                border: `1px solid ${colors.border}`
              }}
            >
              <div className="py-2">
                {/* 主题设置 */}
                <div className="relative group/theme">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                    style={{ color: colors.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.border
                      e.currentTarget.style.color = colors.text
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = colors.textSecondary
                    }}
                  >
                    <Palette className="w-5 h-5" />
                    <span className="text-sm whitespace-nowrap">{t('sidebar.settings.theme')}</span>
                    <div className="ml-auto flex items-center gap-1">
                      {getThemeIcon(theme)}
                      <span className="text-xs" style={{ color: colors.tabIconDefault }}>
                        {theme === 'light'
                          ? t('sidebar.settings.themeModes.light')
                          : theme === 'dark'
                            ? t('sidebar.settings.themeModes.dark')
                            : t('sidebar.settings.themeModes.auto')}
                      </span>
                      <ChevronRight className="w-3 h-3" style={{ color: colors.tabIconDefault }} />
                    </div>
                  </button>

                  {/* 主题子菜单 */}
                  <div
                    className="absolute left-full bottom-0 ml-1 w-32 rounded-lg shadow-lg opacity-0 invisible group-hover/theme:opacity-100 group-hover/theme:visible transition-all duration-200 z-50"
                    style={{
                      backgroundColor: colors.card.background,
                      border: `1px solid ${colors.border}`
                    }}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => setTheme('light')}
                        className="w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: theme === 'light' ? colors.accent.blue + '20' : 'transparent',
                          color: theme === 'light' ? colors.accent.blue : colors.text
                        }}
                        onMouseEnter={(e) => {
                          if (theme !== 'light') {
                            e.currentTarget.style.backgroundColor = colors.border
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (theme !== 'light') {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }
                        }}
                      >
                        <Sun className="w-3 h-3" />
                        {t('sidebar.settings.themeOptions.light')}
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className="w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: theme === 'dark' ? colors.accent.blue + '20' : 'transparent',
                          color: theme === 'dark' ? colors.accent.blue : colors.text
                        }}
                        onMouseEnter={(e) => {
                          if (theme !== 'dark') {
                            e.currentTarget.style.backgroundColor = colors.border
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (theme !== 'dark') {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }
                        }}
                      >
                        <Moon className="w-3 h-3" />
                        {t('sidebar.settings.themeOptions.dark')}
                      </button>
                      <button
                        onClick={() => setTheme('auto')}
                        className="w-full px-3 py-2 text-left text-sm transition-colors flex items-center gap-2"
                        style={{
                          backgroundColor: theme === 'auto' ? colors.accent.blue + '20' : 'transparent',
                          color: theme === 'auto' ? colors.accent.blue : colors.text
                        }}
                        onMouseEnter={(e) => {
                          if (theme !== 'auto') {
                            e.currentTarget.style.backgroundColor = colors.border
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (theme !== 'auto') {
                            e.currentTarget.style.backgroundColor = 'transparent'
                          }
                        }}
                      >
                        <Monitor className="w-3 h-3" />
                        {t('sidebar.settings.themeOptions.system')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile related menu items */}
                <div className="border-t my-1" style={{ borderColor: colors.border }}></div>

                <button
                  onClick={handleAccountInfo}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{t('sidebar.settings.accountInfo')}</span>
                </button>

                <button
                  onClick={handleReferFriends}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <Gift className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{t('sidebar.settings.referFriends')}</span>
                </button>

                <button
                  onClick={handleGiftCode}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <Ticket className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{t('sidebar.settings.giftCode')}</span>
                </button>

                <Link
                  href="/plans"
                  className="flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-sm">{t('navigation.plans')}</span>
                </Link>

                <div className="border-t my-1" style={{ borderColor: colors.border }}></div>

                <button
                  onClick={() => setShowKeyboardHelp(true)}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <Keyboard className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{t('sidebar.settings.keyboardShortcuts')}</span>
                </button>

                <Link
                  href="https://dopamind.app/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <Shield className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{t('sidebar.settings.privacyPolicy')}</span>
                </Link>

                <Link
                  href="https://dopamind.app/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <FileText className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{t('sidebar.settings.termsOfService')}</span>
                </Link>

                <div className="border-t my-1" style={{ borderColor: colors.border }}></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 transition-colors"
                  style={{ color: colors.textSecondary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.border
                    e.currentTarget.style.color = colors.text
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = colors.textSecondary
                  }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm whitespace-nowrap">{t('sidebar.settings.logout')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Profile Button */}
          <button
            className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 p-3'} rounded-lg transition-colors ${
              currentView === 'profile' ? 'bg-blue-100 dark:bg-blue-900' : ''
            }`}
            style={{
              backgroundColor: currentView === 'profile' ? colors.tint + '20' : 'transparent',
              color: currentView === 'profile' ? colors.tint : colors.textSecondary
            }}
            onClick={() => onNavigate('profile')}
            onMouseEnter={(e) => {
              if (currentView !== 'profile') {
                e.currentTarget.style.backgroundColor = colors.border
                e.currentTarget.style.color = colors.text
              }
            }}
            onMouseLeave={(e) => {
              if (currentView !== 'profile') {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = colors.textSecondary
              }
            }}
          >
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 min-w-0 flex-1'}`}>
              {/* Avatar or User icon */}
              {user?.avatarUrl ? (
                <div className="w-[30px] h-[30px] rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={user.avatarUrl}
                    alt="avatar"
                    width={30}
                    height={30}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <User style={{ width: '30px', height: '30px' }} className="flex-shrink-0" />
              )}

              {!isCollapsed && (
                <span className="text-xl truncate" style={{ color: currentView === 'profile' ? colors.tint : colors.text }}>
                  {getUserDisplayName()}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Keyboard Help Modal */}
      {showKeyboardHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: colors.card.background }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: colors.text }}>快捷键帮助</h2>
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="transition-colors"
                  style={{ color: colors.tabIconDefault }}
                  onMouseEnter={(e) => e.currentTarget.style.color = colors.textSecondary}
                  onMouseLeave={(e) => e.currentTarget.style.color = colors.tabIconDefault}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* 任务管理快捷键 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">任务管理</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'Alt + 0', description: '显示所有任务' },
                      { key: 'Alt + 1', description: '显示今日任务' },
                      { key: 'Alt + 2', description: '显示本周任务' },
                      { key: 'Alt + 3', description: '显示进行中任务' },
                      { key: 'Alt + 4', description: '显示未完成任务' },
                      { key: 'Alt + 5', description: '显示已完成任务' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{item.description}</span>
                        <kbd className="px-2 py-1 text-sm bg-white border border-gray-200 rounded shadow-sm">
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 通用快捷键 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">通用操作</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: 'Ctrl + /', description: '显示/隐藏此帮助面板' },
                      { key: 'Esc', description: '关闭弹窗或取消操作' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{item.description}</span>
                        <kbd className="px-2 py-1 text-sm bg-white border border-gray-200 rounded shadow-sm">
                          {item.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 聊天快捷键 */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">聊天操作</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="text-gray-700">语音输入并发送</span>
                        <div className="text-xs text-gray-500 mt-1">长按空格键开始录音，松开立即发送</div>
                      </div>
                      <kbd className="px-2 py-1 text-sm bg-white border border-gray-200 rounded shadow-sm">
                        长按空格键
                      </kbd>
                    </div>
                  </div>
                </div>

                {/* 提示 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium text-blue-800">小贴士</span>
                  </div>
                  <p className="text-blue-700 text-sm">
                    快捷键在对应的功能页面使用时最有效。例如，任务管理快捷键在任务页面使用时效果最佳。
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

export default ChatSidebar
