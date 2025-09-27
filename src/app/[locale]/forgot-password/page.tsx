"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { getTranslation, type Locale } from "@/lib/i18n";
import { apiService } from "../../../lib/api";

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export default function ForgotPasswordPage({ params }: ForgotPasswordPageProps) {
  const { locale: localeParam } = use(params);
  const locale = localeParam as Locale;
  const t = getTranslation(locale);
  
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      await apiService.forgotPassword(email);
      setIsSuccess(true);
      setMessage(t.forgotPassword.emailSent);
    } catch (error) {
      setIsSuccess(false);
      if (error instanceof Error) {
        if (error.message.includes('No account found') || error.message.includes('404')) {
          setMessage(t.forgotPassword.emailNotFound);
        } else {
          setMessage(error.message);
        }
      } else {
        setMessage(t.forgotPassword.error);
      }
    } finally {
      setIsLoading(false);
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
            {t.forgotPassword.title}
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            {t.forgotPassword.subtitle}
          </p>
        </div>

        {!isSuccess ? (
          <form className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                {t.forgotPassword.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-foreground rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder={t.forgotPassword.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {message && (
              <div className={`text-sm text-center ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t.forgotPassword.sending : t.forgotPassword.sendButton}
              </button>
            </div>

            <div className="text-center">
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:text-primary-600"
              >
                {t.forgotPassword.backToLogin}
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6 bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="text-green-600 text-sm mb-4">
                {message}
              </div>
              <Link
                href={`/${locale}/login`}
                className="font-medium text-primary hover:text-primary-600"
              >
                {t.forgotPassword.backToLogin}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

