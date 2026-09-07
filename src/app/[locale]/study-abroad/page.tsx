import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hfosServices, hfosCountries, hfosSteps } from '@/content/hfos';
import { hfosTestimonial } from '@/content/testimonials';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Section } from '@/components/sections/Section';
import { RouteMap } from '@/components/sections/RouteMap';
import { Button } from '@/components/m3/Button';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const th = await getTranslations({ locale, namespace: 'hfos' });
  return {
    title: th('title'),
    description: th('lead'),
    alternates: {
      canonical: `/${locale}/study-abroad`,
      languages: { id: '/id/study-abroad', en: '/en/study-abroad' },
    },
  };
}

export default async function StudyAbroadPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const th = await getTranslations('hfos');
  const tc = await getTranslations('cta');

  return (
    <main>
      <section className="border-b-[1.5px] border-on-surface bg-primary text-on-primary">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3.5 font-heading text-label-medium text-secondary-container">
              {th('eyebrow')}
            </p>
            <h1 className="mb-6 text-display-medium">{th('title')}</h1>
            <p className="max-w-[44ch] font-quote text-quote italic text-secondary-container">
              {th('lead')}
            </p>
          </div>
          <RouteMap locale={locale} />
        </div>
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{th('services')}</h2>
            {hfosServices.map((s) => (
              <p key={s.en} className="border-t-[1.5px] border-outline-variant py-4 text-body-large">
                {t(s, locale)}
              </p>
            ))}
          </div>
          <div>
            <h2 className="mb-5 text-headline-small">{th('countries')}</h2>
            <div className="flex flex-wrap gap-2.5">
              {hfosCountries.map((c) => (
                <span
                  key={c.en}
                  className="border-[1.5px] border-on-surface px-3.5 py-2 font-heading text-title-medium"
                >
                  {t(c, locale)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="mb-10 text-headline-large">{th('process')}</h2>
        <ol className="ml-2 border-l-2 border-primary">
          {hfosSteps.map((step, i) => (
            <Reveal key={step.n} as="li" delay={i * 70} className="relative list-none pb-9 pl-9">
              <span
                aria-hidden="true"
                className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary"
              />
              <p className="mb-1.5 font-heading text-label-medium text-on-surface-variant">
                {th('step')} {step.n}
              </p>
              <p className="mb-1.5 font-heading text-title-large">{t(step.title, locale)}</p>
              <p className="max-w-[60ch] text-body-medium">{t(step.body, locale)}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section
        tone="primary"
        bordered={false}
        innerClassName="flex flex-wrap items-center justify-between gap-8"
      >
        <blockquote className="max-w-[52ch] bg-secondary-container p-6">
          <p className="font-quote text-title-large italic leading-[1.5] text-on-secondary-container">
            {t(hfosTestimonial.quote, locale)}
          </p>
          <footer className="mt-3.5 text-body-small text-on-surface-variant">
            <strong className="font-heading">{hfosTestimonial.name}</strong> ·{' '}
            {t(hfosTestimonial.role, locale)}
          </footer>
        </blockquote>
        <Button href={ROUTES.contact} variant="outlinedInverse">
          {tc('scheduleConsult')}
        </Button>
      </Section>
    </main>
  );
}
