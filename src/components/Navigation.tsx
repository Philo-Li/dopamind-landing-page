'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { getTranslation } from '../lib/i18n';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import AuthButton from '../../components/AuthButton';

interface NavigationProps {
  locale: string;
  logoAlt: string;
}

export default function Navigation({ locale, logoAlt }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getTranslation(locale);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href={`/${locale}`} className="flex items-center gap-2">
          <Image 
            src="/dopamind-logo.png"
            alt={logoAlt}
            width={32}
            height={32}
            className="rounded-[8px]"
          />
          <span className="text-xl font-bold text-foreground">Dopamind</span>
        </a>
        
        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href={`/${locale}#features`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.features}</a>
          <a href={`/${locale}#how-it-works`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.howItWorks}</a>
          <a href={`/${locale}/pricing`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.pricing}</a>
          <a href={`/${locale}/download`} className="text-sm font-medium text-muted transition-colors hover:text-primary">Download</a>
          <a href={`/${locale}/support`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.support}</a>
        </nav>
        
        {/* 右侧工具栏 */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <AuthButton locale={locale} />
          </div>
          
          {/* 移动端汉堡菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="flex flex-col py-4">
            <a 
              href={`/${locale}#features`} 
              className="px-4 py-2 text-sm font-medium text-muted hover:bg-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.navigation.features}
            </a>
            <a 
              href={`/${locale}#how-it-works`} 
              className="px-4 py-2 text-sm font-medium text-muted hover:bg-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.navigation.howItWorks}
            </a>
            <a 
              href={`/${locale}/pricing`} 
              className="px-4 py-2 text-sm font-medium text-muted hover:bg-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.navigation.pricing}
            </a>
            <a 
              href={`/${locale}/download`} 
              className="px-4 py-2 text-sm font-medium text-muted hover:bg-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Download
            </a>
            <a 
              href={`/${locale}/support`} 
              className="px-4 py-2 text-sm font-medium text-muted hover:bg-gray-50 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t.navigation.support}
            </a>
            <div className="px-4 pt-4 pb-2 border-t border-gray-200 mt-2 flex items-center gap-4">
              <LanguageSwitcher currentLocale={locale} />
              <AuthButton locale={locale} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}