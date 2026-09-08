'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { programs } from '@/content/programs';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';

export function LevelLadder() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');
  const [active, setActive] = useState(2);

  return (
    <div className="min-w-0 border-[1.5px] border-secondary-container/55">
      <p className="mx-5 mb-3.5 mt-4 font-heading text-label-medium text-secondary-container">
        {th('levelLadder')}
      </p>

      {programs.map((p, i) => {
        const on = i === active;
        return (
          <Link
            key={p.slug}
            href={`${ROUTES.programs}/${p.slug}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={
              'state-layer relative flex items-center gap-3 px-5 py-4 text-on-primary no-underline ' +
              (i > 0 ? 'border-t-[1.5px] border-secondary-container/55' : '')
            }
            style={{
              animation: `hf-rise var(--md-duration-long2) var(--ease-emphasized) ${120 + i * 80}ms both`,
            }}
          >
            <span className="flex w-12 flex-none items-center">
              <span
                className="block h-3 border-[1.5px] border-secondary-container origin-left"
                style={{
                  width: `${14 + i * 8}px`,
                  background: on ? 'var(--color-tertiary-container)' : 'rgb(245 214 174 / 0.22)',
                  animation: `hf-step var(--md-duration-medium4) var(--ease-emphasized) ${200 + i * 80}ms both`,
                }}
              />
            </span>
            <span className="w-4 flex-none font-heading text-title-small text-secondary-container">{p.n}</span>
            <span
              className={
                'min-w-0 flex-1 truncate font-heading text-title-medium ' +
                (on ? 'text-tertiary-container' : 'text-on-primary')
              }
            >
              {t(p.shortName, locale)}
            </span>
            <span className="ml-auto flex-none whitespace-nowrap pl-2 text-body-small text-secondary-container">
              {t(p.audienceShort, locale)}
            </span>
          </Link>
        );
      })}

      <Link
        href={ROUTES.studyAbroad}
        className="state-layer relative flex items-center gap-3 border-t-[1.5px]
                   border-secondary-container/55 px-5 py-4 font-heading text-title-medium
                   text-tertiary-container no-underline"
      >
        {th('studyAbroadRow')}
      </Link>
    </div>
  );
}
