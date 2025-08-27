import { Mail, MessageCircle, Book } from 'lucide-react';
import { getTranslation } from '../../../lib/i18n';

interface SupportPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = await params;
  const t = getTranslation(locale);

  return (
    <>
        {/* 页面标题 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
              {t.support.title}
            </h1>
            <p className="mt-4 text-lg text-muted md:text-xl">
              {t.support.subtitle}
            </p>
          </div>
        </section>

        {/* 快速联系方式 */}
        <section className="w-full bg-gray-50 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm">
                <Mail className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground">{t.support.contact.email.title}</h3>
                <p className="text-sm text-muted text-center mt-2">
                  {t.support.contact.email.description}
                </p>
                <p className="text-xs text-muted mt-1">{t.support.contact.email.response}</p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm">
                <MessageCircle className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground">{t.support.contact.feedback.title}</h3>
                <p className="text-sm text-muted text-center mt-2">
                  {t.support.contact.feedback.description}
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-white p-6 shadow-sm">
                <Book className="h-8 w-8 text-primary mb-3" />
                <h3 className="text-lg font-semibold text-foreground">{t.support.contact.guide.title}</h3>
                <p className="text-sm text-muted text-center mt-2">
                  {t.support.contact.guide.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ 部分 */}
        <section className="w-full py-16 md:py-20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              {t.support.faq.title}
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              {/* 这里可以添加实际的 FAQ 内容 */}
              <div className="border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground bg-gray-50 px-6 py-4 border-b border-gray-200">
                  {t.support.faq.categories.account}
                </h3>
                <div className="p-6">
                  <p className="text-muted">FAQ 内容将根据具体需求添加...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能指南链接 */}
        <section className="w-full bg-gray-50 py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-foreground mb-8">
              {t.support.guides.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <a href="#" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.support.guides.quickStart.title}</h3>
                <p className="text-sm text-muted">{t.support.guides.quickStart.description}</p>
              </a>
              <a href="#" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.support.guides.aiCoach.title}</h3>
                <p className="text-sm text-muted">{t.support.guides.aiCoach.description}</p>
              </a>
              <a href="#" className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.support.guides.focus.title}</h3>
                <p className="text-sm text-muted">{t.support.guides.focus.description}</p>
              </a>
            </div>
          </div>
        </section>

        {/* 联系我们 */}
        <section className="w-full py-16">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {t.support.stillNeedHelp.title}
            </h2>
            <p className="text-lg text-muted mb-8 max-w-2xl mx-auto">
              {t.support.stillNeedHelp.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@dopamind.com"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
              >
                <Mail className="h-5 w-5" />
                {t.support.stillNeedHelp.sendEmail}
              </a>
              <p className="text-sm text-muted">
                {t.support.stillNeedHelp.responseTime}
              </p>
            </div>
          </div>
        </section>
    </>
  );
}