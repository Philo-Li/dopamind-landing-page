'use client'

import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { storage } from '@/lib/utils'
import { useThemeColors } from '@/hooks/useThemeColor'
import ChatContainer from '@/components/chat/ChatContainer'
import ChatSidebar, { type AppView } from '@/components/chat/ChatSidebar'
import DashboardContent from '@/components/dashboard/DashboardContent'
import TaskContainer from '@/components/tasks/TaskContainer'
import TaskDetail from '@/components/tasks/TaskDetail'
import { FocusPage } from '@/components/focus/FocusPage'
import ProfileContent from '@/components/profile/ProfileContent'
import { CalendarPage } from '@/components/calendar/CalendarPage'
import HabitsContent from '@/components/habits/HabitsContent'
import FridgeContent from '@/components/fridge/FridgeContent'
import AboutContent from '@/components/about/AboutContent'
import ChangelogPage from '@/components/ChangelogPage'
import SubscriptionTrackerContent from '@/components/subscription/SubscriptionTrackerContent'
import ReferralContent from '@/components/referral/ReferralContent'
import GiftCodeContent from '@/components/giftcode/GiftCodeContent'
import AccountContent from '@/components/account/AccountContent'
import PlansContent from '@/components/plans/PlansContent'

type AppLayoutProps = {
  initialSidebarCollapsed?: boolean
  children?: React.ReactNode
}

