"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, LoginResponse, RegisterResponse } from '../lib/api';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
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
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  refreshPremiumStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从 localStorage 恢复用户状态
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        const premiumData = localStorage.getItem('premiumStatus');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          if (premiumData) {
            const parsedPremium = JSON.parse(premiumData);
            setPremiumStatus(parsedPremium);
          }
          
          // 验证 token 有效性并获取最新的用户和 premium 状态
          try {
            const response = await apiService.getProfile(token);
            if (response.user) {
              setUser(response.user);
              localStorage.setItem('user', JSON.stringify(response.user));
            }
            
            // 同时获取 premium 状态
            await refreshPremiumStatus();
          } catch (error) {
            console.error('Token 验证失败:', error);
            // Token 无效，清除本地存储
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
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const response: LoginResponse = await apiService.login(email, password);
      
      // 保存到 localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // 更新状态
      setUser(response.user);
      
      // 获取 premium 状态
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
    referralCode?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const response: RegisterResponse = await apiService.register(email, password, nickname, referralCode);
      
      // 保存到 localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // 更新状态
      setUser(response.user);
      
      // 新用户默认获得 7 天试用
      const trialPremium: PremiumStatus = {
        isPremium: true,
        source: 'trial',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 天后
      };
      setPremiumStatus(trialPremium);
      localStorage.setItem('premiumStatus', JSON.stringify(trialPremium));
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('premiumStatus');
    setUser(null);
    setPremiumStatus(null);
  };

  const refreshPremiumStatus = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // 这里应该调用获取 premium 状态的 API
      // const premiumResponse = await apiService.getPremiumStatus(token);
      // 暂时使用模拟数据
      
      // 检查是否有存储的 premium 状态
      const storedPremium = localStorage.getItem('premiumStatus');
      if (storedPremium) {
        const parsedPremium: PremiumStatus = JSON.parse(storedPremium);
        
        // 检查试用是否过期
        if (parsedPremium.source === 'trial' && parsedPremium.expiresAt) {
          const now = new Date();
          const expiryDate = new Date(parsedPremium.expiresAt);
          
          if (now > expiryDate) {
            // 试用过期
            const expiredStatus: PremiumStatus = {
              isPremium: false,
            };
            setPremiumStatus(expiredStatus);
            localStorage.setItem('premiumStatus', JSON.stringify(expiredStatus));
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