import type { Metadata } from 'next';
import { SITE_URL, site } from '../content/site.ts';
import { LOCALES, type FaqItem, type Locale, type Program } from '../content/types.ts';

const SITE_NAME = 'Hanna Filia English Course';

/**
 * Canonical, hreflang and Open Graph tags for one page. `path` excludes the
 * locale prefix ('' for the homepage, '/about', '/programs/kids').
 *
 * Open Graph is written out in full on purpose: a page that sets `openGraph`
 * replaces the layout's object wholesale, so anything left out here (site
 * name, locale) would silently vanish from that page's share preview.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
): Metadata {
  const url = `/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, `/${l}${path}`])),
        'x-default': `/id${path}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      url,
      title,
      description,
      // Named explicitly: a page-level `openGraph` object does not inherit
      // the file-based image from src/app/opengraph-image.tsx.
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: { card: 'summary_large_image' },
  };
}

const school = { '@type': 'LanguageSchool', name: SITE_NAME, url: SITE_URL };

// shortcut: days are matched to `site.hours` by position (Mon–Fri, Sat, Sun);
// give Hours a machine-readable days field if the opening pattern ever changes.
const HOURS_DAYS = [
  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
  ['Saturday'],
  ['Sunday'],
];

export function organizationJsonLd(locale: Locale) {
  const [street, , cityLine] = site.addressLines;
  return {
    '@context': 'https://schema.org',
    ...school,
    '@id': `${SITE_URL}/#school`,
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/opengraph-image`,
    foundingDate: '2003',
    telephone: `+62${site.phone.replace(/\D/g, '').slice(1)}`,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: 'Batam',
      addressRegion: 'Kepulauan Riau',
      postalCode: cityLine.match(/\d{5}/)?.[0],
      addressCountry: 'ID',
    },
    openingHoursSpecification: site.hours.flatMap((h, i) => {
      const m = h.open.en.match(/(\d\d:\d\d)–(\d\d:\d\d)/);
      return m
        ? [{ '@type': 'OpeningHoursSpecification', dayOfWeek: HOURS_DAYS[i], opens: m[1], closes: m[2] }]
        : [];
    }),
    sameAs: [`https://instagram.com/${site.instagram.replace('@', '')}`],
  };
}

export function faqJsonLd(items: FaqItem[], locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q[locale],
      acceptedAnswer: { '@type': 'Answer', text: item.a[locale] },
    })),
  };
}

export function courseJsonLd(program: Program, locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: program.name[locale],
    description: program.summary[locale],
    url: `${SITE_URL}/${locale}/programs/${program.slug}`,
    inLanguage: locale,
    provider: school,
  };
}

/** Serialised for a `<script type="application/ld+json">`. `<` is escaped so
 *  no content string can close the script tag early. */
export function jsonLdHtml(data: object): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, '\\u003c') };
}
