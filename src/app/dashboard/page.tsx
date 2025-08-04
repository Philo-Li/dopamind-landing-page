"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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
  BookOpen
} from "lucide-react";

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  tasksCompleted: number;
  focusMinutes: number;
  streakDays: number;
  subscriptionStatus: 'free' | 'premium';
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    tasksCompleted: 0,
    focusMinutes: 0,
    streakDays: 0,
    subscriptionStatus: 'free'
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push("/en/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // 模拟统计数据 - 实际应用中应该从 API 获取
      setStats({
        tasksCompleted: 42,
        focusMinutes: 360,
        streakDays: 7,
        subscriptionStatus: 'premium'
      });
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push("/en/login");
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image 
                  src="/dopamind-logo.png" 
                  alt="Dopamind Logo" 
                  width={32}
                  height={32}
                  className="rounded-[8px]"
                />
                <span className="text-xl font-bold text-foreground">Dopamind</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-medium text-foreground">仪表板</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {stats.subscriptionStatus === 'premium' && (
                <div className="flex items-center space-x-1 bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1 rounded-full text-sm">
                  <Crown className="h-4 w-4" />
                  <span>Premium</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted">欢迎, {user.nickname}</span>
              </div>
              
              <button
                onClick={handleSignOut}
                className="text-muted hover:text-foreground px-3 py-2 rounded-md text-sm font-medium"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold text-foreground">快速导航</h2>
              </div>
              <nav className="p-2">
                <div className="space-y-1">
                  <Link 
                    href="/dashboard/profile"
                    className="flex items-center space-x-3 px-3 py-2 text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>个人信息</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/subscription"
                    className="flex items-center space-x-3 px-3 py-2 text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <CreditCard className="h-5 w-5" />
                    <span>订阅管理</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/analytics"
                    className="flex items-center space-x-3 px-3 py-2 text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BarChart3 className="h-5 w-5" />
                    <span>数据分析</span>
                  </Link>
                  
                  <Link 
                    href="/dashboard/settings"
                    className="flex items-center space-x-3 px-3 py-2 text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span>设置</span>
                  </Link>
                </div>
                
                <div className="border-t border-gray-200 my-3"></div>
                
                <div className="space-y-1">
                  <Link 
                    href="/support"
                    className="flex items-center space-x-3 px-3 py-2 text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>帮助中心</span>
                  </Link>
                  
                  <Link 
                    href="/privacy"
                    className="flex items-center space-x-3 px-3 py-2 text-muted hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BookOpen className="h-5 w-5" />
                    <span>隐私政策</span>
                  </Link>
                </div>
              </nav>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="lg:col-span-3">
            {/* 欢迎消息 */}
            <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    欢迎回来, {user.nickname}! 🎉
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
                    <p className="text-sm text-muted">已完成任务</p>
                    <p className="text-2xl font-bold text-foreground">{stats.tasksCompleted}</p>
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
                    <p className="text-sm text-muted">专注时长 (分钟)</p>
                    <p className="text-2xl font-bold text-foreground">{stats.focusMinutes}</p>
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
                    <p className="text-sm text-muted">连续打卡天数</p>
                    <p className="text-2xl font-bold text-foreground">{stats.streakDays}</p>
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
                <h3 className="text-lg font-semibold text-foreground mb-4">快速操作</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Target className="h-5 w-5" />
                    <span>创建新任务</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors">
                    <Clock className="h-5 w-5" />
                    <span>开始专注时间</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 border border-gray-200 text-foreground rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar className="h-5 w-5" />
                    <span>查看今日计划</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">最近活动</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">完成了「学习 React」任务</p>
                      <p className="text-xs text-muted">2 小时前</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">专注学习 25 分钟</p>
                      <p className="text-xs text-muted">3 小时前</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">创建了新的项目</p>
                      <p className="text-xs text-muted">5 小时前</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 订阅状态提示 */}
            {stats.subscriptionStatus === 'free' && (
              <div className="bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold mb-2">升级到 Premium</h3>
                    <p className="text-white/90 mb-4">
                      解锁所有功能，包括无限任务、AI 智能建议、云端同步等
                    </p>
                    <Link 
                      href="/dashboard/subscription"
                      className="inline-flex items-center space-x-2 bg-white text-primary px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
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
      </div>
    </div>
  );
}