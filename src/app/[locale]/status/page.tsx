import { CheckCircle, AlertCircle } from 'lucide-react';
import { getTranslation } from '../../../lib/i18n';
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
    <>
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
    </>
  );
}