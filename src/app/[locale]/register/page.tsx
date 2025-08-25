"use client";

import { useState, Suspense, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../hooks/useAuth";
import { getTranslation, type Locale } from "../../../lib/i18n";

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

function RegisterForm({ locale }: { locale: Locale }) {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = getTranslation(locale);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t.register.errors.passwordMismatch);
      return;
    }

    if (password.length < 6) {
      setError(t.register.errors.passwordTooShort);
      return;
    }

    if (!nickname.trim()) {
      setError(t.register.errors.nicknameEmpty);
      return;
    }

    if (nickname.trim().length > 20) {
      setError(t.register.errors.nicknameTooLong);
      return;
    }

    try {
      // 将当前语言作为 preferredLanguage 传递给注册接口
      await register(email, password, nickname.trim(), referralCode.trim() || undefined, locale);
      
      // 检查是否需要跳转到支付流程
      const redirectTo = searchParams.get('redirect_to');
      const planId = searchParams.get('plan_id');
      const planName = searchParams.get('plan_name');
      const planPrice = searchParams.get('plan_price');
      const planPeriod = searchParams.get('plan_period');
      
      if (redirectTo === 'payment' && planId) {
        // 注册成功后，自动触发支付流程
        // 给一个短暂的延迟确保用户认证状态已更新
        setTimeout(async () => {
          try {
            // 获取当前语言并构建回调URL
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
            const currentLocale = locale;
            const successUrl = `${baseUrl}/${currentLocale}/success?session_id={CHECKOUT_SESSION_ID}`;
            const cancelUrl = `${baseUrl}/${currentLocale}/cancelled`;
            
            console.log('Register page sending URLs:', {
              success_url: successUrl,
              cancel_url: cancelUrl,
              currentLocale
            });
            
            // 根据 planId 确定计划类型
            const planType = planId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRODUCT_ID ? 'monthly' : 'yearly';
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-checkout-session`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
              },
              body: JSON.stringify({ 
                plan: planType,
                currency: 'usd',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                  planId: planId,
                  planName: planName,
                  planPrice: planPrice,
                  planPeriod: planPeriod,
                  locale: currentLocale
                }
              }),
            });
            
            if (response.ok) {
              const { sessionId } = await response.json();
              
              // 重定向到 Stripe Checkout
              const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!));
              if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId });
                if (error) {
                  console.error('Stripe redirect error:', error);
                  router.push(`/${locale}/pricing?selected_plan=${planId}`);
                }
              }
            } else {
              // 如果支付创建失败，跳转到定价页面让用户重试
              router.push(`/${locale}/pricing?selected_plan=${planId}`);
            }
          } catch (error) {
            console.error('Payment creation failed after registration:', error);
            router.push(`/${locale}/pricing?selected_plan=${planId}`);
          }
        }, 1000);
        
        // 先显示一个loading页面
        router.push('/payment-processing');
        return;
      }
      
      // 默认跳转到仪表板
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "注册过程中出现错误");
    }
  };

  return (
    <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="nickname" className="sr-only">
            {t.register.nickname}
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder={`${t.register.nickname} (最多20个字符)`}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            {t.register.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder={t.register.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            {t.register.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder={`${t.register.password} (至少6位)`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            {t.register.confirmPassword}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder={t.register.confirmPassword}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="referralCode" className="sr-only">
            {t.register.referralCode}
          </label>
          <input
            id="referralCode"
            name="referralCode"
            type="text"
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder={t.register.referralCode}
            value={referralCode}
            onChange={(e) => setReferralCode(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm text-center">{error}</div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t.register.registering : t.register.registerButton}
        </button>
      </div>

      <div className="text-center">
        <Link
          href={`/${locale}`}
          className="font-medium text-primary hover:text-primary-600"
        >
          {t.register.backToHome}
        </Link>
      </div>
    </form>
  );
}

export default function RegisterPage({ params }: RegisterPageProps) {
  const { locale: localeParam } = use(params);
  const locale = localeParam as Locale;
  const t = getTranslation(locale);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <div className="flex justify-center mb-6">
            <Link href={`/${locale}`} className="flex items-center gap-3">
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
            {t.register.title}
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            {t.register.or}{" "}
            <Link
              href={`/${locale}/login`}
              className="font-medium text-primary hover:text-primary-600"
            >
              {t.register.alreadyHaveAccount}
            </Link>
          </p>
        </div>
        <Suspense fallback={<div className="text-center">加载中...</div>}>
          <RegisterForm locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}