import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ROUTES, footerKeys, site } from '@/content/site';
import { t as tr } from '@/content/types';
import type { Locale } from '@/content/types';

export function Footer() {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');
  const locale = useLocale() as Locale;

  return (
    <footer className="border-t-[1.5px] border-on-surface bg-primary text-on-primary">
      <div className="mx-auto grid max-w-[1140px] gap-12 px-6 pb-8 pt-16
                      md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="font-heading text-headline-small">{tf('orgName')}</p>
          <p className="mt-1.5 text-body-small text-secondary-container">
            {tr(site.foundation, locale)}
          </p>
          <p className="mt-5 font-quote text-title-large italic text-tertiary-container">
            {site.motto}
          </p>
          <address className="mt-5 not-italic text-body-small text-secondary-container">
            {site.addressLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </address>
        </div>

        <nav aria-label={tf('pages')}>
          <p className="mb-3.5 font-heading text-label-medium text-secondary-container">
            {tf('pages')}
          </p>
          {footerKeys.map((key) => (
            <Link
              key={key}
              href={ROUTES[key]}
              className="block py-1 text-body-medium text-on-primary no-underline
                         transition-colors duration-200 ease-standard hover:text-tertiary-container"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div>
          <p className="mb-3.5 font-heading text-label-medium text-secondary-container">
            {tf('contact')}
          </p>
          <p className="text-body-medium">{site.phone}</p>
          <a href={`https://wa.me/${site.whatsappE164}`} className="block text-body-medium text-on-primary no-underline hover:text-tertiary-container">
            {site.whatsapp}
          </a>
          <a href={`mailto:${site.email}`} className="block text-body-medium text-on-primary no-underline hover:text-tertiary-container">
            {site.email}
          </a>
          <p className="mt-4 text-body-medium">Instagram {site.instagram}</p>
          <p className="text-body-medium">Facebook {site.facebook}</p>
          <div className="mt-5 text-body-small text-secondary-container">
            {site.hours.map((h) => (
              <p key={h.day.en}>
                {tr(h.day, locale)} {tr(h.open, locale)}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1140px] flex-wrap justify-between gap-6 border-t-[1.5px]
                      border-secondary-container/40 px-6 pb-10 pt-5 text-body-small
                      text-secondary-container">
        <span>{tr(site.accreditationNote, locale)}</span>
        <span>{tf('rights')}</span>
      </div>
    </footer>
  );
}
