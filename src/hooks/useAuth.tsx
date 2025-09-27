"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiService, LoginResponse, RegisterResponse } from '../lib/api';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt: string;
}

interface PremiumStatus {
  isPremium: boolean;
  source?: 'trial' | 'subscription';
  expiresAt?: string;
  planType?: 'monthly' | 'yearly';
  subscriptionId?: string;
}

interface AuthContextType {
  user: User | null;
  premiumStatus: PremiumStatus | null;
  isLoading: boolean;
  login: (email: string, password: string, preferredLanguage?: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, referralCode?: string, preferredLanguage?: string) => Promise<void>;
  logout: () => void;
  refreshPremiumStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从 cookie 中获取值的辅助函数
  const getCookie = useCallback((name: string): string | null => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }, []);

  // 设置 cookie 的辅助函数（支持跨子域名）
  const setCookie = useCallback((name: string, value: string, days: number = 30) => {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const isProduction = window.location.hostname.includes('dopamind.app');
    const domain = isProduction ? '.dopamind.app' : '';
    const secure = isProduction ? ';Secure' : '';

    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/${domain ? `;domain=${domain}` : ''};SameSite=Lax${secure}`;
  }, []);

  // 删除 cookie 的辅助函数
  const deleteCookie = useCallback((name: string) => {
    if (typeof document === 'undefined') return;
    const isProduction = window.location.hostname.includes('dopamind.app');
    const domain = isProduction ? '.dopamind.app' : '';
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/${domain ? `;domain=${domain}` : ''}`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('premiumStatus');

    deleteCookie('token');
    deleteCookie('user');
    deleteCookie('premiumStatus');

    setUser(null);
    setPremiumStatus(null);
  }, [deleteCookie]);

  const refreshPremiumStatus = useCallback(async (): Promise<void> => {
    const token = getCookie('token') || localStorage.getItem('token');
    if (!token) return;

    try {
      const storedPremium = getCookie('premiumStatus') || localStorage.getItem('premiumStatus');
      if (storedPremium) {
        const parsedPremium: PremiumStatus = JSON.parse(storedPremium);

        if (parsedPremium.source === 'trial' && parsedPremium.expiresAt) {
          const now = new Date();
          const expiryDate = new Date(parsedPremium.expiresAt);

          if (now > expiryDate) {
            const expiredStatus: PremiumStatus = { isPremium: false };
            setPremiumStatus(expiredStatus);
            const expiredJson = JSON.stringify(expiredStatus);
            localStorage.setItem('premiumStatus', expiredJson);
            setCookie('premiumStatus', expiredJson);
          } else {
            setPremiumStatus(parsedPremium);
          }
        } else {
          setPremiumStatus(parsedPremium);
        }
      }
    } catch (error) {
      console.error('获取 premium 状态失败:', error);
    }
  }, [getCookie, setCookie]);

  // 初始化时从 localStorage 和 cookie 恢复用户状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = getCookie('token') || localStorage.getItem('token');
        const userData = getCookie('user') || localStorage.getItem('user');
        const premiumData = getCookie('premiumStatus') || localStorage.getItem('premiumStatus');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          if (premiumData) {
            const parsedPremium = JSON.parse(premiumData);
            setPremiumStatus(parsedPremium);
          }

          try {
            const response = await apiService.getProfile(token);
            if (response.user) {
              setUser(response.user);
              const userJson = JSON.stringify(response.user);
              localStorage.setItem('user', userJson);
              setCookie('user', userJson);
            }

            await refreshPremiumStatus();
          } catch (error) {
            console.error('Token 验证失败:', error);
            logout();
          }
        }
      } catch (error) {
        console.error('初始化认证状态时出错:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [getCookie, setCookie, refreshPremiumStatus, logout]);

  const login = async (email: string, password: string, preferredLanguage?: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await apiService.login(email, password, preferredLanguage);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setCookie('token', response.token);
      setCookie('user', JSON.stringify(response.user));

      setUser(response.user);

      await refreshPremiumStatus();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    nickname: string,
    referralCode?: string,
    preferredLanguage?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response: RegisterResponse = await apiService.register(email, password, nickname, referralCode, preferredLanguage);

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setCookie('token', response.token);
      setCookie('user', JSON.stringify(response.user));

      setUser(response.user);

      const trialPremium: PremiumStatus = {
        isPremium: true,
        source: 'trial',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };
      setPremiumStatus(trialPremium);
      const premiumJson = JSON.stringify(trialPremium);
      localStorage.setItem('premiumStatus', premiumJson);
      setCookie('premiumStatus', premiumJson);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    premiumStatus,
    isLoading,
    login,
    register,
    logout,
    refreshPremiumStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
