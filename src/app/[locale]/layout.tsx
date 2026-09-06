import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Archivo, Source_Sans_3, Newsreader } from 'next/font/google';

import { routing } from '@/i18n/routing';
import type { Locale } from '@/content/types';
import { SkipLink } from '@/components/chrome/SkipLink';
import { TopAppBar } from '@/components/chrome/TopAppBar';
import { Footer } from '@/components/chrome/Footer';
import { BottomNav } from '@/components/chrome/BottomNav';
import '@/styles/globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-newsreader',
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
    metadataBase: new URL('https://hannafilia.co.id'),
    title: {
      default: 'Hanna Filia English Course — Batam',
      template: '%s · Hanna Filia',
    },
    description: t('heroBody'),
    alternates: {
      canonical: `/${locale}`,
      languages: { id: '/id', en: '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: 'Hanna Filia English Course',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      title: 'Hanna Filia English Course — Batam',
      description: t('heroBody'),
    },
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

  return (
    <html lang={locale} className={`${archivo.variable} ${sourceSans.variable} ${newsreader.variable}`}>
      <body className="bg-surface text-on-surface pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <NextIntlClientProvider>
          <SkipLink />
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
