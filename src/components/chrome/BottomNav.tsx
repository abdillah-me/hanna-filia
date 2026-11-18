'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ROUTES, bottomNavKeys, type BottomNavKey } from '@/content/site';
import { Icon, type IconName } from '@/components/Icon';

// Exactly the four bottom-nav destinations — `BottomNavKey` is the literal
// union derived from `bottomNavKeys`, not the full route `RouteKey`, so
// there is no room for a padded entry (e.g. `about: 'home'`) that would
// assert an icon for a route this bar never renders.
const ICONS: Record<BottomNavKey, IconName> = {
  home: 'home',
  programs: 'school',
  studyAbroad: 'flight',
  contact: 'chat',
};

export function BottomNav() {
  const t = useTranslations('nav');
  const tShort = useTranslations('navShort');
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('mainNavigation')}
      className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-30 rounded-[1.75rem]
                 bg-inverse-surface p-1.5 text-inverse-on-surface elevation-3 md:hidden"
    >
      <ul className="flex items-stretch gap-1">
        {bottomNavKeys.map((key) => {
          const href = ROUTES[key];
          const active = href === ROUTES.home ? pathname === '/' : pathname.startsWith(href);

          return (
            <li key={key} className="min-w-0 flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  'press flex h-14 flex-col items-center justify-center gap-0.5 rounded-[1.375rem] no-underline ' +
                  'transition-colors duration-200 ease-standard ' +
                  (active
                    ? 'bg-tertiary-container text-on-tertiary-container'
                    : 'text-inverse-on-surface hover:bg-surface/10')
                }
              >
                <Icon name={ICONS[key]} filled={active} size={22} />
                <span className={'whitespace-nowrap text-label-nav font-heading ' + (active ? 'font-bold' : 'font-medium')}>
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
