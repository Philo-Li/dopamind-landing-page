import { Trash2, AlertTriangle, Mail, User, Key } from 'lucide-react';
import { getLandingTranslation } from '@/lib/i18n';

interface AccountDeletionPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AccountDeletionPage({ params }: AccountDeletionPageProps) {
  const { locale } = await params;
  const t = getLandingTranslation(locale);

  return (
    <>
        {/* 页面标题 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trash2 className="h-12 w-12 text-red-600" />
              <h1 className="text-4xl font-extrabold tracking-tight text-marketing-foreground md:text-5xl">
                {t.accountDeletion.title}
              </h1>
            </div>
            <p className="text-lg text-marketing-textSecondary md:text-xl max-w-3xl mx-auto">
              {t.accountDeletion.subtitle}
            </p>
          </div>
        </section>

        {/* 账户删除指南 */}
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              
              {/* 应用信息 */}
              <div className="mb-12">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-marketing-foreground mb-4">{t.accountDeletion.appInfo.title}</h2>
                  <div className="space-y-2">
                    <p className="text-marketing-foreground"><strong>{t.accountDeletion.appInfo.appName}:</strong> Dopamind</p>
                    <p className="text-marketing-foreground"><strong>{t.accountDeletion.appInfo.developer}:</strong> Dopamind Inc.</p>
                    <p className="text-marketing-foreground"><strong>{t.accountDeletion.appInfo.contact}:</strong> support@dopamind.app</p>
                  </div>
                </div>
              </div>

              {/* 删除步骤 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-marketing-foreground">{t.accountDeletion.steps.title}</h2>
                </div>
                <div className="space-y-4">
                  {t.accountDeletion.steps.items.map((step: {number: number, title: string, description: string}, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-marketing-foreground mb-2">{step.title}</h3>
                          <p className="text-marketing-textSecondary">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 数据说明 */}
              <div className="mb-12">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    <h2 className="text-2xl font-bold text-marketing-foreground">{t.accountDeletion.dataInfo.title}</h2>
                  </div>
                  <div className="space-y-4 text-marketing-textSecondary">
                    <p className="font-semibold text-red-800">{t.accountDeletion.dataInfo.warning}</p>
                    <p>{t.accountDeletion.dataInfo.description}</p>
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-marketing-foreground mb-3">{t.accountDeletion.dataInfo.deletedData.title}</h3>
                      <ul className="space-y-2 list-disc list-inside">
                        {t.accountDeletion.dataInfo.deletedData.items.map((item: string, index: number) => (
                          <li key={index} className="text-sm text-marketing-textSecondary">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 额外确认步骤 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                    <Key className="h-5 w-5 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-marketing-foreground">{t.accountDeletion.confirmation.title}</h2>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <p className="text-yellow-800 mb-4">{t.accountDeletion.confirmation.description}</p>
                  <div className="space-y-2">
                    {t.accountDeletion.confirmation.requirements.map((requirement: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-yellow-600 rounded-full"></div>
                        <span className="text-sm text-yellow-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 联系支持 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Mail className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-marketing-foreground">{t.accountDeletion.support.title}</h2>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="mb-4 text-marketing-textSecondary">{t.accountDeletion.support.description}</p>
                  <div className="space-y-2">
                    <p className="text-marketing-foreground"><strong>Email: </strong>support@dopamind.app</p>
                    <p className="text-marketing-foreground"><strong>{t.accountDeletion.support.subject}: </strong>{t.accountDeletion.support.subjectText}</p>
                  </div>
                  <p className="mt-4 text-sm text-marketing-textSecondary">
                    {t.accountDeletion.support.responseTime}
                  </p>
                </div>
              </div>

              {/* 备选方案 */}
              <div className="mb-12">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-marketing-foreground mb-4">{t.accountDeletion.alternatives.title}</h2>
                  <p className="text-blue-800 mb-4">{t.accountDeletion.alternatives.description}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {t.accountDeletion.alternatives.options.map((option: {title: string, description: string}, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-marketing-foreground mb-2">{option.title}</h3>
                        <p className="text-sm text-marketing-textSecondary">{option.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
    </>
  );
}

