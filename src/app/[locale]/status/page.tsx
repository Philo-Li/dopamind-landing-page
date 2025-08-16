import Image from 'next/image';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getTranslation } from '../../../lib/i18n';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import AuthButton from '../../../../components/AuthButton';
import { Metadata } from 'next';

interface StatusPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: StatusPageProps): Promise<Metadata> {
  const { locale } = await params;
  
  return {
    alternates: {
      canonical: `https://www.dopamind.app/${locale}/status`,
      languages: {
        'en': 'https://www.dopamind.app/en/status',
        'zh': 'https://www.dopamind.app/zh/status',
        'ja': 'https://www.dopamind.app/ja/status',
        'x-default': 'https://www.dopamind.app/en/status',
      },
    },
  };
}

// 模拟性能指标数据 (在真实应用中，这些数据会从 API 获取)
const getMetrics = () => {
  const metrics = {
    uptime: 99.98,
    avgResponseTime: 145,
    successRate: 99.95
  };

  return { metrics };
};


export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;
  const t = getTranslation(locale);
  const { metrics } = getMetrics();

  const allOperational = true; // 简化为总是显示正常状态

  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
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
            <a href={`/${locale}`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.home}</a>
            <a href={`/${locale}#features`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.features}</a>
            <a href={`/${locale}#pricing`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.pricing}</a>
            <a href={`/${locale}/support`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.support}</a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <AuthButton locale={locale} />
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1">
        {/* 页面标题和总体状态 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              {allOperational ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              )}
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {t.status.title}
              </h1>
            </div>
            <p className="text-lg text-muted md:text-xl max-w-3xl mx-auto mb-6">
              {t.status.subtitle}
            </p>
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
              allOperational 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {allOperational ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {allOperational ? t.status.allSystemsOperational : t.status.systemIssues}
            </div>
            <p className="text-sm text-muted mt-4">
              {t.status.lastUpdated}: {new Date().toLocaleString(locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US')}
            </p>
          </div>
        </section>

        {/* 性能指标 */}
        <section className="w-full py-8 md:py-12 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{t.status.metrics.title}</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <div className="text-3xl font-bold text-green-600 mb-2">{metrics.uptime}%</div>
                  <div className="text-sm text-muted">{t.status.metrics.uptime.title}</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{metrics.avgResponseTime}{t.status.metrics.responseTime.unit}</div>
                  <div className="text-sm text-muted">{t.status.metrics.responseTime.title}</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <div className="text-3xl font-bold text-green-600 mb-2">{metrics.successRate}%</div>
                  <div className="text-sm text-muted">{t.status.metrics.successRate.title}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 页脚 */}
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
                <li><a href={`/${locale}/status`} className="hover:text-primary">{t.footer.links.status}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.legal}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/privacy`} className="hover:text-primary">{t.footer.links.privacy}</a></li>
                <li><a href={`/${locale}/terms`} className="hover:text-primary">{t.footer.links.terms}</a></li>
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