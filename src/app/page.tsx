import Image from 'next/image';
import Link from 'next/link';
import { Globe, ChevronRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dopamind - Choose Your Language',
  description: 'AI-powered focus companion designed for ADHD users. Choose your language to get started.',
  alternates: {
    canonical: 'https://www.dopamind.app/',
    languages: {
      'en': 'https://www.dopamind.app/en',
      'zh': 'https://www.dopamind.app/zh',
      'ja': 'https://www.dopamind.app/ja',
      'x-default': 'https://www.dopamind.app/',
    },
  },
};

const languages = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image 
              src="/dopamind-logo.png"
              alt="Dopamind Logo" 
              width={32}
              height={32}
              className="rounded-[8px]"
            />
            <span className="text-xl font-bold text-foreground">Dopamind</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Logo and Title */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Choose Your Language
            </h1>
            <p className="text-muted">
              Select your preferred language to continue
            </p>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            {languages.map((language) => (
              <Link
                key={language.code}
                href={`/${language.code}`}
                className="flex items-center justify-between w-full p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-primary/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium text-foreground group-hover:text-primary">
                      {language.nativeName}
                    </div>
                    <div className="text-sm text-muted">
                      {language.name}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted group-hover:text-primary" />
              </Link>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-sm text-muted">
            <p>AI-powered focus companion designed for ADHD users</p>
          </div>
        </div>
      </main>
    </div>
  );
}