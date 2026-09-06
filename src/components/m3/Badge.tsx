import type { ReactNode } from 'react';

/** The notched tag from the original design: "Gratis" / "Level N". */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block bg-tertiary-container text-on-tertiary-container font-heading text-label-medium px-6 py-[7px]"
      style={{
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 11px) 50%, 100% 100%, 0 100%, 11px 50%)',
      }}
    >
      {children}
    </span>
  );
}
