"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";
import { getTranslation } from "../../lib/i18n";

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
  const fallback = `${trimmedBase}/dashboard`;

  if (!rawRedirect) {
    return fallback;
  }

  const decoded = fullyDecode(rawRedirect).trim();
  if (!decoded) {
    return fallback;
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

    if (decoded.startsWith("/")) {
      return `${trimmedBase}${decoded}`;
    }

    if (isAllowedHost) {
      return candidate.toString();
    }
  } catch (error) {
    console.warn("Invalid redirect parameter ignored", error);
  }

  return fallback;
};

// 使用英文作为默认语言
const locale = 'en';
const t = getTranslation(locale);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const webAppBaseUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || "https://web.dopamind.app";

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

      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const userJson = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

      if (token && userJson) {
        const callbackUrl = new URL("/auth/callback", webAppBaseUrl);
        callbackUrl.searchParams.set("token", token);
        if (refreshToken) {
          callbackUrl.searchParams.set("refreshToken", refreshToken);
        }
        callbackUrl.searchParams.set("user", userJson);
        callbackUrl.searchParams.set("redirect", targetUrl);
        window.location.href = callbackUrl.toString();
        return;
      }

      window.location.href = targetUrl;
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during login");
    } finally {
      setIsSubmitting(false);
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
            {t.login.title}
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            {t.login.or}{" "}
            <Link
              href="/register"
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
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t.login.loggingIn : t.login.loginButton}
            </button>
          </div>

          <div className="text-center space-y-2">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-primary-600"
            >
              {t.login.forgotPassword}
            </Link>
            <div>
              <Link
                href="/"
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
