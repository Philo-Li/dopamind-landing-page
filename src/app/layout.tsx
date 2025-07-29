// web/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dopamind",
  description: "专为 ADHD 用户设计的 AI 专注伙伴",
  icons: {
    icon: [
      { url: '/dopamind-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/dopamind-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/dopamind-logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/dopamind-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 【修改】添加 suppressHydrationWarning
    <html lang="en" suppressHydrationWarning> 
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}