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
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const th = await getTranslations({ locale, namespace: 'hfos' });
  return pageMetadata(locale, '/study-abroad', th('title'), th('lead'));
}

export default async function StudyAbroadPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const th = await getTranslations('hfos');
  const tc = await getTranslations('cta');

  return (
    <main>
      <section className="border-b border-outline-variant bg-surface-container-low text-on-surface">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <h1 className="mb-6 text-display-medium">{th('title')}</h1>
            <p className="max-w-[56ch] text-body-large text-on-surface-variant">
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
              <p key={s.en} className="border-t border-outline-variant py-4 text-body-large">
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
                  className="rounded-full border border-outline-variant px-4 py-2 font-heading text-title-small"
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
        <ol className="ml-4 border-l-2 border-primary-container">
          {hfosSteps.map((step, i) => (
            <Reveal key={step.n} as="li" delay={i * 70} className="relative list-none pb-9 pl-9">
              <span
                className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full
                           bg-primary font-heading text-title-small text-on-primary"
              >
                <span className="sr-only">{th('step')} </span>
                {step.n}
              </span>
              <p className="mb-1.5 font-heading text-title-large">{t(step.title, locale)}</p>
              <p className="max-w-[60ch] text-body-medium">{t(step.body, locale)}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section bordered={false} innerClassName="flex flex-wrap items-center justify-between gap-8">
        <blockquote className="max-w-[52ch] rounded-lg bg-secondary-container p-6">
          <p className="text-body-large text-on-secondary-container">
            {t(hfosTestimonial.quote, locale)}
          </p>
          <footer className="mt-3.5 text-body-small text-on-surface-variant">
            <strong className="font-heading">{hfosTestimonial.name}</strong> ·{' '}
            {t(hfosTestimonial.role, locale)}
          </footer>
        </blockquote>
        <Button href={ROUTES.contact}>
          {tc('scheduleConsult')}
        </Button>
      </Section>
    </main>
  );
}
