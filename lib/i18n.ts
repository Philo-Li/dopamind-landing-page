import en from '../locales/en.json';
import zh from '../locales/zh.json';
import ja from '../locales/ja.json';

const translations = { en, zh, ja };

export type Locale = keyof typeof translations;

export function getTranslation(locale: string) {
  // 如果语言不存在，回退到中文
  return translations[locale as Locale] || translations.zh;
}

// 辅助函数：获取嵌套的翻译文本
export function t(obj: any, path: string): any {
  return path.split('.').reduce((current, segment) => {
    return current && current[segment];
  }, obj);
}

// 支持的语言配置
export const locales = ['zh', 'en', 'ja'] as const;
export const defaultLocale = 'zh';

// 语言显示名称
export const languageNames = {
  zh: '中文',
  en: 'English', 
  ja: '日本語'
};