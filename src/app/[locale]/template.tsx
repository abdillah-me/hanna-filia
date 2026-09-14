import type { ReactNode } from 'react';

/**
 * Per-navigation entrance animation. Unlike `layout.tsx`, a `template.tsx`
 * remounts its children on every navigation — so wrapping them here makes the
 * `hf-page` fade-in replay on each page change *and* on a locale switch
 * (which is a navigation to the same path under a different prefix). The
 * animation is defined in globals.css and is disabled under
 * prefers-reduced-motion.
 */
export default function LocaleTemplate({ children }: { children: ReactNode }) {
  return <div className="hf-page">{children}</div>;
}
