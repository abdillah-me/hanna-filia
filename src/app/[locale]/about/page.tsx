import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { about } from '@/content/about';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { PhotoSlot } from '@/components/media/PhotoSlot';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const ta = await getTranslations({ locale, namespace: 'about' });
  return pageMetadata(locale, '/about', ta('title'), t(about.vision, locale));
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ta = await getTranslations('about');

  return (
    <main>
      <PageHero title={ta('title')} />

      <Section>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14">
          <div className="max-w-[68ch]">
            {about.history.map((para) => (
              <p key={para.en} className="mb-5 text-body-large last:mb-0">
                {t(para, locale)}
              </p>
            ))}
          </div>
          <PhotoSlot
            imageKey="building-front"
            className="border border-outline-variant"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        </div>
      </Section>

      <Section tone="sand">
        <h2 className="sr-only">{ta('vision')}</h2>
        <p className="max-w-[40ch] text-quote">{t(about.vision, locale)}</p>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{ta('mission')}</h2>
            {about.mission.map((m) => (
              <p key={m.en} className="border-t border-outline-variant py-4 text-body-medium">
                {t(m, locale)}
              </p>
            ))}
          </div>
          <div>
            <h2 className="mb-5 text-headline-small">{ta('values')}</h2>
            {about.values.map((v) => (
              <div key={v.title.en} className="border-t border-outline-variant py-4">
                <p className="font-heading text-title-large text-primary">{t(v.title, locale)}</p>
                <p className="mt-1 text-body-medium">{t(v.body, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section bordered={false}>
        <h2 className="mb-6 text-headline-small">{ta('facilities')}</h2>
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.facilities.map((f) => (
            <p key={f.en} className="border-t border-outline-variant py-3.5 text-body-medium">
              {t(f, locale)}
            </p>
          ))}
        </div>
      </Section>
    </main>
  );
}
