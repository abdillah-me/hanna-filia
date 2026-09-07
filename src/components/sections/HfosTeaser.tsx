import { useTranslations } from 'next-intl';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';
import { PhotoSlot } from '@/components/media/PhotoSlot';

export function HfosTeaser() {
  const th = useTranslations('home');
  const tc = useTranslations('cta');

  return (
    <section className="border-b-[1.5px] border-on-surface bg-primary text-on-primary">
      <div className="mx-auto grid max-w-[1140px] items-start gap-10 px-6 py-18 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="mb-8 text-display-small">{th('hfosTitle')}</h2>
          <PhotoSlot
            imageKey="hfos-hero"
            className="border-[1.5px] border-secondary-container/55"
            sizes="(max-width: 768px) 100vw, 520px"
          />
        </div>
        <div>
          <p className="mb-5 text-body-large text-secondary-container">{th('hfosBody')}</p>
          <Button href={ROUTES.studyAbroad} variant="outlinedInverse">
            {tc('learnHfos')}
          </Button>
        </div>
      </div>
    </section>
  );
}
