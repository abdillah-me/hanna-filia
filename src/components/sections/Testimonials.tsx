import { useLocale, useTranslations } from 'next-intl';
import { testimonials } from '@/content/testimonials';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Reveal } from '@/components/Reveal';

export function Testimonials() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');

  return (
    <section className="bg-primary-container">
      <div className="mx-auto max-w-[1140px] px-6 py-16">
        <h2 className="mb-8 text-headline-large text-on-primary-container">{th('testimonialsTitle')}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <blockquote className="flex h-full flex-col rounded-[1.5rem] rounded-tl-none bg-surface p-7 elevation-1">
                <svg aria-hidden="true" viewBox="0 0 40 30" className="mb-4 h-7 w-9 fill-tertiary-container">
                  <path d="M0 30V17C0 7 5 1 15 0v6c-4 1-6 4-6 8h7v16H0Zm23 0V17C23 7 28 1 38 0v6c-4 1-6 4-6 8h7v16H23Z" />
                </svg>
                <p className="text-body-large text-on-surface">{t(item.quote, locale)}</p>
                <footer className="mt-auto flex items-center gap-3 pt-6">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-primary
                               font-heading text-title-small text-on-primary"
                  >
                    {item.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </span>
                  <span className="text-body-small text-on-surface-variant">
                    <strong className="block font-heading text-on-surface">{item.name}</strong>
                    {t(item.role, locale)}
                  </span>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
