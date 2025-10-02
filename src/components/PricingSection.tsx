"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import { CheckCircle, Gift, Crown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import SubscribeButton from './SubscribeButton';
import { getTranslation } from '@/lib/i18n';
import SubscriptionPlans from './plans/SubscriptionPlans';

interface PricingSectionProps {
  locale: string;
}

type PlanType = 'trial' | 'monthly' | 'yearly';

interface Plan {
  id: PlanType;
  name: string;
  priceId?: string;
  price: string;
  period: string;
  buttonText: string;
  features: string[];
  isPopular?: boolean;
  isTrial?: boolean;
}

interface StripePrice {
  id: string;
  amount: number;
  currency: string;
  interval: string;
}

interface PricesResponse {
  success: boolean;
  prices?: {
    monthly: StripePrice;
    yearly: StripePrice;
  };
}

export default function PricingSection({ locale }: PricingSectionProps) {
  const { user, premiumStatus } = useAuth();
  const router = useRouter();
  const t = getTranslation(locale);
  const pricing = (t as any).pricing ?? {};
  const pricingPlans = pricing.plans ?? {};
  const pricingBadges = pricing.badges ?? {};
  const pricingStatus = pricing.status ?? {};
  const pricingButtons = pricing.buttons ?? {};
  const pricingDescriptions = pricing.descriptions ?? {};
  const [prices, setPrices] = useState<{ monthly?: StripePrice; yearly?: StripePrice }>({});
  const [loading, setLoading] = useState(true);


  // 获取 Stripe 价格信息
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // 通过后端 API 获取 Stripe 价格信息
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/prices`);
        
        if (response.ok) {
          const data: PricesResponse = await response.json();
          if (data.success && data.prices) {
            setPrices(data.prices);
          }
        }
      } catch (error) {
        console.error('Error fetching Stripe prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  const handleTrialStart = () => {
    if (!user) {
      // 如果用户未登录，跳转到注册页面
      router.push(`/${locale}/register`);
    } else {
      // 如果用户已登录但没有试用过，开始试用
      // 这里应该调用 API 来激活试用
      console.log('Starting trial for user:', user.id);
      alert('7天免费试用已激活！请前往仪表板开始使用。');
      router.push('/dashboard');
    }
  };

  // 格式化价格
  const formatPrice = (planType: 'monthly' | 'yearly') => {
    const priceData = prices[planType];
    if (!priceData) return '¥0';
    
    // Stripe 价格是以分为单位，需要除以100转换为元
    const amount = priceData.amount / 100;
    
    // 根据货币类型格式化
    if (priceData.currency === 'usd') {
      return `$${amount}`;
    } else if (priceData.currency === 'cny') {
      return `¥${amount}`;
    } else {
      return `${amount} ${priceData.currency.toUpperCase()}`;
    }
  };


  const renderHeader = () => {
    // 状态 1: 未登录用户（新访客）
    if (!user) {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-marketing-foreground md:text-4xl mb-4">
            {pricing.title || 'Choose Your Plan'}
          </h2>
          <p className="text-lg text-marketing-textSecondary md:text-xl">
            {pricing.subtitle || 'Unlock your potential with AI-powered task management'}
          </p>
          <div className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            {pricingBadges.newUser || 'New User'}
          </div>
        </>
      );
    }

    // 状态 2: 正在试用的用户
    if (user && premiumStatus?.isPremium && premiumStatus?.source === 'trial') {
      const daysLeft = Math.max(0, differenceInDays(new Date(premiumStatus.expiresAt!), new Date()));
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-marketing-foreground md:text-4xl mb-4">
{(pricingStatus.trial_active || 'Your Premium trial has {days} days left').replace('{days}', daysLeft.toString())}
          </h2>
          <p className="text-lg text-marketing-textSecondary md:text-xl">
            {pricingStatus.trial_subtitle || 'Subscribe now to continue enjoying premium features'}
          </p>
          <div className="mt-2 inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            {pricingBadges.trialEnding || 'Trial Ending'}
          </div>
        </>
      );
    }

    // 状态 3: 已付费用户
    if (user && premiumStatus?.isPremium && premiumStatus?.source === 'subscription') {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-marketing-foreground md:text-4xl mb-4">
{pricingStatus.premium_active || 'You are a Premium Member'}
          </h2>
          <p className="text-lg text-marketing-textSecondary md:text-xl">
            {pricingStatus.premium_subtitle || 'Thank you for your support! You are enjoying all premium features.'}
          </p>
          <div className="mt-2 inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            {pricingBadges.premium || 'Premium'}
          </div>
        </>
      );
    }

    // 状态 4: 试用已结束的免费用户
    if (user && !premiumStatus?.isPremium) {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-marketing-foreground md:text-4xl mb-4">
{pricingStatus.trial_ended || 'Your free trial has ended'}
          </h2>
          <p className="text-lg text-marketing-textSecondary md:text-xl">
            {pricingStatus.trial_ended_subtitle || 'Upgrade to Premium to continue using powerful AI features'}
          </p>
          <div className="mt-2 inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
            {pricingBadges.upgrade || 'Upgrade'}
          </div>
        </>
      );
    }

    // 默认状态
    return (
      <>
        <h2 className="text-3xl font-bold tracking-tight text-marketing-foreground md:text-4xl mb-4">
          {pricing.title || 'Choose Your Plan'}
        </h2>
        <p className="text-lg text-marketing-textSecondary md:text-xl">
          {pricing.subtitle || 'Choose the plan that works for you'}
        </p>
      </>
    );
  };

  // 如果是已付费用户，显示不同的界面
  if (user && premiumStatus?.isPremium && premiumStatus?.source === 'subscription') {
    return (
      <section id="pricing" className="w-full py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            {renderHeader()}
          </div>
          
          <div className="max-w-md mx-auto bg-marketing-cardBg rounded-3xl p-8 shadow-lg border-2 border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-marketing-foreground mb-4">Premium 会员</h3>
              <p className="text-marketing-textSecondary mb-6">您正在享受所有高级功能</p>
              
              <div className="space-y-3 mb-8">
                {(pricingPlans.yearly?.features || []).map((feature: string, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-marketing-textSecondary">{feature}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-marketing-textSecondary">
                如需更改订阅计划或取消订阅，请访问
                <Link href="/dashboard/subscription" className="text-primary hover:underline ml-1">
                  订阅管理页面
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // 判断用户当前的订阅状态
  const getUserPlanStatus = () => {
    if (!user) return null;

    if (premiumStatus?.isPremium && premiumStatus?.source === 'trial') {
      return 'trial';
    }

    if (premiumStatus?.isPremium && premiumStatus?.source === 'subscription') {
      // 这里应该根据实际的订阅类型判断，目前默认为yearly
      // 在实际项目中，可以从premiumStatus中获取具体的计划类型
      return premiumStatus.planType === 'monthly' ? 'monthly' : 'yearly';
    }

    return 'free'; // 免费用户或试用已结束
  };

  const currentUserPlan = getUserPlanStatus();

  return (
    <section id="pricing" className="w-full py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          {renderHeader()}
        </div>

        {/* 使用统一的订阅产品列表组件 */}
        <SubscriptionPlans
          user={user}
          currentUserPlan={currentUserPlan}
          monthlyPrice={formatPrice('monthly')}
          yearlyPrice={formatPrice('yearly')}
          monthlyPriceId={prices.monthly?.id}
          yearlyPriceId={prices.yearly?.id}
          isLoadingPrices={loading}
          translations={{
            plans: {
              trial: {
                name: pricingPlans.trial?.name || '7-Day Premium Trial',
                price: pricingPlans.trial?.price || '$0',
                period: pricingPlans.trial?.period || 'trial',
                buttonText: pricingPlans.trial?.buttonText || 'Start Free Trial',
                features: pricingPlans.trial?.features || []
              },
              monthly: {
                name: pricingPlans.monthly?.name || 'Monthly',
                period: pricingPlans.monthly?.period || 'month',
                buttonText: pricingPlans.monthly?.buttonText || 'Choose Monthly',
                features: pricingPlans.monthly?.features || []
              },
              yearly: {
                name: pricingPlans.yearly?.name || 'Yearly',
                period: pricingPlans.yearly?.period || 'year',
                buttonText: pricingPlans.yearly?.buttonText || 'Choose Yearly',
                features: pricingPlans.yearly?.features || []
              }
            },
            badges: {
              current: pricingBadges.current || 'Current',
              upgrade: pricingBadges.upgrade_label || 'Upgrade',
              popular: pricingBadges.popular || 'Popular',
              trial: pricingBadges.trial || 'Trial',
            },
            buttons: {
              trialActive: pricingButtons.trial_active || 'Trial Active',
              monthlyMember: pricingButtons.monthly_member || 'Monthly Member',
              yearlyMember: pricingButtons.yearly_member || 'Yearly Member',
              currentPlan: pricingButtons.current_plan || 'Current Plan',
              upgradeToMonthly: pricingButtons.upgrade_to_monthly || 'Upgrade to Monthly',
              upgradeToYearly: pricingButtons.upgrade_to_yearly || 'Upgrade to Yearly',
            },
            descriptions: {
              current: pricingDescriptions.current || 'This is your current plan',
              trial: pricingDescriptions.trial || 'Start your free trial today',
              upgrade: pricingDescriptions.upgrade || 'Upgrade to {plan}',
              yearlySpecial: pricingDescriptions.yearly_special || 'Best value - save 2 months',
              yearlyDiscount: pricingDescriptions.yearly_discount || 'Save 2 months',
              basic: pricingDescriptions.basic || 'Choose this plan',
            },
          }}
          featureHighlights={{
            yearlyExclusive: ['省下 2 个月费用', '专属会员社群'],
            premiumFeatures: ['一对一 AI 教练支持', '新功能抢先体验权'],
          }}
          locale={locale}
          onTrialStart={handleTrialStart}
        />
      </div>
    </section>
  );
}



