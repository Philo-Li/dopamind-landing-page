import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'

export interface UseLocalizationReturn {
  t: (key: string, options?: any) => string
  language: string
  changeLanguage: (language: string) => Promise<void>
  supportedLanguages: Array<{
    code: string
    name: string
    nativeName: string
  }>
}

export const useLocalization = (): UseLocalizationReturn => {
  const { t, i18n } = useTranslation()

  const supportedLanguages = [
    { code: 'zh', name: 'Chinese Simplified', nativeName: '简体中文' },
    { code: 'zh-TW', name: 'Chinese Traditional', nativeName: '繁體中文' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  ]

  const changeLanguage = useCallback(async (language: string) => {
    try {
      await i18n.changeLanguage(language)
      // Store preference for future sessions
      localStorage.setItem('dopamind-language', language)
      document.cookie = `dopamind-language=${language}; path=/; max-age=31536000; SameSite=Lax`
      document.documentElement.setAttribute('lang', language === 'zh' ? 'zh-CN' : language)
      document.documentElement.setAttribute('data-language', language)
      document.documentElement.setAttribute('data-i18n', 'ready')
      document.body?.setAttribute('data-language', language)

      // Also update user profile if user is logged in
      try {
        const userStr = localStorage.getItem('dopamind-user')
        if (userStr) {
          const user = JSON.parse(userStr)
          user.preferredLanguage = language
          localStorage.setItem('dopamind-user', JSON.stringify(user))
          console.log('Updated user preferred language to:', language)
        }
      } catch (error) {
        console.warn('Failed to update user language preference:', error)
      }
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }, [i18n])

  return {
    t,
    language: i18n.language,
    changeLanguage,
    supportedLanguages,
  }
}