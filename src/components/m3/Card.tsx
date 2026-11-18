import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

const BASE =
  'block border border-outline-variant rounded-lg bg-surface text-on-surface ' +
  'transition-[box-shadow,border-color] duration-200 ease-standard';

const INTERACTIVE =
  'state-layer hover-lift relative hover:border-primary hover:elevation-2 no-underline';

export function Card({
  href,
  className = '',
  children,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Link href={href} className={`${BASE} ${INTERACTIVE} ${className}`}>
        {children}
      </Link>
    );
  }
  return <div className={`${BASE} ${className}`}>{children}</div>;
}
