'use client';

import { useTranslations } from 'next-intl';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';

export default function NotFound() {
  const t = useTranslations('nav');

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1140px] flex-col items-start justify-center gap-6 px-6">
      <p className="font-heading text-display-large text-primary">404</p>
      <Button href={ROUTES.home} variant="outlined">{t('home')}</Button>
    </main>
  );
}
