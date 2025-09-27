'use client'

import { useEffect } from 'react'
import { PaywallModal } from './PaywallModal'
import { usePaywall } from '@/hooks/usePaywall'
import { useRouter, usePathname } from 'next/navigation'

export function GlobalPaywall() {
  const {
    isPaywallOpen,
    shouldShowPaywall,
    hasEverPaid,
    showPaywall,
    hidePaywall,
    navigateToPlans
  } = usePaywall()

  const pathname = usePathname()

  useEffect(() => {
    // 排除不需要付费墙的页面
    const excludedPaths = [
      '/login',
      '/register',
      '/plans',
      '/',
    ]

    // 如果在排除的页面，不显示付费墙
    if (excludedPaths.some(path => pathname === path || pathname.startsWith(path))) {
      return
    }

    // 如果需要显示付费墙且当前未显示，则显示
    if (shouldShowPaywall && !isPaywallOpen) {
      showPaywall()
    }
  }, [pathname, shouldShowPaywall, isPaywallOpen, showPaywall])

  return (
    <PaywallModal
      isOpen={isPaywallOpen}
      onClose={hidePaywall}
      onNavigateToPlans={navigateToPlans}
      hasEverPaid={hasEverPaid}
    />
  )
}