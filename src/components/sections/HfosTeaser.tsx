import { useTranslations } from 'next-intl';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';
import { BrandPattern } from '@/components/media/BrandPattern';
import { PhotoSlot } from '@/components/media/PhotoSlot';

export function HfosTeaser() {
  const th = useTranslations('home');
  const tc = useTranslations('cta');

  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-[1140px] px-6 py-16">
        <div className="grid overflow-hidden rounded-[2rem] bg-inverse-surface text-inverse-on-surface md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative">
            <PhotoSlot
              imageKey="hfos-hero"
              className="h-full min-h-56 rounded-none"
              ratio="auto"
              sizes="(max-width: 768px) 100vw, 500px"
            />
            <BrandPattern pattern="block" tone="ink" className="absolute bottom-0 right-0 h-24 w-24 md:h-32 md:w-32" />
          </div>
          <div className="p-8 md:p-12">
            <h2 className="mb-5 text-display-small text-balance">{th('hfosTitle')}</h2>
            <p className="mb-8 max-w-[48ch] text-body-large text-secondary-container">{th('hfosBody')}</p>
            <Button href={ROUTES.studyAbroad} variant="accent" icon="arrow_right">
              {tc('learnHfos')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
