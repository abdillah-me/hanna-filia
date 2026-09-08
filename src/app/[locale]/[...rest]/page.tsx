import { notFound } from 'next/navigation';

// Catch-all for any URL under a valid locale that matches no real page.
// Next.js only renders a *nested* not-found.tsx in response to an explicit
// notFound() call within that segment's tree — an unmatched URL with no
// catch-all route falls through to the root not-found instead, which has no
// locale and none of the site's chrome. This route exists purely to make
// that explicit call so `[locale]/not-found.tsx` renders.
export default function CatchAll(): never {
  notFound();
}
