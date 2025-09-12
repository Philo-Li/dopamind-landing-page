import React from 'react';

interface AppStoreButtonProps {
  size?: 'small' | 'large';
  className?: string;
  locale?: string;
}

export default function AppStoreButton({ size = 'small', className = '', locale = 'en' }: AppStoreButtonProps) {
  const sizeClasses = size === 'large' 
    ? 'px-10 py-5 text-base' 
    : 'px-8 py-4 text-sm';

  const getAppStoreLink = (locale: string) => {
    switch (locale) {
      case 'zh':
        return 'https://apps.apple.com/cn/app/dopamind-ai/id6747915249';
      case 'zh-TW':
        return 'https://apps.apple.com/tw/app/dopamind-ai/id6747915249';
      case 'ja':
        return 'https://apps.apple.com/jp/app/dopamind-ai/id6747915249';
      case 'en':
      default:
        return 'https://apps.apple.com/us/app/dopamind-ai/id6747915249';
    }
  };

  return (
    <a 
      href={getAppStoreLink(locale)} 
      className={`
        group relative inline-flex items-center justify-center 
        ${sizeClasses}
        bg-gradient-to-r from-primary to-primary-600 
        text-white font-semibold rounded-2xl 
        shadow-lg hover:shadow-xl 
        hover:scale-105 
        transition-all duration-300 
        overflow-hidden
        ${className}
      `}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        {/* Apple icon */}
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
        
        {/* Text */}
        <div className="text-left">
          <div className="text-xs opacity-90 leading-tight">Download on the</div>
          <div className={`font-bold leading-tight ${size === 'large' ? 'text-xl' : 'text-lg'}`}>App Store</div>
        </div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
    </a>
  );
}