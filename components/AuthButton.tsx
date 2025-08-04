"use client";

import Link from "next/link";
import { useAuth } from "../src/hooks/useAuth";
import { getTranslation, type Locale } from "../src/lib/i18n";

interface AuthButtonProps {
  locale: string;
}

export default function AuthButton({ locale }: AuthButtonProps) {
  const { user, isLoading, logout } = useAuth();
  const t = getTranslation(locale as Locale);

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          {t.auth.dashboard}
        </Link>
        <span className="text-sm text-muted">
          {user.nickname}
        </span>
        <button
          onClick={logout}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          {t.auth.logout}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href={`/${locale}/login`}
        className="text-sm font-medium text-muted hover:text-foreground"
      >
        {t.auth.login}
      </Link>
      <Link
        href={`/${locale}/register`}
        className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        {t.auth.register}
      </Link>
    </div>
  );
}