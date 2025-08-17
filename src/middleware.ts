// import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from './lib/i18n'

export function middleware(request: NextRequest) {
  // 检查路径是否已经包含语言前缀
  const pathname = request.nextUrl.pathname
  
  // 排除不需要多语言处理的路径（包括根路径）
  const excludePaths = ['/login', '/register', '/dashboard', '/api', '/']
  const shouldExclude = excludePaths.some(path => 
    pathname.startsWith(path) || pathname === path
  )
  
  if (shouldExclude) return
  
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // 移除了自动语言重定向逻辑
  // 现在只有带语言前缀的路径会被处理，其他路径将正常访问
  return
}

// getLocale 函数已移除，不再需要自动语言检测

export const config = {
  matcher: [
    // 跳过内部 Next.js 路径、静态文件、API路由和认证页面
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/|login|register|dashboard).*)',
  ],
}