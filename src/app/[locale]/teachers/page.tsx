import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { teachers } from '@/content/teachers';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Card } from '@/components/m3/Card';
import { Reveal } from '@/components/Reveal';
import { PhotoSlot, hasPhoto } from '@/components/media/PhotoSlot';
import { Monogram } from '@/components/media/Monogram';
import type { ImageKey } from '@/content/images';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tt = await getTranslations({ locale, namespace: 'teachers' });
  return pageMetadata(locale, '/teachers', tt('title'), tt('metaDescription'));
}

export default async function TeachersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tt = await getTranslations('teachers');

  return (
    <main>
      <PageHero title={tt('title')} />

      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1140px] gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((person, i) => (
            <Reveal key={person.name} delay={i * 70}>
              <Card className="h-full overflow-hidden">
                <div className="border-b border-outline-variant">
                  {hasPhoto(person.imageKey as ImageKey) ? (
                    <PhotoSlot imageKey={person.imageKey as ImageKey} sizes="(max-width: 640px) 100vw, 360px" />
                  ) : (
                    <div className="relative">
                      <Monogram initials={person.initials} className="aspect-square w-full" />
                      <span className="absolute bottom-3 left-3 text-label-small font-heading
                                       text-on-primary-container/70">
                        {tt('portraitPending')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="font-heading text-title-large">{person.name}</p>
                  <p className="mt-1 text-body-small font-semibold text-primary">
                    {t(person.role, locale)}
                  </p>
                  <p className="mt-3 text-body-small text-on-surface-variant">
                    {t(person.credential, locale)}
                  </p>
                  <p className="mt-3.5 text-body-large italic">
                    {t(person.quote, locale)}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
