import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { ROUTES, SITE_URL } from '@/content/site';
import { programs } from '@/content/programs';

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.values(ROUTES),
    ...programs.map((p) => `${ROUTES.programs}/${p.slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${BASE}/${locale}${path === '/' ? '' : path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE}/${l}${path === '/' ? '' : path}`]),
        ),
      },
    })),
  );
}
