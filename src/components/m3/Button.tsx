import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon, type IconName } from '@/components/Icon';

type Variant = 'filled' | 'tonal' | 'outlined' | 'outlinedInverse' | 'text';

const VARIANTS: Record<Variant, string> = {
  filled: 'bg-primary text-on-primary border-primary px-5',
  tonal: 'bg-tertiary-container text-on-tertiary-container border-on-surface px-5',
  outlined: 'bg-transparent text-on-surface border-on-surface px-5',
  // Outlined button on a primary-coloured (crimson) background — e.g. hero
  // CTAs. A consumer must never pass on-primary/on-surface colour classes
  // in `className` to simulate this: `text`/`border` are single CSS
  // properties, and Tailwind resolves same-property clashes by rule order
  // in the compiled stylesheet, not by className order, so a consumer
  // class can silently lose to this variant's own colour class.
  outlinedInverse: 'bg-transparent text-on-primary border-on-primary px-5',
  text: 'bg-transparent text-primary border-transparent px-1',
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
  'state-layer relative inline-flex items-center justify-center gap-2 ' +
  'border-[1.5px] rounded-sm py-3 min-h-12 ' +
  'font-heading text-label-large no-underline cursor-pointer ' +
  'transition-[box-shadow,background-color] duration-200 ease-standard ' +
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
