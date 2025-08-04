"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ArrowLeft, CreditCard, HelpCircle } from 'lucide-react';
import { getTranslation, type Locale } from '@/lib/i18n';

export default function PaymentCancelledPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const t = getTranslation(locale);

  useEffect(() => {
    // 可以在这里添加分析或日志
    console.log('User cancelled payment');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-300/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-100/50 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-2xl w-full mx-auto px-4 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-flex items-center gap-3">
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

        <div className="max-w-lg mx-auto">
          {/* 取消图标 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X className="w-12 h-12 text-orange-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-4">
              {t.paymentCancelled.title}
            </h1>
            
            <p className="text-lg text-muted mb-2">
              {t.paymentCancelled.subtitle}
            </p>
            
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
              <span>{t.paymentCancelled.incompletePayment}</span>
            </div>
          </div>

          {/* 说明信息 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">{t.paymentCancelled.whatHappened}</h3>
            
            <div className="space-y-3 text-sm text-muted">
              {t.paymentCancelled.explanation.map((item, index) => (
                <p key={index}>• {item}</p>
              ))}
            </div>
          </div>

          {/* 重新尝试的理由 */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              {t.paymentCancelled.whyPremium}
            </h3>
            
            <div className="grid gap-3">
              {t.paymentCancelled.premiumFeatures.map((feature, index) => (
                <div key={index} className="text-sm text-foreground">
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* 行动按钮 */}
          <div className="flex flex-col gap-4">
            <Link
              href={`/${locale}/pricing`}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
            >
              <CreditCard className="w-4 h-4" />
              {t.paymentCancelled.retryPayment}
            </Link>
            
            <div className="flex gap-3">
              <Link
                href={`/${locale}`}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-foreground font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.paymentCancelled.backToHome}
              </Link>
              
              <Link
                href={`/${locale}/support`}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-foreground font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                {t.paymentCancelled.contactSupport}
              </Link>
            </div>
          </div>

          {/* 特别优惠提示 */}
          <div className="text-center mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              {t.paymentCancelled.tip}
            </p>
            <p className="text-xs text-yellow-700">
              {t.paymentCancelled.savings}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}