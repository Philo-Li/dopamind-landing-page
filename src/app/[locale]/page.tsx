import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { getTranslation } from '../../../lib/i18n';
import LanguageSwitcher from '../../../components/LanguageSwitcher';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = getTranslation(locale);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 1. 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a href={`/${locale}`} className="flex items-center gap-2">
            <Image 
              src="/dopamind-logo.png"
              alt="Dopamind Logo" 
              width={32}
              height={32}
              className="rounded-[8px]"
            />
            <span className="text-xl font-bold text-foreground">Dopamind</span>
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            <a href={`/${locale}#features`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.features}</a>
            <a href={`/${locale}#pricing`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.pricing}</a>
            <a href={`/${locale}/support`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.support}</a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <a href="#" className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.login}</a>
            <a
              href="#"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600"
            >
              {t.navigation.signup}
            </a>
          </div>
        </div>
      </header>

      {/* 2. 英雄区域 */}
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40 animate-fade-in">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="inline-block rounded-lg bg-orange-100 px-3 py-1 text-sm font-medium text-primary animate-fade-in-up">
                {t.hero.badge}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl animate-fade-in-up [animation-delay:0.1s]">
                {t.hero.title}<span className="text-primary">{t.hero.titleHighlight1}</span>与<span className="text-primary">{t.hero.titleHighlight2}</span>
              </h1>
              <p className="text-lg text-muted md:text-xl animate-fade-in-up [animation-delay:0.2s]">
                {t.hero.subtitle}
              </p>
              <div className="flex justify-center gap-4 animate-fade-in-up [animation-delay:0.3s]">
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
                >
                  {t.hero.ctaPrimary}
                </a>
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-8 text-base font-semibold text-muted shadow-lg transition-transform hover:scale-105 hover:bg-gray-100"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 社交证明区域 */}
        <section className="w-full bg-gray-100 py-12 md:py-20 animate-fade-in-up [animation-delay:0.4s]">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 text-center md:grid-cols-3 md:px-6">
            {t.socialProof.map((item: any, index: number) => (
              <div key={index} className="flex flex-col items-center justify-center">
                <p className="text-4xl font-bold text-primary">{item.value}</p>
                <p className="text-sm font-medium text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. 特性介绍区域 */}
        <section id="features" className="w-full py-20 md:py-32">
          <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:px-6 lg:gap-20">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t.features.title}
              </h2>
              <p className="text-muted md:text-lg">
                {t.features.subtitle}
              </p>
              <ul className="space-y-3 pt-4">
                {t.features.list.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <Image 
                src="/app-screenshot.svg" 
                alt="App Screenshot" 
                width={300} 
                height={600}
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </section>
        
        {/* 5. 最终行动号召 (CTA) */}
        <section className="w-full bg-gray-900 py-20 md:py-28">
            <div className="container mx-auto px-4 text-center text-white md:px-6">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {t.cta.title}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-300">
                    {t.cta.subtitle}
                </p>
                <div className="mt-8 flex justify-center">
                    <a href="#">
                      <Image src="/download-app-store.svg" alt="Download on the App Store" width={160} height={54} />
                    </a>
                </div>
            </div>
        </section>
      </main>

      {/* 6. 页脚 */}
      <footer className="w-full border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image 
                  src="/dopamind-logo.png"
                  alt="Dopamind Logo" 
                  width={24}
                  height={24}
                  className="rounded-[6px]"
                />
                <span className="font-bold text-foreground">Dopamind</span>
              </div>
              <p className="text-sm text-muted">
                {t.footer.description}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.product}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}`} className="hover:text-primary">{t.navigation.home}</a></li>
                <li><a href={`/${locale}#features`} className="hover:text-primary">{t.footer.links.features}</a></li>
                <li><a href={`/${locale}#pricing`} className="hover:text-primary">{t.footer.links.pricing}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.support}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/support`} className="hover:text-primary">{t.footer.links.supportCenter}</a></li>
                <li><a href="mailto:support@dopamind.com" className="hover:text-primary">{t.footer.links.contactUs}</a></li>
                <li><a href="#" className="hover:text-primary">{t.footer.links.status}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.legal}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/privacy`} className="hover:text-primary">{t.footer.links.privacy}</a></li>
                <li><a href="#" className="hover:text-primary">{t.footer.links.terms}</a></li>
                <li><a href="#" className="hover:text-primary">{t.footer.links.cookies}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-muted">
            <p>&copy; {new Date().getFullYear()} Dopamind Inc. {t.footer.copyright}.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}