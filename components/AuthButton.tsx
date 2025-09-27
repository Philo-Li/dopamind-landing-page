"use client";

import Link from "next/link";
import { useAuth } from "../src/hooks/useAuth";
import { getTranslation, type Locale } from "../src/lib/i18n";

interface AuthButtonProps {
  locale: string;
}

export default function AuthButton({ locale }: AuthButtonProps) {
  const { user, logout } = useAuth();
  const t = getTranslation(locale as Locale);

  if (user) {
    const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || "https://web.dopamind.app";
    return (
      <div className="flex items-center space-x-4">
        <a
          href={`${webAppUrl}/dashboard`}
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          {t.auth.dashboard}
        </a>
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
