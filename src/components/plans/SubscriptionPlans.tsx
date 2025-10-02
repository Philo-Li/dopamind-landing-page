"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Gift } from 'lucide-react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import PlanCard from './PlanCard';

// 初始化 Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export interface PlanData {
  id: 'trial' | 'monthly' | 'yearly';
  name: string;
  priceId?: string;
  price: string;
  period: string;
  buttonText: string;
  features: string[];
  isPopular?: boolean;
  isTrial?: boolean;
}

export interface SubscriptionPlansProps {
  // 用户信息
  user?: any;
  currentUserPlan?: string | null;

  // 定价数据
  monthlyPrice?: string;
  yearlyPrice?: string;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  isLoadingPrices?: boolean;

  // 翻译文案
  translations: {
    plans: {
      trial: { name: string; price: string; period: string; buttonText: string; features: string[] };
      monthly: { name: string; period: string; buttonText: string; features: string[] };
      yearly: { name: string; period: string; buttonText: string; features: string[] };
    };
    badges: {
      current?: string;
      upgrade?: string;
      popular?: string;
      trial?: string;
    };
    buttons: {
      trialActive?: string;
      monthlyMember?: string;
      yearlyMember?: string;
      currentPlan?: string;
      upgradeToMonthly?: string;
      upgradeToYearly?: string;
    };
    descriptions: {
      current?: string;
      trial?: string;
      upgrade?: string;
      yearlySpecial?: string;
      yearlyDiscount?: string;
      basic?: string;
    };
  };

  // 样式配置
  colors?: {
    tint: string;
    text: string;
    textSecondary: string;
    cardBackground?: string;
    cardBorder?: string;
    cardBorderHover?: string;
    sectionBackground?: string;
  };

  // 特性高亮
  featureHighlights?: {
    yearlyExclusive?: string[];
    premiumFeatures?: string[];
  };

  // 语言
  locale?: string;

  // 试用激活回调
  onTrialStart?: () => void;

  // 显示哪些计划（默认显示所有三个）
  visiblePlans?: ('trial' | 'monthly' | 'yearly')[];
}

