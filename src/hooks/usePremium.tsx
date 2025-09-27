"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { settingsApi } from '@/lib/api';

export interface PremiumStatus {
  isPremium: boolean;
  type: 'free' | 'trial' | 'paid' | 'referral_credit';
  expiresAt?: Date;
  store?: 'APP_STORE' | 'GOOGLE_PLAY' | 'STRIPE';
  willRenew: boolean;
  referralCreditDays?: number;
}

interface PremiumContextType {
  premiumStatus: PremiumStatus | null;
  isPremium: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPremiumStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await settingsApi.getSettings();

      if (response.success && response.data) {
        // 模拟 Premium 状态数据，实际应该从 API 获取
        const mockStatus: PremiumStatus = {
          isPremium: (response.data as any)?.premiumStatus?.isPremium || false,
          type: (response.data as any)?.premiumStatus?.type || 'free',
          expiresAt: (response.data as any)?.premiumStatus?.expiresAt ? new Date((response.data as any).premiumStatus.expiresAt) : undefined,
          store: (response.data as any)?.premiumStatus?.store,
          willRenew: (response.data as any)?.premiumStatus?.willRenew || false,
          referralCreditDays: (response.data as any)?.premiumStatus?.referralCreditDays
        };

        setPremiumStatus(mockStatus);
      } else {
        // 默认免费用户状态
        setPremiumStatus({
          isPremium: false,
          type: 'free',
          willRenew: false
        });
      }
    } catch (err) {
      console.error('Failed to fetch premium status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch premium status');
      setPremiumStatus({
        isPremium: false,
        type: 'free',
        willRenew: false
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPremiumStatus();
  }, [fetchPremiumStatus]);

  const contextValue: PremiumContextType = {
    premiumStatus,
    isPremium: premiumStatus?.isPremium ?? false,
    loading,
    error,
    refetch: fetchPremiumStatus,
  };

  return (
    <PremiumContext.Provider value={contextValue}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}