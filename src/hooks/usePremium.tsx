"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useAuthOptional } from './useAuth';
import type { AuthContextType } from './useAuth';
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
  const auth = useAuthOptional();
  const authPremiumStatus = auth?.premiumStatus ?? null;
  const authLoading = auth?.isLoading ?? false;
  const refreshPremiumStatus = auth?.refreshPremiumStatus;
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const normalizePremiumStatus = useCallback(
    (status: AuthContextType['premiumStatus']): PremiumStatus | null => {
      if (!status) {
        return null;
      }

      let type: PremiumStatus['type'] = 'free';

      if (status.isPremium) {
        type = status.source === 'trial' ? 'trial' : 'paid';
      } else if (status.source === 'trial') {
        type = 'trial';
      }

      const normalized: PremiumStatus = {
        isPremium: status.isPremium,
        type,
        expiresAt: status.expiresAt ? new Date(status.expiresAt) : undefined,
        willRenew: status.source === 'subscription' && status.isPremium,
      };

      if (status.source === 'subscription') {
        normalized.store = 'STRIPE';
      }

      return normalized;
    },
    []
  );

  useEffect(() => {
    setPremiumStatus(normalizePremiumStatus(authPremiumStatus));
  }, [authPremiumStatus, normalizePremiumStatus]);

  useEffect(() => {
    if (auth) {
      setError(null);
    }
  }, [auth]);

  const fetchPremiumStatus = useCallback(async () => {
    if (!refreshPremiumStatus) {
      setError('Premium status is unavailable until authentication completes.');
      return;
    }

    setIsRefreshing(true);
    setError(null);

    try {
      await refreshPremiumStatus();
    } catch (err) {
      console.warn('Failed to refresh premium status:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh premium status');
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshPremiumStatus]);

  const loading = authLoading || isRefreshing || !auth;

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
