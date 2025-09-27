'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  User,
  CreditCard,
  BarChart3,
  Calendar,
  Settings,
  Crown,
  TrendingUp,
  Clock,
  Target,
  Zap,
  BookOpen,
  MessageCircle
} from 'lucide-react'
import { storage } from '@/lib/utils'
import { User as UserType } from '@/types'

interface DashboardStats {
  tasksCompleted: number
  focusMinutes: number
  streakDays: number
}

interface DashboardContentProps {
  onNavigateToChat: () => void
}

export default function DashboardContent({ onNavigateToChat }: DashboardContentProps) {
  const [user, setUser] = useState<UserType | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    tasksCompleted: 0,
    focusMinutes: 0,
    streakDays: 0
  })
  const [loading, setLoading] = useState(true)

  // 模拟 Premium 状态
  const [isPremium] = useState(false)

  useEffect(() => {
    const userData = storage.get('user')

    if (userData) {
      setUser(userData)

      // 模拟统计数据 - 实际应用中应该从 API 获取
      setStats({
        tasksCompleted: 42,
        focusMinutes: 360,
        streakDays: 7
      })
    }

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">加载中...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">用户信息加载失败</div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 欢迎消息 */}
        <div className="bg-gradient-to-r from-dopamind-500 to-orange-600 rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                欢迎回来, {user.nickname || user.email}! 🎉
              </h2>
              <p className="text-white/90">
                准备好开始高效的一天了吗？让 AI 助你一臂之力。
              </p>
            </div>
            <div className="hidden sm:block">
              <Zap className="h-16 w-16 text-white/20" />
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成任务</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksCompleted}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-green-600">比上周增加 12%</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">专注时长 (分钟)</p>
                <p className="text-2xl font-bold text-gray-900">{stats.focusMinutes}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-blue-600">今天已专注 45 分钟</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">连续打卡天数</p>
                <p className="text-2xl font-bold text-gray-900">{stats.streakDays}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-orange-600">保持好习惯！</p>
            </div>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
            <div className="space-y-3">
              <button
                onClick={onNavigateToChat}
                className="w-full flex items-center space-x-3 p-3 bg-dopamind-500 text-white rounded-lg hover:bg-dopamind-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span>与 AI 对话</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <Target className="h-5 w-5" />
                <span>创建新任务</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <Clock className="h-5 w-5" />
                <span>开始专注时间</span>
              </button>

              <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-5 w-5" />
                <span>查看今日计划</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">最近活动</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">完成了「学习 React」任务</p>
                  <p className="text-xs text-gray-600">2 小时前</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">专注学习 25 分钟</p>
                  <p className="text-xs text-gray-600">3 小时前</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">创建了新的项目</p>
                  <p className="text-xs text-gray-600">5 小时前</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 订阅状态提示 */}
        {!isPremium && (
          <div className="bg-gradient-to-r from-dopamind-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-2">升级到 Premium</h3>
                <p className="text-white/90 mb-4">
                  解锁所有功能，包括无限任务、AI 智能建议、云端同步等
                </p>
                <Link
                  href="/plans"
                  className="inline-flex items-center space-x-2 bg-white text-dopamind-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  <span>立即升级</span>
                </Link>
              </div>
              <div className="hidden sm:block">
                <Crown className="h-16 w-16 text-white/20" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}