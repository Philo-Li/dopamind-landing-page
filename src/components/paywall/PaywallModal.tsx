'use client'

import { useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { useThemeColors } from '@/hooks/useThemeColor'
import { useLocalization } from '@/hooks/useLocalization'

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToPlans: () => void
  hasEverPaid?: boolean
}

export function PaywallModal({
  isOpen,
  onClose,
  onNavigateToPlans,
  hasEverPaid = false
}: PaywallModalProps) {
  const colors = useThemeColors()
  const { t } = useLocalization()
  const [container, setContainer] = useState<HTMLElement | null>(() => {
    if (typeof document === 'undefined') {
      return null
    }
    return document.querySelector('[data-paywall-container]') as HTMLElement | null
  })

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const target = document.querySelector('[data-paywall-container]') as HTMLElement | null
    setContainer(target)
  }, [])

  const handleUpgradeClick = () => {
    onClose()
    onNavigateToPlans()
  }

  const title = useMemo(
    () => hasEverPaid ? t('paywall.membership_expired_title') : t('paywall.trial_expired_title'),
    [hasEverPaid, t]
  )

  const description = useMemo(
    () => hasEverPaid ? t('paywall.membership_expired_description') : t('paywall.trial_expired_description'),
    [hasEverPaid, t]
  )

  const premiumBadge = t('paywall.premium_badge')
  const premiumNotice = t('paywall.web_only_notice')
  const upgradeLabel = t('paywall.actions.view_plans')

  if (!isOpen) {
    return null
  }

  const overlayPosition = container ? 'absolute' : 'fixed'

  const modal = (
    <div className={`${overlayPosition} inset-0 z-50 flex items-center justify-center`}>
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleUpgradeClick}
      />

      {/* 弹窗内容 */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 p-6"
        style={{ backgroundColor: colors.card.background }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              {premiumBadge}
            </span>

            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <div className="w-full rounded-lg border border-orange-200 dark:border-orange-400/40 bg-orange-50 dark:bg-orange-500/10 px-4 py-3 text-sm text-orange-700 dark:text-orange-100">
            {premiumNotice}
          </div>

          <Button
            onClick={handleUpgradeClick}
            className="w-full bg-dopamind-500 hover:bg-dopamind-600 text-white"
          >
            {upgradeLabel}
          </Button>
        </div>
      </div>
    </div>
  )

  if (container) {
    return createPortal(modal, container)
  }

  return modal
}
