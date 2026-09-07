'use client';

import { useLocale } from 'next-intl';
import { stats } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { CountUp, Reveal } from '@/components/Reveal';

export function StatsBar() {
  const locale = useLocale() as Locale;
  // maximumFractionDigits: 0 — CountUp animates through fractional values
  // before settling, and the default formatter would show them.
  const numberFormat = new Intl.NumberFormat(
    locale === 'id' ? 'id-ID' : 'en-US',
    { maximumFractionDigits: 0 },
  );

  return (
    <section className="border-b-[1.5px] border-on-surface bg-surface">
      <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-y-8 px-6 py-11 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label.en}
            delay={i * 90}
            className={
              'px-4 md:px-7 ' +
              (i % 2 === 1 ? 'border-l border-outline-variant ' : '') +
              (i >= 2 ? 'md:border-l ' : '') +
              (i === 0 ? 'md:pl-0' : '')
            }
          >
            <div className="font-heading text-headline-large leading-none text-primary">
              {s.countTo === null ? (
                s.value
              ) : (
                <CountUp
                  to={s.countTo}
                  format={(n) => (
                    s.countTo === 4200 ? `${numberFormat.format(n)}+` : numberFormat.format(n)
                  )}
                />
              )}
            </div>
            <div className="mt-2 text-body-small text-on-surface-variant">{t(s.label, locale)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
