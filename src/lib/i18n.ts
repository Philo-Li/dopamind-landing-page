export const defaultLocale = 'zh' as const;
export const locales = ['zh', 'en', 'ja'] as const;
export type Locale = typeof locales[number];

export const languageNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
};

export function getTranslation(locale: string) {
  // 为了简化，这里返回一个默认的翻译对象结构
  // 实际项目中应该从翻译文件中加载对应语言的内容
  return new Proxy({}, {
    get(target, prop) {
      // 返回一个递归的代理对象，支持任意深度的属性访问
      return new Proxy({}, {
        get(target, prop) {
          return typeof prop === 'string' ? prop : '';
        }
      });
    }
  });
}