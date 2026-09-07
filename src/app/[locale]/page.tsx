import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/content/types';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';
import { LevelLadder } from '@/components/sections/LevelLadder';
import { Marquee } from '@/components/sections/Marquee';
import { StatsBar } from '@/components/sections/StatsBar';
import { PathFinder } from '@/components/sections/PathFinder';
import { ProgramGrid } from '@/components/sections/ProgramGrid';
import { HfosTeaser } from '@/components/sections/HfosTeaser';
import { Testimonials } from '@/components/sections/Testimonials';
import { TrialCta } from '@/components/sections/TrialCta';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return { title: t('heroTitle'), description: t('heroBody') };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('cta');

  return (
    <main>
      <section className="bg-primary text-on-primary">
        <div className="mx-auto grid max-w-[1140px] items-start gap-12 px-6 pb-18 pt-20
                        md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-16">
          <div className="min-w-0">
            <h1 className="mb-6 text-display-large text-balance">{t('heroTitle')}</h1>
            <p className="mb-9 max-w-[46ch] text-body-large text-secondary-container">
              {t('heroBody')}
            </p>
            <div className="flex flex-wrap items-center gap-3.5">
              <Button href={ROUTES.contact} variant="tonal">{tc('trial')}</Button>
              <Button href={ROUTES.programs} variant="outlinedInverse">
                {tc('seePrograms')}
              </Button>
            </div>
          </div>
          <LevelLadder />
        </div>
      </section>

      <Marquee text={t('marquee')} />
      <StatsBar />
      <PathFinder />
      <ProgramGrid />
      <HfosTeaser />
      <Testimonials />
      <TrialCta />
    </main>
  );
}
