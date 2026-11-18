import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Figtree } from 'next/font/google';

import { routing } from '@/i18n/routing';
import { SAMPLE_DATA, SITE_URL } from '@/content/site';
import { jsonLdHtml, organizationJsonLd } from '@/lib/seo';
import type { Locale } from '@/content/types';
import { SkipLink } from '@/components/chrome/SkipLink';
import { TopAppBar } from '@/components/chrome/TopAppBar';
import { Footer } from '@/components/chrome/Footer';
import { BottomNav } from '@/components/chrome/BottomNav';
import '@/styles/globals.css';

const figtree = Figtree({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-figtree',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: 'Hanna Filia English Course — Batam',
      template: '%s · Hanna Filia',
    },
    description: t('metaDescription'),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const tf = await getTranslations('footer');

  return (
    <html lang={locale} className={figtree.variable}>
      <body className="bg-surface text-on-surface pb-[calc(var(--hf-bottom-nav-h)+env(safe-area-inset-bottom))] md:pb-0">
        {/* Reveal hides its children until client JS reveals them, so without scripting that content would never appear. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(organizationJsonLd(locale))} />
        <NextIntlClientProvider>
          <SkipLink />
          {SAMPLE_DATA ? (
            <p className="bg-tertiary-container px-6 py-2 text-center text-body-small text-on-tertiary-container">
              {tf('sampleNotice')}
            </p>
          ) : null}
          <TopAppBar />
          {/* tabIndex={-1}: a plain div isn't focusable, so without this the
              skip link would only scroll here — keyboard focus would land on
              <body> and a second Tab would restart at the top of the page
              instead of continuing into the content that was skipped to. */}
          <div id="main" tabIndex={-1} className="focus:outline-none">
            {children}
          </div>
          <Footer />
          <BottomNav />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
