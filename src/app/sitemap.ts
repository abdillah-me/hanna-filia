import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { ROUTES } from '@/content/site';
import { programs } from '@/content/programs';

const BASE = 'https://hannafilia.co.id';

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
