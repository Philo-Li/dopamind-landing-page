"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    setLoading(false);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = "/";
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>;
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          仪表板
        </Link>
        <span className="text-sm text-gray-600">
          {user.nickname}
        </span>
        <button
          onClick={handleSignOut}
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
        className="text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        登录
      </Link>
      <Link
        href="/register"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
      >
        注册
      </Link>
    </div>
  );
}