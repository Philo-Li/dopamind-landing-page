import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './lib/i18n'

export function middleware(request: NextRequest) {
  // 检查路径是否已经包含语言前缀
  const pathname = request.nextUrl.pathname
  
  // 排除不需要多语言处理的路径
  const excludePaths = ['/login', '/register', '/dashboard', '/api']
  const shouldExclude = excludePaths.some(path => 
    pathname.startsWith(path) || pathname === path
  )
  
  if (shouldExclude) return
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // 如果没有语言前缀，根据 Accept-Language 头重定向
  const locale = getLocale(request) || defaultLocale
  
  return NextResponse.redirect(
    new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
  )
}

function getLocale(request: NextRequest) {
  // 从 Accept-Language 头获取用户偏好语言
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return defaultLocale

  // 简单的语言匹配逻辑
  for (const locale of locales) {
    if (acceptLanguage.includes(locale)) {
      return locale
    }
  }
  
  return defaultLocale
}

export const config = {
  matcher: [
    // 跳过内部 Next.js 路径和静态文件
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)',
  ],
}