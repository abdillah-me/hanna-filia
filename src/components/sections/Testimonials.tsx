import { useLocale, useTranslations } from 'next-intl';
import { testimonials } from '@/content/testimonials';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Reveal } from '@/components/Reveal';

export function Testimonials() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');

  return (
    <section className="border-b border-outline-variant bg-surface">
      <div className="mx-auto max-w-[1140px] px-6 py-18">
        <h2 className="mb-8 text-headline-large">{th('testimonialsTitle')}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <blockquote className="h-full rounded-lg bg-secondary-container p-7">
                <p className="text-body-large text-on-secondary-container">
                  {t(item.quote, locale)}
                </p>
                <footer className="mt-4 text-body-small text-on-surface-variant">
                  <strong className="font-heading">{item.name}</strong> · {t(item.role, locale)}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
