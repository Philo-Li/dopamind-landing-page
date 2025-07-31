"use client";

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Plan {
  id: string;
  name: string;
  priceId: string;
  price: string;
  period: string;
}

interface SubscribeButtonProps {
  plan: Plan;
  isPopular?: boolean;
  className?: string;
}

export default function SubscribeButton({ plan, isPopular = false, className = "" }: SubscribeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    // 如果用户未登录，重定向到注册页面，并附带回调参数
    if (!user) {
      const redirectUrl = `/pricing`;
      router.push(`/register?redirect_url=${encodeURIComponent(redirectUrl)}&plan_id=${plan.priceId}`);
      return;
    }

    // 如果用户已登录，执行支付流程
    setIsLoading(true);
    try {
      // 模拟 API 调用 - 在实际项目中，这里应该调用后端 API
      console.log('Creating checkout session for:', {
        userId: user.id,
        priceId: plan.priceId,
        planName: plan.name
      });
      
      // 模拟创建 Stripe Checkout Session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // 重定向到 Stripe Checkout
      // 这里需要安装 @stripe/stripe-js
      // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      // await stripe?.redirectToCheckout({ sessionId });
      
      // 暂时模拟重定向到成功页面
      console.log('Redirecting to Stripe Checkout with session:', sessionId);
      alert(`模拟：即将跳转到 Stripe 支付页面\n计划: ${plan.name}\n价格: ${plan.price}\n周期: ${plan.period}`);
      
    } catch (error) {
      console.error('Subscription error:', error);
      alert('订阅过程中出现错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 根据 plan 动态生成按钮文案
  const buttonText = `立即订阅${plan.name}方案`;

  // 按钮样式
  const buttonClass = `
    ${className || 'w-full py-3 px-6'} rounded-xl font-semibold text-base transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${isPopular 
      ? 'bg-primary hover:bg-primary-600 text-white shadow-lg hover:shadow-xl' 
      : 'bg-gray-900 hover:bg-gray-800 text-white shadow-md hover:shadow-lg'
    }
  `.trim();

  return (
    <button 
      onClick={handlePress} 
      disabled={isLoading} 
      className={buttonClass}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          处理中...
        </div>
      ) : (
        buttonText
      )}
    </button>
  );
}