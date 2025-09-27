"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLandingTranslation, type Locale } from "@/lib/i18n";

interface AuthButtonProps {
  locale: string;
}

export default function AuthButton({ locale }: AuthButtonProps) {
  const { user, logout } = useAuth();
  const t = getLandingTranslation(locale as Locale);

  const labels = useMemo(() => ({
    dashboard: t.navigation?.dashboard ?? "Dashboard",
    logout: t.sidebar?.settings?.logout ?? "Log Out",
    login: t.auth?.login?.login_button ?? "Log In",
    register: t.auth?.register?.register_button ?? "Sign Up",
  }), [t]);

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {labels.dashboard}
        </Link>
        <span className="text-sm text-muted-foreground">
          {user.nickname}
        </span>
        <button
          onClick={logout}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          {labels.logout}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href={`/${locale}/login`}
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        {labels.login}
      </Link>
      <Link
        href={`/${locale}/register`}
        className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        {labels.register}
      </Link>
    </div>
  );
}
