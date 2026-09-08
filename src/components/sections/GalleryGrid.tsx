'use client';

import { useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { galleryItems, galleryCategories } from '@/content/gallery';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PhotoSlot } from '@/components/media/PhotoSlot';
import { Reveal } from '@/components/Reveal';
import type { ImageKey } from '@/content/images';

export function GalleryGrid() {
  const locale = useLocale() as Locale;
  const tg = useTranslations('gallery');
  const [active, setActive] = useState<string>('all');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const visible = galleryItems.filter((g) => active === 'all' || g.category === active);

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (delta === 0) return;
    e.preventDefault();
    const next = (index + delta + galleryCategories.length) % galleryCategories.length;
    setActive(galleryCategories[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label={tg('filterLabel')}
        className="mb-7 flex gap-2.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {galleryCategories.map((cat, i) => {
          const selected = active === cat.key;
          return (
            <button
              key={cat.key}
              ref={(el) => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(cat.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={
                'state-layer relative shrink-0 rounded-full border-[1.5px] border-on-surface ' +
                'px-4 py-2 min-h-12 font-heading text-title-small cursor-pointer ' +
                'transition-colors duration-200 ease-standard ' +
                (selected ? 'bg-on-surface text-surface' : 'bg-transparent text-on-surface')
              }
            >
              {t(cat.label, locale)}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item, i) => (
          <Reveal key={item.imageKey} delay={i * 50}>
            <figure className="m-0">
              <PhotoSlot
                imageKey={item.imageKey as ImageKey}
                className="border-[1.5px] border-on-surface"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              />
              <figcaption className="mt-2 text-body-small text-on-surface-variant">
                {t(item.label, locale)}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-body-small text-on-surface-variant">{tg('placeholderNote')}</p>
    </div>
  );
}
