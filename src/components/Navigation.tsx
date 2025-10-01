'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { getLandingTranslation } from '@/lib/i18n';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import AuthButton from '../../components/AuthButton';

interface NavigationProps {
  locale: string;
  logoAlt: string;
}

export default function Navigation({ locale, logoAlt }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = getLandingTranslation(locale);
  const marketingNav = ((t as any).marketing?.navigation ?? (t as any).landingNavigation) ?? {};
  const navLabels = {
    home: marketingNav.home ?? t.navigation?.home ?? 'Home',
    pricing: marketingNav.pricing ?? 'Pricing',
    download: marketingNav.download ?? 'Download',
    support: marketingNav.support ?? 'Support',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-marketing-border bg-marketing-cardBg backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <a href={`/${locale}`} className="flex items-center gap-2">
          <Image 
            src="/dopamind-logo.png"
            alt={logoAlt}
            width={32}
            height={32}
            className="rounded-[8px]"
          />
          <span className="text-xl font-bold text-marketing-foreground">Dopamind</span>
        </a>
        
        {/* 桌面端导航 */}
        <nav className="hidden items-center gap-6 md:flex">
          <a href={`/${locale}`} className="text-sm font-medium text-marketing-foreground transition-colors hover:text-primary">{navLabels.home}</a>
          <a href={`/${locale}/pricing`} className="text-sm font-medium text-marketing-foreground transition-colors hover:text-primary">{navLabels.pricing}</a>
          <a href={`/${locale}/download`} className="text-sm font-medium text-marketing-foreground transition-colors hover:text-primary">{navLabels.download}</a>
          <a href={`/${locale}/support`} className="text-sm font-medium text-marketing-foreground transition-colors hover:text-primary">{navLabels.support}</a>
        </nav>
        
        {/* 右侧工具栏 */}
        <div className="flex items-center gap-2">
          {/* 桌面端工具栏 */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <AuthButton locale={locale} />
          </div>
          
          {/* 移动端语言选择器 - 只显示国旗 */}
          <div className="md:hidden">
            <LanguageSwitcher currentLocale={locale} compact={true} />
          </div>
          
          {/* 移动端汉堡菜单按钮 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-marketing-cardBg transition-colors text-marketing-foreground"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-marketing-border bg-marketing-background">
          <nav className="flex flex-col py-4">
            <a
              href={`/${locale}`}
              className="px-4 py-2 text-sm font-medium text-marketing-foreground hover:bg-marketing-cardBg hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {navLabels.home}
            </a>
            <a
              href={`/${locale}/pricing`}
              className="px-4 py-2 text-sm font-medium text-marketing-foreground hover:bg-marketing-cardBg hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {navLabels.pricing}
            </a>
            <a
              href={`/${locale}/download`}
              className="px-4 py-2 text-sm font-medium text-marketing-foreground hover:bg-marketing-cardBg hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {navLabels.download}
            </a>
            <a
              href={`/${locale}/support`}
              className="px-4 py-2 text-sm font-medium text-marketing-foreground hover:bg-marketing-cardBg hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {navLabels.support}
            </a>
            <div className="px-4 pt-4 pb-2 border-t border-marketing-border mt-2 flex items-center justify-center">
              <AuthButton locale={locale} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

