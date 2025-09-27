'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { languageNames, locales, type Locale } from '@/lib/i18n';

// 语言配置，包含国旗和简化显示名称
const languageConfig: Record<Locale, { name: string; flag: string; shortName: string }> = {
  'en': { name: 'English', flag: '🇺🇸', shortName: 'EN' },
  'zh': { name: '简体中文', flag: '🇨🇳', shortName: '中文' },
  'zh-TW': { name: '繁體中文', flag: '🇹🇼', shortName: '繁中' },
  'ja': { name: '日本語', flag: '🇯🇵', shortName: '日本語' }
};

interface LanguageSwitcherProps {
  currentLocale: string;
  compact?: boolean;
}

export default function LanguageSwitcher({ currentLocale, compact = false }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
  // 获取当前路径，移除语言前缀
  const getLocalizedPath = (locale: string) => {
    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = locale;
      return segments.join('/');
    }
    return `/${locale}${pathname}`;
  };

  const currentLangConfig = languageConfig[currentLocale as Locale] || languageConfig['en'];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center transition-all hover:text-primary rounded-lg ${
          compact 
            ? 'gap-1 p-2 text-gray-700 hover:bg-primary/10' 
            : 'gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:bg-primary/10 hover:border-primary/30 shadow-sm'
        }`}
        title={`Current language: ${currentLangConfig.name}`}
      >
        <span className="text-base">{currentLangConfig.flag}</span>
        {!compact && <span className="font-medium">{currentLangConfig.shortName}</span>}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''} ${compact ? 'h-3 w-3' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className={`absolute top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-20 min-w-[160px] overflow-hidden ${
            compact ? 'right-0' : 'right-0'
          }`}>
            {locales.map((locale) => {
              const langConfig = languageConfig[locale as Locale];
              const isActive = locale === currentLocale;
              return (
                <Link
                  key={locale}
                  href={getLocalizedPath(locale)}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? 'text-primary font-semibold bg-primary/10 border-r-2 border-primary'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-base flex-shrink-0">{langConfig.flag}</span>
                  <span className="flex-1">{langConfig.name}</span>
                  {isActive && (
                    <span className="text-primary flex-shrink-0 font-bold">✓</span>
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
