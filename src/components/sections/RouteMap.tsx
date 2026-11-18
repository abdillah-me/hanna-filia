'use client';

import { useTranslations } from 'next-intl';
import { useInView } from '@/components/Reveal';
import { PATHS } from '@/components/Icon';
import { hfosCountries } from '@/content/hfos';
import { WORLD_NORTH, WORLD_ROWS, WORLD_STEP, WORLD_WEST } from '@/content/world-dots';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';

// The map is a dotted, Pacific-centred world: Batam on the left, the Americas
// on the right. Everything is placed by longitude/latitude through `px`/`py`.
const W = 640;
const S = W / (WORLD_ROWS[0].length * WORLD_STEP);
const H = WORLD_ROWS.length * WORLD_STEP * S;
const px = (lon: number) => (lon - WORLD_WEST) * S;
const py = (lat: number) => (WORLD_NORTH - lat) * S;

const BATAM = { x: px(104), y: py(1) };

type Side = 'top' | 'bottom' | 'left' | 'right';

// Keyed by the English name in `hfosCountries` — the single list of
// destinations — so the map and the chips below it cannot disagree. A country
// added there without an entry here simply gets no marker.
// Singapore and Malaysia sit a few pixels from Batam at this scale; they are
// nudged apart so both stay readable, and get no plane (the hop is too short).
const DESTINATIONS: Record<string, { lon: number; lat: number; side: Side; near?: true }> = {
  Malaysia: { lon: 99.5, lat: 6.5, side: 'left', near: true },
  Singapore: { lon: 108, lat: 5.5, side: 'right', near: true },
  China: { lon: 116, lat: 40, side: 'top' },
  Australia: { lon: 149, lat: -33, side: 'bottom' },
  'New Zealand': { lon: 175, lat: -38, side: 'right' },
  Canada: { lon: 237, lat: 50, side: 'top' },
  'United States': { lon: 258, lat: 37, side: 'bottom' },
};

const PILL_H = 24;
const FLIGHT = 4.2; // seconds a plane takes, including its pause at the gate

function pill(x: number, y: number, w: number, side: Side) {
  if (side === 'left') return { x: x - 10 - w, y: y - PILL_H / 2 };
  if (side === 'right') return { x: x + 10, y: y - PILL_H / 2 };
  if (side === 'bottom') return { x: x - w / 2, y: y + 10 };
  return { x: x - w / 2, y: y - 10 - PILL_H };
}

export function RouteMap({ locale }: { locale: Locale }) {
  const th = useTranslations('home');
  const [ref, inView] = useInView<SVGSVGElement>();

  const routes = hfosCountries
    .filter((c) => c.en in DESTINATIONS)
    .map((c, i) => {
      const d = DESTINATIONS[c.en];
      const x = px(d.lon);
      const y = py(d.lat);
      // Arc: lift the midpoint away from the straight line, like a flight path.
      const lift = Math.hypot(x - BATAM.x, y - BATAM.y) * 0.22;
      const cx = (BATAM.x + x) / 2;
      const cy = (BATAM.y + y) / 2 - lift;
      return {
        ...d, i, x, y, name: t(c, locale), id: `hf-route-${i}`,
        path: `M${BATAM.x.toFixed(1)} ${BATAM.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`,
      };
    });
  const flights = routes.filter((r) => !r.near);

  return (
    <svg
      ref={ref}
      viewBox={`0 -8 ${W} ${H + 8}`}
      width="100%"
      role="img"
      aria-label={`${th('hfosMapAlt')} ${routes.map((r) => r.name).join(', ')}`}
      className="block max-w-[600px]"
    >
      <g aria-hidden="true" className="fill-primary/25">
        {WORLD_ROWS.flatMap((row, r) =>
          [...row].map((cell, c) =>
            cell === '#' ? (
              <circle
                key={`${r}-${c}`}
                cx={(c + 0.5) * WORLD_STEP * S}
                cy={(r + 0.5) * WORLD_STEP * S}
                r="2.4"
              />
            ) : null,
          ),
        )}
      </g>

      {/* Routes draw themselves once when the map scrolls into view. */}
      <g fill="none" strokeWidth="1.75" strokeLinecap="round" className="stroke-primary">
        {routes.map((r) => (
          <path
            key={r.id}
            id={r.id}
            d={r.path}
            strokeDasharray="700"
            style={{
              strokeDashoffset: inView ? 0 : 700,
              transition: `stroke-dashoffset 1500ms var(--ease-standard-decelerate) ${r.i * 120}ms`,
            }}
          />
        ))}
      </g>

      {/* aria-hidden: the svg's aria-label already names every destination. */}
      <g aria-hidden="true" fontFamily="var(--font-heading)" fontSize="12.5" fontWeight="700">
        {routes.map((r) => {
          const w = r.name.length * 7.1 + 20;
          const p = pill(r.x, r.y, w, r.side);
          return (
            <g
              key={r.id}
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 400ms var(--ease-standard) ${800 + r.i * 120}ms`,
              }}
            >
              <circle cx={r.x} cy={r.y} r={r.near ? 4 : 5.5} className="fill-primary stroke-surface" strokeWidth="2" />
              <rect x={p.x} y={p.y} width={w} height={PILL_H} rx={PILL_H / 2} className="fill-surface" />
              <text x={p.x + w / 2} y={p.y + 16.5} textAnchor="middle" className="fill-on-surface">
                {r.name}
              </text>
            </g>
          );
        })}

        <circle cx={BATAM.x} cy={BATAM.y} r="9" className="hf-ping fill-tertiary-container" />
        <circle cx={BATAM.x} cy={BATAM.y} r="9" className="fill-tertiary-container stroke-on-surface" strokeWidth="1.5" />
        <rect x={BATAM.x - 31} y={BATAM.y + 14} width="62" height={PILL_H} rx={PILL_H / 2} className="fill-inverse-surface" />
        <text x={BATAM.x} y={BATAM.y + 30.5} textAnchor="middle" className="fill-inverse-on-surface">
          Batam
        </text>
      </g>

      {/* One aeroplane per long route, taking off in turn and looping. Hidden
          under reduced motion: SVG motion ignores the CSS kill-switch. */}
      {inView ? (
        <g aria-hidden="true" className="fill-on-surface motion-reduce:hidden">
          {flights.map((r, n) => {
            const begin = `${1.4 + n * 0.85}s`;
            const dur = `${FLIGHT}s`;
            return (
              <g key={r.id} opacity="0">
                {/* Material "flight" glyph: drawn nose-up on a 960 grid. */}
                <path d={PATHS.flight[0]} transform="rotate(90) scale(0.024) translate(-480 480)" />
                <animateMotion
                  dur={dur} begin={begin} repeatCount="indefinite" rotate="auto"
                  keyPoints="0;1;1" keyTimes="0;0.72;1" calcMode="linear"
                >
                  <mpath href={`#${r.id}`} />
                </animateMotion>
                <animate
                  attributeName="opacity" dur={dur} begin={begin} repeatCount="indefinite"
                  values="0;1;1;0;0" keyTimes="0;0.06;0.66;0.72;1"
                />
              </g>
            );
          })}
        </g>
      ) : null}
    </svg>
  );
}
