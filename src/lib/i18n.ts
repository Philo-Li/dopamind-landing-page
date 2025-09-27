import en from '@/locales/en.json'
import zh from '@/locales/zh.json'
import ja from '@/locales/ja.json'
import zhTW from '@/locales/zh-TW.json'

// Landing page specific translations (complete original files)
import enLanding from '@/locales/en-landing.json'
import zhLanding from '@/locales/zh-landing.json'
import jaLanding from '@/locales/ja-landing.json'
import zhTWLanding from '@/locales/zh-TW-landing.json'

export const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ja: { translation: ja },
  'zh-TW': { translation: zhTW },
} as const

export const landingResources = {
  en: { translation: enLanding },
  zh: { translation: zhLanding },
  ja: { translation: jaLanding },
  'zh-TW': { translation: zhTWLanding },
} as const

export const locales = ['en', 'zh', 'ja', 'zh-TW'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const languageNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  'zh-TW': '繁體中文',
}

export function getTranslation(locale: string): any {
  const normalized = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale
  return resources[normalized].translation
}

export function getLandingTranslation(locale: string): any {
  const normalized = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale
  return landingResources[normalized].translation
}

