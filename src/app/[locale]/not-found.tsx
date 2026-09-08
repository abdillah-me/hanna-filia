'use client';

import { useTranslations } from 'next-intl';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';

export default function NotFound() {
  const t = useTranslations('nav');
  const tn = useTranslations('notFound');

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1140px] flex-col items-start justify-center gap-6 px-6">
      <p className="font-heading text-label-medium text-on-surface-variant">404</p>
      <div>
        <h1 className="text-display-medium text-primary text-balance">{tn('title')}</h1>
        <p className="mt-4 max-w-[46ch] text-body-large text-on-surface-variant">{tn('body')}</p>
      </div>
      <Button href={ROUTES.home} variant="outlined">{t('home')}</Button>
    </main>
  );
}