export default function SubscriptionPlans({
  user,
  currentUserPlan = null,
  monthlyPrice,
  yearlyPrice,
  monthlyPriceId,
  yearlyPriceId,
  isLoadingPrices = false,
  translations,
  colors,
  featureHighlights = {},
  locale = 'en',
  onTrialStart,
  visiblePlans = ['trial', 'monthly', 'yearly'],
}: SubscriptionPlansProps) {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'trial' | 'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);

  // 构建完整的三个计划
  const allPlans: PlanData[] = [
    {
      id: 'trial',
      name: translations.plans.trial.name,
      price: translations.plans.trial.price,
      period: translations.plans.trial.period,
      buttonText: translations.plans.trial.buttonText,
      isTrial: true,
      features: translations.plans.trial.features,
    },
    {
      id: 'monthly',
      name: translations.plans.monthly.name,
      priceId: monthlyPriceId || process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRODUCT_ID,
      price: isLoadingPrices ? 'Loading...' : (monthlyPrice || '$0'),
      period: translations.plans.monthly.period,
      buttonText: translations.plans.monthly.buttonText,
      features: translations.plans.monthly.features,
    },
    {
      id: 'yearly',
      name: translations.plans.yearly.name,
      priceId: yearlyPriceId || process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID,
      price: isLoadingPrices ? 'Loading...' : (yearlyPrice || '$0'),
      period: translations.plans.yearly.period,
      buttonText: translations.plans.yearly.buttonText,
      isPopular: true,
      features: translations.plans.yearly.features,
    },
  ];

  // 过滤出需要显示的计划
  const plans = allPlans.filter(plan => visiblePlans.includes(plan.id));

  // 判断是否为升级方案
  const isUpgradePlan = (planId: string) => {
    if (!currentUserPlan) return false;

    const planHierarchy = { trial: 0, free: 0, monthly: 1, yearly: 2 };
    const currentLevel = planHierarchy[currentUserPlan as keyof typeof planHierarchy] || 0;
    const targetLevel = planHierarchy[planId as keyof typeof planHierarchy] || 0;

    return targetLevel > currentLevel;
  };

  // 判断是否为当前方案
  const isCurrentPlan = (planId: string) => {
    return currentUserPlan === planId;
  };

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)!;

  // 获取按钮文案
  const getButtonText = () => {
    const planId = selectedPlanData.id;

    // 如果是当前方案
    if (isCurrentPlan(planId)) {
      switch (currentUserPlan) {
        case 'trial':
          return translations.buttons.trialActive || 'Trial Active';
        case 'monthly':
          return translations.buttons.monthlyMember || 'Monthly Member';
        case 'yearly':
          return translations.buttons.yearlyMember || 'Yearly Member';
        default:
          return translations.buttons.currentPlan || 'Current Plan';
      }
    }

    // 如果是升级方案
    if (isUpgradePlan(planId)) {
      if (planId === 'monthly') {
        return translations.buttons.upgradeToMonthly || 'Upgrade to Monthly';
      } else if (planId === 'yearly') {
        return translations.buttons.upgradeToYearly || 'Upgrade to Yearly';
      }
    }

    // 默认文案
    return selectedPlanData.buttonText;
  };

  // 处理试用开始
  const handleTrialStart = () => {
    if (onTrialStart) {
      onTrialStart();
    } else {
      if (!user) {
        router.push(`/${locale}/register`);
      } else {
        console.log('Starting trial for user:', user.id);
        alert('7天免费试用已激活！请前往仪表板开始使用。');
        router.push('/dashboard');
      }
    }
  };

  // 处理付费订阅
  const handleSubscribe = async (plan: PlanData) => {
    const currentLocale = locale || localStorage.getItem('preferred-locale') || 'en';

    // 如果用户未登录，重定向到注册页面
    if (!user) {
      const paymentParams = new URLSearchParams({
        redirect_to: 'payment',
        plan_id: plan.priceId || '',
        plan_name: plan.name,
        plan_price: plan.price,
        plan_period: plan.period
      });
      router.push(`/${currentLocale}/register?${paymentParams.toString()}`);
      return;
    }

    // 如果用户已登录，执行支付流程
    setIsLoading(true);
    try {
      console.log('Creating checkout session for:', {
        userId: user.id,
        priceId: plan.priceId,
        planName: plan.name,
        currentLocale: currentLocale
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const successUrl = `${baseUrl}/${currentLocale}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/${currentLocale}/cancelled`;

      // 创建 Stripe Checkout Session
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          plan: plan.id === 'monthly' ? 'monthly' : 'yearly',
          currency: 'usd',
          success_url: successUrl,
          cancel_url: cancelUrl,
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

  // 渲染订阅按钮
  const renderButton = () => {
    const plan = selectedPlanData;
    const buttonText = getButtonText();

    // 如果是当前方案
    if (isCurrentPlan(plan.id)) {
      return (
        <button
          disabled
          className="w-full bg-green-100 text-green-700 font-semibold py-4 px-8 rounded-xl text-lg cursor-not-allowed border-2 border-green-200"
        >
          <Crown className="w-5 h-5 inline mr-2" />
          {buttonText}
        </button>
      );
    }

    // 如果是试用方案
    if (plan.isTrial) {
      return (
        <button
          onClick={handleTrialStart}
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              处理中...
            </div>
          ) : (
            <>
              <Gift className="w-5 h-5 inline mr-2" />
              {buttonText}
            </>
          )}
        </button>
      );
    }

    // 判断是否为升级按钮
    const isUpgrade = isUpgradePlan(plan.id);
    const buttonColor = isUpgrade ? 'rgb(249, 115, 22)' : (colors?.tint || 'rgb(99, 102, 241)'); // 升级用橙色，普通用主题色

    // 付费方案
    if (user) {
      return (
        <button
          onClick={() => handleSubscribe(plan)}
          disabled={isLoading}
          className="w-full text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all shadow-lg hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: buttonColor }}
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
    } else {
      return (
        <Link
          href={`/${locale}/register`}
          className="w-full inline-block text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg text-center hover:opacity-90"
          style={{ backgroundColor: buttonColor }}
        >
          {buttonText}
        </Link>
      );
    }
  };

  return (
    <div className="py-12 rounded-lg" style={{ backgroundColor: colors?.sectionBackground || '#f9fafb' }}>
      <div className="container mx-auto px-4 md:px-6">
        {/* 定价卡片 - 根据 visiblePlans 动态调整布局 */}
        <div className={`grid gap-8 max-w-6xl mx-auto mb-12 ${plans.length === 3 ? 'md:grid-cols-3' : plans.length === 2 ? 'md:grid-cols-2 max-w-4xl' : 'md:grid-cols-1 max-w-md'}`}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isCurrent = isCurrentPlan(plan.id);
            const isUpgrade = isUpgradePlan(plan.id);

            return (
              <PlanCard
                key={plan.id}
                id={plan.id}
                name={plan.name}
                price={plan.price}
                period={plan.period}
                features={plan.features}
                isPopular={plan.isPopular}
                isTrial={plan.isTrial}
                isSelected={isSelected}
                isCurrent={isCurrent}
                isUpgrade={isUpgrade}
                onClick={() => setSelectedPlan(plan.id)}
                badges={translations.badges}
                colors={colors}
                yearlyDiscount={plan.id === 'yearly' ? translations.descriptions.yearlyDiscount : undefined}
                featureHighlights={featureHighlights}
              />
            );
          })}
        </div>

        {/* 统一的订阅按钮 */}
        <div className="text-center">
          <div className="max-w-md mx-auto">
            {renderButton()}

            <p className="text-sm mt-4" style={{ color: colors?.textSecondary || '#6b7280' }}>
              {isCurrentPlan(selectedPlanData.id)
                ? translations.descriptions.current || 'This is your current plan'
                : selectedPlanData.isTrial
                ? translations.descriptions.trial || 'Start your free trial today'
                : isUpgradePlan(selectedPlanData.id)
                ? (translations.descriptions.upgrade || 'Upgrade to {plan}').replace('{plan}', selectedPlanData.name)
                : selectedPlanData.id === 'yearly'
                ? translations.descriptions.yearlySpecial || 'Best value - save 2 months'
                : translations.descriptions.basic || 'Choose this plan'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
