"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";

function RegisterForm() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("密码不匹配");
      return;
    }

    if (password.length < 6) {
      setError("密码至少需要6位字符");
      return;
    }

    if (!nickname.trim()) {
      setError("昵称不能为空");
      return;
    }

    if (nickname.trim().length > 20) {
      setError("昵称长度不能超过20个字符");
      return;
    }

    try {
      await register(email, password, nickname.trim(), referralCode.trim() || undefined);
      
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
            // 根据 planId 确定计划类型
            const planType = planId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'monthly' : 'yearly';
            
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/create-checkout-session`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
              },
              body: JSON.stringify({ 
                plan: planType,
                currency: 'usd',
                metadata: {
                  planId: planId,
                  planName: planName,
                  planPrice: planPrice,
                  planPeriod: planPeriod
                }
              }),
            });
            
            if (response.ok) {
              const { url } = await response.json();
              window.location.href = url; // 直接跳转到 Stripe 支付页面
            } else {
              // 如果支付创建失败，跳转到定价页面让用户重试
              router.push(`/pricing?selected_plan=${planId}`);
            }
          } catch (error) {
            console.error('Payment creation failed after registration:', error);
            router.push(`/pricing?selected_plan=${planId}`);
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
            昵称
          </label>
          <input
            id="nickname"
            name="nickname"
            type="text"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="昵称 (最多20个字符)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">
            邮箱地址
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="sr-only">
            密码
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="密码 (至少6位)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="sr-only">
            确认密码
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="确认密码"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="referralCode" className="sr-only">
            推荐码
          </label>
          <input
            id="referralCode"
            name="referralCode"
            type="text"
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
            placeholder="推荐码 (可选)"
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
          {isLoading ? "注册中..." : "注册"}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/"
          className="font-medium text-primary hover:text-primary-600"
        >
          返回首页
        </Link>
      </div>
    </form>
  );
}

export default function RegisterPage() {
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
            <Link href="/" className="flex items-center gap-3">
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
            创建新账户
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            或{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-600"
            >
              登录现有账户
            </Link>
          </p>
        </div>
        <Suspense fallback={<div className="text-center">加载中...</div>}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}