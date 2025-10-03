'use client'

import { useEffect } from 'react'
import { PaywallModal } from './PaywallModal'
import { usePaywall } from '@/hooks/usePaywall'
import { usePathname } from 'next/navigation'

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
    if (!pathname || !shouldShowPaywall) {
      return
    }

    const paywalledPaths = [
      '/chat',
      '/tasks',
      '/calendar',
      '/focus',
      '/fridge',
      '/habits',
      '/subscription-tracker',
    ]

    const isPaywalledPath = paywalledPaths.some(path => {
      return pathname === path || pathname.startsWith(`${path}/`)
    })

    if (!isPaywalledPath) {
      return
    }

    showPaywall()
  }, [pathname, shouldShowPaywall, showPaywall])

  return (
    <PaywallModal
      isOpen={isPaywallOpen}
      onClose={hidePaywall}
      onNavigateToPlans={navigateToPlans}
      hasEverPaid={hasEverPaid}
    />
  )
}
