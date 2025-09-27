'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { storage } from '@/lib/utils'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = () => {
      // 从 URL 参数中获取 token 和用户信息
      const token = searchParams.get('token')
      const refreshToken = searchParams.get('refreshToken')
      const userJson = searchParams.get('user')
      const redirect = searchParams.get('redirect')

      if (token && userJson) {
        try {
          // 解析用户信息
          const user = JSON.parse(decodeURIComponent(userJson))

          // 保存认证信息到本地存储
          storage.set('token', token)
          if (refreshToken) {
            storage.set('refreshToken', refreshToken)
          }
          storage.set('user', user)

          // 重定向到目标页面或 dashboard
          const targetUrl = redirect ? decodeURIComponent(redirect) : '/dashboard'

          // 清理 URL 参数，重定向到目标页面
          window.location.replace(targetUrl)
        } catch (error) {
          console.error('Failed to parse user data:', error)
          // 如果解析失败，重定向到首页
          router.push('/')
        }
      } else {
        // 如果没有必要的参数，重定向到首页
        console.error('Missing authentication parameters')
        router.push('/')
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dopamind-600 mx-auto"></div>
        <p className="mt-4 text-lg text-gray-600">登录成功，正在跳转...</p>
        <p className="mt-2 text-sm text-gray-500">请稍等，我们正在为您设置应用</p>
      </div>
    </div>
  )
}