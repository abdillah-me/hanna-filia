import type { ReactNode } from 'react';
import { Icon } from '@/components/Icon';
import { BrandPattern } from '@/components/media/BrandPattern';
import { PhotoSlot } from '@/components/media/PhotoSlot';

/**
 * Homepage hero: a full crimson field with the headline's promise set in gold
 * italic, and a photograph sitting on the brand pattern with two fact chips
 * pinned to it. The copy animates in on mount (`hf-enter`); the photograph is
 * the page's largest paint, so it loads with priority and does not animate.
 */
export function Hero({
  lead,
  emphasis,
  body,
  actions,
  chips,
}: {
  lead: string;
  emphasis: string;
  body: string;
  actions: ReactNode;
  chips: [string, string];
}) {
  return (
    <section className="relative overflow-hidden bg-primary text-on-primary">
      <div
        className="mx-auto grid max-w-[1140px] items-center gap-10 px-6 pb-12 pt-10
                   md:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] md:gap-10 md:pb-16 md:pt-14"
      >
        <div className="min-w-0">
          <h1 className="hf-enter mb-5 text-display-large text-balance">
            {lead}{' '}
            <em className="text-tertiary-container">{emphasis}</em>
          </h1>
          <p
            className="hf-enter mb-8 max-w-[44ch] text-body-large text-secondary-container"
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

        <div className="relative pb-8 pr-8 md:pb-12 md:pr-12">
          <BrandPattern
            pattern="hero"
            tone="crimson"
            className="absolute bottom-0 right-0 h-[78%] w-auto"
          />
          <PhotoSlot
            imageKey="class-conversation"
            className="rounded-[2rem] rounded-br-none elevation-3"
            sizes="(max-width: 768px) 100vw, 520px"
            ratio="5/4"
            priority
          />
          {chips.map((label, i) => (
            <p
              key={label}
              className={
                'absolute z-10 hidden items-center gap-2.5 rounded-full bg-surface py-2 pl-2 pr-4 ' +
                'font-heading text-title-small text-on-surface elevation-3 md:flex ' +
                (i === 0 ? '-left-6 top-8' : 'bottom-20 right-2')
              }
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-primary">
                <Icon name={i === 0 ? 'chat' : 'check'} size={18} />
              </span>
              {label}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
