"use client";

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';

// 初始化 Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
  customText?: string;
  locale?: string;
}

export default function SubscribeButton({ plan, isPopular = false, className = "", customText, locale }: SubscribeButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    // 如果用户未登录，重定向到注册页面，并附带支付信息
    if (!user) {
      const paymentParams = new URLSearchParams({
        redirect_to: 'payment',
        plan_id: plan.priceId,
        plan_name: plan.name,
        plan_price: plan.price,
        plan_period: plan.period
      });
      router.push(`/register?${paymentParams.toString()}`);
      return;
    }

    // 如果用户已登录，执行支付流程
    setIsLoading(true);
    try {
      console.log('Creating checkout session for:', {
        userId: user.id,
        priceId: plan.priceId,
        planName: plan.name
      });
      
      // 获取当前语言，优先使用传入的locale参数
      const currentLocale = locale || localStorage.getItem('preferred-locale') || 'zh';
      const baseUrl = window.location.origin;
      
      // 创建 Stripe Checkout Session - 调用后端 API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
          plan: plan.id === 'monthly' ? 'monthly' : 'yearly',
          currency: 'usd',
          success_url: `${baseUrl}/${currentLocale}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${baseUrl}/${currentLocale}/cancelled`,
          metadata: {
            planName: plan.name,
            planPrice: plan.price,
            planPeriod: plan.period,
            priceId: plan.priceId,
            locale: currentLocale
          }
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      // 重定向到 Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }
      
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        throw new Error(error.message);
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
      const errorMessage = error instanceof Error ? error.message : '订阅过程中出现错误，请稍后重试';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 根据 plan 动态生成按钮文案
  const buttonText = customText || `立即订阅${plan.name}方案`;

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