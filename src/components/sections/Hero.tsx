import type { ReactNode } from 'react';
import { PhotoSlot } from '@/components/media/PhotoSlot';

/**
 * Homepage hero: copy and actions beside one classroom photograph. The copy
 * animates in on mount with a short stagger (`hf-enter`) rather than the
 * scroll-triggered `Reveal` — a hero never scrolls into view. The photograph
 * is the page's largest paint, so it loads with priority and does not animate.
 */
export function Hero({
  title,
  body,
  actions,
}: {
  title: string;
  body: string;
  actions: ReactNode;
}) {
  return (
    <section className="bg-surface">
      <div
        className="mx-auto grid max-w-[1140px] items-center gap-10 px-6 pb-10 pt-8
                   md:grid-cols-2 md:gap-12 md:pb-10 md:pt-12"
      >
        <div className="min-w-0">
          <h1 className="hf-enter mb-5 text-display-large text-balance">{title}</h1>
          <p
            className="hf-enter mb-8 max-w-[46ch] text-body-large text-on-surface-variant"
            style={{ ['--hf-enter-delay' as string]: '90ms' }}
          >
            {body}
          </p>
          <div
            className="hf-enter flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            style={{ ['--hf-enter-delay' as string]: '180ms' }}
          >
            {actions}
          </div>
        </div>
        <PhotoSlot
          imageKey="class-conversation"
          className="rounded-xl"
          ratio="6/5"
          sizes="(max-width: 768px) 100vw, 546px"
          priority
        />
      </div>
    </section>
  );
}
