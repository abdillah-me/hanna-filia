'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/content/types';

export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');

  return (
    <div
      role="group"
      aria-label={t('switchLanguage')}
      className="inline-flex overflow-hidden rounded-full border-[1.5px] border-on-surface"
    >
      {(['id', 'en'] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-current={active ? 'true' : undefined}
            onClick={() => router.replace(pathname, { locale: code })}
            className={
              'state-layer relative min-h-12 min-w-12 px-3 py-1.5 font-heading text-title-small uppercase ' +
              'cursor-pointer transition-colors duration-200 ease-standard ' +
              (active ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface')
            }
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
