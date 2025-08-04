"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';

interface SessionData {
  paymentStatus: string;
  subscriptionId?: string;
  sessionId: string;
}

function PaymentSuccessContent() {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      setError('缺少支付会话ID');
      setLoading(false);
      return;
    }

    // 获取支付详情
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/success?session_id=${sessionId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        } else {
          throw new Error('获取支付详情失败');
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError('获取支付详情失败，但您的支付已成功处理');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
        <p className="text-muted">正在确认支付状态...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 成功图标 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          🎉 支付成功！
        </h1>
        
        <p className="text-xl text-muted mb-2">
          欢迎成为 Dopamind Premium 用户
        </p>
        
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <Crown className="w-4 h-4" />
          <span>Premium 会员已激活</span>
        </div>
      </div>

      {/* 支付详情 */}
      {sessionData && (
        <div className="bg-white rounded-xl p-6 shadow-lg border mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">支付详情</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">支付状态：</span>
              <span className="font-medium text-green-600">
                {sessionData.paymentStatus === 'paid' ? '已支付' : sessionData.paymentStatus}
              </span>
            </div>
            
            {sessionData.subscriptionId && (
              <div className="flex justify-between">
                <span className="text-muted">订阅ID：</span>
                <span className="font-mono text-xs">{sessionData.subscriptionId}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-muted">支付会话：</span>
              <span className="font-mono text-xs">{sessionData.sessionId}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <p className="text-yellow-800 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Premium 功能预览 */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          您现在可以享受的 Premium 功能
        </h3>
        
        <div className="grid gap-3">
          {[
            'AI 对话式规划 - 像聊天一样安排一切',
            '沉浸式专注圣所 - 屏蔽干扰，进入心流状态', 
            'AI 智能拆解 - 将复杂项目分解为小步骤',
            '多设备云端同步 - 所有数据，永不丢失',
            '可视化成长报告 - 用热力图见证进步'
          ].map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 行动按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
        >
          开始使用 Premium 功能
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <Link
          href="/dashboard/subscription"
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-foreground font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          管理我的订阅
        </Link>
      </div>

      {/* 帮助信息 */}
      <div className="text-center mt-8 space-y-2">
        <p className="text-sm text-muted">
          感谢您选择 Dopamind Premium！
        </p>
        <p className="text-xs text-muted">
          如有任何问题，请联系我们的 
          <Link href="/support" className="text-primary hover:underline ml-1">
            客服支持
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-300/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-100/50 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-4xl w-full mx-auto px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image 
              src="/dopamind-logo.png"
              alt="Dopamind Logo" 
              width={48}
              height={48}
              className="rounded-xl"
            />
            <span className="text-2xl font-bold text-foreground">Dopamind</span>
          </Link>
        </div>

        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted">加载中...</p>
          </div>
        }>
          <PaymentSuccessContent />
        </Suspense>
      </div>
    </div>
  );
}