import PricingSection from '../../../components/PricingSection';
import { getLandingTranslation } from '@/lib/i18n';

interface PricingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const t = getLandingTranslation(locale);

  return (
    <>
        <PricingSection locale={locale} />

        {/* FAQ Section */}
        <section className="w-full py-20 md:py-32 bg-marketing-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-marketing-foreground md:text-4xl mb-4">
                {t.pricing.faq.title}
              </h2>
              <p className="text-lg text-marketing-textSecondary md:text-xl">
                {t.pricing.faq.subtitle}
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {t.pricing.faq.items.map((item: any, index: number) => (
                <div key={index} className="bg-marketing-cardBg rounded-xl p-6 shadow-sm border border-marketing-border">
                  <h3 className="text-lg font-semibold text-marketing-foreground mb-2">{item.question}</h3>
                  <p className="text-marketing-textSecondary">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}