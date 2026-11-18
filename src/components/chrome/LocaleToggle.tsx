'use client';

import { useEffect, useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES } from '@/content/types';
import type { Locale } from '@/content/types';

/**
 * Language switcher. A pill-shaped segmented control where a single crimson
 * indicator *slides* between the two locales.
 *
 * Why the indicator is driven by local state, not by the `locale` prop:
 * clicking a language triggers `router.replace`, which re-renders the whole
 * tree on the server and *remounts* this component with the new locale. A
 * remounted element never runs a CSS transition — it just appears with the
 * indicator already at its final spot, which is the "jumpy" behaviour we're
 * fixing. So the click updates `selected` synchronously (the indicator slides
 * immediately, in the *same* mounted element) and the navigation runs inside a
 * transition so it doesn't block that paint. A `useEffect` re-syncs `selected`
 * if the locale changes from elsewhere (e.g. the browser back button).
 *
 * Under prefers-reduced-motion the transition duration is zeroed globally
 * (see globals.css), so the indicator jumps instead of sliding.
 *
 * Colours are tokens only; `on-surface-variant` on `surface` and `on-primary`
 * on `primary` both clear WCAG AA (verified in test/tokens.test.ts).
 */
export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  const [, startTransition] = useTransition();

  const localeIndex = Math.max(0, LOCALES.indexOf(locale));
  const [selected, setSelected] = useState(localeIndex);

  // Re-sync when the locale changes without a click (back/forward navigation).
  useEffect(() => {
    setSelected(localeIndex);
  }, [localeIndex]);

  function choose(code: Locale, index: number) {
    if (index === selected) return;
    setSelected(index); // slide the indicator now, in this same element
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  }

  return (
    <div
      role="group"
      aria-label={t('switchLanguage')}
      className="relative inline-flex items-center rounded-full border border-outline-variant
                 bg-surface-container p-0.5"
    >
      {/* Sliding indicator. `aria-hidden` — purely visual; state is conveyed by
          each button's `aria-current`. Width matches one segment (w-12). */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0.5 top-0.5 bottom-0.5 w-12 rounded-full
                   bg-primary elevation-1 transition-transform duration-300 ease-emphasized"
        style={{ transform: `translateX(${selected * 100}%)` }}
      />

      {LOCALES.map((code, index) => {
        const active = selected === index;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-current={active ? 'true' : undefined}
            onClick={() => choose(code, index)}
            className={
              'relative z-10 flex h-10 w-12 items-center justify-center rounded-full ' +
              'font-heading text-title-small uppercase cursor-pointer ' +
              'transition-colors duration-300 ease-emphasized ' +
              (active ? 'text-on-primary' : 'text-on-surface-variant hover:text-on-surface')
            }
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
