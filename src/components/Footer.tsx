import Image from 'next/image';
import { getTranslation } from '../lib/i18n';

interface FooterProps {
  locale: string;
  logoAlt?: string;
}

export default function Footer({ locale, logoAlt = "Dopamind Logo" }: FooterProps) {
  const t = getTranslation(locale);

  return (
    <footer className="w-full border-t border-gray-200 bg-white py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-5">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/dopamind-logo.png"
                alt={logoAlt}
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
              <li><a href={`/${locale}`} className="hover:text-primary transition-colors">{t.navigation.home}</a></li>
              <li><a href={`/${locale}#features`} className="hover:text-primary transition-colors">{t.navigation.features}</a></li>
              <li><a href={`/${locale}#how-it-works`} className="hover:text-primary transition-colors">{t.navigation.howItWorks}</a></li>
              <li><a href={`/${locale}/pricing`} className="hover:text-primary transition-colors">{t.navigation.pricing}</a></li>
              <li><a href={`/${locale}/download`} className="hover:text-primary transition-colors">Download</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.support}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href={`/${locale}/support`} className="hover:text-primary transition-colors">{t.footer.links.supportCenter}</a></li>
              <li><a href="mailto:support@dopamind.com" className="hover:text-primary transition-colors">{t.footer.links.contactUs}</a></li>
              <li><a href={`/${locale}/status`} className="hover:text-primary transition-colors">{t.footer.links.status}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.community}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="https://discord.gg/E9tEAYNaqK" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{t.footer.links.discord}</a></li>
              <li><a href="https://x.com/dopamindai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{t.footer.links.twitter}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t.footer.sections.legal}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href={`/${locale}/privacy`} className="hover:text-primary transition-colors">{t.footer.links.privacy}</a></li>
              <li><a href={`/${locale}/terms`} className="hover:text-primary transition-colors">{t.footer.links.terms}</a></li>
              <li><a href={`/${locale}/account-deletion`} className="hover:text-primary transition-colors">{t.footer.links.accountDeletion}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t.footer.links.cookies}</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-muted">
          <p>&copy; {new Date().getFullYear()} Dopamind Inc. {t.footer.copyright}.</p>
        </div>
      </div>
    </footer>
  );
}