import type { ReactNode } from 'react';
import { LevelLadder } from '@/components/sections/LevelLadder';

/**
 * Homepage hero. The heading, body and actions animate in on mount with a
 * short stagger (`hf-enter`, sequenced by `--hf-enter-delay`), rather than the
 * scroll-triggered `Reveal` used further down the page — a hero is above the
 * fold and never scrolls into view, so it must animate from mount instead.
 *
 * Two low-opacity accent blobs drift slowly behind the content (`hf-float`).
 * They are `aria-hidden`, carry no content, and are frozen under
 * prefers-reduced-motion (see globals.css). Colours come from tokens only.
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
    <section className="relative overflow-hidden bg-primary text-on-primary">
      {/* Decorative drifting accents — purely aesthetic. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="hf-float absolute -right-24 -top-24 h-72 w-72 rounded-full bg-tertiary-container/10 blur-2xl" />
        <span
          className="hf-float absolute -bottom-32 left-[12%] h-80 w-80 rounded-full bg-secondary-container/10 blur-2xl"
          style={{ animationDelay: '-4.5s', animationDuration: '11s' }}
        />
      </div>

      <div
        className="relative mx-auto grid max-w-[1140px] items-start gap-12 px-6 pb-18 pt-20
                   md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-16"
      >
        <div className="min-w-0">
          <h1 className="hf-enter mb-6 text-display-large text-balance">{title}</h1>
          <p
            className="hf-enter mb-9 max-w-[46ch] text-body-large text-secondary-container"
            style={{ ['--hf-enter-delay' as string]: '90ms' }}
          >
            {body}
          </p>
          <div
            className="hf-enter flex flex-wrap items-center gap-3.5"
            style={{ ['--hf-enter-delay' as string]: '180ms' }}
          >
            {actions}
          </div>
        </div>
        <LevelLadder />
      </div>
    </section>
  );
}
