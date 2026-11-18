import type { ReactNode } from 'react';

/** The gold tag: "Gratis" / "Level N". */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-tertiary-container px-3.5 py-1.5 font-heading text-label-medium text-on-tertiary-container">
      {children}
    </span>
  );
}
