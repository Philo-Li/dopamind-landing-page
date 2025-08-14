// web/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "../components/ClientWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dopamind",
  description: "AI-powered focus companion designed for ADHD users",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 【修改】添加 suppressHydrationWarning
    <html lang="en" suppressHydrationWarning> 
      <body className={inter.className}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}