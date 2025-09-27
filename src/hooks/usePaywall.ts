'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { usePremium } from './usePremium'
import { storage } from '@/lib/utils'

export function usePaywall() {
  const [isPaywallOpen, setIsPaywallOpen] = useState(false)
  const { isPremium, premiumStatus } = usePremium()
  const router = useRouter()

  // 检查用户是否已付费过（基于历史订阅记录）
  const hasEverPaid = premiumStatus?.type === 'paid' || premiumStatus?.store !== undefined

  // 检查是否需要显示付费墙
  const shouldShowPaywall = useCallback(() => {
    // 检查用户是否已登录
    const token = storage.get('token')
    if (!token) {
      return false
    }

    // 检查用户是否已是会员
    if (isPremium) {
      return false
    }

    return true
  }, [isPremium])

  // 显示付费墙
  const showPaywall = useCallback(() => {
    if (shouldShowPaywall()) {
      setIsPaywallOpen(true)
    }
  }, [shouldShowPaywall])

  // 关闭付费墙
  const hidePaywall = useCallback(() => {
    setIsPaywallOpen(false)
  }, [])

  // 跳转到套餐页面
  const navigateToPlans = useCallback(() => {
    router.push('/plans')
  }, [router])

  // 检查功能权限并在需要时显示付费墙
  const checkAccess = useCallback((feature?: string) => {
    if (shouldShowPaywall()) {
      showPaywall()
      return false
    }
    return true
  }, [shouldShowPaywall, showPaywall])

  return {
    isPaywallOpen,
    shouldShowPaywall: shouldShowPaywall(),
    hasEverPaid,
    showPaywall,
    hidePaywall,
    navigateToPlans,
    checkAccess,
  }
}