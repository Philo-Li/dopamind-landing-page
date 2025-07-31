'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, Globe } from 'lucide-react';
import { languageNames, locales, type Locale } from '../src/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
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

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-primary rounded-md hover:bg-gray-100"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{languageNames[currentLocale as Locale]}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[120px]">
            {locales.map((locale) => (
              <Link
                key={locale}
                href={getLocalizedPath(locale)}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 text-sm transition-colors hover:bg-gray-100 ${
                  locale === currentLocale
                    ? 'text-primary font-medium bg-primary/5'
                    : 'text-muted'
                }`}
              >
                {languageNames[locale as Locale]}
                {locale === currentLocale && (
                  <span className="ml-2 text-primary">✓</span>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}