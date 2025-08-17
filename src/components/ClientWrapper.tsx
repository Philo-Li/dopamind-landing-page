"use client";

import { AuthProvider } from '../hooks/useAuth';
import { PremiumProvider } from '../hooks/usePremium';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PremiumProvider>
        {children}
      </PremiumProvider>
    </AuthProvider>
  );
}