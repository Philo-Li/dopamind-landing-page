"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  ArrowLeft,
  Crown,
  Zap
} from "lucide-react";

interface Subscription {
  id: string;
  plan: 'free' | 'monthly' | 'yearly';
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  price?: number;
  currency?: string;
  autoRenew: boolean;
  trialEndsAt?: string;
}

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // 模拟订阅数据 - 实际应用中应该从 API 获取
      const mockSubscription: Subscription = {
        id: "sub_123456789",
        plan: "yearly",
        status: "active",
        startDate: "2024-01-15T00:00:00Z",
        nextBillingDate: "2025-01-15T00:00:00Z",
        price: 159.99,
        currency: "USD",
        autoRenew: true
      };
      setSubscription(mockSubscription);
      
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push("/login");
      return;
    }
    
    setLoading(false);
  }, [router]);

  const handleCancelSubscription = async () => {
    if (!confirm("确定要取消订阅吗？取消后您仍可使用到当前计费周期结束。")) {
      return;
    }
    
    // 这里应该调用 API 取消订阅
    console.log("取消订阅");
    
    if (subscription) {
      setSubscription({
        ...subscription,
        status: "canceled",
        autoRenew: false
      });
    }
  };

  const handleReactivateSubscription = async () => {
    // 这里应该调用 API 重新激活订阅
    console.log("重新激活订阅");
    
    if (subscription) {
      setSubscription({
        ...subscription,
        status: "active",
        autoRenew: true
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'trial':
        return 'text-blue-600 bg-blue-100';
      case 'canceled':
        return 'text-yellow-600 bg-yellow-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '激活中';
      case 'trial':
        return '试用期';
      case 'canceled':
        return '已取消';
      case 'expired':
        return '已过期';
      default:
        return '未知';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free':
        return '免费版';
      case 'monthly':
        return '月度订阅';
      case 'yearly':
        return '年度订阅';
      default:
        return '未知';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  if (!user || !subscription) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-muted hover:text-primary">
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回仪表板
              </Link>
              <h1 className="text-xl font-semibold text-foreground">订阅管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted">欢迎, {user.nickname}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* 当前订阅状态 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Crown className="h-5 w-5 mr-2 text-primary" />
              当前订阅
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold text-foreground">{getPlanName(subscription.plan)}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                    {getStatusText(subscription.status)}
                  </span>
                </div>
                {subscription.price && (
                  <p className="text-2xl font-bold text-primary">
                    ${subscription.price} <span className="text-sm text-muted font-normal">/ {subscription.plan === 'yearly' ? '年' : '月'}</span>
                  </p>
                )}
              </div>
              
              {subscription.plan !== 'free' && (
                <div className="text-right">
                  {subscription.status === 'active' ? (
                    <button
                      onClick={handleCancelSubscription}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      取消订阅
                    </button>
                  ) : subscription.status === 'canceled' ? (
                    <button
                      onClick={handleReactivateSubscription}
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      重新激活
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            {/* 订阅详情 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-muted" />
                <div>
                  <p className="text-sm text-muted">开始日期</p>
                  <p className="font-medium text-foreground">
                    {new Date(subscription.startDate).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>

              {subscription.nextBillingDate && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5 text-muted" />
                  <div>
                    <p className="text-sm text-muted">下次扣费</p>
                    <p className="font-medium text-foreground">
                      {new Date(subscription.nextBillingDate).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-muted" />
                <div>
                  <p className="text-sm text-muted">自动续费</p>
                  <p className="font-medium text-foreground">
                    {subscription.autoRenew ? '已开启' : '已关闭'}
                  </p>
                </div>
              </div>
            </div>

            {/* 取消订阅提示 */}
            {subscription.status === 'canceled' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">订阅已取消</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      您可以继续使用 Premium 功能直到 {subscription.nextBillingDate ? new Date(subscription.nextBillingDate).toLocaleDateString('zh-CN') : '当前计费周期结束'}。
                      之后账户将自动转为免费版。
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 功能对比 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-foreground flex items-center">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              功能对比
            </h2>
          </div>
          
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-foreground">功能</th>
                    <th className="text-center py-3 px-4 font-medium text-foreground">免费版</th>
                    <th className="text-center py-3 px-4 font-medium text-foreground">Premium</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-foreground">基础任务管理</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-foreground">AI 智能建议</td>
                    <td className="text-center py-3 px-4 text-muted">限制使用</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-foreground">云端同步</td>
                    <td className="text-center py-3 px-4 text-muted">×</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-foreground">专注模式</td>
                    <td className="text-center py-3 px-4 text-muted">基础版</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4 text-foreground">习惯追踪</td>
                    <td className="text-center py-3 px-4 text-muted">×</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-foreground">优先客户支持</td>
                    <td className="text-center py-3 px-4 text-muted">×</td>
                    <td className="text-center py-3 px-4">
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 升级订阅 */}
        {subscription.plan === 'free' && (
          <div className="mt-8 bg-gradient-to-r from-primary to-primary/80 rounded-lg p-6 text-white">
            <div className="text-center">
              <Crown className="h-12 w-12 mx-auto mb-4 text-white" />
              <h3 className="text-xl font-bold mb-2">升级到 Premium</h3>
              <p className="text-white/90 mb-6">解锁所有功能，提升您的工作效率</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/pricing"
                  className="bg-white text-primary px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  查看定价方案
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}