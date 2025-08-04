"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PaymentProcessingPage() {
  useEffect(() => {
    // 如果用户在这个页面停留太久，提供备用选项
    const timer = setTimeout(() => {
      const retryButton = document.getElementById('retry-button');
      if (retryButton) {
        retryButton.style.display = 'block';
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10 text-center">
        <div>
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/dopamind-logo.png"
                alt="Dopamind Logo" 
                width={48}
                height={48}
                className="rounded-xl"
              />
              <span className="text-2xl font-bold text-foreground">Dopamind</span>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            正在准备支付页面...
          </h2>
          
          <p className="text-muted mb-6">
            注册成功！我们正在为您创建安全的支付会话，请稍候...
          </p>

          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>账户创建成功</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>正在准备支付会话...</span>
            </div>
          </div>

          <div id="retry-button" style={{ display: 'none' }} className="mt-6">
            <p className="text-sm text-muted mb-4">
              页面加载时间较长？
            </p>
            <Link 
              href="/pricing"
              className="inline-block bg-primary hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              返回定价页面重试
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="font-medium text-primary hover:text-primary-600"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}