import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/content/types';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <main className="p-8">
      <h1 className="text-display-large text-primary">{t('heroTitle')}</h1>
      <p className="text-body-large text-on-surface-variant">{t('heroBody')}</p>
    </main>
  );
}
