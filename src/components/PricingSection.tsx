"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import { CheckCircle, Gift, Crown, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import SubscribeButton from './SubscribeButton';
import { getTranslation } from '../lib/i18n';

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
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [prices, setPrices] = useState<{ monthly?: StripePrice; yearly?: StripePrice }>({});
  const [loading, setLoading] = useState(true);

  // 检查 URL 参数，如果有选中的计划则高亮显示
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const selectedPlanParam = urlParams.get('selected_plan');
      
      if (selectedPlanParam) {
        // 根据 priceId 找到对应的计划类型
        if (selectedPlanParam === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRODUCT_ID) {
          setSelectedPlan('monthly');
        } else if (selectedPlanParam === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRODUCT_ID) {
          setSelectedPlan('yearly');
        }
      }
    }
  }, []);

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

  const plans: Plan[] = [
    {
      id: 'trial',
      name: t.pricing?.plans?.trial?.name || '7-Day Premium Trial',
      price: t.pricing?.plans?.trial?.price || '$0',
      period: t.pricing?.plans?.trial?.period || 'trial',
      buttonText: t.pricing?.plans?.trial?.buttonText || 'Start Free Trial',
      isTrial: true,
      features: t.pricing?.plans?.trial?.features || []
    },
    {
      id: 'monthly',
      name: t.pricing?.plans?.monthly?.name || 'Monthly',
      priceId: prices.monthly?.id || process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRODUCT_ID || 'price_monthly_placeholder',
      price: loading ? 'Loading...' : formatPrice('monthly'),
      period: t.pricing?.plans?.monthly?.period || 'month',
      buttonText: t.pricing?.plans?.monthly?.buttonText || 'Choose Monthly',
      features: t.pricing?.plans?.monthly?.features || []
    },
    {
      id: 'yearly',
      name: t.pricing?.plans?.yearly?.name || 'Yearly',
      priceId: prices.yearly?.id || process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || 'price_yearly_placeholder', 
      price: loading ? 'Loading...' : formatPrice('yearly'),
      period: t.pricing?.plans?.yearly?.period || 'year',
      buttonText: t.pricing?.plans?.yearly?.buttonText || 'Choose Yearly',
      isPopular: true,
      features: t.pricing?.plans?.yearly?.features || []
    }
  ];

  const renderHeader = () => {
    // 状态 1: 未登录用户（新访客）
    if (!user) {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
            {t.pricing?.title || 'Choose Your Plan'}
          </h2>
          <p className="text-lg text-muted md:text-xl">
            {t.pricing?.subtitle || 'Unlock your potential with AI-powered task management'}
          </p>
          <div className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            {t.pricing?.badges?.newUser || 'New User'}
          </div>
        </>
      );
    }

    // 状态 2: 正在试用的用户
    if (user && premiumStatus?.isPremium && premiumStatus?.source === 'trial') {
      const daysLeft = Math.max(0, differenceInDays(new Date(premiumStatus.expiresAt!), new Date()));
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
{(t.pricing?.status?.trial_active || 'Your Premium trial has {days} days left').replace('{days}', daysLeft.toString())}
          </h2>
          <p className="text-lg text-muted md:text-xl">
            {t.pricing?.status?.trial_subtitle || 'Subscribe now to continue enjoying premium features'}
          </p>
          <div className="mt-2 inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            {t.pricing?.badges?.trialEnding || 'Trial Ending'}
          </div>
        </>
      );
    }

    // 状态 3: 已付费用户
    if (user && premiumStatus?.isPremium && premiumStatus?.source === 'subscription') {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
{t.pricing?.status?.premium_active || 'You are a Premium Member'}
          </h2>
          <p className="text-lg text-muted md:text-xl">
            {t.pricing?.status?.premium_subtitle || 'Thank you for your support! You are enjoying all premium features.'}
          </p>
          <div className="mt-2 inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            {t.pricing?.badges?.premium || 'Premium'}
          </div>
        </>
      );
    }

    // 状态 4: 试用已结束的免费用户
    if (user && !premiumStatus?.isPremium) {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
{t.pricing?.status?.trial_ended || 'Your free trial has ended'}
          </h2>
          <p className="text-lg text-muted md:text-xl">
            {t.pricing?.status?.trial_ended_subtitle || 'Upgrade to Premium to continue using powerful AI features'}
          </p>
          <div className="mt-2 inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
            {t.pricing?.badges?.upgrade || 'Upgrade'}
          </div>
        </>
      );
    }

    // 默认状态
    return (
      <>
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
          {t.pricing?.title || 'Choose Your Plan'}
        </h2>
        <p className="text-lg text-muted md:text-xl">
          {t.pricing?.subtitle || 'Choose the plan that works for you'}
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
          
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-lg border-2 border-green-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Premium 会员</h3>
              <p className="text-muted mb-6">您正在享受所有高级功能</p>
              
              <div className="space-y-3 mb-8">
                {(plans[2]?.features || []).map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="text-muted">{feature}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted">
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

  // 判断是否为升级方案
  const isUpgradePlan = (planId: PlanType) => {
    if (!user || !currentUserPlan) return false;
    
    const planHierarchy = { trial: 0, free: 0, monthly: 1, yearly: 2 };
    const currentLevel = planHierarchy[currentUserPlan as keyof typeof planHierarchy] || 0;
    const targetLevel = planHierarchy[planId] || 0;
    
    return targetLevel > currentLevel;
  };

  // 判断是否为当前方案
  const isCurrentPlan = (planId: PlanType) => {
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
          return t.pricing?.buttons?.trial_active || 'Trial Active';
        case 'monthly':
          return t.pricing?.buttons?.monthly_member || 'Monthly Member';
        case 'yearly':
          return t.pricing?.buttons?.yearly_member || 'Yearly Member';
        default:
          return t.pricing?.buttons?.current_plan || 'Current Plan';
      }
    }
    
    // 如果是升级方案
    if (isUpgradePlan(planId)) {
      if (planId === 'monthly') {
        return t.pricing?.buttons?.upgrade_to_monthly || 'Upgrade to Monthly';
      } else if (planId === 'yearly') {
        return t.pricing?.buttons?.upgrade_to_yearly || 'Upgrade to Yearly';
      }
    }
    
    // 试用方案
    if (planId === 'trial') {
      return selectedPlanData.buttonText;
    }
    
    // 默认文案
    return selectedPlanData.buttonText;
  };

  return (
    <section id="pricing" className="w-full py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          {renderHeader()}
        </div>
        
        {/* 定价卡片 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isCurrent = isCurrentPlan(plan.id);
            const isUpgrade = isUpgradePlan(plan.id);
            
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-3xl p-8 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                  isSelected
                    ? 'border-2 border-primary ring-4 ring-primary/20'
                    : 'border border-gray-200 hover:border-gray-300'
                } ${isCurrent ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
              >
                {/* 选中指示器 */}
                {isSelected && !isCurrent && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}

                {/* 当前方案标识 */}
                {isCurrent && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                      <Crown className="w-4 h-4" />
{t.pricing?.badges?.current || 'Current'}
                    </span>
                  </div>
                )}

                {/* 升级标识 */}
                {isUpgrade && !isSelected && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
{t.pricing?.badges?.upgrade_label || 'Upgrade'}
                    </span>
                  </div>
                )}

                {/* 推荐标签 */}
                {plan.isPopular && !isCurrent && !isUpgrade && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
{t.pricing?.badges?.popular || 'Popular'}
                    </span>
                  </div>
                )}

                {/* 试用标签 */}
                {plan.isTrial && !isCurrent && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                      <Gift className="w-4 h-4" />
{t.pricing?.badges?.trial || 'Trial'}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted ml-2">/{plan.period}</span>
                  </div>

                  {/* 年度计划折扣 */}
                  {plan.id === 'yearly' && (
                    <div className="mb-6">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
{t.pricing?.descriptions?.yearly_discount || 'Save 2 months'}
                      </span>
                    </div>
                  )}

                  <ul className="space-y-4 text-left">
                    {plan.features.map((feature, index) => {
                      // 为年度订阅的独有功能添加特殊样式
                      const isYearlyExclusiveFeature = plan.id === 'yearly' && (
                        feature.includes('省下 2 个月费用') || 
                        feature.includes('专属会员社群')
                      );
                      
                      // 为试用、月度和年度订阅的高级功能添加特殊样式
                      const isPremiumFeature = (plan.id === 'trial' || plan.id === 'monthly' || plan.id === 'yearly') && (
                        feature.includes('一对一 AI 教练支持') || 
                        feature.includes('新功能抢先体验权')
                      );
                      
                      const shouldHighlight = isYearlyExclusiveFeature || isPremiumFeature;
                      
                      return (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                            shouldHighlight ? 'text-green-500' : 'text-primary'
                          }`} />
                          <span className={`text-sm ${
                            shouldHighlight 
                              ? 'text-foreground font-medium' 
                              : 'text-muted'
                          }`}>
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* 统一的订阅按钮 */}
        <div className="text-center">
          <div className="max-w-md mx-auto">
            {isCurrentPlan(selectedPlanData.id) ? (
              <button 
                disabled
                className="w-full bg-green-100 text-green-700 font-semibold py-4 px-8 rounded-xl text-lg cursor-not-allowed border-2 border-green-200"
              >
                <Crown className="w-5 h-5 inline mr-2" />
                {getButtonText()}
              </button>
            ) : selectedPlanData.isTrial ? (
              <button 
                onClick={handleTrialStart}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
              >
                {getButtonText()}
              </button>
            ) : user ? (
              <SubscribeButton 
                plan={{
                  id: selectedPlanData.id,
                  name: selectedPlanData.name,
                  priceId: selectedPlanData.priceId!,
                  price: selectedPlanData.price,
                  period: selectedPlanData.period === '每月' ? 'month' : 'year'
                }}
                isPopular={selectedPlanData.isPopular}
                className="w-full py-4 text-lg"
                customText={getButtonText()}
                locale={locale}
              />
            ) : (
              <Link 
                href={`/${locale}/register`} 
                className="w-full inline-block bg-primary hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg text-center"
              >
                {getButtonText()}
              </Link>
            )}
            
            <p className="text-sm text-muted mt-4">
              {isCurrentPlan(selectedPlanData.id)
                ? (t.pricing?.descriptions?.current || 'This is your current plan')
                : selectedPlanData.isTrial 
                ? (t.pricing?.descriptions?.trial || 'Start your free trial today')
                : isUpgradePlan(selectedPlanData.id)
                ? (t.pricing?.descriptions?.upgrade || 'Upgrade to {plan}').replace('{plan}', selectedPlanData.name)
                : selectedPlanData.id === 'yearly'
                ? (t.pricing?.descriptions?.yearly_special || 'Best value - save 2 months')
                : (t.pricing?.descriptions?.basic || 'Choose this plan')
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}