"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../hooks/useAuth";
import { getTranslation, type Locale } from "../../../lib/i18n";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { locale: localeParam } = use(params);
  const locale = localeParam as Locale;
  const t = getTranslation(locale);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // 将当前语言作为 preferredLanguage 传递给登录接口
      await login(email, password, locale);
      // 跳转到仪表板
      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "登录过程中出现错误");
    }
  };

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
            {t.login.title}
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            {t.login.or}{" "}
            <Link
              href={`/${locale}/register`}
              className="font-medium text-primary hover:text-primary-600"
            >
              {t.login.createAccount}
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                {t.login.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t.login.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                {t.login.password}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t.login.password}
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
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t.login.loggingIn : t.login.loginButton}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href={`/${locale}/forgot-password`}
              className="text-sm font-medium text-primary hover:text-primary-600"
            >
              {t.login.forgotPassword}
            </Link>
            <div>
              <Link
                href={`/${locale}`}
                className="font-medium text-primary hover:text-primary-600"
              >
                {t.login.backToHome}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}