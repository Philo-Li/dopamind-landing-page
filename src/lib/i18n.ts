import enTranslations from '../../locales/en.json';
import zhTranslations from '../../locales/zh.json';
import jaTranslations from '../../locales/ja.json';
import zhTWTranslations from '../../locales/zh-TW.json';

export const defaultLocale = 'en' as const;
export const locales = ['en', 'zh', 'ja', 'zh-TW'] as const;
export type Locale = typeof locales[number];

export const languageNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  'zh-TW': '繁體中文',
};

// Import translations from JSON files
const translations = {
  en: enTranslations,
  zh: zhTranslations,
  ja: jaTranslations,
  'zh-TW': zhTWTranslations
} as const;

// Type definition for the translation structure
type TranslationStructure = typeof translations['en'];

export function getTranslation(locale: string): TranslationStructure {
  const validLocale = locales.includes(locale as Locale) ? locale as Locale : defaultLocale;
  return translations[validLocale] as TranslationStructure;
}