export default function AppLayout({ initialSidebarCollapsed = false, children }: AppLayoutProps) {
  const colors = useThemeColors()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(initialSidebarCollapsed)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    document.body.classList.add('app-shell')
    return () => {
      document.body.classList.remove('app-shell')
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
    document.cookie = `sidebar-collapsed=${sidebarCollapsed ? '1' : '0'}; path=/; max-age=31536000`
  }, [sidebarCollapsed])

  // 使用 useMemo 根据路径计算当前视图，避免状态更新闪烁
  const currentView = useMemo<AppView>(() => {
    console.log('AppLayout currentView calculation, pathname:', pathname)
    if (pathname === '/dashboard') {
      return 'dashboard'
    } else if (pathname === '/tasks') {
      return 'tasks'
    } else if (pathname.startsWith('/tasks/') && pathname !== '/tasks') {
      console.log('Task detail path detected:', pathname)
      return 'task-detail'
    } else if (pathname === '/focus') {
      return 'focus'
    } else if (pathname === '/profile') {
      return 'profile'
    } else if (pathname === '/calendar') {
      return 'calendar'
    } else if (pathname === '/habits') {
      return 'habits'
    } else if (pathname.startsWith('/habits/') && pathname !== '/habits') {
      console.log('Habit detail path detected:', pathname)
      return 'habits'
    } else if (pathname === '/fridge') {
      return 'fridge'
    } else if (pathname === '/subscription-tracker') {
      return 'subscription-tracker'
    } else if (pathname === '/referral') {
      return 'referral'
    } else if (pathname === '/gift-code') {
      return 'gift-code'
    } else if (pathname === '/account') {
      return 'account'
    } else if (pathname === '/plans') {
      return 'plans'
    } else if (pathname === '/about') {
      return 'about'
    } else if (pathname === '/changelog') {
      return 'changelog'
    } else if (pathname === '/chat') {
      return 'chat'
    }
    return 'chat' // 默认值
  }, [pathname])

  // Extract task ID from path for task detail view
  const taskId = useMemo(() => {
    if (currentView === 'task-detail') {
      const matches = pathname.match(/\/tasks\/(\d+)/)
      const extractedId = matches ? parseInt(matches[1], 10) : null
      console.log('Extracted task ID:', extractedId, 'from path:', pathname)
      return extractedId
    }
    return null
  }, [currentView, pathname])

  // Extract habit ID from path for habit detail view
  const habitId = useMemo(() => {
    if (currentView === 'habits' && pathname.startsWith('/habits/') && pathname !== '/habits') {
      const matches = pathname.match(/\/habits\/(\d+)/)
      const extractedId = matches ? parseInt(matches[1], 10) : null
      console.log('Extracted habit ID:', extractedId, 'from path:', pathname)
      return extractedId
    }
    return null
  }, [currentView, pathname])

  // 当折叠状态改变时，保存到 localStorage
  const handleToggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev)
  }

  useEffect(() => {
    // 检查用户是否已登录
    const token = storage.get('token')
    if (!token) {
      router.push('/login')
      return
    }
  }, [router])

  const handleNavigate = useCallback((view: AppView) => {
    // 清除之前的导航超时
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }

    // 只更新 URL 路径
    let newPath = '/chat'
    switch (view) {
      case 'dashboard':
        newPath = '/dashboard'
        break
      case 'tasks':
        newPath = '/tasks'
        break
      case 'focus':
        newPath = '/focus'
        break
      case 'profile':
        newPath = '/profile'
        break
      case 'calendar':
        newPath = '/calendar'
        break
      case 'habits':
        newPath = '/habits'
        break
      case 'fridge':
        newPath = '/fridge'
        break
      case 'subscription-tracker':
        newPath = '/subscription-tracker'
        break
      case 'referral':
        newPath = '/referral'
        break
      case 'gift-code':
        newPath = '/gift-code'
        break
      case 'account':
        newPath = '/account'
        break
      case 'plans':
        newPath = '/plans'
        break
      case 'about':
        newPath = '/about'
        break
      case 'task-detail':
        // task-detail doesn't change the URL, just the view state
        return
      case 'chat':
      default:
        newPath = '/chat'
        break
    }

    // 使用 replace 而不是 push，避免历史记录堆积
    router.replace(newPath, { scroll: false })
  }, [router])

  const handleNavigateToChat = () => {
    handleNavigate('chat')
  }

  const handleBackToTasks = useCallback(() => {
    router.replace('/tasks', { scroll: false })
  }, [router])

  const handleBackToHabits = useCallback(() => {
    router.replace('/habits', { scroll: false })
  }, [router])

  const handleStartFocus = useCallback((taskId: number, taskTitle: string) => {
    router.push(`/focus?taskId=${taskId}&taskTitle=${encodeURIComponent(taskTitle)}`)
  }, [router])

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        backgroundColor: colors.background
      }}
    >
      {/* Side Navigation */}
      <ChatSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, height: '100vh', overflow: 'hidden' }}>
        {currentView === 'chat' ? (
          <ChatContainer />
        ) : currentView === 'dashboard' ? (
          <DashboardContent onNavigateToChat={handleNavigateToChat} />
        ) : currentView === 'tasks' ? (
          <TaskContainer />
        ) : currentView === 'task-detail' ? (
          taskId ? (
            <TaskDetail
              taskId={taskId}
              onBack={handleBackToTasks}
              onStartFocus={handleStartFocus}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">任务未找到</h2>
                <button
                  onClick={handleBackToTasks}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  返回任务列表
                </button>
              </div>
            </div>
          )
        ) : currentView === 'focus' ? (
          <FocusPage />
        ) : currentView === 'profile' ? (
          <ProfileContent />
        ) : currentView === 'calendar' ? (
          <CalendarPage />
        ) : currentView === 'habits' ? (
          habitId ? (
            children
          ) : (
            <HabitsContent />
          )
        ) : currentView === 'fridge' ? (
          <FridgeContent />
        ) : currentView === 'subscription-tracker' ? (
          <SubscriptionTrackerContent />
        ) : currentView === 'referral' ? (
          <ReferralContent />
        ) : currentView === 'gift-code' ? (
          <GiftCodeContent />
        ) : currentView === 'account' ? (
          <AccountContent />
        ) : currentView === 'plans' ? (
          <PlansContent />
        ) : currentView === 'about' ? (
          <AboutContent />
        ) : currentView === 'changelog' ? (
          <ChangelogPage />
        ) : null}
      </div>
    </div>
  )
}
