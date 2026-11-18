import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { programs } from '@/content/programs';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Card } from '@/components/m3/Card';
import { Reveal } from '@/components/Reveal';
import { PhotoSlot } from '@/components/media/PhotoSlot';
import type { ImageKey } from '@/content/images';

export function ProgramGrid() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');
  const tc = useTranslations('cta');

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1140px] px-6 pb-16 pt-4">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="text-headline-large">{th('levelsTitle')}</h2>
          <Link href={ROUTES.programs} className="font-heading text-title-medium text-primary">
            {tc('allPrograms')}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {programs.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Card href={`${ROUTES.programs}/${p.slug}`} className="group h-full overflow-hidden">
                <PhotoSlot
                  imageKey={p.imageKey as ImageKey}
                  className="rounded-none"
                  ratio="16/9"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 215px"
                />
                <div className="p-5">
                  <p className="font-heading text-title-medium">
                    <span className="mr-2 text-primary">{p.n}</span>
                    {t(p.name, locale)}
                  </p>
                  <p className="mt-1.5 text-body-small text-on-surface-variant">{t(p.audience, locale)}</p>
                  <p className="text-body-small text-on-surface-variant">
                    {t(p.duration, locale)}, {t(p.schedule, locale)}
                  </p>
                  <p className="mt-3 text-body-small">{t(p.summary, locale)}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
