'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { programs } from '@/content/programs';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale, ProgramSlug } from '@/content/types';
import { Button } from '@/components/m3/Button';

const CHOICES: { key: string; target: ProgramSlug | 'hfos' }[] = [
  { key: 'kids', target: 'kids' },
  { key: 'teens', target: 'teens' },
  { key: 'conversation', target: 'conversation' },
  { key: 'toefl', target: 'toefl-ielts' },
  { key: 'business', target: 'business' },
  { key: 'hfos', target: 'hfos' },
];

export function PathFinder() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');
  const tp = useTranslations('pick');
  const tc = useTranslations('cta');
  const [picked, setPicked] = useState<number | null>(null);

  const choice = picked === null ? null : CHOICES[picked];
  const program = choice && choice.target !== 'hfos'
    ? programs.find((p) => p.slug === choice.target)
    : null;

  const result = choice
    ? choice.target === 'hfos'
      ? { name: tp('hfosName'), meta: tp('hfosMeta'), href: ROUTES.studyAbroad }
      : program
        ? {
            name: t(program.name, locale),
            meta: `${t(program.audience, locale)} · ${t(program.duration, locale)}, ${t(program.schedule, locale)}, ${t(program.minutes, locale)}`,
            href: `${ROUTES.programs}/${program.slug}`,
          }
        : null
    : null;

  const resultId = 'pathfinder-result';

  return (
    <section className="border-b border-outline-variant bg-secondary-container">
      <div className="mx-auto max-w-[1140px] px-6 py-16">
        <h2 className="text-headline-large text-on-secondary-container">{th('pickTitle')}</h2>
        <p className="mb-7 mt-2 max-w-[60ch] text-body-large text-on-surface-variant">
          {th('pickBody')}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHOICES.map((c, i) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={picked === i}
              aria-controls={resultId}
              onClick={() => setPicked(i)}
              className={
                'state-layer relative rounded-md border px-4 py-4 text-left ' +
                'font-heading text-title-medium cursor-pointer ' +
                'transition-colors duration-200 ease-standard ' +
                (picked === i
                  ? 'border-primary bg-surface text-on-surface'
                  : 'border-outline-variant bg-surface text-on-secondary-container')
              }
            >
              {tp(c.key)}
            </button>
          ))}
        </div>

        {/* Always mounted (even empty) so aria-live reliably announces the
            recommendation when it appears — a live region that mounts only
            once content exists is not guaranteed to be observed by screen
            readers. */}
        <div id={resultId} aria-live="polite">
          {result ? (
            <div
              className="mt-5 flex flex-wrap items-center justify-between gap-6 border
                         border-outline-variant bg-surface p-6 rounded-lg"
              style={{ animation: 'hf-rise var(--md-duration-medium2) var(--ease-emphasized) both' }}
            >
              <div>
                <p className="font-heading text-label-medium text-on-surface-variant">
                  {th('pickRecommendation')}
                </p>
                <p className="mt-1.5 font-heading text-headline-small text-on-surface">{result.name}</p>
                <p className="mt-1.5 text-body-small text-on-surface-variant">{result.meta}</p>
              </div>
              <Button href={result.href} variant="outlined">
                {tc('openPage')}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
