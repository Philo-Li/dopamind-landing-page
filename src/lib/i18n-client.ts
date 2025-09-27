"use client";

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { resources, defaultLocale, locales, type Locale } from '@/lib/i18n'

const getInitialLanguage = (): Locale => {
  if (typeof window === 'undefined') {
    return defaultLocale
  }

  const cookieMatch = document.cookie.match(/(?:^|; )dopamind-language=([^;]+)/)
  if (cookieMatch) {
    const cookieLanguage = decodeURIComponent(cookieMatch[1]) as Locale
    if (locales.includes(cookieLanguage)) {
      return cookieLanguage
    }
  }

  const savedLanguage = localStorage.getItem('dopamind-language') as Locale | null
  if (savedLanguage && locales.includes(savedLanguage)) {
    return savedLanguage
  }

  try {
    const userStr = localStorage.getItem('dopamind-user')
    if (userStr) {
      const user = JSON.parse(userStr) as { preferredLanguage?: Locale }
      if (user.preferredLanguage && locales.includes(user.preferredLanguage)) {
        return user.preferredLanguage
      }
    }
  } catch (error) {
    console.warn('Failed to read user language from storage:', error)
  }

  const browserLanguage = navigator.language
  if (browserLanguage.startsWith('zh')) {
    return browserLanguage === 'zh-TW' ? 'zh-TW' : 'zh'
  }
  if (browserLanguage.startsWith('ja')) {
    return 'ja'
  }
  if (browserLanguage.startsWith('en')) {
    return 'en'
  }

  return defaultLocale
}

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: getInitialLanguage(),
      fallbackLng: defaultLocale,
      debug: false,
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'dopamind-language',
      },
      interpolation: {
        escapeValue: false,
      },
    })
}

export default i18n
