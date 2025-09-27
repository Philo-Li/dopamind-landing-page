'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { storage } from '@/lib/utils'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = storage.get('token')
      const user = storage.get('user')

      if (!token || !user) {
        // 构建重定向 URL
        const currentUrl = window.location.href
        const landingPageUrl = process.env.NEXT_PUBLIC_LANDING_PAGE_URL || 'https://dopamind.app'
        const loginUrl = `${landingPageUrl}/login?redirect=${encodeURIComponent(currentUrl)}`

        // 重定向到 dopamind.app 登录页面
        window.location.href = loginUrl
        return
      }

      setIsAuthenticated(true)
    }

    checkAuth()
  }, [])

  // 显示加载状态
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dopamind-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">正在验证登录状态...</p>
          <p className="mt-2 text-sm text-gray-500">如果您还未登录，即将跳转到登录页面</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}