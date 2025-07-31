import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { notFound } from 'next/navigation';
import { locales } from '../../lib/i18n';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dopamind",
  description: "专为 ADHD 用户设计的 AI 专注伙伴",
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
};

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
  if (!locales.includes(locale as any)) {
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
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}