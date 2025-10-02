"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";
import { getLandingTranslation, type Locale } from "@/lib/i18n";

const fullyDecode = (raw: string): string => {
  let current = raw;
  while (true) {
    try {
      const next = decodeURIComponent(current);
      if (next === current) {
        return current;
      }
      current = next;
    } catch {
      return current;
    }
  }
};

const sanitizeRedirectTarget = (rawRedirect: string | null, baseUrl: string): string => {
  const trimmedBase = baseUrl.replace(/\/$/, "");
  const fallback = `${trimmedBase}/chat`;

  if (!rawRedirect) {
    return fallback;
  }

  const decoded = fullyDecode(rawRedirect).trim();
  if (!decoded) {
    return fallback;
  }

  if (decoded.startsWith("/")) {
    return `${trimmedBase}${decoded}`;
  }

  try {
    const baseForUrl = new URL(`${trimmedBase}/`);
    const candidate = new URL(decoded, baseForUrl);
    const baseHost = baseForUrl.hostname;
    const candidateHost = candidate.hostname;
    const hostParts = baseHost.split(".");
    const allowedSuffix = hostParts.length >= 2 ? hostParts.slice(-2).join(".") : baseHost;

    const isAllowedHost =
      candidateHost === baseHost ||
      candidateHost === allowedSuffix ||
      candidateHost.endsWith(`.${allowedSuffix}`);

    if (isAllowedHost) {
      return candidate.toString();
    }
  } catch (error) {
    console.warn("Invalid redirect parameter ignored", error);
  }

  return fallback;
};

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { locale: localeParam } = use(params);
  const locale = localeParam as Locale;
  const t = getLandingTranslation(locale);
  const loginCopy = t?.login ?? {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, user, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const webAppBaseUrl = typeof window !== "undefined" ? window.location.origin : "";

  // 如果用户已登录，重定向到 /chat
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/chat');
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // 将当前语言作为 preferredLanguage 传递给登录接口
      await login(email, password, locale);

      const redirectParam = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null;
      const targetUrl = sanitizeRedirectTarget(redirectParam, webAppBaseUrl);

      // 使用 router.push 进行客户端导航，避免完整页面刷新
      window.location.href = targetUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : "登录过程中出现错误");
      setIsSubmitting(false);
    }
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-marketing-background relative overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-marketing-textSecondary">{loginCopy.loading || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // 如果已登录，显示重定向提示
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-marketing-background relative overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-marketing-textSecondary">{loginCopy.redirecting || 'Redirecting...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-marketing-heroBgFrom to-marketing-heroBgTo relative overflow-hidden">
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
              <span className="text-2xl font-bold text-marketing-foreground">Dopamind</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-marketing-foreground">
            {loginCopy.title ?? 'Sign in to your account'}
          </h2>
          <p className="mt-4 text-center text-sm text-marketing-textSecondary">
            {loginCopy.or ?? 'Or'}{' '}
            <Link
              href={`/${locale}/register`}
              className="font-medium text-primary hover:opacity-80"
            >
              {loginCopy.createAccount ?? 'create a new account'}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-marketing-cardBg p-8 rounded-xl shadow-lg border border-marketing-border" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {loginCopy.email ?? 'Email address'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder:text-marketing-textSecondary text-marketing-foreground bg-marketing-background rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={loginCopy.email ?? 'Email address'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {loginCopy.password ?? 'Password'}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder:text-marketing-textSecondary text-marketing-foreground bg-marketing-background rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={loginCopy.password ?? 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? loginCopy.loggingIn ?? 'Signing in...'
                : loginCopy.loginButton ?? 'Sign in'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href={`/${locale}/forgot-password`}
              className="text-sm font-medium text-primary hover:opacity-80"
            >
              {loginCopy.forgotPassword ?? 'Forgot your password?'}
            </Link>
            <div>
              <Link
                href={`/${locale}`}
                className="font-medium text-primary hover:opacity-80"
              >
                {loginCopy.backToHome ?? '← Back to Home'}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

