"use client";

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { differenceInDays } from 'date-fns';
import { CheckCircle, Gift } from 'lucide-react';
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

export default function PricingSection({ locale }: PricingSectionProps) {
  const { user, premiumStatus } = useAuth();
  const router = useRouter();
  const t = getTranslation(locale);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

  const handleTrialStart = () => {
    if (!user) {
      // 如果用户未登录，跳转到注册页面
      router.push('/register');
    } else {
      // 如果用户已登录但没有试用过，开始试用
      // 这里应该调用 API 来激活试用
      console.log('Starting trial for user:', user.id);
      alert('7天免费试用已激活！请前往仪表板开始使用。');
      router.push('/dashboard');
    }
  };

  const plans: Plan[] = [
    {
      id: 'trial',
      name: '7天 Premium 体验',
      price: '￥0',
      period: '7天',
      buttonText: '开始7天免费体验',
      isTrial: true,
      features: [
        'AI 对话式规划 (像聊天一样安排一切)',
        '沉浸式专注圣所 (屏蔽干扰，进入心流状态)',
        'AI 智能拆解 (将复杂项目分解为小步骤)',
        '多设备云端同步 (所有数据，永不丢失)',
        '可视化成长报告 (用热力图见证进步)',
        '全能生活管家 (习惯、冰箱、订阅一站管理)',
        '一对一 AI 教练支持 (获得个性化策略)'
      ]
    },
    {
      id: 'monthly',
      name: '月度 Premium',
      priceId: 'price_monthly_placeholder',
      price: '￥79',
      period: '每月',
      buttonText: '立即订阅月度计划',
      features: [
        'AI 对话式规划 (像聊天一样安排一切)',
        '沉浸式专注圣所 (屏蔽干扰，进入心流状态)',
        'AI 智能拆解 (将复杂项目分解为小步骤)',
        '多设备云端同步 (所有数据，永不丢失)',
        '可视化成长报告 (用热力图见证进步)',
        '全能生活管家 (习惯、冰箱、订阅一站管理)',
        '一对一 AI 教练支持 (获得个性化策略)',
        '新功能抢先体验权 (第一时间试用黑科技)'
      ]
    },
    {
      id: 'yearly',
      name: '年度 Premium',
      priceId: 'price_yearly_placeholder', 
      price: '￥799',
      period: '每年',
      buttonText: '立即订阅年度计划',
      isPopular: true,
      features: [
        'AI 对话式规划 (像聊天一样安排一切)',
        '沉浸式专注圣所 (屏蔽干扰，进入心流状态)',
        'AI 智能拆解 (将复杂项目分解为小步骤)',
        '多设备云端同步 (所有数据，永不丢失)',
        '可视化成长报告 (用热力图见证进步)',
        '全能生活管家 (习惯、冰箱、订阅一站管理)',
        '一对一 AI 教练支持 (获得个性化策略)',
        '新功能抢先体验权 (第一时间试用黑科技)',
        '省下 2 个月费用 (相当于 88 折)',
        '专属会员社群 (与高效人士交流心得)'
      ]
    }
  ];

  const renderHeader = () => {
    // 状态 1: 未登录用户（新访客）
    if (!user) {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
            {t.home.pricing.title}
          </h2>
          <p className="text-lg text-muted md:text-xl">
            {t.home.pricing.subtitle}
          </p>
          <div className="mt-2 inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            💎 新用户注册即享 7 天免费试用
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
            您的 Premium 试用还剩 {daysLeft} 天
          </h2>
          <p className="text-lg text-muted md:text-xl">
            立即订阅，确保在试用结束后无缝衔接您的所有高级功能。继续享受 AI 智能建议、无限任务管理等强大功能。
          </p>
          <div className="mt-2 inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
            ⏰ 试用即将结束，立即升级享受持续服务
          </div>
        </>
      );
    }

    // 状态 3: 已付费用户
    if (user && premiumStatus?.isPremium && premiumStatus?.source === 'subscription') {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
            您已是 Premium 会员
          </h2>
          <p className="text-lg text-muted md:text-xl">
            感谢您的支持！您正在享受 Dopamind 的全部高级功能。如需更改订阅计划，请联系客服。
          </p>
          <div className="mt-2 inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            ✨ Premium 会员 - 享受全部功能
          </div>
        </>
      );
    }

    // 状态 4: 试用已结束的免费用户
    if (user && !premiumStatus?.isPremium) {
      return (
        <>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
            您的免费试用已结束
          </h2>
          <p className="text-lg text-muted md:text-xl">
            升级到 Premium，继续使用强大的 AI 功能来掌控您的生活。重新体验智能任务管理、专注模式等高级功能。
          </p>
          <div className="mt-2 inline-block bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
            🔒 升级解锁所有高级功能
          </div>
        </>
      );
    }

    // 默认状态
    return (
      <>
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl mb-4">
          {t.home.pricing.title}
        </h2>
        <p className="text-lg text-muted md:text-xl">
          {t.home.pricing.subtitle}
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
                {plans[2].features.map((feature, index) => (
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

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)!;

  return (
    <section id="pricing" className="w-full py-20 md:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          {renderHeader()}
        </div>
        
        {/* 定价卡片 */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative bg-white rounded-3xl p-8 shadow-lg cursor-pointer transition-all hover:shadow-xl ${
                selectedPlan === plan.id
                  ? 'border-2 border-primary ring-4 ring-primary/20'
                  : 'border border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* 选中指示器 */}
              {selectedPlan === plan.id && (
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}

              {/* 推荐标签 */}
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                    最受欢迎
                  </span>
                </div>
              )}

              {/* 试用标签 */}
              {plan.isTrial && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
                    <Gift className="w-4 h-4" />
                    免费试用
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
                      省下 2 个月费用 (相当于 88 折)
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
          ))}
        </div>

        {/* 统一的订阅按钮 */}
        <div className="text-center">
          <div className="max-w-md mx-auto">
            {selectedPlanData.isTrial ? (
              <button 
                onClick={handleTrialStart}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg"
              >
                {selectedPlanData.buttonText}
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
              />
            ) : (
              <Link 
                href="/register" 
                className="w-full inline-block bg-primary hover:bg-primary-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-colors shadow-lg text-center"
              >
                {selectedPlanData.buttonText}
              </Link>
            )}
            
            <p className="text-sm text-muted mt-4">
              {selectedPlanData.isTrial 
                ? "无需信用卡，立即体验完整 Premium 功能"
                : selectedPlanData.id === 'yearly'
                ? "年付专享特权 • 随时取消 • 省下 158 元 • 专属教练"
                : "包含核心功能 • 随时取消 • 安全支付"
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}