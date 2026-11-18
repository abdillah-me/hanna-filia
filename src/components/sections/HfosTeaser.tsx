import { useTranslations } from 'next-intl';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';
import { PhotoSlot } from '@/components/media/PhotoSlot';

export function HfosTeaser() {
  const th = useTranslations('home');
  const tc = useTranslations('cta');

  return (
    <section className="border-b border-outline-variant bg-surface text-on-surface">
      <div className="mx-auto grid max-w-[1140px] items-center gap-10 px-6 py-16 md:grid-cols-2 md:gap-14">
        <div>
          <h2 className="mb-5 text-display-small text-balance">{th('hfosTitle')}</h2>
          <p className="mb-7 max-w-[52ch] text-body-large text-on-surface-variant">{th('hfosBody')}</p>
          <Button href={ROUTES.studyAbroad} variant="outlined">
            {tc('learnHfos')}
          </Button>
        </div>
        <PhotoSlot imageKey="hfos-hero" sizes="(max-width: 768px) 100vw, 546px" />
      </div>
    </section>
  );
}
