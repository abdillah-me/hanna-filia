import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { programs, programBySlug } from '@/content/programs';
import { routing } from '@/i18n/routing';
import { ROUTES, SHOW_PRICES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import type { ImageKey } from '@/content/images';
import { Badge } from '@/components/m3/Badge';
import { Button } from '@/components/m3/Button';
import { Link } from '@/i18n/navigation';
import { PhotoSlot } from '@/components/media/PhotoSlot';
import { BrandPattern } from '@/components/media/BrandPattern';
import { Section } from '@/components/sections/Section';
import { courseJsonLd, jsonLdHtml, pageMetadata } from '@/lib/seo';

type Params = { locale: Locale; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    programs.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const program = programBySlug(slug);
  if (!program) return {};
  return pageMetadata(locale, `/programs/${slug}`, t(program.name, locale), t(program.summary, locale));
}

export default async function ProgramDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const program = programBySlug(slug);
  if (!program) notFound();

  const tp = await getTranslations('programs');
  const tc = await getTranslations('cta');

  const summaryRows: [string, string][] = [
    [tp('forWhom'), t(program.audience, locale)],
    [tp('duration'), t(program.duration, locale)],
    [tp('meetings'), `${t(program.schedule, locale)} · ${t(program.minutes, locale)}`],
    [tp('fee'), SHOW_PRICES ? t(program.price, locale) : tc('askPrice')],
  ];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(courseJsonLd(program, locale))} />
      <section className="bg-primary-container text-on-primary-container">
        <div className="relative mx-auto max-w-[1140px] px-6 pb-14 pt-12">
          <BrandPattern
            pattern="block"
            tone="light"
            className="absolute right-6 top-1/2 hidden h-40 w-40 -translate-y-1/2 md:block"
          />
          <Link
            href={ROUTES.programs}
            className="mb-6 block w-fit font-heading text-body-small text-on-surface-variant"
          >
            {tc('allPrograms')}
          </Link>
          <h1 className="mb-4 text-display-medium">{t(program.name, locale)}</h1>
          <p className="max-w-[52ch] text-body-large text-on-surface-variant">
            {t(program.summary, locale)}
          </p>
          <p className="mt-5">
            <Badge>{`${tp('level')} ${program.n}`}</Badge>
          </p>
        </div>
      </section>

      <section className="border-b border-outline-variant bg-surface">
        <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-y-6 px-6 py-10 md:grid-cols-4">
          {summaryRows.map(([label, value], i) => (
            <div
              key={label}
              className={
                'px-4 md:px-6 ' +
                (i % 2 === 1 ? 'border-l border-outline-variant ' : '') +
                (i >= 2 ? 'md:border-l ' : '') + 'border-outline-variant ' +
                (i === 0 ? 'md:pl-0' : '')
              }
            >
              <p className="mb-2 font-heading text-label-medium text-on-surface-variant">{label}</p>
              <p className="font-heading text-title-large">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{tp('syllabus')}</h2>
            {program.syllabus.map((item) => (
              <p key={item.en} className="border-t border-outline-variant py-3.5 text-body-medium">
                {t(item, locale)}
              </p>
            ))}
          </div>
          <div>
            <h2 className="mb-5 text-headline-small">{tp('afterwards')}</h2>
            <p className="mb-7 rounded-lg bg-secondary-container p-6 text-body-large text-on-secondary-container">
              {t(program.outcome, locale)}
            </p>
            <PhotoSlot
              imageKey={program.imageKey as ImageKey}
              className="border border-outline-variant"
              sizes="(max-width: 768px) 100vw, 540px"
            />
          </div>
        </div>
      </Section>

      <Section bordered={false} innerClassName="flex flex-wrap items-center justify-between gap-8">
        <div>
          <p className="font-heading text-headline-medium">{tp('trySessionTitle')}</p>
          <p className="mt-1.5 text-body-medium text-on-surface-variant">{tp('trySessionBody')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={ROUTES.contact}>{tc('trial')}</Button>
          <Button href={ROUTES.contact} variant="outlined">{tc('askPrice')}</Button>
        </div>
      </Section>
    </main>
  );
}
