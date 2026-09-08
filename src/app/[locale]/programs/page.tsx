import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { programs } from '@/content/programs';
import { crossProgramBenefits } from '@/content/about';
import { ROUTES, SHOW_PRICES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tp = await getTranslations({ locale, namespace: 'programs' });
  return {
    title: tp('title'),
    description: tp('body'),
    alternates: {
      canonical: `/${locale}/programs`,
      languages: { id: '/id/programs', en: '/en/programs' },
    },
  };
}

export default async function ProgramsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tp = await getTranslations('programs');
  const tc = await getTranslations('cta');

  return (
    <main>
      <PageHero eyebrow={tp('eyebrow')} title={tp('title')} lead={tp('body')} />

      <section className="border-b-[1.5px] border-on-surface bg-surface">
        <div className="mx-auto max-w-[1140px] px-6">
          {programs.map((p) => (
            <Link
              key={p.slug}
              href={`${ROUTES.programs}/${p.slug}`}
              className="state-layer relative grid items-center gap-4 border-b-[1.5px]
                         border-outline-variant py-8 text-on-surface no-underline
                         md:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-7"
            >
              <span className="font-heading text-headline-large leading-none text-primary">{p.n}</span>
              <span>
                <span className="block font-heading text-headline-small">{t(p.name, locale)}</span>
                <span className="text-body-small text-on-surface-variant">{t(p.audience, locale)}</span>
              </span>
              <span className="text-body-medium">{t(p.summary, locale)}</span>
              <span className="font-heading text-title-small text-primary md:text-right">
                {SHOW_PRICES ? t(p.price, locale).split(' · ')[0] : tc('askPrice')}
              </span>
            </Link>
          ))}

          <Link
            href={ROUTES.studyAbroad}
            className="state-layer relative grid items-center gap-4 py-8 text-on-surface no-underline
                       md:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-7"
          >
            <span className="font-heading text-headline-large leading-none text-tertiary">6</span>
            <span>
              <span className="block font-heading text-headline-small">{tp('studyAbroadName')}</span>
              <span className="text-body-small text-on-surface-variant">{tp('studyAbroadMeta')}</span>
            </span>
            <span className="text-body-medium">{tp('studyAbroadBody')}</span>
            <span className="font-heading text-title-small text-primary md:text-right">
              {tp('consultation')}
            </span>
          </Link>
        </div>
      </section>

      <Section bordered={false}>
        <h2 className="mb-5 text-headline-small">{tp('crossProgram')}</h2>
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {crossProgramBenefits.map((c) => (
            <p key={c.en} className="border-t-[1.5px] border-outline-variant py-3.5 text-body-medium">
              {t(c, locale)}
            </p>
          ))}
        </div>
      </Section>
    </main>
  );
}
