import { getLandingTranslation } from '@/lib/i18n';
import { defaultHomeContent } from '@/content/defaultLandingContent';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import MarketingBodyClass from '@/components/MarketingBodyClass';
import HomePageContent from '../components/HomePageContent';
import SmartLanguageBanner from '../components/SmartLanguageBanner';

const locale = 'en';

// SEO优化的英文alt标签
const getImageAlt = (key: string) => {
  const altTexts = {
    logo: "Dopamind - AI-powered focus companion for ADHD users"
  };
  return altTexts[key as keyof typeof altTexts] || altTexts.logo;
};

export default function HomePage() {
  const translations = getLandingTranslation('en');
  const t = translations.home ?? defaultHomeContent;

  return (
    <>
      <MarketingBodyClass />
      <div className="flex min-h-screen flex-col bg-gradient-to-b from-white to-gray-50">
        {/* 智能语言提示横幅 */}
        <SmartLanguageBanner />

        {/* Header */}
        <Navigation locale={locale} logoAlt={getImageAlt('logo')} />

        <main>
          <HomePageContent locale={locale} translations={t} />
        </main>

        {/* Footer */}
        <Footer locale={locale} logoAlt={getImageAlt('logo')} />
      </div>
    </>
  );
}









