"use client";

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { apiService, PremiumStatus } from '../lib/api';

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
    const token = localStorage.getItem('token');
    if (!token) {
      setPremiumStatus(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const status = await apiService.getPremiumStatus(token);
      
      // Convert expiresAt string to Date if it exists
      if (status.expiresAt && typeof status.expiresAt === 'string') {
        status.expiresAt = new Date(status.expiresAt);
      }
      
      setPremiumStatus(status);
    } catch (err) {
      console.error('Failed to fetch premium status:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch premium status');
      setPremiumStatus(null);
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