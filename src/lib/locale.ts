export const SUPPORTED_APP_LOCALES = ['en', 'zh', 'zh-TW', 'ja'] as const

export type AppLocale = typeof SUPPORTED_APP_LOCALES[number]

export const normalizeLocale = (language?: string | null): AppLocale => {
  if (!language) {
    return 'en'
  }

  const canonical = language.replace('_', '-')

  if ((SUPPORTED_APP_LOCALES as readonly string[]).includes(canonical)) {
    return canonical as AppLocale
  }

  const lower = canonical.toLowerCase()

  if (lower.startsWith('zh-tw')) return 'zh-TW'
  if (lower.startsWith('zh')) return 'zh'
  if (lower.startsWith('ja')) return 'ja'
  if (lower.startsWith('en')) return 'en'

  return 'en'
}
