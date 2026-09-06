import type { Hours, Localized } from './types.ts';

/** Flip to true to show programme prices across the whole site. */
export const SHOW_PRICES = false;

type Site = {
  phone: string;
  whatsapp: string;
  whatsappE164: string;
  email: string;
  instagram: string;
  facebook: string;
  foundation: Localized;
  motto: string;
  addressLines: string[];
  hours: Hours[];
  accreditationNote: Localized;
};

export const site: Site = {
  phone: '(0778) 426551',
  whatsapp: '0812-7000-1234',
  whatsappE164: '6281270001234',
  email: 'info@hannafilia.co.id',
  instagram: '@hanna_filia',
  facebook: 'Hanna Filia Batam',
  foundation: {
    id: 'Yayasan Hanna Filia Internasional',
    en: 'Yayasan Hanna Filia Internasional',
  },
  motto: 'Soli Deo Gloria',
  // Deliberate, single exception to the bilingual rule: a postal address is an
  // identifier, not prose. Translating "Kec. Lubuk Baja" to "Lubuk Baja District"
  // would produce an address that no longer works in Google Maps or on an
  // envelope — worse for an English-speaking visitor, not better. Stays
  // `string[]`, not `Localized[]`.
  addressLines: [
    'Komplek Nagoya Newton Blok C No. 15–17',
    'Lubuk Baja Kota, Kec. Lubuk Baja',
    'Kota Batam, Kepulauan Riau 29432',
  ],
  hours: [
    { day: { id: 'Senin–Jumat', en: 'Monday–Friday' }, open: { id: '09.00–20.00 WIB', en: '09:00–20:00 WIB' } },
    { day: { id: 'Sabtu', en: 'Saturday' }, open: { id: '09.00–16.00 WIB', en: '09:00–16:00 WIB' } },
    { day: { id: 'Minggu', en: 'Sunday' }, open: { id: 'Tutup', en: 'Closed' } },
  ],
  accreditationNote: {
    id: 'NILEK / NPSN — menunggu data · Akreditasi BAN PAUD & PNF — menunggu data',
    en: 'NILEK / NPSN — pending · BAN PAUD & PNF accreditation — pending',
  },
};

export const stats: { value: string; countTo: number | null; label: Localized }[] = [
  { value: '2003', countTo: null, label: { id: 'Tahun berdiri', en: 'Founded' } },
  { value: '4.200+', countTo: 4200, label: { id: 'Alumni', en: 'Alumni' } },
  { value: '8', countTo: 8, label: { id: 'Siswa maksimal per kelas', en: 'Students per class, maximum' } },
  { value: '37', countTo: 37, label: { id: 'Alumni lanjut studi luar negeri', en: 'Alumni now studying abroad' } },
];

/** Route keys shared by nav, bottom nav, and footer. `href` excludes the locale
 *  prefix — next-intl's Link adds it. */
export const ROUTES = {
  home: '/',
  about: '/about',
  programs: '/programs',
  studyAbroad: '/study-abroad',
  teachers: '/teachers',
  gallery: '/gallery',
  articles: '/articles',
  contact: '/contact',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Desktop top app bar: six links, matching the original site's navigation.
 *  Not eight — eight plus logo, locale toggle and CTA overflow at 768px. */
export const topNavKeys: RouteKey[] = ['home', 'about', 'programs', 'studyAbroad', 'teachers', 'contact'];

/** M3 caps a navigation bar at five destinations. `as const satisfies` keeps
 *  this list checked against `RouteKey` while also giving `BottomNavKey` a
 *  literal union of exactly these five — so a lookup table keyed by
 *  `BottomNavKey` (see `BottomNav`'s `ICONS` map) cannot be padded with
 *  entries for routes that never appear in the bottom nav. */
export const bottomNavKeys = ['home', 'programs', 'studyAbroad', 'gallery', 'contact'] as const satisfies readonly RouteKey[];

export type BottomNavKey = (typeof bottomNavKeys)[number];

export const footerKeys: RouteKey[] = [
  'home', 'about', 'programs', 'studyAbroad', 'teachers', 'gallery', 'articles', 'contact',
];
