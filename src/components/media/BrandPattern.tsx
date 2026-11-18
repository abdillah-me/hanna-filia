/**
 * The brand's geometric tile pattern: quarter circles, circles and squares in
 * the logo's crimson and gold. It is the one decorative device on the site —
 * behind the hero photograph, beside page titles, on the dark feature panel
 * and along the footer — so every page reads as the same brand.
 *
 * A pattern is rows of two-character tiles: a shape letter and a colour index.
 * Shapes: a/b/c/d = quarter circle centred on the top-left / top-right /
 * bottom-right / bottom-left corner, o = circle, s = square, . = empty.
 */
const TONES = {
  crimson: ['tertiary-container', 'primary-container', 'inverse-surface', 'on-primary'],
  light: ['primary', 'tertiary-container', 'primary-container', 'inverse-surface'],
  ink: ['primary', 'tertiary-container', 'primary-container', 'outline'],
} as const;

export const PATTERNS = {
  hero: ['.0 a0 s2 b1', 'c1 o3 d0 .0', 's0 b2 .0 o1', 'd3 .0 c0 s2', 'o0 a1 s1 b0'],
  block: ['a0 s2 o1', 'o3 d0 b2', 's1 c2 a0'],
  panel: ['b0 .0 o1 s2', '.0 c1 a2 .0', 'o2 s0 .0 d1', 'a1 .0 b2 o0'],
  strip: ['a0 s2 o1 d0 .0 b2 s1 c0 o3 a2 s0 d1 .0 o0 b1 s2 a0 c1'],
} as const;

const T = 40;

function shape(kind: string, x: number, y: number) {
  switch (kind) {
    case 'a': return <path d={`M${x} ${y}H${x + T}A${T} ${T} 0 0 1 ${x} ${y + T}Z`} />;
    case 'b': return <path d={`M${x + T} ${y}V${y + T}A${T} ${T} 0 0 1 ${x} ${y}Z`} />;
    case 'c': return <path d={`M${x + T} ${y + T}H${x}A${T} ${T} 0 0 1 ${x + T} ${y}Z`} />;
    case 'd': return <path d={`M${x} ${y + T}V${y}A${T} ${T} 0 0 1 ${x + T} ${y + T}Z`} />;
    case 'o': return <circle cx={x + T / 2} cy={y + T / 2} r={T / 2} />;
    case 's': return <rect x={x} y={y} width={T} height={T} />;
    default: return null;
  }
}

export function BrandPattern({
  pattern,
  tone,
  className = '',
}: {
  pattern: keyof typeof PATTERNS;
  tone: keyof typeof TONES;
  className?: string;
}) {
  const rows = PATTERNS[pattern].map((row) => row.split(' '));
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${rows[0].length * T} ${rows.length * T}`}
      className={className}
    >
      {rows.flatMap((row, r) =>
        row.map((tile, c) => (
          <g key={`${r}-${c}`} fill={`var(--color-${TONES[tone][Number(tile[1])]})`}>
            {shape(tile[0], c * T, r * T)}
          </g>
        )),
      )}
    </svg>
  );
}
