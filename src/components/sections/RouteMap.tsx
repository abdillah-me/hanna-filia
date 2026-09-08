'use client';

import { useTranslations } from 'next-intl';
import { useInView } from '@/components/Reveal';
import { hfosCountries } from '@/content/hfos';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';

// Geometry only — coordinates and SVG path data are not user-visible text,
// so they stay literal here. `countryEn` is a lookup key into `hfosCountries`
// (the site's single source of truth for country names), never rendered
// directly: the actual label always comes through `t()` below.
const ROUTES_OUT: { x: number; y: number; path: string; countryEn: string }[] = [
  { x: 170, y: 152, path: 'M 60 240 Q 100 180 170 152', countryEn: 'Singapore' },
  { x: 260, y: 84, path: 'M 60 240 Q 130 140 260 84', countryEn: 'Malaysia' },
  { x: 400, y: 58, path: 'M 60 240 Q 200 100 400 58', countryEn: 'Canada' },
  { x: 320, y: 210, path: 'M 60 240 Q 180 246 320 210', countryEn: 'Australia' },
  { x: 470, y: 244, path: 'M 60 240 Q 280 310 470 244', countryEn: 'New Zealand' },
];

function countryLabel(countryEn: string, locale: Locale): string {
  const country = hfosCountries.find((c) => c.en === countryEn);
  if (!country) throw new Error(`RouteMap: no hfosCountries entry for "${countryEn}"`);
  return t(country, locale);
}

export function RouteMap({ locale }: { locale: Locale }) {
  const th = useTranslations('home');
  const [ref, inView] = useInView<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 290"
      width="100%"
      role="img"
      aria-label={th('hfosMapAlt')}
      className="block max-w-[520px]"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary-container">
        {ROUTES_OUT.map((r, i) => (
          <path
            key={r.countryEn}
            d={r.path}
            strokeDasharray="700"
            style={{
              strokeDashoffset: inView ? 0 : 700,
              transition: `stroke-dashoffset 1600ms var(--ease-standard-decelerate) ${i * 90}ms`,
            }}
          />
        ))}
      </g>

      <g aria-hidden="true" className="fill-secondary-container">
        {ROUTES_OUT.map((r) => (
          <circle key={r.countryEn} cx={r.x} cy={r.y} r="5" />
        ))}
      </g>

      <circle cx="60" cy="240" r="9" className="fill-tertiary-container stroke-on-primary" strokeWidth="1.5" />

      {/* aria-hidden: the svg's own aria-label (above) already names every
          destination, so these text labels would be redundant to assistive tech. */}
      <g aria-hidden="true" fontFamily="var(--font-heading)" fontSize="15" fontWeight="600" className="fill-on-primary">
        {ROUTES_OUT.map((r) => (
          <text key={r.countryEn} x={r.x + 12} y={r.y + 5}>
            {countryLabel(r.countryEn, locale)}
          </text>
        ))}
        <text x="60" y="272" className="fill-tertiary-container">Batam</text>
      </g>
    </svg>
  );
}
