import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { activities } from '@/content/gallery';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { GalleryGrid } from '@/components/sections/GalleryGrid';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tg = await getTranslations({ locale, namespace: 'gallery' });
  return {
    title: tg('title'),
    alternates: { canonical: `/${locale}/gallery`, languages: { id: '/id/gallery', en: '/en/gallery' } },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tg = await getTranslations('gallery');

  return (
    <main>
      <PageHero eyebrow={tg('eyebrow')} title={tg('title')} />

      <Section>
        <GalleryGrid />
      </Section>

      <Section bordered={false}>
        <h2 className="mb-7 text-headline-large">{tg('activities')}</h2>
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a) => (
            <div key={a.title.en} className="border-t-[1.5px] border-outline-variant py-4.5">
              <p className="font-heading text-title-large text-primary">{t(a.title, locale)}</p>
              <p className="mt-1 text-body-medium">{t(a.body, locale)}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
