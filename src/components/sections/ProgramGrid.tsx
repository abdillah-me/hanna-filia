import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { programs } from '@/content/programs';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Card } from '@/components/m3/Card';
import { Reveal } from '@/components/Reveal';

export function ProgramGrid() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');
  const tc = useTranslations('cta');

  return (
    <section className="border-b-[1.5px] border-on-surface bg-surface">
      <div className="mx-auto max-w-[1140px] px-6 py-18">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="text-headline-large">{th('levelsTitle')}</h2>
          <Link href={ROUTES.programs} className="font-heading text-title-medium text-primary">
            {tc('allPrograms')}
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Card href={`${ROUTES.programs}/${p.slug}`} className="group h-full p-6">
                <span
                  className="inline-block origin-left font-heading text-headline-large leading-none
                             text-primary transition-transform duration-200 ease-emphasized
                             motion-safe:group-hover:scale-110"
                >
                  {p.n}
                </span>
                <p className="mt-4 font-heading text-title-large">{t(p.name, locale)}</p>
                <p className="mt-1.5 text-body-small text-on-surface-variant">
                  {t(p.audience, locale)} · {t(p.duration, locale)}, {t(p.schedule, locale)}
                </p>
                <p className="mt-3 text-body-medium">{t(p.summary, locale)}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
