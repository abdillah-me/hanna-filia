import { defineRouting } from 'next-intl/routing';
import { LOCALES } from '@/content/types';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'id',
  // localeDetection: false prevents auto-redirecting visitors to /en based on
  // Accept-Language header. English-configured browsers are common among
  // Indonesian users; browser locale is a poor proxy for reading preference.
  // The language toggle in the top app bar makes correction one click, and
  // most visitors arrive on deep links in their own language anyway.
  localeDetection: false,
  localePrefix: 'always',
});
