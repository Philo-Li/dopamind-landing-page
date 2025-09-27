import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import MarketingBodyClass from '@/components/MarketingBodyClass';
import { notFound } from 'next/navigation';
import { locales } from '@/lib/i18n';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({ params }: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const metadataByLocale = {
    en: {
      title: "Dopamind - AI-Powered Focus Companion for ADHD | Mind Mapping & Productivity App",
      description: "Transform your ADHD challenges into superpowers with Dopamind's AI-powered focus companion. Features intelligent mind mapping, task management, and personalized productivity tools designed specifically for ADHD brains.",
      keywords: "ADHD app, focus companion, mind mapping, productivity tool, AI assistant, task management, ADHD productivity, attention deficit, cognitive enhancement"
    },
    zh: {
      title: "Dopamind - 专为 ADHD 设计的 AI 专注伙伴 | 思维导图与生产力应用",
      description: "用 Dopamind 的 AI 专注伙伴将 ADHD 挑战转化为优势。提供智能思维导图、任务管理和个性化生产力工具，专为 ADHD 大脑而设计。",
      keywords: "ADHD 应用, 专注伙伴, 思维导图, 生产力工具, AI 助手, 任务管理, ADHD 生产力, 注意力不足, 认知增强"
    },
    ja: {
      title: "Dopamind - ADHDのためのAI集中力コンパニオン | マインドマップ＆生産性アプリ",
      description: "DopamindのAI集中力コンパニオンでADHDの課題を強みに変えましょう。ADHD脳のために特別に設計されたインテリジェントマインドマップ、タスク管理、パーソナライズされた生産性ツールを提供。",
      keywords: "ADHDアプリ, 集中力コンパニオン, マインドマップ, 生産性ツール, AIアシスタント, タスク管理, ADHD生産性, 注意欠如, 認知強化"
    }
  };

  const currentMeta = metadataByLocale[locale as keyof typeof metadataByLocale] || metadataByLocale.en;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    authors: [{ name: "Dopamind Team" }],
    creator: "Dopamind Inc.",
    publisher: "Dopamind Inc.",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/dopamind-logo-bw.jpg', sizes: '32x32', type: 'image/jpeg' },
        { url: '/dopamind-logo-bw.jpg', sizes: '16x16', type: 'image/jpeg' },
      ],
      apple: [
        { url: '/dopamind-logo-bw.jpg', sizes: '180x180', type: 'image/jpeg' },
      ],
      shortcut: '/dopamind-logo-bw.jpg',
    },
    manifest: '/manifest.json',
    category: 'productivity',
    // Open Graph 标签
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      url: `https://www.dopamind.app/${locale}`,
      siteName: 'Dopamind',
      images: [
        {
          url: 'https://www.dopamind.app/dopamind-logo.png',
          width: 1200,
          height: 630,
          alt: 'Dopamind - AI-Powered Focus Companion for ADHD',
        },
      ],
      locale: locale === 'zh' ? 'zh_CN' : locale === 'ja' ? 'ja_JP' : 'en_US',
      type: 'website',
    },
    // Twitter Card 标签  
    twitter: {
      card: 'summary_large_image',
      title: currentMeta.title,
      description: currentMeta.description,
      images: ['https://www.dopamind.app/dopamind-logo.png'],
      creator: '@dopamind_app',
      site: '@dopamind_app',
    },
    // 其他元标签
    metadataBase: new URL('https://www.dopamind.app'),
  };
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#F97316',
    colorScheme: 'light',
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 验证语言参数
  const { locale } = await params;
  if (!locales.includes(locale as typeof locales[number])) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/dopamind-logo-bw.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/dopamind-logo-bw.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/dopamind-logo-bw.jpg" />
        <link rel="shortcut icon" href="/dopamind-logo-bw.jpg" />
        <meta name="theme-color" content="#F97316" />
        <meta name="msapplication-TileColor" content="#F97316" />
        <meta name="msapplication-TileImage" content="/dopamind-logo-bw.jpg" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* hreflang tags for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href="https://www.dopamind.app/en" />
        <link rel="alternate" hrefLang="zh" href="https://www.dopamind.app/zh" />
        <link rel="alternate" hrefLang="ja" href="https://www.dopamind.app/ja" />
        <link rel="alternate" hrefLang="x-default" href="https://www.dopamind.app/en" />
        
        {/* canonical tag */}
        <link rel="canonical" href={`https://www.dopamind.app/${locale}`} />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Dopamind",
              "description": locale === 'zh' ? 
                "专为 ADHD 用户设计的 AI 专注伙伴，提供智能思维导图、任务管理和个性化生产力工具。" :
                locale === 'ja' ?
                "ADHD脳のために特別に設計されたAI集中力コンパニオン。インテリジェントマインドマップ、タスク管理、パーソナライズされた生产性ツールを提供。" :
                "AI-powered focus companion designed specifically for ADHD users. Features intelligent mind mapping, task management, and personalized productivity tools.",
              "url": `https://www.dopamind.app/${locale}`,
              "logo": "https://www.dopamind.app/dopamind-logo.png",
              "image": "https://www.dopamind.app/dopamind-logo.png",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": ["iOS", "Android", "Web"],
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "author": {
                "@type": "Organization",
                "name": "Dopamind Inc.",
                "url": "https://www.dopamind.app"
              },
              "publisher": {
                "@type": "Organization",
                "name": "Dopamind Inc.",
                "url": "https://www.dopamind.app"
              },
              "keywords": locale === 'zh' ? 
                "ADHD, 专注力, 思维导图, 生产力工具, AI 助手, 任务管理" :
                locale === 'ja' ?
                "ADHD, 集中力, マインドマップ, 生産性ツール, AIアシスタント, タスク管理" :
                "ADHD, focus, mind mapping, productivity, AI assistant, task management",
              "inLanguage": locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US',
              "datePublished": "2024-01-01",
              "dateModified": "2025-08-17"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <MarketingBodyClass />
        <div className="flex min-h-screen flex-col">
          <Navigation locale={locale} logoAlt="Dopamind - AI-powered focus companion for ADHD users" />
          <main className="flex-1">
            {children}
          </main>
          <Footer locale={locale} logoAlt="Dopamind - AI-powered focus companion for ADHD users" />
        </div>
      </body>
    </html>
  );
}
