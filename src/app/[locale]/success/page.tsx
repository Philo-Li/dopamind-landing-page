"use client";

import { useEffect, useState, Suspense, use } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Crown, ArrowRight } from 'lucide-react';
import { getLandingTranslation, type Locale } from '@/lib/i18n';

interface SessionData {
  paymentStatus: string;
  subscriptionId?: string;
  sessionId: string;
}

function PaymentSuccessContent({ locale }: { locale: Locale }) {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const t = getLandingTranslation(locale);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      console.error('Missing session_id in URL params');
      setError(t.paymentSuccess.missingSessionId);
      setLoading(false);
      return;
    }

    // 获取支付详情
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/success?session_id=${sessionId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        } else {
          throw new Error('Failed to fetch payment details');
        }
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setError(t.paymentSuccess.fetchError);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
        <p className="text-marketing-textSecondary">{t.paymentSuccess.confirmingPayment}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* 成功图标 */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-marketing-foreground mb-4">
          {t.paymentSuccess.title}
        </h1>

        <p className="text-xl text-marketing-textSecondary mb-2">
          {t.paymentSuccess.subtitle}
        </p>
        
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
          <Crown className="w-4 h-4" />
          <span>{t.paymentSuccess.membershipActivated}</span>
        </div>
      </div>

      {/* 支付详情 */}
      {sessionData && (
        <div className="bg-marketing-cardBg rounded-xl p-6 shadow-lg border border-marketing-border mb-8">
          <h3 className="text-lg font-semibold text-marketing-foreground mb-4">{t.paymentSuccess.paymentDetails}</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-marketing-textSecondary">{t.paymentSuccess.paymentStatus}</span>
              <span className="font-medium text-green-600">
                {sessionData.paymentStatus === 'paid' ? t.paymentSuccess.paid : sessionData.paymentStatus}
              </span>
            </div>

            {sessionData.subscriptionId && (
              <div className="flex justify-between">
                <span className="text-marketing-textSecondary">{t.paymentSuccess.subscriptionId}</span>
                <span className="font-mono text-xs">{sessionData.subscriptionId}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-marketing-textSecondary">{t.paymentSuccess.sessionId}</span>
              <span className="font-mono text-xs">{sessionData.sessionId}</span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <p className="text-yellow-800 text-sm">⚠️ {error}</p>
        </div>
      )}

      {/* Premium 功能预览 */}
      <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold text-marketing-foreground mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          {t.paymentSuccess.premiumFeatures}
        </h3>

        <div className="grid gap-3">
          {t.paymentSuccess.features.map((feature: any, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-marketing-foreground">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 行动按钮 */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
        >
          {t.paymentSuccess.startUsing}
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <Link
          href="/dashboard/subscription"
          className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-marketing-foreground font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          {t.paymentSuccess.manageSubscription}
        </Link>
      </div>

      {/* 帮助信息 */}
      <div className="text-center mt-8 space-y-2">
        <p className="text-sm text-marketing-textSecondary">
          {t.paymentSuccess.thankYou}
        </p>
        <p className="text-xs text-marketing-textSecondary">
          如有任何问题，请联系我们的
          <Link href={`/${locale}/support`} className="text-primary hover:underline ml-1">
            {t.paymentSuccess.support}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = use(params);
  const locale = localeParam as Locale;

  return (
    <div className="min-h-screen flex items-center justify-center bg-marketing-background relative overflow-hidden py-12">
      {/* 背景装饰 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-green-300/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-green-100/50 rounded-full blur-2xl"></div>
      </div>
      
      <div className="max-w-4xl w-full mx-auto px-4 relative z-10">
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
            <span className="text-2xl font-bold text-marketing-foreground">Dopamind</span>
          </Link>
        </div>

        <Suspense fallback={
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-marketing-textSecondary">加载中...</p>
          </div>
        }>
          <PaymentSuccessContent locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
