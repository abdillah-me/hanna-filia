// Root-level fallback, outside any locale. Unreachable in normal use — the
// middleware and `[locale]/not-found.tsx` handle every real 404 — but Next.js
// requires a root not-found boundary distinct from the one nested under
// `[locale]`; without one, the top-level `sitemap.xml` and `robots.txt` route
// handlers are (incorrectly) built with a 404 status. No locale context
// exists here, so `@/i18n/navigation`'s `Link` cannot be used.
export default function RootNotFound() {
  return (
    <html lang="id">
      <body>
        <p>404</p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- no locale/router context at true root */}
        <a href="/id">Beranda</a>
      </body>
    </html>
  );
}
