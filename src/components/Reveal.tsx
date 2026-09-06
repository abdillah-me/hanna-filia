'use client';

import {
  useEffect, useRef, useState,
  type CSSProperties, type ReactNode, type RefObject,
} from 'react';

export function useInView<T extends Element>(
  { once = true, rootMargin = '0px 0px -10% 0px' }: { once?: boolean; rootMargin?: string } = {},
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No IntersectionObserver (or SSR hydration edge): show the content.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, rootMargin]);

  return [ref, inView];
}

type RevealTag = 'div' | 'section' | 'li';

export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: RevealTag;
}) {
  const [ref, inView] = useInView<HTMLElement>();
  // A single callback ref, contravariant over every concrete element type
  // below (div/section/li all extend HTMLElement) — no cast required.
  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
  };

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(16px)',
    transition:
      `opacity var(--md-duration-medium4) var(--ease-emphasized-decelerate) ${delay}ms, ` +
      `transform var(--md-duration-medium4) var(--ease-emphasized-decelerate) ${delay}ms`,
  };

  if (as === 'section') {
    return (
      <section ref={setRef} data-reveal="" className={className} style={style}>
        {children}
      </section>
    );
  }

  if (as === 'li') {
    return (
      <li ref={setRef} data-reveal="" className={className} style={style}>
        {children}
      </li>
    );
  }

  return (
    <div ref={setRef} data-reveal="" className={className} style={style}>
      {children}
    </div>
  );
}

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({
  to,
  format = (n) => String(Math.round(n)),
  durationMs = 1100,
}: {
  to: number;
  format?: (n: number) => string;
  durationMs?: number;
}) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setValue(to);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      setValue(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, durationMs]);

  return <span ref={ref}>{format(value)}</span>;
}
