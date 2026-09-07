import type { ReactNode } from 'react';

const TONES = {
  surface: 'bg-surface text-on-surface',
  primary: 'bg-primary text-on-primary',
  sand: 'bg-secondary-container text-on-secondary-container',
} as const;

export function Section({
  children,
  tone = 'surface',
  bordered = true,
  className = '',
  innerClassName = '',
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  bordered?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={`${TONES[tone]} ${bordered ? 'border-b-[1.5px] border-on-surface' : ''} ${className}`}>
      <div className={`mx-auto max-w-[1140px] px-6 py-14 md:py-18 ${innerClassName}`}>{children}</div>
    </section>
  );
}
