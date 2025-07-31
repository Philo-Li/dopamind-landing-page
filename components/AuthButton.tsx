"use client";

import Link from "next/link";
import { useAuth } from "../src/hooks/useAuth";

export default function AuthButton() {
  const { user, isLoading, logout } = useAuth();

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
          仪表板
        </Link>
        <span className="text-sm text-muted">
          {user.nickname}
        </span>
        <button
          onClick={logout}
          className="text-sm font-medium text-red-600 hover:text-red-700"
        >
          退出
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/login"
        className="text-sm font-medium text-muted hover:text-foreground"
      >
        登录
      </Link>
      <Link
        href="/register"
        className="bg-primary hover:bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        注册
      </Link>
    </div>
  );
}