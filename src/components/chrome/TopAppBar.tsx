'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ROUTES, topNavKeys } from '@/content/site';
import { LocaleToggle } from './LocaleToggle';
import { Button } from '@/components/m3/Button';

export function TopAppBar() {
  const t = useTranslations('nav');
  const tc = useTranslations('cta');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={
        'sticky top-0 z-20 bg-surface border-b border-outline-variant ' +
        'transition-shadow duration-200 ease-standard ' +
        (scrolled ? 'elevation-2' : '')
      }
    >
      <div className="mx-auto flex max-w-[1140px] items-center gap-5 px-6 py-3 lg:gap-7">
        <Link href={ROUTES.home} className="flex-none">
          <Image src="/logo.png" alt="Hanna Filia" width={656} height={304} sizes="80px" priority
                 className="h-8 w-auto md:h-9" />
        </Link>

        <nav aria-label={t('mainNavigation')} className="ml-auto hidden items-center gap-6 md:flex">
          {topNavKeys.map((key) => {
            const href = ROUTES[key];
            const active = href === ROUTES.home ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  'font-body text-body-small font-semibold no-underline whitespace-nowrap ' +
                  'transition-colors duration-200 ease-standard ' +
                  (active ? 'text-primary' : 'text-on-surface hover:text-primary')
                }
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <LocaleToggle />
          {/* Visibility lives on this wrapper, not on Button's own className:
              Button's base classes always include `inline-flex`, and putting
              `hidden lg:inline-flex` on the same element would fight it for
              the `display` property — the exact same-element Tailwind
              cascade conflict the Button/px bug in Task 5 was. */}
          <div className="hidden lg:inline-flex">
            <Button href={ROUTES.contact}>
              {tc('trial')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
