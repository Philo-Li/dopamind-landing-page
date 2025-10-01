import { CheckCircle, AlertCircle } from 'lucide-react';
import { getLandingTranslation } from '@/lib/i18n';
import { fetchHealthStatus, getFallbackHealthStatus, isSystemOperational } from '../../../lib/healthApi';
import { Metadata } from 'next';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

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

// 获取健康状态数据
const getHealthData = async () => {
  const healthResponse = await fetchHealthStatus();

  if (healthResponse.success && healthResponse.data) {
    return {
      health: healthResponse.data,
      isOperational: isSystemOperational(healthResponse.data)
    };
  } else {
    // 使用 fallback 数据当 API 不可用时
    const fallbackHealth = getFallbackHealthStatus();
    return {
      health: fallbackHealth,
      isOperational: false,
      error: healthResponse.error
    };
  }
};


export default async function StatusPage({ params }: StatusPageProps) {
  const { locale } = await params;
  const t = getLandingTranslation(locale);
  const { health, isOperational, error } = await getHealthData();

  return (
    <>
        {/* 页面标题和服务状态 */}
        <section className="w-full bg-gradient-to-br from-marketing-heroBgFrom to-marketing-heroBgTo">
          {/* 页面标题和总体状态 */}
          <div className="container mx-auto px-4 text-center md:px-6 py-16 md:py-20">
            <div className="flex items-center justify-center gap-3 mb-6">
              {isOperational ? (
                <CheckCircle className="h-12 w-12 text-green-500" />
              ) : (
                <AlertCircle className="h-12 w-12 text-yellow-500" />
              )}
              <h1 className="text-4xl font-extrabold tracking-tight text-marketing-foreground md:text-5xl">
                {t.status.title}
              </h1>
            </div>
            <p className="text-lg text-marketing-textSecondary md:text-xl max-w-3xl mx-auto mb-6">
              {t.status.subtitle}
            </p>
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
              isOperational
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            }`}>
              {isOperational ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {isOperational ? t.status.allSystemsOperational : t.status.systemIssues}
            </div>
            <p className="text-sm text-marketing-textSecondary mt-4">
              {t.status.lastUpdated}: {health.lastUpdated ? new Date(health.lastUpdated).toLocaleString(locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US') : new Date().toLocaleString(locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja-JP' : 'en-US')}
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-2 bg-red-50 px-4 py-2 rounded-md inline-block">
                ⚠️ {error}
              </p>
            )}
          </div>

          {/* 服务状态详情 */}
          {health.services && Object.keys(health.services).length > 0 && (
          <div className="w-full pb-16 md:pb-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-marketing-foreground mb-8 text-center">Service Status</h2>
                <div className="space-y-3">
                  {Object.entries(health.services).map(([serviceName, serviceStatus]) => (
                    <div
                      key={serviceName}
                      className="bg-white/80 backdrop-blur-sm rounded-lg p-5 border border-gray-200/80 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`flex-shrink-0 w-2 h-2 rounded-full ${
                            serviceStatus.status === 'healthy'
                              ? 'bg-green-500'
                              : serviceStatus.status === 'degraded'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-marketing-foreground capitalize">
                              {serviceName}
                            </h3>
                            {serviceStatus.message && (
                              <p className="text-sm text-marketing-textSecondary mt-0.5 truncate">
                                {serviceStatus.message}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className={`flex-shrink-0 text-sm font-medium capitalize ${
                          serviceStatus.status === 'healthy'
                            ? 'text-green-600'
                            : serviceStatus.status === 'degraded'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {serviceStatus.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        </section>
    </>
  );
}

