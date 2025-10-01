'use client'

import { useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useLocalization } from '@/hooks/useLocalization'
import { normalizeLocale } from '@/lib/locale'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const { language } = useLocalization()
  const hasRedirectedRef = useRef(false)

  useEffect(() => {
    // 只在认证加载完成且无用户时才重定向
    if (!isLoading && !user && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true

      const currentUrl = window.location.href
      const locale = normalizeLocale(language)
      const loginUrl = `/${locale}/login?redirect=${encodeURIComponent(currentUrl)}`

      window.location.href = loginUrl
    }
  }, [user, isLoading, language])

  // 显示加载状态，等待认证初始化完成
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dopamind-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">正在验证登录状态...</p>
        </div>
      </div>
    )
  }

  // 等待重定向完成
  if (!user) {
    return null
  }

  return <>{children}</>
}
