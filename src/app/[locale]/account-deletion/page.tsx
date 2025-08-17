import Image from 'next/image';
import { Trash2, AlertTriangle, Mail, User, Key } from 'lucide-react';
import { getTranslation } from '../../../lib/i18n';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';
import AuthButton from '../../../../components/AuthButton';

interface AccountDeletionPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function AccountDeletionPage({ params }: AccountDeletionPageProps) {
  const { locale } = await params;
  const t = getTranslation(locale);

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
            <a href={`/${locale}#how-it-works`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.howItWorks}</a>
            <a href={`/${locale}/pricing`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.pricing}</a>
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
        {/* 页面标题 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trash2 className="h-12 w-12 text-red-600" />
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {t.accountDeletion.title}
              </h1>
            </div>
            <p className="text-lg text-muted md:text-xl max-w-3xl mx-auto">
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t.accountDeletion.appInfo.title}</h2>
                  <div className="space-y-2">
                    <p><strong>{t.accountDeletion.appInfo.appName}:</strong> Dopamind</p>
                    <p><strong>{t.accountDeletion.appInfo.developer}:</strong> Dopamind Inc.</p>
                    <p><strong>{t.accountDeletion.appInfo.contact}:</strong> support@dopamind.app</p>
                  </div>
                </div>
              </div>

              {/* 删除步骤 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{t.accountDeletion.steps.title}</h2>
                </div>
                <div className="space-y-4">
                  {t.accountDeletion.steps.items.map((step: {number: number, title: string, description: string}, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-sm">
                          {step.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                          <p className="text-muted">{step.description}</p>
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
                    <h2 className="text-2xl font-bold text-foreground">{t.accountDeletion.dataInfo.title}</h2>
                  </div>
                  <div className="space-y-4 text-muted">
                    <p className="font-semibold text-red-800">{t.accountDeletion.dataInfo.warning}</p>
                    <p>{t.accountDeletion.dataInfo.description}</p>
                    <div className="bg-white rounded-lg p-4">
                      <h3 className="font-semibold text-foreground mb-3">{t.accountDeletion.dataInfo.deletedData.title}</h3>
                      <ul className="space-y-2 list-disc list-inside">
                        {t.accountDeletion.dataInfo.deletedData.items.map((item: string, index: number) => (
                          <li key={index} className="text-sm">{item}</li>
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
                  <h2 className="text-2xl font-bold text-foreground">{t.accountDeletion.confirmation.title}</h2>
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
                  <h2 className="text-2xl font-bold text-foreground">{t.accountDeletion.support.title}</h2>
                </div>
                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <p className="mb-4">{t.accountDeletion.support.description}</p>
                  <div className="space-y-2">
                    <p><strong>Email: </strong>support@dopamind.app</p>
                    <p><strong>{t.accountDeletion.support.subject}: </strong>{t.accountDeletion.support.subjectText}</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">
                    {t.accountDeletion.support.responseTime}
                  </p>
                </div>
              </div>

              {/* 备选方案 */}
              <div className="mb-12">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">{t.accountDeletion.alternatives.title}</h2>
                  <p className="text-blue-800 mb-4">{t.accountDeletion.alternatives.description}</p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {t.accountDeletion.alternatives.options.map((option: {title: string, description: string}, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
                        <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                        <p className="text-sm text-muted">{option.description}</p>
                      </div>
                    ))}
                  </div>
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
                <li><a href="mailto:support@dopamind.app" className="hover:text-primary">{t.footer.links.contactUs}</a></li>
                <li><a href={`/${locale}/status`} className="hover:text-primary">{t.footer.links.status}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.legal}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${locale}/privacy`} className="hover:text-primary">{t.footer.links.privacy}</a></li>
                <li><a href={`/${locale}/terms`} className="hover:text-primary">{t.footer.links.terms}</a></li>
                <li><a href={`/${locale}/account-deletion`} className="hover:text-primary">{t.footer.links.accountDeletion}</a></li>
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