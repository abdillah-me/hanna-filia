import type { ReactNode } from 'react';

const TONES: Record<'gold' | 'outline', string> = {
  // Gold on crimson container is 4.51:1 — valid only because this is always
  // ≥14px at weight 800 with wide tracking (see test/tokens.test.ts).
  gold: 'bg-tertiary-container text-on-tertiary-container',
  outline: 'bg-transparent text-on-surface border-[1.5px] border-on-surface',
};

/** The notched tag from the original design: "Gratis" (gold) / "Level N" (outline). */
export function Badge({ tone, children }: { tone: 'gold' | 'outline'; children: ReactNode }) {
  return (
    <span
      className={`inline-block font-heading text-label-medium px-6 py-[7px] ${TONES[tone]}`}
      style={{
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 11px) 50%, 100% 100%, 0 100%, 11px 50%)',
      }}
    >
      {children}
    </span>
  );
}
