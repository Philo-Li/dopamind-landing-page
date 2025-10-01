import { Mail, MessageCircle, Book } from 'lucide-react';
import { getLandingTranslation } from '@/lib/i18n';

interface SupportPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { locale } = await params;
  const t = getLandingTranslation(locale);

  return (
    <>
        {/* 页面标题和快速联系方式 */}
        <section className="w-full bg-gradient-to-br from-marketing-heroBgFrom to-marketing-heroBgTo">
          {/* 页面标题 */}
          <div className="container mx-auto px-4 text-center md:px-6 py-16 md:py-20">
            <h1 className="text-4xl font-extrabold tracking-tight text-marketing-foreground md:text-5xl">
              {t.support.title}
            </h1>
            <p className="mt-4 text-lg text-marketing-textSecondary md:text-xl">
              {t.support.subtitle}
            </p>
          </div>

          {/* 快速联系方式 */}
          <div className="w-full pb-16 md:pb-20">
            <div className="container mx-auto px-4 md:px-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center rounded-lg bg-marketing-cardBg p-6 shadow-sm">
                  <Mail className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold text-marketing-foreground">{t.support.contact.email.title}</h3>
                  <p className="text-sm text-marketing-textSecondary text-center mt-2">
                    {t.support.contact.email.description}
                  </p>
                  <p className="text-xs text-marketing-textSecondary mt-1">{t.support.contact.email.response}</p>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-marketing-cardBg p-6 shadow-sm">
                  <MessageCircle className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold text-marketing-foreground">{t.support.contact.feedback.title}</h3>
                  <p className="text-sm text-marketing-textSecondary text-center mt-2">
                    {t.support.contact.feedback.description}
                  </p>
                </div>
                <div className="flex flex-col items-center rounded-lg bg-marketing-cardBg p-6 shadow-sm">
                  <Book className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-semibold text-marketing-foreground">{t.support.contact.guide.title}</h3>
                  <p className="text-sm text-marketing-textSecondary text-center mt-2">
                    {t.support.contact.guide.description}
                  </p>
                </div>
              </div>

              {/* Community Links */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-center text-marketing-foreground mb-6">{t.footer.sections.community}</h3>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://discord.gg/E9tEAYNaqK"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    {t.footer.links.discord}
                  </a>
                  <a
                    href="https://x.com/dopamindai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                    </svg>
                    {t.footer.links.twitter}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ 部分 */}
        <section className="w-full py-16 md:py-20 bg-marketing-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-marketing-foreground mb-12">
              {t.support.faq.title}
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              {/* 这里可以添加实际的 FAQ 内容 */}
              <div className="border border-marketing-border rounded-lg">
                <h3 className="text-lg font-semibold text-marketing-foreground bg-marketing-background px-6 py-4 border-b border-marketing-border">
                  {t.support.faq.categories.account}
                </h3>
                <div className="p-6">
                  <p className="text-marketing-textSecondary">FAQ 内容将根据具体需求添加...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 功能指南链接 */}
        <section className="w-full bg-marketing-background py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center text-marketing-foreground mb-8">
              {t.support.guides.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              <a href="#" className="block p-6 bg-marketing-cardBg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.support.guides.quickStart.title}</h3>
                <p className="text-sm text-marketing-textSecondary">{t.support.guides.quickStart.description}</p>
              </a>
              <a href="#" className="block p-6 bg-marketing-cardBg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.support.guides.aiCoach.title}</h3>
                <p className="text-sm text-marketing-textSecondary">{t.support.guides.aiCoach.description}</p>
              </a>
              <a href="#" className="block p-6 bg-marketing-cardBg rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-primary mb-2">{t.support.guides.focus.title}</h3>
                <p className="text-sm text-marketing-textSecondary">{t.support.guides.focus.description}</p>
              </a>
            </div>
          </div>
        </section>

        {/* 联系我们 */}
        <section className="w-full py-16">
          <div className="container mx-auto px-4 text-center md:px-6">
            <h2 className="text-3xl font-bold text-marketing-foreground mb-4">
              {t.support.stillNeedHelp.title}
            </h2>
            <p className="text-lg text-marketing-textSecondary mb-8 max-w-2xl mx-auto">
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
              <p className="text-sm text-marketing-textSecondary">
                {t.support.stillNeedHelp.responseTime}
              </p>
            </div>
          </div>
        </section>
    </>
  );
}

