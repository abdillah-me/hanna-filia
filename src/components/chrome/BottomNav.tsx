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
      className="fixed bottom-0 left-0 right-0 z-30 min-h-[var(--hf-bottom-nav-h)] border-t-[1.5px] border-outline-variant
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
                className="flex h-full min-h-12 flex-col items-center justify-center gap-1
                           no-underline text-on-surface-variant"
              >
                <span className="relative flex h-8 w-16 items-center justify-center">
                  {/* M3 active indicator: a pill that grows from the centre. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-secondary-container
                               transition-transform duration-[240ms] ease-emphasized"
                    style={{ transform: active ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  <Icon
                    name={ICONS[key]}
                    filled={active}
                    size={24}
                    className={
                      'relative transition-colors duration-[240ms] ease-emphasized ' +
                      (active ? 'text-on-secondary-container' : 'text-on-surface-variant')
                    }
                  />
                </span>
                <span
                  className={
                    'text-label-nav font-heading transition-colors duration-[240ms] ease-emphasized ' +
                    (active
                      ? 'font-bold text-on-secondary-container'
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
