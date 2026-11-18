import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { ROUTES, SITE_URL } from '@/content/site';
import { programs } from '@/content/programs';

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    // Articles is noindex until it has real content — see its page.
    ...Object.values(ROUTES).filter((path) => path !== ROUTES.articles),
    ...programs.map((p) => `${ROUTES.programs}/${p.slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${BASE}/${locale}${path === '/' ? '' : path}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE}/${l}${path === '/' ? '' : path}`]),
        ),
      },
    })),
  );
}
