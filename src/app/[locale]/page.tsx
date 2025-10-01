import { getTranslation } from '@/lib/i18n';
import HomePageContent from '../../components/HomePageContent';

interface HomePageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = getTranslation(locale);

  return <HomePageContent locale={locale} translations={t.home} />;
}


