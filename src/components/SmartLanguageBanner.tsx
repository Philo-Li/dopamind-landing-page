'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function SmartLanguageBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [suggestedLanguage, setSuggestedLanguage] = useState<string | null>(null);

  // 添加/移除body的class来调整导航栏位置
  useEffect(() => {
    if (isVisible) {
      document.body.classList.add('has-language-banner');
    } else {
      document.body.classList.remove('has-language-banner');
    }

    return () => {
      document.body.classList.remove('has-language-banner');
    };
  }, [isVisible]);

  useEffect(() => {
    // 检查用户是否已经选择过语言偏好
    const savedLanguage = localStorage.getItem('preferred-language');
    const cookieLanguage = document.cookie
      .split('; ')
      .find(row => row.startsWith('preferred-language='))
      ?.split('=')[1];

    // 如果用户已经选择过，不显示横幅
    if (savedLanguage || cookieLanguage) {
      return;
    }

    // 检测浏览器语言
    const browserLang = (navigator.language || navigator.languages?.[0] || 'en').toLowerCase();

    let detectedLanguage = null;
    let languageInfo = null;

    if (browserLang.startsWith('zh-cn') || browserLang.startsWith('zh-hans') || browserLang.startsWith('zh')) {
      detectedLanguage = 'zh';
      languageInfo = { name: '简体中文', flag: '🇨🇳', greeting: '您好' };
    } else if (browserLang.startsWith('zh-tw') || browserLang.startsWith('zh-hant')) {
      detectedLanguage = 'zh-TW';
      languageInfo = { name: '繁體中文', flag: '🇹🇼', greeting: '您好' };
    } else if (browserLang.startsWith('ja')) {
      detectedLanguage = 'ja';
      languageInfo = { name: '日本語', flag: '🇯🇵', greeting: 'こんにちは' };
    }

    if (detectedLanguage && languageInfo) {
      setSuggestedLanguage(detectedLanguage);
      setIsVisible(true);
    }
  }, []);

  const acceptLanguage = () => {
    if (suggestedLanguage) {
      // 保存用户选择
      localStorage.setItem('preferred-language', suggestedLanguage);

      const expires = new Date();
      expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
      document.cookie = `preferred-language=${suggestedLanguage}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

      // 跳转到对应语言页面
      window.location.href = `/${suggestedLanguage}`;
    }
  };

  const dismissBanner = () => {
    // 保存英文为用户偏好
    localStorage.setItem('preferred-language', 'en');

    const expires = new Date();
    expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
    document.cookie = `preferred-language=en; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

    setIsVisible(false);
  };

  const getLanguageInfo = () => {
    const languageMap: Record<string, { name: string; flag: string; greeting: string }> = {
      'zh': { name: '简体中文', flag: '🇨🇳', greeting: '您好' },
      'zh-TW': { name: '繁體中文', flag: '🇹🇼', greeting: '您好' },
      'ja': { name: '日本語', flag: '🇯🇵', greeting: 'こんにちは' }
    };
    return languageMap[suggestedLanguage || ''];
  };

  if (!isVisible) return null;

  const languageInfo = getLanguageInfo();

  return (
    <>
      {/* 智能语言提示横幅 */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-blue-50 border-b border-blue-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-lg">{languageInfo.flag}</span>
              <span className="text-muted-foreground">
                <span className="font-medium">{languageInfo.greeting}!</span> Dopamind is now available in {languageInfo.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={acceptLanguage}
                className="px-3 py-1 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-100 rounded-md transition-colors"
              >
                Switch to {languageInfo.name}
              </button>
              <button
                onClick={dismissBanner}
                className="px-3 py-1 text-sm font-medium text-muted-foreground hover:text-muted-foreground hover:bg-gray-100 rounded-md transition-colors"
              >
                Stay in English
              </button>
              <button
                onClick={dismissBanner}
                className="p-1 text-muted-foreground hover:text-muted-foreground hover:bg-gray-100 rounded-md transition-colors"
                aria-label="Close language banner"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 占位符 */}
      <div className="h-12" />
    </>
  );
}
