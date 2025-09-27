"use client";

import { useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslation, type Locale } from "@/lib/i18n";

interface PaymentProcessingPageProps {
  params: Promise<{ locale: string }>;
}

export default function PaymentProcessingPage({ params }: PaymentProcessingPageProps) {
  const { locale: localeParam } = use(params);
  const locale = localeParam as Locale;
  const t = getTranslation(locale);

  useEffect(() => {
    const timer = setTimeout(() => {
      const retryButton = document.getElementById("retry-button");
      if (retryButton) {
        retryButton.style.display = "block";
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 text-center">
        <div>
          <div className="flex justify-center mb-6">
            <Link href={`/${locale}`} className="flex items-center gap-3">
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
            {t.paymentProcessing.title}
          </h2>

          <p className="text-muted mb-6">
            {t.paymentProcessing.message}
          </p>

          <div className="space-y-3 text-sm text-muted">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{t.paymentProcessing.statusAccountCreated}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>{t.paymentProcessing.statusPreparing}</span>
            </div>
          </div>

          <div id="retry-button" style={{ display: "none" }} className="mt-6">
            <p className="text-sm text-muted mb-4">
              {t.paymentProcessing.retryPrompt}
            </p>
            <Link
              href={`/${locale}/pricing`}
              className="inline-block bg-primary hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              {t.paymentProcessing.retryButton}
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}`}
            className="font-medium text-primary hover:text-primary-600"
          >
            {t.paymentProcessing.backToHome}
          </Link>
        </div>
      </div>
    </div>
  );
}

