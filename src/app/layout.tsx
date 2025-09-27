import type { Metadata } from "next";
import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import I18nProvider from "@/components/I18nProvider";
import { ThemeProvider, type Theme } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { PremiumProvider } from "@/hooks/usePremium";
import { GlobalPaywall } from "@/components/paywall/GlobalPaywall";
import { AuthProvider } from "@/hooks/useAuth";

const inter = Inter({ subsets: ["latin"] });

const SUPPORTED_LANGUAGES = new Set(["zh", "zh-TW", "en", "ja"]);

function resolveLanguage(value?: string | null) {
  if (!value) return "zh";
  return SUPPORTED_LANGUAGES.has(value) ? value : "zh";
}

const toHtmlLang = (language: string) => (language === "zh" ? "zh-CN" : language);

export const metadata: Metadata = {
  title: {
    default: "Dopamind - 智能执行功能教练",
    template: "%s | Dopamind",
  },
  description:
    "Dopamind 是专为 ADHD 用户打造的 AI 执行功能教练，提供从专注练习、任务管理到订阅管理的一体化体验。",
  keywords: [
    "Dopamind",
    "ADHD",
    "专注",
    "任务管理",
    "AI Coach",
    "Productivity",
  ],
  authors: [{ name: "Dopamind Team" }],
  creator: "Dopamind",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://dopamind.app",
    siteName: "Dopamind",
    title: "Dopamind - 智能执行功能教练",
    description:
      "AI-powered focus companion for ADHD users with integrated planning, focus, and accountability tools.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dopamind - 智能执行功能教练",
    description:
      "AI-powered focus companion for ADHD users with integrated planning, focus, and accountability tools.",
    creator: "@dopamind",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: [
      { url: "/dopamind-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const preferenceCookie = cookieStore.get("theme-preference")?.value as Theme | undefined;
  const resolvedCookie = cookieStore.get("theme-resolved")?.value === "dark" ? "dark" : "light";

  const languageCookie = resolveLanguage(cookieStore.get("dopamind-language")?.value);
  const initialLanguage = languageCookie;
  const htmlLang = toHtmlLang(initialLanguage);
  const initialI18nState = initialLanguage === "zh" ? "ready" : "pending";

  const initialTheme: Theme =
    preferenceCookie === "light" || preferenceCookie === "dark" || preferenceCookie === "auto"
      ? preferenceCookie
      : "auto";
  const initialActualTheme = initialTheme === "dark" ? "dark" : initialTheme === "light" ? "light" : resolvedCookie;
  const htmlClassName = initialActualTheme === "dark" ? "dark" : "";
  const dataTheme = initialActualTheme;
  const serializedThemeFallback = JSON.stringify(initialTheme);
  const languageInitScript = `(function(){try{var supported={zh:1,"zh-TW":1,en:1,ja:1};var fallback=${JSON.stringify(
    initialLanguage,
  )};var stored=window.localStorage.getItem('dopamind-language');var cookieMatch=document.cookie.match(/(?:^|; )dopamind-language=([^;]+)/);var preference=stored||(cookieMatch?decodeURIComponent(cookieMatch[1]):fallback);if(!supported[preference]){preference='zh';}window.localStorage.setItem('dopamind-language',preference);document.cookie='dopamind-language='+preference+'; path=/; max-age=31536000; SameSite=Lax';var htmlLang=preference==='zh'?'zh-CN':preference;document.documentElement.setAttribute('lang',htmlLang);document.documentElement.setAttribute('data-language',preference);if(document.body){document.body.setAttribute('data-language',preference);}}catch(e){}})();`;
  const themeInitScript = `(function(){try{var stored=window.localStorage.getItem('theme');var cookieMatch=document.cookie.match(/(?:^|; )theme-preference=([^;]+)/);var preference=stored||(cookieMatch?decodeURIComponent(cookieMatch[1]):${serializedThemeFallback});if(preference!=='light'&&preference!=='dark'&&preference!=='auto'){preference='auto';}var system=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var resolved=preference==='dark'?'dark':preference==='light'?'light':system;var root=document.documentElement;root.classList.remove('light','dark');if(resolved==='dark'){root.classList.add('dark');}root.setAttribute('data-theme',resolved);if(document.body){document.body.setAttribute('data-theme',resolved);}window.localStorage.setItem('theme',preference);document.cookie='theme-preference='+preference+'; path=/; max-age=31536000; SameSite=Lax';document.cookie='theme-resolved='+resolved+'; path=/; max-age=31536000; SameSite=Lax';}catch(e){}})();`;

  return (
    <html
      lang={htmlLang}
      className={cn(inter.className, htmlClassName)}
      data-theme={dataTheme}
      data-language={initialLanguage}
      data-i18n={initialI18nState}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: languageInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
      </head>
      <body className={cn('bg-background antialiased', inter.className)} data-theme={dataTheme} data-language={initialLanguage}>
        <I18nProvider initialLanguage={initialLanguage}>
          <ThemeProvider initialTheme={initialTheme} initialActualTheme={initialActualTheme}>
            <ToastProvider>
              <AuthProvider>
                <PremiumProvider>
                  <div id="root" data-app-shell>
                    {children}
                  </div>
                  <GlobalPaywall />
                </PremiumProvider>
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

