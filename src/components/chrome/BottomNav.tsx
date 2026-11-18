'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ROUTES, bottomNavKeys, type BottomNavKey } from '@/content/site';
import { Icon, type IconName } from '@/components/Icon';

// Exactly the five bottom-nav destinations — `BottomNavKey` is the literal
// union derived from `bottomNavKeys`, not the full eight-route `RouteKey`, so
// there is no room for a padded entry (e.g. `about: 'home'`) that would
// assert an icon for a route this bar never renders.
const ICONS: Record<BottomNavKey, IconName> = {
  home: 'home',
  programs: 'school',
  studyAbroad: 'flight',
  gallery: 'photo',
  contact: 'chat',
};

export function BottomNav() {
  const t = useTranslations('nav');
  const tShort = useTranslations('navShort');
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('mainNavigation')}
      className="fixed bottom-0 left-0 right-0 z-30 min-h-[var(--hf-bottom-nav-h)] border-t border-outline-variant
                 bg-surface-container elevation-2 md:hidden
                 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-20 items-stretch justify-around">
        {bottomNavKeys.map((key) => {
          const href = ROUTES[key];
          const active = href === ROUTES.home ? pathname === '/' : pathname.startsWith(href);

          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className="group flex h-full min-h-12 flex-col items-center justify-center gap-1
                           no-underline text-on-surface-variant"
              >
                <span className="relative flex h-8 w-16 items-center justify-center">
                  {/* M3 active indicator. Instead of a horizontal scaleX (which
                      reads rubbery), the pill fades in while scaling up from 80%
                      to full size — a rounder, more deliberate entrance. It also
                      squeezes slightly on press for tactile feedback. */}
                  <span
                    aria-hidden="true"
                    className={
                      'absolute inset-0 rounded-full bg-primary-container ' +
                      'transition-[transform,opacity] duration-[240ms] ease-emphasized ' +
                      'group-active:scale-95 ' +
                      (active ? 'scale-100 opacity-100' : 'scale-75 opacity-0')
                    }
                  />
                  <Icon
                    name={ICONS[key]}
                    filled={active}
                    size={24}
                    className={
                      'relative transition-[transform,color] duration-[240ms] ease-emphasized ' +
                      'group-active:scale-90 ' +
                      (active
                        ? '-translate-y-px scale-110 text-on-primary-container'
                        : 'scale-100 text-on-surface-variant group-hover:text-on-surface')
                    }
                  />
                </span>
                <span
                  className={
                    'text-label-nav font-heading transition-colors duration-[240ms] ease-emphasized ' +
                    (active
                      ? 'font-bold text-on-primary-container'
                      : 'font-medium text-on-surface-variant')
                  }
                >
                  {tShort(key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
