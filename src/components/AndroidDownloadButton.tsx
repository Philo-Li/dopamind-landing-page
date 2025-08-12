'use client';

import React from 'react';

interface AndroidDownloadButtonProps {
  size?: 'small' | 'large';
  className?: string;
  downloadUrl: string;
}

export default function AndroidDownloadButton({ 
  size = 'small', 
  className = '',
  downloadUrl 
}: AndroidDownloadButtonProps) {
  const sizeClasses = size === 'large' 
    ? 'px-10 py-5 text-base' 
    : 'px-8 py-4 text-sm';

  const handleDownload = () => {
    // 创建一个临时的下载链接
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'Dopamind.apk';
    link.click();
  };

  return (
    <button 
      onClick={handleDownload}
      className={`
        group relative inline-flex items-center justify-center 
        ${sizeClasses}
        bg-gradient-to-r from-green-500 to-green-600 
        text-white font-semibold rounded-2xl 
        shadow-lg hover:shadow-xl 
        hover:scale-105 
        transition-all duration-300 
        overflow-hidden
        ${className}
      `}
    >
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative flex items-center gap-3">
        {/* Android icon */}
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993.9993.4482.9993.9993c0 .5511-.4482.9997-.9993.9997zm-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993.9993.4482.9993.9993c0 .5511-.4482.9997-.9993.9997zm11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8452 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0329L4.8442 5.3819a.4161.4161 0 00-.5676-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6456 0 18.761h24c-.3435-4.1154-2.6892-7.5743-6.1185-9.4396z"/>
          </svg>
        </div>
        
        {/* Text */}
        <div className="text-left">
          <div className="text-xs opacity-90 leading-tight">Download APK</div>
          <div className={`font-bold leading-tight ${size === 'large' ? 'text-xl' : 'text-lg'}`}>for Android</div>
        </div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
    </button>
  );
}