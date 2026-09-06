import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

const BASE =
  'block border-[1.5px] border-on-surface rounded-sm bg-surface text-on-surface ' +
  'transition-[box-shadow,border-color] duration-200 ease-standard';

const INTERACTIVE = 'state-layer relative hover:border-primary hover:elevation-1 no-underline';

export function Card({
  as: Tag = 'div',
  href,
  className = '',
  children,
}: {
  as?: 'div' | 'article';
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
  return <Tag className={`${BASE} ${className}`}>{children}</Tag>;
}
