import Image from 'next/image';
import { useLocale } from 'next-intl';
import { images, type ImageKey } from '@/content/images';
import { t, type Locale } from '@/content/types';

/**
 * Renders the photograph registered under `imageKey`. When the manifest has no
 * `src` yet, renders nothing and lets the caller's fallback show through — see
 * the teacher cards, which render a Monogram instead.
 */
export function PhotoSlot({
  imageKey,
  className = '',
  sizes = '(max-width: 768px) 100vw, 560px',
  priority = false,
}: {
  imageKey: ImageKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const locale = useLocale() as Locale;
  const entry = images[imageKey];

  if (!entry.src) return null;

  return (
    <div
      className={`relative overflow-hidden bg-surface-container-high ${className}`}
      style={{ aspectRatio: entry.ratio }}
    >
      <Image
        src={entry.src}
        alt={t(entry.alt, locale)}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    </div>
  );
}

export function hasPhoto(imageKey: ImageKey): boolean {
  return images[imageKey].src.length > 0;
}
