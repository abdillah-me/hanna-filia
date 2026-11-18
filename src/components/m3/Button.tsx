import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon, type IconName } from '@/components/Icon';

type Variant = 'filled' | 'outlined';

const VARIANTS: Record<Variant, string> = {
  filled: 'bg-primary text-on-primary border-primary px-5 hover:elevation-1',
  outlined: 'bg-surface text-on-surface border-outline px-5 hover:border-on-surface',
};

// `inline-flex` here is unconditional and cannot be overridden by a
// consumer's `className` (e.g. `hidden lg:inline-flex`): Tailwind resolves
// same-property conflicts (`display`) by the compiled stylesheet's rule
// order, not by attribute order in the rendered `class` list, and BASE's
// rules are emitted before anything a consumer passes in. A consumer that
// needs to hide/show a Button responsively must wrap it in an element that
// carries the `hidden`/`inline-flex` classes instead. This exact hazard
// produced real bugs in Task 5 (`px-*`) and Task 6 (a CTA visible at every
// viewport width).
const BASE =
  'state-layer press relative inline-flex items-center justify-center gap-2 ' +
  'border rounded-md py-3 min-h-12 ' +
  'font-heading text-label-large no-underline cursor-pointer ' +
  'transition-[box-shadow,background-color,border-color] duration-200 ease-standard ' +
  'disabled:opacity-45 disabled:cursor-not-allowed';

type Common = {
  variant?: Variant;
  icon?: IconName;
  className?: string;
  children: ReactNode;
};

// Discriminated on `href`: when present this renders a next-intl `Link`
// (never `next/link` — that would drop the locale prefix) and button-only
// props are disallowed; when absent it renders a `<button>` and accepts
// button-only props. This makes it impossible to render an anchor without
// an href, and impossible to attach onClick/type to a Link.
type LinkButtonProps = Common & {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
};

type PlainButtonProps = Common & {
  href?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

export type ButtonProps = LinkButtonProps | PlainButtonProps;

export function Button(props: ButtonProps) {
  const { variant = 'filled', icon, className = '', children } = props;
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  const body = (
    <>
      {children}
      {icon ? <Icon name={icon} size={20} /> : null}
    </>
  );

  if (props.href !== undefined) {
    return (
      <Link href={props.href} className={classes}>
        {body}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={classes}
    >
      {body}
    </button>
  );
}
