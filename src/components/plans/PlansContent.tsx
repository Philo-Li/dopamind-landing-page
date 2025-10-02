"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/useThemeColor';
import { storage } from '@/lib/utils';
import { settingsApi, pricingApi, apiService } from '@/lib/api';
import {
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Crown,
  Zap,
  TrendingUp,
  Gift
} from "lucide-react";

// 将 Premium 相关的接口和逻辑移到组件内部，避免 hook 依赖问题
interface PremiumStatus {
  isPremium: boolean;
  type: 'free' | 'trial' | 'paid' | 'referral_credit';
  expiresAt?: Date;
  store?: 'APP_STORE' | 'GOOGLE_PLAY' | 'STRIPE' | 'system';
  willRenew: boolean;
  referralCreditDays?: number;
}

interface LocalSubscription {
  id: string;
  plan: 'free' | 'monthly' | 'yearly' | 'trial';
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

interface PriceData {
  id: string;
  amount: number;
  currency: string;
  interval: string;
}

interface PricingData {
  monthly: PriceData;
  yearly: PriceData;
}

interface PlanFeatures {
  [key: string]: string[];
}

export default function PlansContent() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  // 获取当前语言对应的locale
  const getLocale = () => {
    switch (currentLanguage) {
      case 'zh':
        return 'zh-CN';
      case 'zh-TW':
        return 'zh-TW';
      case 'ja':
        return 'ja-JP';
      case 'en':
      default:
        return 'en-US';
    }
  };
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<LocalSubscription | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [premiumLoading, setPremiumLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [pricingLoading, setPricingLoading] = useState(true);
  const router = useRouter();
  const colors = useThemeColors();

  // 获取价格数据的函数
  const fetchPricingData = async () => {
    try {
      setPricingLoading(true);
      const response = await pricingApi.getPrices();

      if (response.success && response.data) {
        setPricingData(response.data);
      } else {
        console.error('Failed to fetch pricing data:', (response as any).error);
        // 如果API失败，使用默认价格
        setPricingData({
          monthly: { id: 'monthly', amount: 2900, currency: 'usd', interval: 'month' },
          yearly: { id: 'yearly', amount: 29900, currency: 'usd', interval: 'year' }
        });
      }
    } catch (error) {
      console.error('Error fetching pricing data:', error);
      // 如果API失败，使用默认价格
      setPricingData({
        monthly: { id: 'monthly', amount: 2900, currency: 'usd', interval: 'month' },
        yearly: { id: 'yearly', amount: 29900, currency: 'usd', interval: 'year' }
      });
    } finally {
      setPricingLoading(false);
    }
  };

  // 格式化价格显示
  const formatPrice = (priceData: PriceData | null) => {
    if (!priceData) return '$0';

    // 价格通常以分为单位存储，需要除以100转换为元
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
  const fetchPremiumStatus = async () => {
    try {
      setPremiumLoading(true);

      const token = storage.get('token');
      console.log('[PlansContent] Token from storage:', token ? 'exists' : 'missing');

      if (!token) {
        console.error('[PlansContent] No token found in storage');
        throw new Error('No token found');
      }

      console.log('[PlansContent] Calling getPremiumStatus API...');
      const response = await apiService.getPremiumStatus(token);
      console.log('[PlansContent] API Response:', response);

      if (response) {
        const status: PremiumStatus = {
          isPremium: response.isPremium || false,
          type: (response.type as 'trial' | 'free' | 'paid' | 'referral_credit') || 'free',
          expiresAt: response.expiresAt ? new Date(response.expiresAt) : undefined,
          store: response.store as 'APP_STORE' | 'GOOGLE_PLAY' | 'STRIPE' | 'system' | undefined,
          willRenew: response.willRenew || false,
          referralCreditDays: response.referralCreditDays
        };

        console.log('[PlansContent] Parsed status:', status);
        setPremiumStatus(status);
      } else {
        console.log('[PlansContent] No response from API, setting default free status');
        // 默认免费用户状态
        setPremiumStatus({
          isPremium: false,
          type: 'free',
          willRenew: false
        });
      }
    } catch (err) {
      console.error('[PlansContent] Failed to fetch premium status:', err);
      setPremiumStatus({
        isPremium: false,
        type: 'free',
        willRenew: false
      });
    } finally {
      setPremiumLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const userData = storage.getUser();

      if (!userData) {
        router.push("/login");
        return;
      }

      try {
        setUser(userData as any);

        // 并行获取 Premium 状态和价格数据
        await Promise.all([
          fetchPremiumStatus(),
          fetchPricingData()
        ]);

      } catch (error) {
        console.error('Error loading user data:', error);
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  // 根据 Premium 状态生成订阅信息
  useEffect(() => {
    if (user && premiumStatus) {
      if (premiumStatus.isPremium) {
        let plan: 'free' | 'monthly' | 'yearly' | 'trial' = 'free';

        if (premiumStatus.type === 'trial') {
          plan = 'trial';
        } else if (premiumStatus.type === 'paid') {
          plan = premiumStatus.store === 'STRIPE' ? 'yearly' : 'monthly';
        }

        const localSub: LocalSubscription = {
          id: "sub_from_premium_status",
          plan: plan as any,
          status: premiumStatus.type === 'trial' ? 'trial' : 'active',
          startDate: new Date().toISOString(),
          nextBillingDate: premiumStatus.expiresAt ? premiumStatus.expiresAt.toISOString() : undefined,
          price: premiumStatus.type === 'paid' ? 159.99 : undefined,
          currency: "USD",
          autoRenew: premiumStatus.willRenew,
          trialEndsAt: premiumStatus.type === 'trial' && premiumStatus.expiresAt ? premiumStatus.expiresAt.toISOString() : undefined
        };
        setSubscription(localSub);
      } else {
        // 免费用户
        const freeSub: LocalSubscription = {
          id: "free_user",
          plan: "free",
          status: "active",
          startDate: user.createdAt,
          autoRenew: false
        };
        setSubscription(freeSub);
      }
    }
  }, [user, premiumStatus]);

  const handleCancelSubscription = async () => {
    if (!confirm(t('plans.cancellation.confirm_title') + " " + t('plans.cancellation.confirm_message'))) {
      return;
    }

    alert(t('plans.cancellation.instructions'));
    console.log(t('plans.cancellation.cancel_button') + " - 引导用户到相应平台");
  };

  const handleReactivateSubscription = async () => {
    alert(t('plans.cancellation.reactivate_message'));
    console.log(t('plans.cancellation.reactivate_button'));
  };

  // 判断用户当前的订阅状态
  const getUserPlanStatus = () => {
    if (!user) return null;

    if (premiumStatus?.isPremium && (premiumStatus as any)?.source === 'trial') {
      return 'trial';
    }

    if (premiumStatus?.isPremium && (premiumStatus as any)?.source === 'subscription') {
      // 这里应该根据实际的订阅类型判断，目前默认为yearly
      // 在实际项目中，可以从premiumStatus中获取具体的计划类型
      return (premiumStatus as any).planType === 'monthly' ? 'monthly' : 'yearly';
    }

    return t('plans.plan_names.free'); // 免费用户或试用已结束
  };

  const currentUserPlan = getUserPlanStatus();

  // 判断是否为升级方案
  const isUpgradePlan = (planId: 'monthly' | 'yearly') => {
    if (!user || !currentUserPlan) return false;

    const planHierarchy = { trial: 0, free: 0, monthly: 1, yearly: 2 };
    const currentLevel = planHierarchy[currentUserPlan as keyof typeof planHierarchy] || 0;
    const targetLevel = planHierarchy[planId] || 0;

    return targetLevel > currentLevel;
  };

  // 判断是否为当前方案
  const isCurrentPlan = (planId: 'monthly' | 'yearly') => {
    return currentUserPlan === planId;
  };

  // 定义方案数据
  const plans = [
    {
      id: 'monthly' as const,
      name: t('pricing.plans.monthly.name') || t('plans.plan_names.monthly'),
      price: pricingLoading ? 'Loading...' : formatPrice(pricingData?.monthly || null),
      period: t('pricing.plans.monthly.period') || t('plans.subscription_info.per_month'),
      buttonText: t('pricing.plans.monthly.buttonText') || t('plans.actions.upgrade_to').replace('{plan}', t('plans.plan_names.monthly')),
      features: t('pricing.plans.monthly.features', { returnObjects: true }) as string[] || []
    },
    {
      id: 'yearly' as const,
      name: t('pricing.plans.yearly.name') || t('plans.plan_names.yearly'),
      price: pricingLoading ? 'Loading...' : formatPrice(pricingData?.yearly || null),
      period: t('pricing.plans.yearly.period') || t('plans.subscription_info.per_year'),
      buttonText: t('pricing.plans.yearly.buttonText') || t('plans.actions.upgrade_to').replace('{plan}', t('plans.plan_names.yearly')),
      isPopular: true,
      features: t('pricing.plans.yearly.features', { returnObjects: true }) as string[] || []
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)!;

  // 获取按钮文案
  const getButtonText = () => {
    const planId = selectedPlanData.id;

    // 如果是当前方案
    if (isCurrentPlan(planId)) {
      switch (currentUserPlan) {
        case 'monthly':
          return t('pricing.buttons.monthly_member') || t('plans.plan_names.monthly');
        case 'yearly':
          return t('pricing.buttons.yearly_member') || t('plans.plan_names.yearly');
        default:
          return t('pricing.buttons.current_plan') || t('plans.current_subscription');
      }
    }

    // 如果是升级方案
    if (isUpgradePlan(planId)) {
      if (planId === 'monthly') {
        return t('pricing.buttons.upgrade_to_monthly') || t('plans.actions.upgrade_to', { plan: t('plans.plan_names.monthly') });
      } else if (planId === 'yearly') {
        return t('pricing.buttons.upgrade_to_yearly') || t('plans.actions.upgrade_to', { plan: t('plans.plan_names.yearly') });
      }
    }

    // 默认文案
    return selectedPlanData.buttonText;
  };

  const handleTrialStart = () => {
    if (!user) {
      // 如果用户未登录，跳转到注册页面
      router.push('/register');
    } else {
      // 如果用户已登录但没有试用过，开始试用
      // 这里应该调用 API 来激活试用
      console.log('Starting trial for user:', user.id);
      alert(t('plans.actions.trial_activated'));
      router.push('/dashboard');
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
        return t('plans.status.active');
      case 'trial':
        return t('plans.status.trial');
      case 'canceled':
        return t('plans.status.cancelled');
      case 'expired':
        return t('plans.status.expired');
      default:
        return t('plans.status.unknown');
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free':
        return t('plans.plan_names.free');
      case 'trial':
        return t('plans.plan_names.trial');
      case 'monthly':
        return t('plans.plan_names.monthly');
      case 'yearly':
        return t('plans.plan_names.yearly');
      default:
        return t('plans.plan_names.unknown');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-lg" style={{ color: colors.text }}>{t('plans.loading')}</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!subscription) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="text-lg" style={{ color: colors.text }}>{t('plans.loading')}</div>
      </div>
    );
  }

  const isPremium = premiumStatus?.isPremium || false;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: colors.background }}>
      {/* 页面头部 */}
      <div className="flex-shrink-0 px-6 py-4 border-b" style={{ borderColor: colors.border }}>
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>{t('navigation.plans')}</h1>
      </div>

      {/* 可滚动内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-6 px-6">
        {/* {t('plans.current_subscription')} */}
        <div
          className="rounded-lg shadow-sm border overflow-hidden mb-8"
          style={{
            backgroundColor: colors.card.background,
            borderColor: colors.border
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{
              borderColor: colors.border,
              backgroundColor: colors.background
            }}
          >
            <h2 className="text-lg font-semibold flex items-center" style={{ color: colors.text }}>
              <Crown className="h-5 w-5 mr-2" style={{ color: colors.tint }} />
              {t('plans.current_subscription')}
            </h2>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-bold" style={{ color: colors.text }}>{getPlanName(subscription.plan)}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
                    {getStatusText(subscription.status)}
                  </span>
                </div>
                {subscription.price && subscription.plan !== 'free' && subscription.plan !== 'trial' && (
                  <p className="text-2xl font-bold" style={{ color: colors.tint }}>
                    ${subscription.price} <span className="text-sm font-normal" style={{ color: colors.textSecondary }}>/ {subscription.plan === 'yearly' ? t('plans.subscription_info.per_year') : t('plans.subscription_info.per_month')}</span>
                  </p>
                )}
              </div>

              {subscription.plan !== 'free' && (
                <div className="text-right">
                  {subscription.status === 'active' ? (
                    <button
                      onClick={handleCancelSubscription}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      {t('plans.cancellation.cancel_button')}
                    </button>
                  ) : subscription.status === 'canceled' ? (
                    <button
                      onClick={handleReactivateSubscription}
                      className="text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      style={{ backgroundColor: colors.tint }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      {t('plans.cancellation.reactivate_button')}
                    </button>
                  ) : null}
                </div>
              )}
            </div>

            {/* {t('plans.subscription_details')} */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5" style={{ color: colors.textSecondary }} />
                <div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>{t('plans.subscription_info.start_date')}</p>
                  <p className="font-medium" style={{ color: colors.text }}>
                    {new Date(subscription.startDate).toLocaleDateString(getLocale())}
                  </p>
                </div>
              </div>

              {subscription.nextBillingDate && (
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-5 w-5" style={{ color: colors.textSecondary }} />
                  <div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>{t('plans.subscription_info.next_billing')}</p>
                    <p className="font-medium" style={{ color: colors.text }}>
                      {new Date(subscription.nextBillingDate).toLocaleDateString(getLocale())}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5" style={{ color: colors.textSecondary }} />
                <div>
                  <p className="text-sm" style={{ color: colors.textSecondary }}>{t('plans.subscription_info.auto_renew')}</p>
                  <p className="font-medium" style={{ color: colors.text }}>
                    {subscription.autoRenew ? t('plans.subscription_info.enabled') : t('plans.subscription_info.disabled')}
                  </p>
                </div>
              </div>
            </div>

            {/* {t('plans.premium_status_details')} */}
            {isPremium && premiumStatus && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="w-full">
                    <p className="text-sm font-medium text-green-800">
                      {premiumStatus.type === 'paid' && t('plans.premium_status.subscription_active')}
                      {premiumStatus.type === 'trial' && t('plans.premium_status.trial_active')}
                      {premiumStatus.type === 'referral_credit' && t('plans.premium_status.referral_credit_active')}
                    </p>
                    <div className="text-sm text-green-700 mt-1 space-y-1">
                      {premiumStatus.expiresAt && (
                        <p>
                          {premiumStatus.type === 'trial'
                            ? t('plans.premium_status.trial_expires_at')
                            : t('plans.premium_status.expiry_time', { date: new Date(premiumStatus.expiresAt).toLocaleDateString(getLocale()) })
                          }
                          {premiumStatus.type === 'trial' && (
                            <span className="ml-1 font-medium">
                              {new Date(premiumStatus.expiresAt).toLocaleDateString(getLocale())}
                            </span>
                          )}
                        </p>
                      )}
                      {premiumStatus.store && premiumStatus.store !== 'system' && (
                        <p>{t('plans.premium_status.subscription_source', { source: premiumStatus.store === 'APP_STORE' ? t('plans.premium_status.app_store') : premiumStatus.store === 'GOOGLE_PLAY' ? t('plans.premium_status.google_play') : premiumStatus.store })}</p>
                      )}
                      {premiumStatus.referralCreditDays && (
                        <p>{t('plans.premium_status.referral_credit_remaining', { days: premiumStatus.referralCreditDays })}</p>
                      )}
                      {premiumStatus.willRenew ? (
                        <p className="text-green-600">{t('plans.premium_status.auto_renew_enabled')}</p>
                      ) : (
                        <p className="text-yellow-600">{t('plans.premium_status.auto_renew_disabled')}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Free trial status for non-premium users (trial expired) */}
            {!isPremium && premiumStatus?.expiresAt && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      {t('plans.premium_status.trial_expired_notice')}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {new Date(premiumStatus.expiresAt).toLocaleDateString(getLocale())}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* {t('plans.cancel_subscription_tips')} */}
            {subscription.status === 'canceled' && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{t('plans.cancellation.cancelled_notice')}</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      {t('plans.cancellation.cancelled_description', {
                        date: subscription.nextBillingDate
                          ? new Date(subscription.nextBillingDate).toLocaleDateString(getLocale())
                          : t('plans.cancellation.current_billing_cycle_end')
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* {t('plans.subscription_plans')} - 完全仿照 landing page 的 pricing section */}
        <div className="py-12 bg-gray-50 rounded-lg">
          <div className="container mx-auto px-4 md:px-6">

            {/* {t('plans.plan_cards')} */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
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
                        ? 'border-2 ring-4 ring-offset-2'
                        : 'border border-gray-200 hover:border-gray-300'
                    } ${isCurrent ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                    style={{
                      borderColor: isSelected ? colors.tint : undefined,
                      '--tw-ring-color': isSelected ? `${colors.tint}33` : undefined,
                    } as React.CSSProperties}
                  >
                    {/* {t('plans.selected_indicator')} */}
                    {isSelected && !isCurrent && (
                      <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.tint }}>
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}

                    {/* {t('plans.current_plan_badge')} */}
                    {isCurrent && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                          <Crown className="w-4 h-4" />
                          {t('pricing.badges.current')}
                        </span>
                      </div>
                    )}

                    {/* {t('plans.upgrade_badge')} */}
                    {isUpgrade && !isSelected && (
                      <div className="absolute -top-4 right-4">
                        <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {t('pricing.badges.upgrade_label')}
                        </span>
                      </div>
                    )}

                    {/* {t('plans.popular_badge')} */}
                    {plan.isPopular && !isCurrent && !isUpgrade && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg" style={{ backgroundColor: colors.tint }}>
                          {t('pricing.badges.popular')}
                        </span>
                      </div>
                    )}

                    {/* {t('plans.trial_badge')} */}
                    {(plan as any).isTrial && !isCurrent && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                          <CheckCircle className="w-4 h-4" />
                          {t('pricing.badges.trial')}
                        </span>
                      </div>
                    )}

                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold" style={{ color: colors.text }}>{plan.price}</span>
                        <span className="text-gray-500 ml-2">/{plan.period}</span>
                      </div>

                      {/* {t('plans.yearly_discount')} */}
                      {plan.id === 'yearly' && (
                        <div className="mb-6">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            {t('pricing.descriptions.yearly_discount')}
                          </span>
                        </div>
                      )}

                      <ul className="space-y-4 text-left">
                        {plan.features.map((feature, index) => {
                          // 为年度订阅的独有功能添加特殊样式
                          const isYearlyExclusiveFeature = plan.id === 'yearly' && (
                            (t('plans.feature_highlights.yearly_exclusive', { returnObjects: true }) as string[]).some(exclusiveFeature => feature.includes(exclusiveFeature))
                          );

                          // 为试用、月度和年度订阅的高级功能添加特殊样式
                          const isPremiumFeature = (plan.id === 'monthly' || plan.id === 'yearly') && (
                            (t('plans.feature_highlights.premium_features', { returnObjects: true }) as string[]).some(premiumFeature => feature.includes(premiumFeature))
                          );

                          const shouldHighlight = isYearlyExclusiveFeature || isPremiumFeature;

                          return (
                            <li key={index} className="flex items-start gap-3">
                              <CheckCircle className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                                shouldHighlight ? 'text-green-500' : ''
                              }`} style={{ color: shouldHighlight ? '#10b981' : colors.tint }} />
                              <span className={`text-sm ${
                                shouldHighlight
                                  ? 'font-medium'
                                  : ''
                              }`} style={{
                                color: shouldHighlight ? colors.text : colors.textSecondary
                              }}>
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

            {/* {t('plans.unified_subscription_button')} */}
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
                ) : (
                  <button
                    onClick={() => {
                      // 这里应该集成实际的订阅功能
                      alert(t('plans.actions.upgrade_to', { plan: selectedPlanData.name }));
                    }}
                    className="w-full text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg hover:opacity-90"
                    style={{ backgroundColor: colors.tint }}
                  >
                    {getButtonText()}
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* {t('plans.refresh_status_button')} */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchPremiumStatus}
            className="transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.tint}
            onMouseLeave={(e) => e.currentTarget.style.color = colors.textSecondary}
            disabled={premiumLoading}
          >
            {premiumLoading ? t('plans.actions.refreshing') : t('plans.actions.refresh_subscription_status')}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}