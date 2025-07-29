import Image from 'next/image';
import { Shield, Lock, Eye, Users, Calendar, Mail } from 'lucide-react';
import { getTranslation } from '../../../../lib/i18n';
import LanguageSwitcher from '../../../../components/LanguageSwitcher';

interface PrivacyPageProps {
  params: {
    locale: string;
  };
}

export default function PrivacyPage({ params }: PrivacyPageProps) {
  const t = getTranslation(params.locale);

  return (
    <div className="flex min-h-screen flex-col">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <a href={`/${params.locale}`} className="flex items-center gap-2">
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
            <a href={`/${params.locale}`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.home}</a>
            <a href={`/${params.locale}#features`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.features}</a>
            <a href={`/${params.locale}#pricing`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.pricing}</a>
            <a href={`/${params.locale}/support`} className="text-sm font-medium text-muted transition-colors hover:text-primary">{t.navigation.support}</a>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLocale={params.locale} />
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

      {/* 主要内容 */}
      <main className="flex-1">
        {/* 页面标题 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {t.privacy.title}
              </h1>
            </div>
            <p className="text-lg text-muted md:text-xl max-w-3xl mx-auto">
              {t.privacy.subtitle}
            </p>
            <p className="text-sm text-muted mt-4">
              {t.privacy.lastUpdated}：{new Date().getFullYear()}年{new Date().getMonth() + 1}月{new Date().getDate()}日
            </p>
          </div>
        </section>

        {/* 隐私政策内容 */}
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* 1. 引言 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">1. {t.privacy.sections.introduction.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.privacy.sections.introduction.content}</p>
                </div>
              </div>

              {/* 2. 我们收集的信息 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">2. {t.privacy.sections.dataCollection.title}</h2>
                </div>
                <div className="space-y-6 text-muted leading-relaxed">
                  <p>{t.privacy.sections.dataCollection.subtitle}</p>
                  
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{t.privacy.sections.dataCollection.directInfo.title}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      {t.privacy.sections.dataCollection.directInfo.items.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">{t.privacy.sections.dataCollection.autoInfo.title}</h3>
                    <ul className="space-y-2 list-disc list-inside">
                      {t.privacy.sections.dataCollection.autoInfo.items.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. 我们如何使用您的信息 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">3. {t.privacy.sections.dataUsage.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <div className="grid gap-4 md:grid-cols-2">
                    {t.privacy.sections.dataUsage.items.map((item: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. 我们如何分享您的信息 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">4. {t.privacy.sections.dataSharing.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                    <p className="font-semibold text-green-800 mb-2">我们的承诺</p>
                    <p className="text-green-700">{t.privacy.sections.dataSharing.promise}</p>
                  </div>
                  <ul className="space-y-3 list-disc list-inside">
                    {t.privacy.sections.dataSharing.exceptions.map((exception: string, index: number) => (
                      <li key={index}>{exception}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 5. 数据安全 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">5. {t.privacy.sections.dataSecurity.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.privacy.sections.dataSecurity.subtitle}</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {t.privacy.sections.dataSecurity.measures.map((measure: any, index: number) => (
                      <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                        <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                        <h4 className="font-semibold text-foreground mb-1">{measure.title}</h4>
                        <p className="text-sm">{measure.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. 您的权利与选择 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">6. {t.privacy.sections.userRights.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.privacy.sections.userRights.subtitle}</p>
                  <div className="space-y-4">
                    {t.privacy.sections.userRights.rights.map((right: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-foreground mb-2">{right.title}</h4>
                        <p className="text-sm">{right.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7. 儿童隐私 */}
              <div className="mb-12">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">7. {t.privacy.sections.childrenPrivacy.title}</h2>
                  <p className="text-muted">{t.privacy.sections.childrenPrivacy.content}</p>
                </div>
              </div>

              {/* 8. 政策变更 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">8. {t.privacy.sections.policyChanges.title}</h2>
                </div>
                <div className="space-y-4 text-muted leading-relaxed">
                  <p>{t.privacy.sections.policyChanges.content}</p>
                  <ul className="space-y-2 list-disc list-inside">
                    {t.privacy.sections.policyChanges.methods.map((method: string, index: number) => (
                      <li key={index}>{method}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 9. 联系我们 */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">9. {t.privacy.sections.contact.title}</h2>
                </div>
                <div className="bg-gray-900 text-white rounded-lg p-6">
                  <p className="mb-4">{t.privacy.sections.contact.subtitle}</p>
                  <div className="space-y-2">
                    <p><strong>邮箱：</strong> {t.privacy.sections.contact.email}</p>
                    <p><strong>支持邮箱：</strong> {t.privacy.sections.contact.support}</p>
                  </div>
                  <p className="mt-4 text-sm text-gray-300">
                    {t.privacy.sections.contact.responseTime}
                  </p>
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
                <li><a href={`/${params.locale}`} className="hover:text-primary">{t.navigation.home}</a></li>
                <li><a href={`/${params.locale}#features`} className="hover:text-primary">{t.footer.links.features}</a></li>
                <li><a href={`/${params.locale}#pricing`} className="hover:text-primary">{t.footer.links.pricing}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.support}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${params.locale}/support`} className="hover:text-primary">{t.footer.links.supportCenter}</a></li>
                <li><a href="mailto:support@dopamind.com" className="hover:text-primary">{t.footer.links.contactUs}</a></li>
                <li><a href="#" className="hover:text-primary">{t.footer.links.status}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.legal}</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><a href={`/${params.locale}/privacy`} className="hover:text-primary">{t.footer.links.privacy}</a></li>
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