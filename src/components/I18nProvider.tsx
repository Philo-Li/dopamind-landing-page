'use client'

import { useLayoutEffect } from 'react'
import i18n from '@/lib/i18n-client'

const SUPPORTED_LANGUAGES = new Set(['zh', 'zh-TW', 'en', 'ja'])

function normalizeLanguage(language?: string | null) {
  if (!language) return 'zh'
  return SUPPORTED_LANGUAGES.has(language) ? language : 'zh'
}

const mapToHtmlLang = (language: string) => (language === 'zh' ? 'zh-CN' : language)

interface I18nProviderProps {
  children: React.ReactNode
  initialLanguage?: string
}

export default function I18nProvider({ children, initialLanguage = 'zh' }: I18nProviderProps) {
  const normalized = normalizeLanguage(initialLanguage)

  useLayoutEffect(() => {
    let cancelled = false

    const applyLanguage = async () => {
      try {
        // Force set the language immediately to match server-side
        if (i18n.language !== normalized) {
          console.log('Syncing client i18n language:', i18n.language, '->', normalized)
          await i18n.changeLanguage(normalized)
        }

        // Ensure localStorage and cookie are in sync
        localStorage.setItem('dopamind-language', normalized)
        document.cookie = `dopamind-language=${normalized}; path=/; max-age=31536000; SameSite=Lax`
      } catch (error) {
        console.error('Failed to apply initial language', error)
      } finally {
        if (cancelled) return
        const htmlEl = document.documentElement
        htmlEl.setAttribute('lang', mapToHtmlLang(normalized))
        htmlEl.setAttribute('data-language', normalized)
        htmlEl.setAttribute('data-i18n', 'ready')
        document.body?.setAttribute('data-language', normalized)
      }
    }

    applyLanguage()

    return () => {
      cancelled = true
    }
  }, [normalized])

  return <>{children}</>
}

