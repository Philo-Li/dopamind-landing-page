"use client";

import { useState, use, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getLandingTranslation, type Locale } from "@/lib/i18n";
import { apiService } from "../../../lib/api";

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
}

function ResetPasswordContent({ locale, t }: { locale: Locale; t: ReturnType<typeof getLandingTranslation> }) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 验证输入
  const validateForm = () => {
    if (newPassword !== confirmPassword) {
      setMessage(t.resetPassword.passwordMismatch);
      return false;
    }
    if (newPassword.length < 6) {
      setMessage(t.resetPassword.passwordTooShort);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage(t.resetPassword.invalidToken);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await apiService.resetPassword(token, newPassword);
      setIsSuccess(true);
      setMessage(t.resetPassword.success);
    } catch (error) {
      setIsSuccess(false);
      if (error instanceof Error) {
        if (error.message.includes('invalid') || error.message.includes('expired') || error.message.includes('404')) {
          setMessage(t.resetPassword.invalidToken);
        } else {
          setMessage(error.message);
        }
      } else {
        setMessage(t.resetPassword.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 如果没有token，显示错误信息
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-marketing-heroBgFrom to-marketing-heroBgTo relative overflow-hidden">
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
              {t.resetPassword.title}
            </h2>
          </div>

          <div className="mt-8 space-y-6 bg-marketing-cardBg p-8 rounded-xl shadow-lg border border-marketing-border">
            <div className="text-center">
              <div className="text-red-600 text-sm mb-4">
                {t.resetPassword.invalidToken}
              </div>
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:opacity-80"
              >
                {t.resetPassword.goToLogin}
              </Link>
            </div>
          </div>
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
            {t.resetPassword.title}
          </h2>
          <p className="mt-2 text-center text-sm text-marketing-textSecondary">
            {t.resetPassword.subtitle}
          </p>
        </div>

        {!isSuccess ? (
          <form className="mt-8 space-y-6 bg-marketing-cardBg p-8 rounded-xl shadow-lg border border-marketing-border" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="newPassword" className="sr-only">
                  {t.resetPassword.newPassword}
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder:text-marketing-textSecondary text-marketing-foreground bg-marketing-background rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder={t.resetPassword.newPassword}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  {t.resetPassword.confirmNewPassword}
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder:text-marketing-textSecondary text-marketing-foreground bg-marketing-background rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder={t.resetPassword.confirmNewPassword}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {message && !isSuccess && (
              <div className="text-red-600 text-sm text-center">{message}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t.resetPassword.resetting : t.resetPassword.resetButton}
              </button>
            </div>

            <div className="text-center">
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:opacity-80"
              >
                {t.resetPassword.goToLogin}
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6 bg-marketing-cardBg p-8 rounded-xl shadow-lg border border-marketing-border">
            <div className="text-center">
              <div className="text-green-600 text-sm mb-4">
                {message}
              </div>
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:opacity-80"
              >
                {t.resetPassword.goToLogin}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { locale: localeParam } = use(params);
  const locale = localeParam as Locale;
  const t = getLandingTranslation(locale);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-marketing-heroBgFrom to-marketing-heroBgTo">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-marketing-textSecondary">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordContent locale={locale} t={t} />
    </Suspense>
  );
}

