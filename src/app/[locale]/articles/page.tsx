import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { articles } from '@/content/articles';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import type { ImageKey } from '@/content/images';
import { PageHero } from '@/components/sections/PageHero';
import { Card } from '@/components/m3/Card';
import { Reveal } from '@/components/Reveal';
import { PhotoSlot } from '@/components/media/PhotoSlot';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const ta = await getTranslations({ locale, namespace: 'articles' });
  return {
    ...pageMetadata(locale, '/articles', ta('title'), ta('body')),
    // Placeholder cards only: kept out of the index, the sitemap and the
    // navigation until real articles exist.
    robots: { index: false },
  };
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ta = await getTranslations('articles');

  return (
    <main>
      <PageHero title={ta('title')} lead={ta('body')} />

      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1140px] gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.imageKey} delay={i * 70}>
              <Card className="h-full overflow-hidden">
                <div className="border-b border-outline-variant">
                  <PhotoSlot
                    imageKey={a.imageKey as ImageKey}
                    sizes="(max-width: 640px) 100vw, 360px"
                  />
                </div>
                <div className="p-6">
                  <p className="mb-2.5 font-heading text-label-medium text-on-surface-variant">
                    {t(a.category, locale)}
                  </p>
                  <p className="font-heading text-title-large leading-[1.25]">{t(a.title, locale)}</p>
                  <p className="mt-2 text-body-small text-on-surface-variant">{t(a.date, locale)}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
