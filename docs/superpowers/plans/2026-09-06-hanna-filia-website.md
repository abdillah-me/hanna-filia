# Hanna Filia Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Hanna Filia English course website as a bilingual (Indonesian/English) Next.js site with a Material 3 design system and a mobile bottom navigation bar.

**Architecture:** Next.js 15 App Router with `next-intl` locale-prefixed routes (`/id`, `/en`), all pages statically prerendered. The Material 3 system lives entirely in one CSS file as design tokens consumed by Tailwind v4's `@theme`; components are plain React, not Web Components. Structured content (programs, teachers, FAQ) lives in typed TypeScript modules with `{ id, en }` fields so a missing translation fails the build; flat UI strings live in `next-intl` JSON.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, next-intl v4, `node:test`. No UI library, no state manager, no animation library.

**Spec:** `docs/superpowers/specs/2026-09-06-hanna-filia-nextjs-design.md`

**Reference (do not modify):** `LKP Hanna Filia - Website.html` — the original bundle. All content has already been extracted into this plan; you never need to open it.

## Global Constraints

- **Node ≥ 22.18** — required because tests import `.ts` content modules directly and rely on built-in type stripping. Put `"engines": { "node": ">=22.18" }` in `package.json`.
- **Runtime dependencies are exactly four:** `next`, `react`, `react-dom`, `next-intl`. Adding any other runtime dependency requires stopping and asking. Dev dependencies are exactly ten: `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `tailwindcss`, `@tailwindcss/postcss`, `eslint`, `eslint-config-next`, `@eslint/eslintrc`, `@eslint/js`. (The last two are imported by `eslint.config.mjs`: `eslint-config-next@15` ships no flat-config export, so `FlatCompat` is required. They must be declared, not relied on as eslint's transitive dependencies.)
- **TypeScript `strict: true`.** No `any`. No `@ts-ignore`.
- **Every user-visible string must exist in both `id` and `en`**, with exactly one documented exception: `site.addressLines`. A postal address is an identifier, not prose — rendering "Kec. Lubuk Baja" as "Lubuk Baja District" produces an address that fails when typed into Maps or written on an envelope. It stays a plain `string[]` in both locales, and `src/content/site.ts` carries a comment saying why. No other exception is permitted, and no fallback to the other language is permitted anywhere.
- **Bilingual content must be protected by direct type annotations, never `as` assertions.** `const x: Localized[] = [...]` rejects a missing `en` at compile time; `[...] as Localized[]` silently accepts it, because an assertion only requires the two types to be comparable in one direction. Every `Localized` literal in `src/content/**` must use a direct annotation.
- **Colors are only ever referenced through M3 token names** (`bg-primary`, `text-on-surface-variant`). A raw hex value anywhere outside `src/styles/tokens.css` is a defect.
- **Gold on crimson (`tertiary-container` on `primary`) is 4.5072:1** — this passes WCAG AA for normal-size text, so there is no size or weight restriction. The margin is 0.007, so both tokens are effectively locked; the contrast test asserts `>= 4.5` and fails the build if a change drops below it.
- **Every animation must be disabled under `prefers-reduced-motion: reduce`, but content must remain visible.** A reveal animation that leaves `opacity: 0` when motion is reduced is a defect.
- **The first screenful of every page renders unconditionally — never wrapped in `Reveal`.** `Reveal` ships `opacity: 0` in the server-rendered HTML and depends on client JavaScript to reveal it, so anything inside it is invisible until hydration. Heroes and page headers must therefore be plain markup. This bounds the worst case on a slow mobile connection to "content below the fold appears a moment late" instead of "the page is blank on arrival" — which matters here, because most of this site's audience reaches it on Indonesian mobile data.
- **No `href="#"` anywhere.** Navigation uses `next/link`; actions use `<button>`.
- **Breakpoint is `768px`** (Tailwind `md`). Bottom nav below it, top app bar at and above it.
- **Contact phone:** `(0778) 426551` · **WhatsApp:** `0812-7000-1234` → `6281270001234` · **Email:** `info@hannafilia.co.id` · **Instagram:** `@hanna_filia` · **Facebook:** `Hanna Filia Batam`
- **Address:** Komplek Nagoya Newton Blok C No. 15–17, Lubuk Baja Kota, Kec. Lubuk Baja, Kota Batam, Kepulauan Riau 29432
- **Prices are hidden by default.** A single exported constant `SHOW_PRICES = false` in `src/content/site.ts` controls this. When false, price labels read "Tanya biaya" / "Ask for pricing".
- **Where a task's "Interfaces / Produces" prose disagrees with its code sample, the code sample wins.** The prose blocks are summaries written ahead of the code and have already drifted three times (`navItems` vs `topNavKeys`; "consumes `LOCALES`" vs a hardcoded array; `Card as` / `Badge tone` props that no call site passes). Downstream tasks were written against the code samples, so implementing the prose adds API surface with no consumer. Report the discrepancy rather than resolving it silently in either direction.
- **Every page's `generateMetadata` must declare its own `alternates`** — both `canonical` and the two `languages` entries, pointing at that page's own URLs. Next merges metadata per key: a page that omits `alternates` silently inherits the root layout's, so it declares the *homepage* as its canonical and hreflang target. That is a duplicate-content signal to search engines, and it produces no error, no warning, and no visible difference. It shipped on the programmes list page before being caught.
- **A `Button`'s colours can never be overridden through `className`.** `VARIANTS` already sets `text-*` and `border-*`, so a consumer passing `border-on-primary text-on-primary` loses to the variant's own classes and the button renders in the wrong colour with a green build. A button that needs different colours needs a new **variant**, not a class override. This shipped a 2.30:1 contrast failure on the homepage hero before it was caught — and the token contrast test cannot see it, because every individual token is fine and only the composition is wrong.
- **Never rely on `className` ordering to resolve two Tailwind utilities that set the same property.** Tailwind resolves those conflicts by position in the compiled stylesheet, not by order in the attribute — `px-5` in a base string beats `px-1` in a variant string no matter how they are concatenated. Put the conflicting property in exactly one place: either the base or every variant, never both.
- **Commit after every task.** Conventional commit prefixes (`feat:`, `test:`, `chore:`, `fix:`).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/styles/tokens.css` | The entire M3 system: color, shape, typography, motion, elevation. Only file containing hex values. |
| `src/styles/globals.css` | Reset, base element styles, state-layer utility, keyframes, reduced-motion block. |
| `src/content/types.ts` | `Locale`, `Localized`, `t()` helper, and every content entity type. |
| `src/content/site.ts` | Contact details, opening hours, `SHOW_PRICES`, nav definitions. |
| `src/content/programs.ts` | The 5 programs with syllabus, outcome, price. |
| `src/content/teachers.ts` | The 6 teachers. |
| `src/content/faq.ts` | The 7 FAQ entries. |
| `src/content/hfos.ts` | Services, destination countries, 6-step process. |
| `src/content/gallery.ts` | 12 gallery items and their categories. |
| `src/content/articles.ts` | 3 placeholder articles. |
| `src/content/about.ts` | History paragraphs, vision, mission, values, facilities. |
| `src/content/testimonials.ts` | 3 homepage testimonials + 1 HFOS testimonial. |
| `src/content/images.ts` | Photo manifest — the single place a photo path is changed. |
| `src/lib/whatsapp.ts` | Phone normalisation and message building. Pure, no React. |
| `src/i18n/routing.ts` `navigation.ts` `request.ts` | next-intl wiring. |
| `src/components/Icon.tsx` | All SVG icons; nav icons in outlined/filled pairs. |
| `src/components/m3/*` | Button, Card, Chip, Badge, TextField, Accordion, StateLayer. |
| `src/components/chrome/*` | TopAppBar, BottomNav, LocaleToggle, Footer, SkipLink. |
| `src/components/Reveal.tsx` | IntersectionObserver wrapper + `useInView` hook. |
| `src/components/media/*` | PhotoSlot, Monogram. |
| `src/components/sections/*` | One file per homepage/page section. |
| `src/app/[locale]/**` | Routes. |
| `scripts/fetch-photos.mjs` | Downloads placeholder photos into `public/images/`. |
| `test/*.test.ts` | The five invariants. |

---

## Task 1: Scaffold, M3 tokens, and the contrast test

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`
- Create: `src/styles/tokens.css`, `src/styles/globals.css`
- Create: `src/app/layout.tsx`, `src/app/page.tsx` (temporary, replaced in Task 4)
- Test: `test/tokens.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: every M3 token name used by all later tasks. Tailwind utility names derive from these: `--color-primary` → `bg-primary` / `text-primary` / `border-primary`; `--radius-md` → `rounded-md`; `--ease-emphasized` → `ease-emphasized`; `--text-display-large` → `text-display-large`.

- [ ] **Step 1: Initialise the project**

```bash
cd "/Users/abdillah/Documents/Code/Projects/hanna filia"
git init
npm init -y
npm install next@15 react@19 react-dom@19 next-intl@4
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss@4 @tailwindcss/postcss eslint eslint-config-next
```

- [ ] **Step 2: Write the config files**

`package.json` — replace the `scripts`, `engines` and `private` fields:

```json
{
  "name": "hanna-filia",
  "private": true,
  "engines": { "node": ">=22.18" },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "node --test test/",
    "photos": "node scripts/fetch-photos.mjs"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`postcss.config.mjs`:

```js
export default { plugins: { '@tailwindcss/postcss': {} } };
```

`next.config.ts` (the next-intl plugin is added in Task 4):

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

`.gitignore`:

```
node_modules
.next
out
next-env.d.ts
.DS_Store
*.tsbuildinfo
```

- [ ] **Step 3: Write the M3 token file**

Create `src/styles/tokens.css`. This is the only file in the project allowed to contain hex colours.

```css
@theme {
  /* ── Color — M3 light scheme, seeded from brand crimson #A21C42 ──────────
     Every ratio here was verified before this file was written; test/tokens.test.ts
     re-verifies them on every run. Do not change a value without running the test. */
  --color-primary: #A21C42;
  --color-on-primary: #FFFDFA;
  --color-primary-container: #FFD9DF;
  --color-on-primary-container: #3F0014;

  --color-secondary: #77574A;
  --color-on-secondary: #FFFFFF;
  --color-secondary-container: #F5D6AE;
  --color-on-secondary-container: #2C160C;

  --color-tertiary: #725C00;
  --color-on-tertiary: #FFFFFF;
  --color-tertiary-container: #F2C230;
  --color-on-tertiary-container: #231B00;

  --color-error: #BA1A1A;
  --color-on-error: #FFFFFF;
  --color-error-container: #FFDAD6;
  --color-on-error-container: #410002;

  --color-surface: #FFFDFA;
  --color-on-surface: #1C1A19;
  --color-on-surface-variant: #5C5350;
  --color-surface-container-lowest: #FFFFFF;
  --color-surface-container-low: #FBF4F0;
  --color-surface-container: #F6EEE9;
  --color-surface-container-high: #F0E8E3;
  --color-surface-container-highest: #EAE2DD;

  --color-outline: #7C716D;
  --color-outline-variant: #D5C7C2;

  --color-inverse-surface: #312F2E;
  --color-inverse-on-surface: #F5EFEC;
  --color-inverse-primary: #FFB2BF;
  --color-scrim: #000000;

  /* ── Shape — tuned tight; this brand is editorial, not rounded ─────────── */
  --radius-none: 0px;
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;

  /* ── Typography ────────────────────────────────────────────────────────── */
  --font-heading: var(--font-archivo), system-ui, sans-serif;
  --font-body: var(--font-source-sans), system-ui, sans-serif;
  --font-quote: var(--font-newsreader), Georgia, serif;

  --text-display-large: clamp(38px, 5vw, 64px);
  --text-display-large--line-height: 1.04;
  --text-display-large--letter-spacing: -0.02em;
  --text-display-large--font-weight: 800;

  --text-display-medium: clamp(32px, 4.4vw, 56px);
  --text-display-medium--line-height: 1.06;
  --text-display-medium--letter-spacing: -0.02em;
  --text-display-medium--font-weight: 800;

  --text-display-small: clamp(28px, 3.4vw, 44px);
  --text-display-small--line-height: 1.1;
  --text-display-small--letter-spacing: -0.02em;
  --text-display-small--font-weight: 800;

  --text-headline-large: 32px;
  --text-headline-large--line-height: 1.12;
  --text-headline-large--letter-spacing: -0.02em;
  --text-headline-large--font-weight: 800;

  --text-headline-medium: 28px;
  --text-headline-medium--line-height: 1.15;
  --text-headline-medium--letter-spacing: -0.02em;
  --text-headline-medium--font-weight: 800;

  --text-headline-small: 24px;
  --text-headline-small--line-height: 1.2;
  --text-headline-small--letter-spacing: -0.01em;
  --text-headline-small--font-weight: 800;

  --text-title-large: 20px;
  --text-title-large--line-height: 1.25;
  --text-title-large--letter-spacing: -0.01em;
  --text-title-large--font-weight: 700;

  --text-title-medium: 17px;
  --text-title-medium--line-height: 1.3;
  --text-title-medium--font-weight: 700;

  --text-title-small: 15px;
  --text-title-small--line-height: 1.35;
  --text-title-small--font-weight: 700;

  --text-body-large: 17px;
  --text-body-large--line-height: 1.65;
  --text-body-medium: 16px;
  --text-body-medium--line-height: 1.55;
  --text-body-small: 15px;
  --text-body-small--line-height: 1.5;

  --text-label-large: 15px;
  --text-label-large--line-height: 1.2;
  --text-label-large--font-weight: 700;
  --text-label-medium: 13px;
  --text-label-medium--line-height: 1.2;
  --text-label-medium--letter-spacing: 0.09em;
  --text-label-medium--font-weight: 700;
  --text-label-small: 11px;
  --text-label-small--line-height: 1.2;
  --text-label-small--letter-spacing: 0.09em;
  --text-label-small--font-weight: 700;

  /* Nav label is deliberately NOT label-medium: nav labels are not uppercase
     and must differ in weight between resting and active state. */
  --text-label-nav: 12px;
  --text-label-nav--line-height: 1.2;

  --text-quote: clamp(20px, 2.4vw, 28px);
  --text-quote--line-height: 1.45;

  /* ── Motion — M3 tokens, unmodified ─────────────────────────────────────
     `emphasized` and `standard` share a value on purpose: the real emphasized
     curve is a two-segment spline that no single CSS cubic-bezier can express,
     and this is the approximation M3 itself ships on the web. Two names are
     kept so intent stays readable. */
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --ease-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
}

:root {
  --md-duration-short2: 100ms;
  --md-duration-short4: 200ms;
  --md-duration-medium2: 300ms;
  --md-duration-medium4: 400ms;
  --md-duration-long2: 500ms;

  --md-elevation-1: 0 1px 2px rgb(28 26 25 / 0.14), 0 1px 3px 1px rgb(28 26 25 / 0.07);
  --md-elevation-2: 0 1px 2px rgb(28 26 25 / 0.16), 0 2px 6px 2px rgb(28 26 25 / 0.08);
  --md-elevation-3: 0 4px 8px 3px rgb(28 26 25 / 0.1), 0 1px 3px rgb(28 26 25 / 0.16);

  --md-state-hover: 0.08;
  --md-state-focus: 0.1;
  --md-state-pressed: 0.1;
}
```

- [ ] **Step 4: Write the global stylesheet**

Create `src/styles/globals.css`:

```css
@import 'tailwindcss';
@import './tokens.css';

@layer base {
  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    background: var(--color-surface);
    color: var(--color-on-surface);
    font-family: var(--font-body);
    font-size: var(--text-body-large);
    line-height: var(--text-body-large--line-height);
  }

  h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); margin: 0; }
  p { margin: 0; }
  img { display: block; max-width: 100%; }

  :focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  ::selection { background: var(--color-secondary-container); }
}

@layer components {
  /* M3 state layer. Apply `state-layer` to a `relative` interactive element.
     Uses currentColor so it stays correct on any surface. */
  .state-layer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: currentColor;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--md-duration-short4) var(--ease-standard);
    border-radius: inherit;
  }
  .state-layer:hover::after { opacity: var(--md-state-hover); }
  .state-layer:active::after { opacity: var(--md-state-pressed); }
}

@layer utilities {
  .elevation-1 { box-shadow: var(--md-elevation-1); }
  .elevation-2 { box-shadow: var(--md-elevation-2); }
  .elevation-3 { box-shadow: var(--md-elevation-3); }
}

@keyframes hf-rise {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes hf-step {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
@keyframes hf-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes hf-draw {
  from { stroke-dashoffset: 700; }
  to   { stroke-dashoffset: 0; }
}

/* Motion off, content still visible. Never leave anything at opacity 0 here. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  [data-reveal] { opacity: 1 !important; transform: none !important; }
}
```

- [ ] **Step 5: Write the failing contrast test**

Create `test/tokens.test.ts`. It parses `tokens.css` rather than hard-coding values, so editing a token without checking contrast fails the build.

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');

function readToken(name: string): string {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`));
  assert.ok(m, `token --color-${name} not found in tokens.css`);
  return m[1];
}

function luminance(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum]
const PAIRS: Array<[string, string, number]> = [
  ['on-primary', 'primary', 4.5],
  ['on-primary-container', 'primary-container', 4.5],
  ['on-secondary', 'secondary', 4.5],
  ['on-secondary-container', 'secondary-container', 4.5],
  ['on-tertiary', 'tertiary', 4.5],
  ['on-tertiary-container', 'tertiary-container', 4.5],
  ['on-error', 'error', 4.5],
  ['on-error-container', 'error-container', 4.5],
  ['on-surface', 'surface', 4.5],
  ['on-surface-variant', 'surface', 4.5],
  ['on-surface', 'surface-container-highest', 4.5],
  ['on-surface-variant', 'surface-container-highest', 4.5],
  ['on-surface', 'secondary-container', 4.5],
  ['on-surface-variant', 'secondary-container', 4.5],
  ['inverse-on-surface', 'inverse-surface', 4.5],
  ['primary', 'surface', 3],
  ['outline', 'surface', 3],
];

for (const [fg, bg, min] of PAIRS) {
  test(`${fg} on ${bg} meets ${min}:1`, () => {
    const r = ratio(readToken(fg), readToken(bg));
    assert.ok(r >= min, `${fg}/${bg} is ${r.toFixed(2)}:1, needs ${min}:1`);
  });
}

// Brand pairing outside the M3 matrix: the gold "Gratis" / "Level N" badge on
// the crimson hero. 4.51:1 passes only for large bold text — this test is the
// reminder that it must never be used for body copy.
test('tertiary-container on primary is large-text-only', () => {
  const r = ratio(readToken('tertiary-container'), readToken('primary'));
  assert.ok(r >= 3, `gold on crimson is ${r.toFixed(2)}:1, needs 3:1`);
  assert.ok(r < 4.5, 'gold on crimson now passes 4.5:1 — relax the ≥18px/700 rule in the spec');
});
```

- [ ] **Step 6: Run the test and watch it fail**

```bash
npm test
```

Expected: fails with `ENOENT` on `tokens.css` if Step 3 was skipped, otherwise passes. If it fails on a ratio, a token was mistyped — fix the token, not the test.

- [ ] **Step 7: Add a temporary root page and verify the build**

`src/app/layout.tsx`:

```tsx
import type { ReactNode } from 'react';
import '@/styles/globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:

```tsx
export default function Page() {
  return (
    <main className="p-8">
      <h1 className="text-display-large text-primary">Hanna Filia</h1>
      <p className="text-body-large text-on-surface-variant">Token check.</p>
    </main>
  );
}
```

- [ ] **Step 8: Verify the build and the tokens render**

```bash
npm run typecheck && npm run build && npm test
```

Expected: all three succeed. Then `npm run dev` and confirm at `http://localhost:3000` that the heading is crimson and large — this proves the `@theme` tokens reached Tailwind.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Material 3 token system"
```

---

## Task 2: Content layer, translations, and content invariants

**Files:**
- Create: `src/content/types.ts`, `site.ts`, `programs.ts`, `teachers.ts`, `faq.ts`, `hfos.ts`, `gallery.ts`, `articles.ts`, `about.ts`, `testimonials.ts`
- Create: `messages/id.json`, `messages/en.json`
- Test: `test/content.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Locale = 'id' | 'en'`
  - `type Localized = { id: string; en: string }`
  - `function t(value: Localized, locale: Locale): string`
  - `const programs: Program[]` with `Program = { slug, n, name, audience, duration, schedule, minutes, summary, syllabus: Localized[], outcome, price, imageKey }`
  - `const teachers: Teacher[]` with `Teacher = { initials, name, role, credential, quote }`
  - `const faq: FaqItem[]` with `FaqItem = { q: Localized; a: Localized }`
  - `const hfosServices: Localized[]`, `const hfosCountries: Localized[]`, `const hfosSteps: HfosStep[]` with `HfosStep = { n: number; title: Localized; body: Localized }`
  - `const galleryItems: GalleryItem[]` with `GalleryItem = { imageKey, category: GalleryCategory, label: Localized }` and `GalleryCategory = 'kids' | 'teens' | 'conversation' | 'toefl' | 'business' | 'events'`
  - `const articles: Article[]` with `Article = { imageKey, category, title, date }`
  - `const about: { history: Localized[]; vision: Localized; mission: Localized[]; values: Value[]; facilities: Localized[] }` with `Value = { title: Localized; body: Localized }`
  - `const testimonials: Testimonial[]`, `const hfosTestimonial: Testimonial`, with `Testimonial = { quote, name, role }`
  - `const site: { phone, whatsapp, whatsappE164, email, instagram, facebook, addressLines: string[], hours: Hours[], foundation: Localized, motto: string, accreditationNote: Localized }`, `const SHOW_PRICES: boolean`, `const stats`, `const ROUTES`, `type RouteKey`, `const topNavKeys: RouteKey[]`, `const bottomNavKeys: RouteKey[]`, `const footerKeys: RouteKey[]`

- [ ] **Step 1: Write the type module**

Create `src/content/types.ts`:

```ts
export type Locale = 'id' | 'en';

export const LOCALES: readonly Locale[] = ['id', 'en'] as const;

/** A string that exists in both languages. Both fields are required, so a
 *  forgotten translation is a compile error rather than a blank on the page. */
export type Localized = { id: string; en: string };

export function t(value: Localized, locale: Locale): string {
  return value[locale];
}

export type ProgramSlug = 'kids' | 'teens' | 'conversation' | 'toefl-ielts' | 'business';

export type Program = {
  slug: ProgramSlug;
  n: 1 | 2 | 3 | 4 | 5;
  name: Localized;
  shortName: Localized;
  audience: Localized;
  audienceShort: Localized;
  duration: Localized;
  schedule: Localized;
  minutes: Localized;
  summary: Localized;
  syllabus: Localized[];
  outcome: Localized;
  price: Localized;
  imageKey: string;
};

export type Teacher = {
  initials: string;
  name: string;
  role: Localized;
  credential: Localized;
  quote: Localized;
  imageKey: string;
};

export type FaqItem = { q: Localized; a: Localized };

export type HfosStep = { n: number; title: Localized; body: Localized };

export type GalleryCategory =
  | 'kids' | 'teens' | 'conversation' | 'toefl' | 'business' | 'events';

export type GalleryItem = {
  imageKey: string;
  category: GalleryCategory;
  label: Localized;
};

export type Article = {
  imageKey: string;
  category: Localized;
  title: Localized;
  date: Localized;
};

export type Value = { title: Localized; body: Localized };

export type Testimonial = { quote: Localized; name: string; role: Localized };

export type Hours = { day: Localized; open: Localized };
```

- [ ] **Step 2: Write the programs module**

Create `src/content/programs.ts`. The Indonesian text is taken verbatim from the original site; the English is a natural translation, not a literal one.

```ts
import type { Program } from './types';

export const programs: Program[] = [
  {
    slug: 'kids',
    n: 1,
    imageKey: 'class-kids',
    name: { id: 'English for Kids', en: 'English for Kids' },
    shortName: { id: 'English for Kids', en: 'English for Kids' },
    audience: { id: 'Usia 6–12 tahun', en: 'Ages 6–12' },
    audienceShort: { id: '6–12 th', en: 'Ages 6–12' },
    duration: { id: '3 bulan', en: '3 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '60 menit', en: '60 minutes' },
    summary: {
      id: 'Kosakata sehari-hari, phonics, dan percakapan dasar lewat lagu, permainan, dan cerita pendek.',
      en: 'Everyday vocabulary, phonics, and simple conversation through songs, games, and short stories.',
    },
    syllabus: [
      { id: 'Kosakata sehari-hari', en: 'Everyday vocabulary' },
      { id: 'Phonics', en: 'Phonics' },
      { id: 'Lagu dan permainan', en: 'Songs and games' },
      { id: 'Membaca cerita pendek', en: 'Reading short stories' },
      { id: 'Percakapan dasar', en: 'Basic conversation' },
    ],
    outcome: {
      id: 'Anak bisa memperkenalkan diri, bercerita tentang keseharian, dan membaca teks pendek.',
      en: 'Your child can introduce themselves, talk about their day, and read short texts.',
    },
    price: { id: 'Rp 650.000 / bulan', en: 'Rp 650,000 / month' },
  },
  {
    slug: 'teens',
    n: 2,
    imageKey: 'class-teens',
    name: { id: 'English for Teens', en: 'English for Teens' },
    shortName: { id: 'English for Teens', en: 'English for Teens' },
    audience: { id: 'Siswa SMP & SMA', en: 'Junior and senior high school students' },
    audienceShort: { id: 'SMP–SMA', en: 'Ages 13–18' },
    duration: { id: '3 bulan', en: '3 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Grammar terstruktur, writing, dan presentasi, dengan latihan soal sekolah dan diskusi topik remaja.',
      en: 'Structured grammar, writing, and presentation skills, with school exam practice and discussion of topics teenagers actually care about.',
    },
    syllabus: [
      { id: 'Grammar terstruktur', en: 'Structured grammar' },
      { id: 'Writing', en: 'Writing' },
      { id: 'Presentasi', en: 'Presentation skills' },
      { id: 'Latihan soal sekolah', en: 'School exam practice' },
      { id: 'Diskusi topik remaja', en: 'Discussion of teen topics' },
    ],
    outcome: {
      id: 'Nilai sekolah naik dan siap ikut tes bahasa tingkat dasar.',
      en: 'Better school marks and readiness for entry-level English tests.',
    },
    price: { id: 'Rp 750.000 / bulan', en: 'Rp 750,000 / month' },
  },
  {
    slug: 'conversation',
    n: 3,
    imageKey: 'class-conversation',
    name: { id: 'Conversation Class', en: 'Conversation Class' },
    shortName: { id: 'Conversation', en: 'Conversation' },
    audience: { id: 'Umum, 15 tahun ke atas', en: 'Open to anyone aged 15 and over' },
    audienceShort: { id: '15 th +', en: '15+' },
    duration: { id: '3 bulan', en: '3 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Percakapan tematik dan roleplay situasi nyata, dengan sesi bulanan bersama pengajar native speaker.',
      en: 'Themed conversation and real-situation roleplay, with a monthly session led by a native-speaker teacher.',
    },
    syllabus: [
      { id: 'Percakapan tematik', en: 'Themed conversation' },
      { id: 'Roleplay situasi nyata', en: 'Real-situation roleplay' },
      { id: 'Pelafalan', en: 'Pronunciation' },
      { id: 'Sesi bulanan dengan pengajar native speaker', en: 'Monthly session with a native-speaker teacher' },
    ],
    outcome: {
      id: 'Berani bicara spontan dalam situasi kerja dan sehari-hari.',
      en: 'The confidence to speak off the cuff, at work and in daily life.',
    },
    price: { id: 'Rp 850.000 / bulan', en: 'Rp 850,000 / month' },
  },
  {
    slug: 'toefl-ielts',
    n: 4,
    imageKey: 'class-toefl',
    name: { id: 'TOEFL & IELTS Preparation', en: 'TOEFL & IELTS Preparation' },
    shortName: { id: 'TOEFL & IELTS', en: 'TOEFL & IELTS' },
    audience: {
      id: 'Pelajar, mahasiswa, dan pekerja yang butuh skor resmi',
      en: 'Students and professionals who need an official score',
    },
    audienceShort: { id: 'Intensif', en: 'Intensive' },
    duration: { id: '2 bulan intensif', en: '2 intensive months' },
    schedule: { id: '3× seminggu', en: 'Three times a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Strategi per section, bank soal, dan dua kali simulasi tes lengkap dengan konsultasi target skor.',
      en: 'Section-by-section strategy, a question bank, and two full mock tests with a target-score consultation.',
    },
    syllabus: [
      { id: 'Strategi per section', en: 'Section-by-section strategy' },
      { id: 'Bank soal', en: 'Question bank' },
      { id: 'Dua kali simulasi tes lengkap', en: 'Two full mock tests' },
      { id: 'Konsultasi target skor', en: 'Target-score consultation' },
    ],
    outcome: {
      id: 'Peningkatan skor rata-rata 60 poin TOEFL ITP.',
      en: 'An average gain of 60 points on the TOEFL ITP.',
    },
    price: { id: 'Rp 2.400.000 / paket', en: 'Rp 2,400,000 / package' },
  },
  {
    slug: 'business',
    n: 5,
    imageKey: 'class-business',
    name: { id: 'Business English', en: 'Business English' },
    shortName: { id: 'Business English', en: 'Business English' },
    audience: { id: 'Karyawan dan profesional', en: 'Employees and professionals' },
    audienceShort: { id: 'Profesional', en: 'Professionals' },
    duration: { id: '2 bulan', en: '2 months' },
    schedule: { id: '2× seminggu', en: 'Twice a week' },
    minutes: { id: '90 menit', en: '90 minutes' },
    summary: {
      id: 'Email, meeting, presentasi, dan negosiasi. Tersedia kelas malam dan in-house di perusahaan.',
      en: 'Email, meetings, presentations, and negotiation. Evening classes and in-house corporate training available.',
    },
    syllabus: [
      { id: 'Email dan korespondensi', en: 'Email and correspondence' },
      { id: 'Meeting', en: 'Meetings' },
      { id: 'Presentasi', en: 'Presentations' },
      { id: 'Negosiasi', en: 'Negotiation' },
      { id: 'Istilah industri', en: 'Industry terminology' },
    ],
    outcome: {
      id: 'Mampu memimpin rapat dan menulis korespondensi kerja dalam bahasa Inggris.',
      en: 'Able to chair a meeting and handle work correspondence in English.',
    },
    price: {
      id: 'Rp 1.100.000 / bulan · in-house dihitung per perusahaan',
      en: 'Rp 1,100,000 / month · in-house quoted per company',
    },
  },
];

export function programBySlug(slug: string): Program | undefined {
  return programs.find((p) => p.slug === slug);
}
```

- [ ] **Step 3: Write the remaining content modules**

Create `src/content/teachers.ts`:

```ts
import type { Teacher } from './types';

export const teachers: Teacher[] = [
  {
    initials: 'AN', name: 'Anna, S.Pd.', imageKey: 'teacher-1',
    role: { id: 'Pendiri & Direktur', en: 'Founder & Director' },
    credential: {
      id: 'S.Pd. Pendidikan Bahasa Inggris, 25 tahun mengajar',
      en: 'B.Ed. in English Education, 25 years of teaching',
    },
    quote: {
      id: 'Saya masih ingat nama tiga belas siswa pertama kami.',
      en: 'I still remember the names of our first thirteen students.',
    },
  },
  {
    initials: 'RS', name: 'Rachel Simorangkir', imageKey: 'teacher-2',
    role: { id: 'Koordinator Akademik', en: 'Academic Coordinator' },
    credential: {
      id: 'S.S. Sastra Inggris, sertifikasi TEFL',
      en: 'B.A. in English Literature, TEFL certified',
    },
    quote: {
      id: 'Kalau siswa belum berani bicara, berarti kelasnya yang perlu diubah.',
      en: 'If a student is not speaking up yet, it is the class that needs changing.',
    },
  },
  {
    initials: 'DW', name: 'Daniel Whitmore', imageKey: 'teacher-3',
    role: { id: 'Pengajar Conversation', en: 'Conversation Teacher' },
    credential: {
      id: 'Penutur asli, Australia, sertifikasi CELTA',
      en: 'Native speaker, Australia, CELTA certified',
    },
    quote: {
      id: 'Nobody learns a language quietly.',
      en: 'Nobody learns a language quietly.',
    },
  },
  {
    initials: 'FN', name: 'Fitriani Nasution', imageKey: 'teacher-4',
    role: { id: 'Pengajar TOEFL & IELTS', en: 'TOEFL & IELTS Teacher' },
    credential: { id: 'S.Pd., skor IELTS 8.0', en: 'B.Ed., IELTS band 8.0' },
    quote: {
      id: 'Tes itu punya pola. Begitu tahu polanya, sisanya latihan.',
      en: 'These tests have patterns. Once you see the pattern, the rest is practice.',
    },
  },
  {
    initials: 'MT', name: 'Marcus Tanjung', imageKey: 'teacher-5',
    role: { id: 'Pengajar Kids', en: 'Kids Teacher' },
    credential: {
      id: 'S.Pd. PGSD, sertifikasi TEYL',
      en: 'B.Ed. in Primary Education, TEYL certified',
    },
    quote: {
      id: 'Anak-anak belajar paling cepat kalau mereka lupa sedang belajar.',
      en: 'Children learn fastest when they forget they are learning.',
    },
  },
  {
    initials: 'SW', name: 'Sri Wahyuni', imageKey: 'teacher-6',
    role: { id: 'Konselor HFOS', en: 'HFOS Counsellor' },
    credential: {
      id: 'Pengalaman 8 tahun penempatan studi luar negeri',
      en: '8 years placing students in universities abroad',
    },
    quote: {
      id: 'Bagian paling sulit biasanya bukan kampusnya, tapi berkasnya.',
      en: 'The hard part is rarely the university. It is the paperwork.',
    },
  },
];
```

Create `src/content/faq.ts`:

```ts
import type { FaqItem } from './types';

export const faq: FaqItem[] = [
  {
    q: { id: 'Apakah bisa coba kelas dulu sebelum daftar?', en: 'Can I try a class before enrolling?' },
    a: {
      id: 'Bisa. Satu sesi percobaan gratis, tanpa kewajiban lanjut. Hubungi kami untuk jadwalnya.',
      en: 'Yes. One free trial session, with no obligation to continue. Contact us to arrange a time.',
    },
  },
  {
    q: { id: 'Bagaimana cara tahu level saya?', en: 'How do I find out my level?' },
    a: {
      id: 'Kami adakan tes penempatan gratis sekitar 30 menit sebelum pendaftaran.',
      en: 'We run a free placement test of about 30 minutes before you enrol.',
    },
  },
  {
    q: { id: 'Berapa jumlah siswa per kelas?', en: 'How many students are in a class?' },
    a: { id: 'Maksimal 8 orang.', en: 'Eight at most.' },
  },
  {
    q: { id: 'Apakah ada kelas privat?', en: 'Do you offer private classes?' },
    a: {
      id: 'Ada, untuk semua program. Biaya dan jadwal disesuaikan.',
      en: 'Yes, for every programme. Fees and scheduling are arranged individually.',
    },
  },
  {
    q: { id: 'Apakah ada kelas online?', en: 'Do you offer online classes?' },
    a: {
      id: 'Ada untuk Conversation, TOEFL/IELTS, dan Business English. Kelas Kids hanya tatap muka.',
      en: 'Yes for Conversation, TOEFL/IELTS, and Business English. Kids classes are in person only.',
    },
  },
  {
    q: { id: 'Bisa bayar per bulan?', en: 'Can I pay monthly?' },
    a: {
      id: 'Bisa untuk program bulanan. Program TOEFL/IELTS dibayar per paket, boleh dua kali cicil.',
      en: 'Yes for the monthly programmes. TOEFL/IELTS is charged per package and can be split into two payments.',
    },
  },
  {
    q: { id: 'Apakah dapat sertifikat?', en: 'Do I get a certificate?' },
    a: { id: 'Ya, di akhir setiap level.', en: 'Yes, at the end of every level.' },
  },
];
```

Create `src/content/hfos.ts`:

```ts
import type { HfosStep, Localized } from './types';

export const hfosServices: Localized[] = [
  { id: 'Konsultasi pemilihan sekolah dan kampus', en: 'Choosing the right school or university' },
  { id: 'Jasa penerjemahan dokumen', en: 'Document translation' },
  { id: 'Pencarian tempat tinggal di negara tujuan', en: 'Finding accommodation in the destination country' },
  { id: 'Pengurusan visa dan student pass', en: 'Visa and student pass processing' },
  { id: 'Study tour ke kampus tujuan', en: 'Study tours to your target campus' },
];

export const hfosCountries: Localized[] = [
  { id: 'Malaysia', en: 'Malaysia' },
  { id: 'Singapura', en: 'Singapore' },
  { id: 'Australia', en: 'Australia' },
  { id: 'Kanada', en: 'Canada' },
  { id: 'Cina', en: 'China' },
  { id: 'Amerika Serikat', en: 'United States' },
  { id: 'Selandia Baru', en: 'New Zealand' },
];

export const hfosSteps: HfosStep[] = [
  {
    n: 1,
    title: { id: 'Konsultasi awal', en: 'First consultation' },
    body: {
      id: 'Kami petakan minat, nilai, dan anggaran keluarga.',
      en: 'We map out interests, grades, and the family budget.',
    },
  },
  {
    n: 2,
    title: { id: 'Pemilihan kampus', en: 'Choosing a university' },
    body: {
      id: 'Kami susun 3–5 pilihan realistis beserta perkiraan biaya.',
      en: 'We put together three to five realistic options with cost estimates.',
    },
  },
  {
    n: 3,
    title: { id: 'Persiapan bahasa', en: 'Language preparation' },
    body: {
      id: 'Kalau skor belum cukup, masuk kelas TOEFL/IELTS dulu.',
      en: 'If the score is not there yet, TOEFL/IELTS classes come first.',
    },
  },
  {
    n: 4,
    title: { id: 'Berkas & aplikasi', en: 'Documents & application' },
    body: {
      id: 'Terjemahan dokumen, pengisian formulir, pengiriman.',
      en: 'Document translation, filling in the forms, submission.',
    },
  },
  {
    n: 5,
    title: { id: 'Visa & student pass', en: 'Visa & student pass' },
    body: { id: 'Pendampingan sampai wawancara.', en: 'Support all the way through the interview.' },
  },
  {
    n: 6,
    title: { id: 'Keberangkatan', en: 'Departure' },
    body: {
      id: 'Akomodasi, orientasi, kontak darurat di negara tujuan.',
      en: 'Accommodation, orientation, and emergency contacts in the destination country.',
    },
  },
];
```

Create `src/content/gallery.ts`:

```ts
import type { GalleryItem, Localized } from './types';

export const galleryCategories: { key: 'all' | GalleryItem['category']; label: Localized }[] = [
  { key: 'all', label: { id: 'Semua', en: 'All' } },
  { key: 'kids', label: { id: 'Kids', en: 'Kids' } },
  { key: 'teens', label: { id: 'Teens', en: 'Teens' } },
  { key: 'conversation', label: { id: 'Conversation', en: 'Conversation' } },
  { key: 'toefl', label: { id: 'TOEFL & IELTS', en: 'TOEFL & IELTS' } },
  { key: 'business', label: { id: 'Business', en: 'Business' } },
  { key: 'events', label: { id: 'Kegiatan', en: 'Events' } },
];

export const galleryItems: GalleryItem[] = [
  { imageKey: 'gallery-kids-class', category: 'kids', label: { id: 'Suasana kelas Kids', en: 'Inside a Kids class' } },
  { imageKey: 'gallery-phonics', category: 'kids', label: { id: 'Kegiatan phonics', en: 'Phonics activity' } },
  { imageKey: 'gallery-teens-discussion', category: 'teens', label: { id: 'Diskusi kelas Teens', en: 'Teens class discussion' } },
  { imageKey: 'gallery-teens-presentation', category: 'teens', label: { id: 'Presentasi siswa Teens', en: 'Teens student presentation' } },
  { imageKey: 'gallery-conversation-roleplay', category: 'conversation', label: { id: 'Roleplay Conversation', en: 'Conversation roleplay' } },
  { imageKey: 'gallery-native-speaker', category: 'conversation', label: { id: 'Sesi native speaker', en: 'Native-speaker session' } },
  { imageKey: 'gallery-toefl-simulation', category: 'toefl', label: { id: 'Simulasi tes TOEFL', en: 'TOEFL mock test' } },
  { imageKey: 'gallery-business-inhouse', category: 'business', label: { id: 'Kelas in-house perusahaan', en: 'In-house corporate class' } },
  { imageKey: 'gallery-english-camp', category: 'events', label: { id: 'English Camp', en: 'English Camp' } },
  { imageKey: 'gallery-graduation', category: 'events', label: { id: 'Graduation', en: 'Graduation' } },
  { imageKey: 'gallery-speaking-day', category: 'events', label: { id: 'Speaking Day', en: 'Speaking Day' } },
  { imageKey: 'gallery-study-tour', category: 'events', label: { id: 'Study tour Singapura', en: 'Singapore study tour' } },
];

export const activities: { title: Localized; body: Localized }[] = [
  {
    title: { id: 'English Camp', en: 'English Camp' },
    body: { id: 'Dua hari setiap Juni, untuk siswa Kids dan Teens.', en: 'Two days every June, for Kids and Teens students.' },
  },
  {
    title: { id: 'Speaking Day', en: 'Speaking Day' },
    body: { id: 'Sabtu terakhir tiap bulan, terbuka untuk umum.', en: 'The last Saturday of every month, open to the public.' },
  },
  {
    title: { id: 'Graduation', en: 'Graduation' },
    body: { id: 'Akhir tiap level, penyerahan sertifikat.', en: 'At the end of every level, with certificates awarded.' },
  },
  {
    title: { id: 'Kunjungan kampus', en: 'Campus visits' },
    body: { id: 'Study tour ke Malaysia dan Singapura, setahun sekali.', en: 'An annual study tour to Malaysia and Singapore.' },
  },
];
```

Create `src/content/articles.ts`:

```ts
import type { Article } from './types';

export const articles: Article[] = [
  {
    imageKey: 'article-1',
    category: { id: 'Belajar', en: 'Learning' },
    title: {
      id: 'Kenapa anak bisa lulus ujian tapi diam waktu diajak bicara',
      en: 'Why a child can pass the exam but freeze in conversation',
    },
    date: { id: 'Menunggu isi', en: 'Coming soon' },
  },
  {
    imageKey: 'article-2',
    category: { id: 'Persiapan tes', en: 'Test preparation' },
    title: {
      id: 'Dua bulan menuju TOEFL: yang perlu dan tidak perlu dilatih',
      en: 'Two months to TOEFL: what to drill and what to skip',
    },
    date: { id: 'Menunggu isi', en: 'Coming soon' },
  },
  {
    imageKey: 'article-3',
    category: { id: 'Studi luar negeri', en: 'Studying abroad' },
    title: {
      id: 'Berkas kuliah ke Malaysia, urutan yang bikin tidak bolak-balik',
      en: 'Malaysian university paperwork, in the order that saves you a second trip',
    },
    date: { id: 'Menunggu isi', en: 'Coming soon' },
  },
];
```

Create `src/content/about.ts`:

```ts
import type { Localized, Value } from './types';

export const about = {
  history: [
    {
      id: 'Hanna Filia mulai tahun 2003 dari satu ruko di Nagoya dengan dua kelas dan tiga belas siswa. Waktu itu Batam sedang tumbuh cepat — pabrik-pabrik baru buka, orang datang dari seluruh Indonesia, dan hampir semua pekerjaan bagus mensyaratkan bahasa Inggris.',
      en: 'Hanna Filia began in 2003 in a single shophouse in Nagoya, with two classrooms and thirteen students. Batam was growing fast then — new factories were opening, people were arriving from all over Indonesia, and almost every good job asked for English.',
    },
    {
      id: 'Ibu Anna, S.Pd. mendirikan Hanna Filia karena melihat celah yang sama berulang: orang bisa lulus ujian bahasa Inggris tapi diam waktu diajak bicara. Sejak awal kelas di sini dibuat kecil dan banyak bicara.',
      en: 'Anna, S.Pd. founded Hanna Filia after seeing the same gap again and again: people could pass an English exam and still go quiet when spoken to. From the very first class, our classes have been small and full of talking.',
    },
    {
      id: 'Dua dekade kemudian, kami sudah mengajar lebih dari empat ribu siswa, dari anak kelas satu SD sampai insinyur yang mau pindah kerja ke Singapura. Sebagian dari mereka kami antar sampai ke kampus di luar negeri lewat layanan HFOS.',
      en: 'Two decades on, we have taught more than four thousand students, from first-graders to engineers moving to Singapore for work. Some of them we accompanied all the way to a university abroad through our HFOS service.',
    },
  ] as Localized[],

  vision: {
    id: 'Menjadi lembaga bahasa Inggris yang membuat orang Batam berani bicara di mana pun mereka berdiri.',
    en: 'To be the English school that gives the people of Batam the confidence to speak, wherever they find themselves.',
  } as Localized,

  mission: [
    {
      id: 'Mengajar dengan kelas kecil supaya setiap siswa dapat giliran bicara.',
      en: 'Keep classes small so every student gets a turn to speak.',
    },
    {
      id: 'Menyesuaikan materi dengan tujuan nyata siswa: sekolah, kerja, atau keberangkatan.',
      en: 'Match the material to the real goal: school, work, or a flight out.',
    },
    {
      id: 'Menjaga kualitas pengajar lewat pelatihan berkala dan sertifikasi.',
      en: 'Keep teaching quality high through regular training and certification.',
    },
    {
      id: 'Mendampingi siswa sampai tujuannya tercapai, bukan sampai kelasnya habis.',
      en: 'Stay with students until they reach their goal, not until the course runs out.',
    },
  ] as Localized[],

  values: [
    {
      title: { id: 'Bicara dulu.', en: 'Speak first.' },
      body: {
        id: 'Grammar penting, tapi kami mulai dari keberanian membuka mulut.',
        en: 'Grammar matters, but we start with the nerve to open your mouth.',
      },
    },
    {
      title: { id: 'Kelas kecil.', en: 'Small classes.' },
      body: {
        id: 'Maksimal delapan orang, supaya tidak ada yang menghilang di belakang.',
        en: 'Eight people at most, so nobody disappears at the back.',
      },
    },
    {
      title: { id: 'Terukur.', en: 'Measured.' },
      body: {
        id: 'Setiap siswa punya rapor perkembangan tiap dua bulan.',
        en: 'Every student gets a progress report every two months.',
      },
    },
    {
      title: { id: 'Sampai tujuan.', en: 'All the way.' },
      body: {
        id: 'Kami ikut memikirkan apa yang terjadi setelah kursus selesai.',
        en: 'We think about what happens after the course ends, too.',
      },
    },
  ] as Value[],

  facilities: [
    { id: '6 ruang kelas ber-AC', en: '6 air-conditioned classrooms' },
    { id: 'Ruang multimedia untuk latihan listening', en: 'Multimedia room for listening practice' },
    { id: 'Perpustakaan mini dengan 400+ buku berbahasa Inggris', en: 'Mini library with 400+ English books' },
    { id: 'Ruang tunggu orang tua', en: 'Waiting area for parents' },
    { id: 'WiFi', en: 'WiFi' },
    { id: 'Parkir', en: 'Parking' },
  ] as Localized[],
};

export const crossProgramBenefits: Localized[] = [
  { id: 'Tes penempatan gratis sebelum mendaftar', en: 'Free placement test before you enrol' },
  { id: 'Kelas percobaan gratis satu sesi', en: 'One free trial session' },
  { id: 'Sertifikat di akhir setiap level', en: 'A certificate at the end of every level' },
  {
    id: 'Diskon 10% untuk dua orang atau lebih dari satu keluarga',
    en: '10% discount for two or more people from the same family',
  },
];
```

Create `src/content/testimonials.ts`:

```ts
import type { Testimonial } from './types';

export const testimonials: Testimonial[] = [
  {
    name: 'Yuliana',
    role: { id: 'orang tua siswa English for Kids', en: 'parent of an English for Kids student' },
    quote: {
      id: 'Anak saya dulu nilai bahasa Inggrisnya pas-pasan dan malu bicara. Enam bulan di sini dia yang jadi juru bicara kelompok waktu presentasi sekolah.',
      en: 'My son used to scrape by in English and was too shy to speak. Six months here and he was the one presenting for his group at school.',
    },
  },
  {
    name: 'Rian Pratama',
    role: { id: 'alumni TOEFL Preparation', en: 'TOEFL Preparation alumnus' },
    quote: {
      id: 'Saya butuh TOEFL 550 buat syarat beasiswa dan cuma punya waktu dua bulan. Dapat 573. Yang paling ngebantu itu simulasi tesnya, bukan materinya.',
      en: 'I needed a TOEFL 550 for a scholarship and had two months. I got 573. The mock tests helped more than the material did.',
    },
  },
  {
    name: 'Hendra Kusuma',
    role: {
      id: 'Production Supervisor, alumni Business English',
      en: 'Production Supervisor, Business English alumnus',
    },
    quote: {
      id: 'Kerja saya banyak meeting sama vendor Singapura. Dulu saya cuma ngangguk. Sekarang saya yang mimpin meetingnya.',
      en: 'My job is full of meetings with Singaporean vendors. I used to just nod along. Now I run the meeting.',
    },
  },
];

export const hfosTestimonial: Testimonial = {
  name: 'Keluarga Tanuwijaya',
  role: { id: 'klien HFOS', en: 'HFOS client' },
  quote: {
    id: 'Kami sekeluarga nggak ngerti apa-apa soal kuliah di Australia. Bu Sri yang urus dari nyari kampus sampai anak saya dapat kamar di Melbourne.',
    en: 'Our family knew nothing about studying in Australia. Sri handled everything, from finding the university to getting our daughter a room in Melbourne.',
  },
};
```

Create `src/content/site.ts`:

```ts
import type { Hours, Localized } from './types';

/** Flip to true to show programme prices across the whole site. */
export const SHOW_PRICES = false;

export const site = {
  phone: '(0778) 426551',
  whatsapp: '0812-7000-1234',
  whatsappE164: '6281270001234',
  email: 'info@hannafilia.co.id',
  instagram: '@hanna_filia',
  facebook: 'Hanna Filia Batam',
  foundation: {
    id: 'Yayasan Hanna Filia Internasional',
    en: 'Yayasan Hanna Filia Internasional',
  } as Localized,
  motto: 'Soli Deo Gloria',
  addressLines: [
    'Komplek Nagoya Newton Blok C No. 15–17',
    'Lubuk Baja Kota, Kec. Lubuk Baja',
    'Kota Batam, Kepulauan Riau 29432',
  ],
  hours: [
    { day: { id: 'Senin–Jumat', en: 'Monday–Friday' }, open: { id: '09.00–20.00 WIB', en: '09:00–20:00 WIB' } },
    { day: { id: 'Sabtu', en: 'Saturday' }, open: { id: '09.00–16.00 WIB', en: '09:00–16:00 WIB' } },
    { day: { id: 'Minggu', en: 'Sunday' }, open: { id: 'Tutup', en: 'Closed' } },
  ] as Hours[],
  accreditationNote: {
    id: 'NILEK / NPSN — menunggu data · Akreditasi BAN PAUD & PNF — menunggu data',
    en: 'NILEK / NPSN — pending · BAN PAUD & PNF accreditation — pending',
  } as Localized,
};

export const stats: { value: string; countTo: number | null; label: Localized }[] = [
  { value: '2003', countTo: null, label: { id: 'Tahun berdiri', en: 'Founded' } },
  { value: '4.200+', countTo: 4200, label: { id: 'Alumni', en: 'Alumni' } },
  { value: '8', countTo: 8, label: { id: 'Siswa maksimal per kelas', en: 'Students per class, maximum' } },
  { value: '37', countTo: 37, label: { id: 'Alumni lanjut studi luar negeri', en: 'Alumni now studying abroad' } },
];

/** Route keys shared by nav, bottom nav, and footer. `href` excludes the locale
 *  prefix — next-intl's Link adds it. */
export const ROUTES = {
  home: '/',
  about: '/about',
  programs: '/programs',
  studyAbroad: '/study-abroad',
  teachers: '/teachers',
  gallery: '/gallery',
  articles: '/articles',
  contact: '/contact',
} as const;

export type RouteKey = keyof typeof ROUTES;

/** Desktop top app bar: six links, matching the original site's navigation.
 *  Not eight — eight plus logo, locale toggle and CTA overflow at 768px. */
export const topNavKeys: RouteKey[] = ['home', 'about', 'programs', 'studyAbroad', 'teachers', 'contact'];

/** M3 caps a navigation bar at five destinations. */
export const bottomNavKeys: RouteKey[] = ['home', 'programs', 'studyAbroad', 'gallery', 'contact'];

export const footerKeys: RouteKey[] = [
  'home', 'about', 'programs', 'studyAbroad', 'teachers', 'gallery', 'articles', 'contact',
];
```

- [ ] **Step 4: Write the translation files**

Create `messages/id.json`:

```json
{
  "nav": {
    "home": "Beranda",
    "about": "Tentang",
    "programs": "Program",
    "studyAbroad": "Studi ke Luar Negeri",
    "teachers": "Pengajar",
    "gallery": "Galeri",
    "articles": "Artikel",
    "contact": "Kontak",
    "skipToContent": "Lompat ke konten utama",
    "mainNavigation": "Navigasi utama",
    "switchLanguage": "Ganti bahasa"
  },
  "footer": {
    "pages": "Halaman",
    "contact": "Kontak",
    "orgName": "Hanna Filia English Course",
    "rights": "© 2026 Yayasan Hanna Filia Internasional"
  },
  "cta": {
    "trial": "Daftar kelas percobaan",
    "seePrograms": "Lihat program",
    "allPrograms": "Semua program",
    "learnHfos": "Pelajari HFOS",
    "openPage": "Buka halamannya",
    "askPrice": "Tanya biaya",
    "scheduleConsult": "Jadwalkan konsultasi",
    "sendViaWhatsapp": "Kirim lewat WhatsApp"
  },
  "home": {
    "heroTitle": "Bahasa Inggris untuk yang mau melangkah lebih jauh",
    "heroBody": "Kursus bahasa Inggris di Nagoya, Batam. Kelas kecil, pengajar bersertifikat, dari usia 6 tahun sampai persiapan kuliah di luar negeri.",
    "levelLadder": "Tangga level",
    "studyAbroadRow": "Studi ke luar negeri",
    "marquee": "Kelas kecil · Maksimal 8 siswa per kelas · Pengajar bersertifikat · Nagoya, Batam · Sejak 2003 · Learning English is Fun and Easy · ",
    "pickTitle": "Kelas mana yang cocok?",
    "pickBody": "Pilih yang paling mendekati keadaan Anda.",
    "pickRecommendation": "Rekomendasi",
    "levelsTitle": "Lima level, satu jalur",
    "hfosTitle": "Setelah bahasanya siap, kami bantu urusan berangkatnya",
    "hfosBody": "Hanna Filia Overseas Service mendampingi pemilihan kampus, terjemahan dokumen, pengurusan student pass, sampai mencari tempat tinggal di negara tujuan. Malaysia, Singapura, Australia, Kanada, dan Selandia Baru.",
    "hfosMapAlt": "Diagram rute pendampingan dari Batam ke Malaysia, Singapura, Australia, Kanada, dan Selandia Baru",
    "testimonialsTitle": "Kata mereka",
    "trialBadge": "Gratis",
    "trialTitle": "Coba satu kelas dulu, gratis",
    "trialBody": "Datang ke Nagoya Newton, ikut satu sesi, lihat sendiri suasana kelasnya. Tanpa biaya, tanpa kewajiban lanjut.",
    "moreLinks": "Halaman lain"
  },
  "pick": {
    "kids": "Anak saya usia 6–12 tahun",
    "teens": "Anak saya SMP/SMA",
    "conversation": "Saya mau lancar ngobrol",
    "toefl": "Saya butuh skor TOEFL/IELTS",
    "business": "Untuk keperluan kerja",
    "hfos": "Saya mau kuliah di luar negeri",
    "hfosName": "Studi ke Luar Negeri",
    "hfosMeta": "Hanna Filia Overseas Service · konsultasi kampus sampai keberangkatan"
  },
  "about": {
    "eyebrow": "Tentang kami",
    "title": "Dua dekade mengajar orang Batam bicara",
    "vision": "Visi",
    "mission": "Misi",
    "values": "Nilai",
    "facilities": "Fasilitas",
    "buildingPhoto": "Gedung Hanna Filia di Nagoya Newton"
  },
  "programs": {
    "eyebrow": "Program kursus",
    "title": "Lima level, berurutan dari kata pertama",
    "body": "Tes penempatan gratis menentukan Anda mulai dari mana. Satu sesi percobaan gratis sebelum mendaftar.",
    "crossProgram": "Berlaku untuk semua program",
    "studyAbroadName": "Studi ke Luar Negeri",
    "studyAbroadMeta": "Hanna Filia Overseas Service",
    "studyAbroadBody": "Pemilihan kampus, terjemahan dokumen, visa dan student pass, sampai tempat tinggal di negara tujuan.",
    "consultation": "Konsultasi",
    "level": "Level",
    "forWhom": "Untuk",
    "duration": "Durasi",
    "meetings": "Pertemuan",
    "fee": "Biaya",
    "syllabus": "Isi materi",
    "afterwards": "Setelah selesai",
    "trySessionTitle": "Coba satu sesi dulu",
    "trySessionBody": "Tes penempatan gratis, tanpa kewajiban lanjut."
  },
  "hfos": {
    "eyebrow": "HFOS",
    "title": "Hanna Filia Overseas Service",
    "lead": "Mengurus kuliah di luar negeri itu bukan satu langkah, tapi belasan. Kami sudah melewatinya bersama puluhan keluarga Batam.",
    "services": "Layanan",
    "countries": "Negara tujuan",
    "process": "Alur pendampingan",
    "step": "Langkah"
  },
  "teachers": {
    "eyebrow": "Pengajar",
    "title": "Enam orang yang berdiri di depan kelas",
    "portraitPending": "Foto asli menyusul"
  },
  "gallery": {
    "eyebrow": "Galeri & kegiatan",
    "title": "Suasana kelas dan kegiatan",
    "filterLabel": "Saring galeri berdasarkan kategori",
    "activities": "Kegiatan rutin",
    "placeholderNote": "Foto di halaman ini masih sementara dan akan diganti dengan dokumentasi Hanna Filia."
  },
  "articles": {
    "eyebrow": "Artikel",
    "title": "Catatan dari ruang kelas",
    "body": "Bagian ini disiapkan untuk fase dua. Tiga judul di bawah menunjukkan bentuk halamannya."
  },
  "contact": {
    "eyebrow": "Kontak & pendaftaran",
    "title": "Datang ke Nagoya Newton",
    "address": "Alamat",
    "hours": "Jam operasional",
    "formTitle": "Form pendaftaran",
    "phone": "Telepon",
    "whatsapp": "WhatsApp",
    "email": "Email",
    "instagram": "Instagram",
    "faqTitle": "Pertanyaan yang sering masuk",
    "mapLabel": "Peta lokasi Hanna Filia di Nagoya Newton, Batam"
  },
  "form": {
    "name": "Nama lengkap",
    "namePlaceholder": "Nama lengkap",
    "whatsapp": "Nomor WhatsApp",
    "whatsappPlaceholder": "08xx xxxx xxxx",
    "age": "Usia calon siswa",
    "program": "Program yang diminati",
    "programPlaceholder": "Pilih program",
    "message": "Pesan (opsional)",
    "errorNameRequired": "Nama wajib diisi.",
    "errorWhatsappRequired": "Nomor WhatsApp wajib diisi.",
    "errorWhatsappInvalid": "Nomor WhatsApp tidak valid. Contoh: 0812 7000 1234.",
    "errorProgramRequired": "Pilih salah satu program.",
    "opening": "Halo Hanna Filia, saya ingin mendaftar kelas percobaan.",
    "hint": "Tombol ini membuka WhatsApp dengan pesan yang sudah terisi. Anda masih bisa mengubahnya sebelum mengirim."
  },
  "common": {
    "photoPending": "Foto sementara"
  }
}
```

Create `messages/en.json` with **exactly the same key structure**:

```json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "programs": "Programs",
    "studyAbroad": "Study Abroad",
    "teachers": "Teachers",
    "gallery": "Gallery",
    "articles": "Articles",
    "contact": "Contact",
    "skipToContent": "Skip to main content",
    "mainNavigation": "Main navigation",
    "switchLanguage": "Switch language"
  },
  "footer": {
    "pages": "Pages",
    "contact": "Contact",
    "orgName": "Hanna Filia English Course",
    "rights": "© 2026 Yayasan Hanna Filia Internasional"
  },
  "cta": {
    "trial": "Book a free trial class",
    "seePrograms": "See programs",
    "allPrograms": "All programs",
    "learnHfos": "About HFOS",
    "openPage": "Open the page",
    "askPrice": "Ask for pricing",
    "scheduleConsult": "Book a consultation",
    "sendViaWhatsapp": "Send via WhatsApp"
  },
  "home": {
    "heroTitle": "English for people who intend to go further",
    "heroBody": "An English course in Nagoya, Batam. Small classes, certified teachers, from age six through to university preparation abroad.",
    "levelLadder": "The level ladder",
    "studyAbroadRow": "Study abroad",
    "marquee": "Small classes · Maximum 8 students per class · Certified teachers · Nagoya, Batam · Since 2003 · Learning English is Fun and Easy · ",
    "pickTitle": "Which class fits?",
    "pickBody": "Pick whichever is closest to your situation.",
    "pickRecommendation": "Recommended",
    "levelsTitle": "Five levels, one path",
    "hfosTitle": "Once the language is ready, we help you get there",
    "hfosBody": "Hanna Filia Overseas Service guides you through choosing a university, translating documents, arranging a student pass, and finding somewhere to live. Malaysia, Singapore, Australia, Canada, and New Zealand.",
    "hfosMapAlt": "Diagram of study routes from Batam to Malaysia, Singapore, Australia, Canada, and New Zealand",
    "testimonialsTitle": "What they say",
    "trialBadge": "Free",
    "trialTitle": "Try one class first, free",
    "trialBody": "Come to Nagoya Newton, sit in on a session, see the class for yourself. No cost, no obligation.",
    "moreLinks": "More pages"
  },
  "pick": {
    "kids": "My child is 6–12",
    "teens": "My child is in secondary school",
    "conversation": "I want to speak fluently",
    "toefl": "I need a TOEFL/IELTS score",
    "business": "For work",
    "hfos": "I want to study abroad",
    "hfosName": "Study Abroad",
    "hfosMeta": "Hanna Filia Overseas Service · from choosing a university to departure"
  },
  "about": {
    "eyebrow": "About us",
    "title": "Two decades teaching Batam to speak",
    "vision": "Vision",
    "mission": "Mission",
    "values": "Values",
    "facilities": "Facilities",
    "buildingPhoto": "The Hanna Filia building at Nagoya Newton"
  },
  "programs": {
    "eyebrow": "Courses",
    "title": "Five levels, starting from the first word",
    "body": "A free placement test decides where you start. One free trial session before you enrol.",
    "crossProgram": "Included in every program",
    "studyAbroadName": "Study Abroad",
    "studyAbroadMeta": "Hanna Filia Overseas Service",
    "studyAbroadBody": "Choosing a university, translating documents, visas and student passes, and somewhere to live when you arrive.",
    "consultation": "Consultation",
    "level": "Level",
    "forWhom": "For",
    "duration": "Duration",
    "meetings": "Sessions",
    "fee": "Fee",
    "syllabus": "What you cover",
    "afterwards": "By the end",
    "trySessionTitle": "Try one session first",
    "trySessionBody": "Free placement test, no obligation to continue."
  },
  "hfos": {
    "eyebrow": "HFOS",
    "title": "Hanna Filia Overseas Service",
    "lead": "Getting into a university abroad is not one step but a dozen. We have been through them with dozens of Batam families.",
    "services": "Services",
    "countries": "Destinations",
    "process": "How it works",
    "step": "Step"
  },
  "teachers": {
    "eyebrow": "Teachers",
    "title": "The six people at the front of the room",
    "portraitPending": "Photograph to follow"
  },
  "gallery": {
    "eyebrow": "Gallery & events",
    "title": "Classes and events",
    "filterLabel": "Filter the gallery by category",
    "activities": "Regular events",
    "placeholderNote": "The photographs on this page are placeholders and will be replaced with Hanna Filia's own."
  },
  "articles": {
    "eyebrow": "Articles",
    "title": "Notes from the classroom",
    "body": "This section is planned for phase two. The three titles below show the shape of the page."
  },
  "contact": {
    "eyebrow": "Contact & enrolment",
    "title": "Come to Nagoya Newton",
    "address": "Address",
    "hours": "Opening hours",
    "formTitle": "Enrolment form",
    "phone": "Phone",
    "whatsapp": "WhatsApp",
    "email": "Email",
    "instagram": "Instagram",
    "faqTitle": "Frequently asked questions",
    "mapLabel": "Map showing Hanna Filia at Nagoya Newton, Batam"
  },
  "form": {
    "name": "Full name",
    "namePlaceholder": "Full name",
    "whatsapp": "WhatsApp number",
    "whatsappPlaceholder": "08xx xxxx xxxx",
    "age": "Student's age",
    "program": "Program of interest",
    "programPlaceholder": "Choose a program",
    "message": "Message (optional)",
    "errorNameRequired": "Please enter your name.",
    "errorWhatsappRequired": "Please enter a WhatsApp number.",
    "errorWhatsappInvalid": "That WhatsApp number is not valid. Example: 0812 7000 1234.",
    "errorProgramRequired": "Please choose a program.",
    "opening": "Hello Hanna Filia, I would like to book a free trial class.",
    "hint": "This opens WhatsApp with the message filled in. You can still edit it before sending."
  },
  "common": {
    "photoPending": "Placeholder photo"
  }
}
```

- [ ] **Step 5: Write the failing content test**

Create `test/content.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { programs } from '../src/content/programs.ts';
import { teachers } from '../src/content/teachers.ts';
import { faq } from '../src/content/faq.ts';
import { hfosServices, hfosCountries, hfosSteps } from '../src/content/hfos.ts';
import { galleryItems, galleryCategories, activities } from '../src/content/gallery.ts';
import { articles } from '../src/content/articles.ts';
import { about, crossProgramBenefits } from '../src/content/about.ts';
import { testimonials, hfosTestimonial } from '../src/content/testimonials.ts';
import { site } from '../src/content/site.ts';

/** Walks any value and yields every object that looks like a Localized. */
function* localizedValues(node: unknown, path: string): Generator<[string, Record<string, unknown>]> {
  if (node === null || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const [i, item] of node.entries()) yield* localizedValues(item, `${path}[${i}]`);
    return;
  }
  const obj = node as Record<string, unknown>;
  const keys = Object.keys(obj);
  if (keys.length === 2 && keys.includes('id') && keys.includes('en')) {
    yield [path, obj];
    return;
  }
  for (const [k, v] of Object.entries(obj)) yield* localizedValues(v, `${path}.${k}`);
}

const CONTENT: Record<string, unknown> = {
  programs, teachers, faq, hfosServices, hfosCountries, hfosSteps,
  galleryItems, galleryCategories, activities, articles, about,
  crossProgramBenefits, testimonials, hfosTestimonial, site,
};

test('every Localized value has non-empty id and en', () => {
  let checked = 0;
  for (const [name, root] of Object.entries(CONTENT)) {
    for (const [path, value] of localizedValues(root, name)) {
      checked++;
      for (const locale of ['id', 'en'] as const) {
        const s = value[locale];
        assert.equal(typeof s, 'string', `${path}.${locale} is not a string`);
        assert.ok((s as string).trim().length > 0, `${path}.${locale} is empty`);
      }
    }
  }
  assert.ok(checked > 100, `only ${checked} localized values found — content is missing`);
});

function keyPaths(obj: unknown, prefix = ''): string[] {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return [prefix];
  return Object.entries(obj as Record<string, unknown>)
    .flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
}

test('id.json and en.json have identical key sets', () => {
  const url = (f: string) => new URL(`../messages/${f}`, import.meta.url);
  const idKeys = keyPaths(JSON.parse(readFileSync(url('id.json'), 'utf8'))).sort();
  const enKeys = keyPaths(JSON.parse(readFileSync(url('en.json'), 'utf8'))).sort();

  const missingInEn = idKeys.filter((k) => !enKeys.includes(k));
  const missingInId = enKeys.filter((k) => !idKeys.includes(k));

  assert.deepEqual(missingInEn, [], `keys present in id.json but missing from en.json`);
  assert.deepEqual(missingInId, [], `keys present in en.json but missing from id.json`);
});

test('no translation string is empty', () => {
  for (const file of ['id.json', 'en.json']) {
    const json = readFileSync(new URL(`../messages/${file}`, import.meta.url), 'utf8');
    const walk = (node: unknown, path: string): void => {
      if (typeof node === 'string') {
        assert.ok(node.trim().length > 0, `${file}:${path} is empty`);
        return;
      }
      if (node && typeof node === 'object') {
        for (const [k, v] of Object.entries(node)) walk(v, `${path}.${k}`);
      }
    };
    walk(JSON.parse(json), file);
  }
});

test('programs have unique slugs and sequential levels', () => {
  assert.equal(programs.length, 5);
  assert.equal(new Set(programs.map((p) => p.slug)).size, 5);
  assert.deepEqual(programs.map((p) => p.n), [1, 2, 3, 4, 5]);
});

test('gallery categories cover every gallery item', () => {
  const declared = new Set(galleryCategories.map((c) => c.key));
  for (const item of galleryItems) {
    assert.ok(declared.has(item.category), `gallery category "${item.category}" is not in galleryCategories`);
  }
});

test('WhatsApp number is stored in E.164 form without punctuation', () => {
  assert.match(site.whatsappE164, /^62\d{9,13}$/);
});
```

- [ ] **Step 6: Run the test**

```bash
npm test
```

Expected: all tests pass. If "only N localized values found" fires, a content module was not added to the `CONTENT` map. If a key-set assertion fires, the two JSON files drifted — fix the JSON, never the test.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add bilingual content modules and translation invariant tests"
```

---

## Task 3: WhatsApp enrolment link

**Files:**
- Create: `src/lib/whatsapp.ts`
- Test: `test/whatsapp.test.ts`

**Interfaces:**
- Consumes: `Locale` from `src/content/types.ts`; `site.whatsappE164` from `src/content/site.ts`.
- Produces:
  - `function normalizeWhatsApp(input: string): string | null` — returns an E.164 number without `+`, or `null` if unusable.
  - `type EnrolmentDetails = { name: string; whatsapp: string; age?: string; program: string; message?: string }`
  - `function buildEnrolmentMessage(details: EnrolmentDetails, opening: string): string`
  - `function buildWhatsAppUrl(details: EnrolmentDetails, opening: string): string`

- [ ] **Step 1: Write the failing test**

Create `test/whatsapp.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeWhatsApp, buildEnrolmentMessage, buildWhatsAppUrl } from '../src/lib/whatsapp.ts';

test('normalizes Indonesian mobile numbers to E.164', () => {
  const cases: Array<[string, string | null]> = [
    ['081270001234', '6281270001234'],
    ['0812-7000-1234', '6281270001234'],
    ['0812 7000 1234', '6281270001234'],
    ['+62 812 7000 1234', '6281270001234'],
    ['+6281270001234', '6281270001234'],
    ['6281270001234', '6281270001234'],
    ['00６2', null],
    ['0062812 7000 1234', '6281270001234'],
    ['81270001234', '6281270001234'],
    ['', null],
    ['   ', null],
    ['abcdefg', null],
    ['62', null],
    ['0812', null],
    ['081270001234567890', null],
    ['123456789', null],
  ];
  for (const [input, expected] of cases) {
    assert.equal(normalizeWhatsApp(input), expected, `input ${JSON.stringify(input)}`);
  }
});

test('builds a message that skips empty optional lines', () => {
  const msg = buildEnrolmentMessage(
    { name: 'Budi', whatsapp: '0812-7000-1234', program: 'English for Kids' },
    'Halo Hanna Filia, saya ingin mendaftar kelas percobaan.',
  );
  assert.ok(msg.startsWith('Halo Hanna Filia'));
  assert.ok(msg.includes('Nama: Budi'));
  assert.ok(msg.includes('WhatsApp: 0812-7000-1234'));
  assert.ok(msg.includes('Program: English for Kids'));
  assert.ok(!msg.includes('Usia:'), 'age line must be omitted when empty');
  assert.ok(!msg.includes('Pesan:'), 'message line must be omitted when empty');
});

test('includes optional lines when they are provided', () => {
  const msg = buildEnrolmentMessage(
    { name: 'Sari', whatsapp: '081270001234', age: '9', program: 'English for Kids', message: 'Bisa hari Sabtu?' },
    'Halo',
  );
  assert.ok(msg.includes('Usia: 9'));
  assert.ok(msg.includes('Pesan: Bisa hari Sabtu?'));
});

test('builds a wa.me URL with the message percent-encoded', () => {
  const url = buildWhatsAppUrl(
    { name: 'Budi & Sari', whatsapp: '081270001234', program: 'Business English' },
    'Halo',
  );
  assert.ok(url.startsWith('https://wa.me/6281270001234?text='));
  assert.ok(url.includes('%26'), 'ampersand in the name must be encoded');
  assert.ok(!url.includes('\n'), 'raw newlines must not appear in the URL');
});
```

- [ ] **Step 2: Run it and watch it fail**

```bash
npm test
```

Expected: `Cannot find module '../src/lib/whatsapp.ts'`.

- [ ] **Step 3: Write the implementation**

Create `src/lib/whatsapp.ts`:

```ts
import { site } from '@/content/site';

/**
 * Normalises an Indonesian mobile number to E.164 without the leading `+`.
 * Accepts the forms people actually type: 0812…, +62 812…, 62812…, 812…,
 * with spaces, dashes, dots or parentheses anywhere. Returns null when the
 * result could not be a valid Indonesian mobile number.
 */
export function normalizeWhatsApp(input: string): string | null {
  let digits = input.replace(/\D/g, '');
  if (digits.length === 0) return null;

  // International prefix dialled the old way: 0062… → 62…
  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith('62')) {
    // already country-coded
  } else if (digits.startsWith('0')) {
    digits = `62${digits.slice(1)}`;
  } else if (digits.startsWith('8')) {
    digits = `62${digits}`;
  } else {
    return null;
  }

  return /^62\d{9,13}$/.test(digits) ? digits : null;
}

export type EnrolmentDetails = {
  name: string;
  whatsapp: string;
  age?: string;
  program: string;
  message?: string;
};

/**
 * Builds the WhatsApp body. `opening` comes from the active locale's
 * `form.opening` translation so the message matches the language the visitor
 * was reading. Field labels stay Indonesian: the recipient is the Batam office.
 */
export function buildEnrolmentMessage(details: EnrolmentDetails, opening: string): string {
  const lines = [
    `Nama: ${details.name.trim()}`,
    `WhatsApp: ${details.whatsapp.trim()}`,
    details.age?.trim() ? `Usia: ${details.age.trim()}` : null,
    `Program: ${details.program.trim()}`,
    details.message?.trim() ? `Pesan: ${details.message.trim()}` : null,
  ].filter((line): line is string => line !== null);

  return `${opening}\n\n${lines.join('\n')}`;
}

export function buildWhatsAppUrl(details: EnrolmentDetails, opening: string): string {
  const text = encodeURIComponent(buildEnrolmentMessage(details, opening));
  return `https://wa.me/${site.whatsappE164}?text=${text}`;
}
```

- [ ] **Step 4: Add the path alias to the test runner**

`@/content/site` will not resolve under `node --test`. Change the import in `src/lib/whatsapp.ts` to a relative one so the module stays testable without a bundler:

```ts
import { site } from '../content/site';
```

Then re-run and confirm. (Relative imports work in both Next and Node; the `@/` alias is used everywhere else where only Next resolves the module.)

- [ ] **Step 5: Run the tests**

```bash
npm test
```

Expected: PASS. Note the `'00６2'` case uses a full-width digit — `replace(/\D/g, '')` strips it, leaving `002` → `2` after the `00` rule → no branch matches → `null`. If that case fails, the implementation is accepting non-ASCII digits.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add WhatsApp enrolment link builder with number normalisation"
```

---

## Task 4: Locale routing, layout shell, and metadata

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `src/i18n/request.ts`, `src/middleware.ts`
- Create: `src/app/[locale]/layout.tsx`
- Modify: `next.config.ts`, `src/app/layout.tsx` (delete), `src/app/page.tsx` (delete)
- Create: `src/app/[locale]/page.tsx` (temporary body, filled in Task 9)

**Interfaces:**
- Consumes: `LOCALES`, `Locale` from `src/content/types.ts`.
- Produces:
  - `routing` from `src/i18n/routing.ts`
  - `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` from `src/i18n/navigation.ts` — **every internal link in the project must import `Link` from here, never from `next/link`**, otherwise the locale prefix is lost.
  - Page params shape: `{ params: Promise<{ locale: Locale }> }` (Next 15 params are async).

- [ ] **Step 1: Write the i18n wiring**

`src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['id', 'en'],
  defaultLocale: 'id',
  localePrefix: 'always',
});
```

`src/i18n/navigation.ts`:

```ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

`src/i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

`src/middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next internals, and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

- [ ] **Step 2: Wire the plugin into next.config.ts**

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Replace the root layout with the locale layout**

Delete `src/app/layout.tsx` and `src/app/page.tsx`, then create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Archivo, Source_Sans_3, Newsreader } from 'next/font/google';

import { routing } from '@/i18n/routing';
import type { Locale } from '@/content/types';
import '@/styles/globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-archivo',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-source-sans',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400'],
  style: ['italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return {
    metadataBase: new URL('https://hannafilia.co.id'),
    title: {
      default: 'Hanna Filia English Course — Batam',
      template: '%s · Hanna Filia',
    },
    description: t('heroBody'),
    alternates: {
      canonical: `/${locale}`,
      languages: { id: '/id', en: '/en' },
    },
    openGraph: {
      type: 'website',
      siteName: 'Hanna Filia English Course',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      title: 'Hanna Filia English Course — Batam',
      description: t('heroBody'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${archivo.variable} ${sourceSans.variable} ${newsreader.variable}`}>
      <body className="bg-surface text-on-surface">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Add a temporary locale page**

`src/app/[locale]/page.tsx`:

```tsx
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/content/types';

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <main className="p-8">
      <h1 className="text-display-large text-primary">{t('heroTitle')}</h1>
      <p className="text-body-large text-on-surface-variant">{t('heroBody')}</p>
    </main>
  );
}
```

- [ ] **Step 5: Verify both locales**

```bash
npm run typecheck && npm run build
npm run dev
```

Expected: `/` redirects to `/id` and shows the Indonesian headline; `/en` shows the English headline; `/fr` returns 404. Confirm `<html lang>` changes between locales using the browser inspector.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add locale routing, fonts, and metadata shell"
```

---

## Task 5: Icons and Material 3 primitives

**Files:**
- Create: `src/components/Icon.tsx`
- Create: `src/components/m3/Button.tsx`, `Card.tsx`, `Chip.tsx`, `Badge.tsx`, `Accordion.tsx`, `TextField.tsx`

**Interfaces:**
- Consumes: `Link` from `@/i18n/navigation`.
- Produces:
  - `type IconName = 'home' | 'school' | 'flight' | 'photo' | 'chat' | 'arrow_right' | 'arrow_left' | 'check' | 'add' | 'remove' | 'language' | 'phone' | 'mail' | 'instagram' | 'facebook' | 'clock' | 'pin' | 'menu'`
  - `<Icon name={IconName} filled?={boolean} size?={number} className?={string} />` — `filled` only differs for `home | school | flight | photo | chat`.
  - `<Button variant="filled"|"tonal"|"outlined"|"text" href?={string} onClick?={...} type?={...} icon?={IconName} className?={string}>` — renders `Link` when `href` is given, `<button>` otherwise. Never renders an anchor without an href.
  - `<Card as?="div"|"article" href?={string} className?={string}>`
  - `<Chip selected={boolean} onClick={...} id?={string} role?={string} aria-selected?={boolean}>`
  - `<Badge tone="gold"|"outline">` — the notched "Gratis" / "Level N" tag.
  - `<Accordion items={{ id: string; question: ReactNode; answer: ReactNode }[]} />`
  - `<TextField label={string} name={string} value error?={string} onChange multiline?={boolean} type?={string} placeholder?={string} required?={boolean} />`
  - `<SelectField label name value options={{value,label}[]} error? onChange placeholder />`

- [ ] **Step 1: Write the icon set**

Create `src/components/Icon.tsx`. Paths are on a 24×24 grid so every icon lines up optically.

```tsx
import type { SVGProps } from 'react';

export type IconName =
  | 'home' | 'school' | 'flight' | 'photo' | 'chat'
  | 'arrow_right' | 'arrow_left' | 'check' | 'add' | 'remove'
  | 'language' | 'phone' | 'mail' | 'instagram' | 'facebook'
  | 'clock' | 'pin' | 'menu';

/** [outlined, filled]. Icons without a filled variant repeat the outlined path. */
const PATHS: Record<IconName, [string, string]> = {
  home: [
    'M4 20v-9.5L12 4l8 6.5V20h-6v-6h-4v6H4Z',
    'M4 20v-9.5L12 4l8 6.5V20h-6v-6h-4v6H4Z',
  ],
  school: [
    'M12 4 2 9l10 5 8-4v6h2V9L12 4Zm-6 8.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z',
    'M12 4 2 9l10 5 8-4v6h2V9L12 4Zm-6 8.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3-6-3Z',
  ],
  flight: [
    'M10.2 3.6a1.6 1.6 0 0 1 3.1 0L14.8 10l6.4 3.1v2l-6.6-1.6-.9 4.3 2.3 1.7v1.4L12 20l-4 .9v-1.4l2.3-1.7-.9-4.3-6.6 1.6v-2L9.2 10l1-6.4Z',
    'M10.2 3.6a1.6 1.6 0 0 1 3.1 0L14.8 10l6.4 3.1v2l-6.6-1.6-.9 4.3 2.3 1.7v1.4L12 20l-4 .9v-1.4l2.3-1.7-.9-4.3-6.6 1.6v-2L9.2 10l1-6.4Z',
  ],
  photo: [
    'M4 5h16v14H4V5Zm2 2v8.2l3.3-3.3 3 3L15 12l3 3V7H6Z',
    'M4 5h16v14H4V5Zm2 10.2 3.3-3.3 3 3L15 12l3 3v2H6v-1.8Z',
  ],
  chat: [
    'M4 4h16v12H7.5L4 19.5V4Zm2 2v9l.7-.7L7.3 14H18V6H6Z',
    'M4 4h16v12H7.5L4 19.5V4Z',
  ],
  arrow_right: ['M12.5 5 19 11.5 12.5 18l-1.4-1.4 4.1-4.1H5v-2h10.2l-4.1-4.1L12.5 5Z', ''],
  arrow_left: ['M11.5 5 5 11.5 11.5 18l1.4-1.4-4.1-4.1H19v-2H8.8l4.1-4.1L11.5 5Z', ''],
  check: ['M9.6 16.6 5 12l1.4-1.4 3.2 3.2 8-8L19 7.2l-9.4 9.4Z', ''],
  add: ['M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z', ''],
  remove: ['M5 11h14v2H5v-2Z', ''],
  language: [
    'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 2c1 0 2.2 1.7 2.7 4.3H9.3C9.8 6.7 11 5 12 5ZM5.3 10h2.8a17 17 0 0 0 0 4H5.3a7 7 0 0 1 0-4Zm.9 6h2.2c.3 1.3.8 2.4 1.3 3.2A7 7 0 0 1 6.2 16Zm1.9-8H6.2a7 7 0 0 1 3.5-3.2C9.2 5.6 8.7 6.7 8.4 8Zm3.6 11c-1 0-2.2-1.7-2.7-4.3h5.4C14.2 17.3 13 19 12 19Zm3-5H9a15 15 0 0 1 0-4h6a15 15 0 0 1 0 4Zm.6 5.2c.5-.8 1-1.9 1.3-3.2h2.2a7 7 0 0 1-3.5 3.2Zm.3-11.2c-.3-1.3-.8-2.4-1.3-3.2A7 7 0 0 1 17.8 8h-1.9Zm2.8 6h-2.8a17 17 0 0 0 0-4h2.8a7 7 0 0 1 0 4Z',
    '',
  ],
  phone: ['M6.6 3h3.2l1.6 4-2 1.5a12 12 0 0 0 5.1 5.1l1.5-2 4 1.6v3.2c0 .8-.7 1.5-1.5 1.5A16.5 16.5 0 0 1 5 5.5C5 4.7 5.7 4 6.6 4V3Z', ''],
  mail: ['M3 5h18v14H3V5Zm2.4 2L12 11.6 18.6 7H5.4ZM5 8.6V17h14V8.6l-7 4.9-7-4.9Z', ''],
  instagram: [
    'M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9ZM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM17.2 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z',
    '',
  ],
  facebook: ['M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.2-1.5 1.5-1.5h1.7V4c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2V10H7.5v3h2.7v8h3.3Z', ''],
  clock: ['M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18Zm0 2a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm-1 3h2v4.6l3.2 1.9-1 1.7L11 13.5V8Z', ''],
  pin: ['M12 2c3.9 0 7 3.1 7 7 0 5.2-7 13-7 13S5 14.2 5 9c0-3.9 3.1-7 7-7Zm0 4.5A2.5 2.5 0 1 0 12 11a2.5 2.5 0 0 0 0-5Z', ''],
  menu: ['M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z', ''],
};

type Props = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  filled?: boolean;
  size?: number;
};

export function Icon({ name, filled = false, size = 24, className, ...rest }: Props) {
  const [outlined, filledPath] = PATHS[name];
  const d = filled && filledPath ? filledPath : outlined;

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      <path d={d} />
    </svg>
  );
}
```

- [ ] **Step 2: Write Button**

Create `src/components/m3/Button.tsx`:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { Icon, type IconName } from '@/components/Icon';

type Variant = 'filled' | 'tonal' | 'outlined' | 'text';

const VARIANTS: Record<Variant, string> = {
  filled: 'bg-primary text-on-primary border-primary',
  tonal: 'bg-tertiary-container text-on-tertiary-container border-on-surface',
  outlined: 'bg-transparent text-on-surface border-on-surface',
  text: 'bg-transparent text-primary border-transparent px-1',
};

const BASE =
  'state-layer relative inline-flex items-center justify-center gap-2 ' +
  'border-[1.5px] rounded-sm px-5 py-3 min-h-12 ' +
  'font-heading text-label-large no-underline cursor-pointer ' +
  'transition-[box-shadow,background-color] duration-200 ease-standard ' +
  'disabled:opacity-45 disabled:cursor-not-allowed';

type Common = { variant?: Variant; icon?: IconName; className?: string; children: ReactNode };

type Props =
  | (Common & { href: string; onClick?: never; type?: never })
  | (Common & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>);

export function Button({ variant = 'filled', icon, className = '', children, ...rest }: Props) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`;
  const body = (
    <>
      {children}
      {icon ? <Icon name={icon} size={20} /> : null}
    </>
  );

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {body}
      </Link>
    );
  }

  const { href: _ignored, ...buttonRest } = rest as { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonRest}>
      {body}
    </button>
  );
}
```

- [ ] **Step 3: Write Card, Chip and Badge**

`src/components/m3/Card.tsx`:

```tsx
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

const BASE =
  'block border-[1.5px] border-on-surface rounded-sm bg-surface text-on-surface ' +
  'transition-[box-shadow,border-color] duration-200 ease-standard';

const INTERACTIVE = 'state-layer relative hover:border-primary hover:elevation-1 no-underline';

export function Card({
  href,
  className = '',
  children,
}: {
  href?: string;
  className?: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Link href={href} className={`${BASE} ${INTERACTIVE} ${className}`}>
        {children}
      </Link>
    );
  }
  return <div className={`${BASE} ${className}`}>{children}</div>;
}
```

`src/components/m3/Chip.tsx`:

```tsx
'use client';

import type { ReactNode } from 'react';

export function Chip({
  selected,
  onClick,
  children,
  ...rest
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'state-layer relative shrink-0 rounded-full border-[1.5px] border-on-surface ' +
        'px-4 py-2 min-h-10 font-heading text-title-small cursor-pointer ' +
        'transition-colors duration-200 ease-standard ' +
        (selected ? 'bg-on-surface text-surface' : 'bg-transparent text-on-surface')
      }
      {...rest}
    >
      {children}
    </button>
  );
}
```

`src/components/m3/Badge.tsx`:

```tsx
import type { ReactNode } from 'react';

/** The notched tag from the original design. Gold on crimson is 4.51:1 — valid
 *  only because this is always ≥14px at weight 800 with wide tracking. */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block bg-tertiary-container text-on-tertiary-container font-heading
                 text-label-medium px-6 py-[7px]"
      style={{
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 11px) 50%, 100% 100%, 0 100%, 11px 50%)',
      }}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Write the Accordion**

Create `src/components/m3/Accordion.tsx`. The open/close animation uses a `grid-template-rows` transition so the height animates without measuring the DOM.

```tsx
'use client';

import { useId, useState, type ReactNode } from 'react';
import { Icon } from '@/components/Icon';

export type AccordionItem = { id: string; question: ReactNode; answer: ReactNode };

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const base = useId();

  return (
    <div>
      {items.map((item) => {
        const open = openId === item.id;
        const buttonId = `${base}-${item.id}-button`;
        const panelId = `${base}-${item.id}-panel`;

        return (
          <div key={item.id} className="border-t-[1.5px] border-outline-variant">
            <button
              type="button"
              id={buttonId}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : item.id)}
              className="state-layer relative flex w-full items-baseline justify-between gap-5
                         py-5 text-left font-heading text-title-large text-on-surface
                         cursor-pointer hover:text-primary transition-colors duration-200 ease-standard"
            >
              <span>{item.question}</span>
              <Icon
                name={open ? 'remove' : 'add'}
                size={24}
                className="shrink-0 self-center text-primary"
              />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="grid transition-[grid-template-rows] duration-200 ease-standard"
              style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div className="pb-6 max-w-[68ch] text-body-large text-on-surface-variant">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

Note: `hidden` is toggled together with the grid rows so collapsed answers stay out of the accessibility tree and out of tab order. Because `hidden` removes the element instantly, the collapse animation is not visible — this is a deliberate trade of exit polish for correct semantics.

- [ ] **Step 5: Write the form fields**

Create `src/components/m3/TextField.tsx`:

```tsx
'use client';

import { useId } from 'react';

type Base = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
};

const FIELD =
  'w-full border-[1.5px] rounded-sm bg-surface px-3.5 py-3 min-h-12 ' +
  'font-body text-body-large text-on-surface ' +
  'transition-colors duration-200 ease-standard';

export function TextField({
  label, name, value, onChange, error, required, placeholder,
  type = 'text', multiline = false,
}: Base & { type?: string; multiline?: boolean }) {
  const id = useId();
  const errorId = `${id}-error`;
  const border = error ? 'border-error' : 'border-on-surface focus-visible:border-primary';
  const shared = {
    id,
    name,
    value,
    required,
    placeholder,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: `${FIELD} ${border}`,
  };

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-body-small font-semibold text-on-surface">
        {label}
      </label>
      {multiline ? (
        <textarea
          {...shared}
          rows={3}
          className={`${shared.className} resize-y`}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input {...shared} type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? (
        <p id={errorId} className="text-body-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label, name, value, onChange, error, required, placeholder, options,
}: Base & { options: { value: string; label: string }[] }) {
  const id = useId();
  const errorId = `${id}-error`;
  const border = error ? 'border-error' : 'border-on-surface focus-visible:border-primary';

  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-body-small font-semibold text-on-surface">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`${FIELD} ${border}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} className="text-body-small text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 6: Verify**

```bash
npm run typecheck && npm run build
```

Expected: clean. Nothing renders these yet; this step catches type errors early.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add icon set and Material 3 component primitives"
```

---

## Task 6: Navigation chrome — top app bar, bottom navigation, footer

**Files:**
- Create: `src/components/chrome/TopAppBar.tsx`, `BottomNav.tsx`, `LocaleToggle.tsx`, `Footer.tsx`, `SkipLink.tsx`
- Create: `public/logo.png` (extract from the original bundle — command given below)
- Modify: `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `ROUTES`, `topNavKeys`, `bottomNavKeys`, `footerKeys`, `site` from `@/content/site`; `Icon`; `Link`, `usePathname` from `@/i18n/navigation`.
- Produces: `<TopAppBar />`, `<BottomNav />`, `<Footer />`, `<SkipLink />`. Layout renders them around `{children}`.

- [ ] **Step 1: Extract the logo from the original bundle**

```bash
cd "/Users/abdillah/Documents/Code/Projects/hanna filia"
mkdir -p public
node -e '
const fs = require("fs");
const lines = fs.readFileSync("LKP Hanna Filia - Website.html", "utf8").split("\n");
const manifest = JSON.parse(lines[378]);
const logo = manifest["cec81c2f-8d04-4f52-aa88-e4da53d831aa"];
fs.writeFileSync("public/logo.png", Buffer.from(logo.data, "base64"));
console.log("wrote public/logo.png");
'
```

Expected: a 656×305 PNG of the Hanna Filia wordmark with the hand-and-heart mark.

- [ ] **Step 2: Write the locale toggle**

Create `src/components/chrome/LocaleToggle.tsx`:

```tsx
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/content/types';

export function LocaleToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');

  return (
    <div
      role="group"
      aria-label={t('switchLanguage')}
      className="inline-flex overflow-hidden rounded-full border-[1.5px] border-on-surface"
    >
      {(['id', 'en'] as const).map((code) => {
        const active = locale === code;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            aria-current={active ? 'true' : undefined}
            onClick={() => router.replace(pathname, { locale: code })}
            className={
              'state-layer relative px-3 py-1.5 min-h-9 font-heading text-title-small uppercase ' +
              'cursor-pointer transition-colors duration-200 ease-standard ' +
              (active ? 'bg-primary text-on-primary' : 'bg-transparent text-on-surface')
            }
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Write the top app bar**

Create `src/components/chrome/TopAppBar.tsx`:

```tsx
'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ROUTES, topNavKeys } from '@/content/site';
import { LocaleToggle } from './LocaleToggle';
import { Button } from '@/components/m3/Button';

export function TopAppBar() {
  const t = useTranslations('nav');
  const tc = useTranslations('cta');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={
        'sticky top-0 z-20 bg-surface border-b-[1.5px] border-on-surface ' +
        'transition-shadow duration-200 ease-standard ' +
        (scrolled ? 'elevation-2' : '')
      }
    >
      <div className="mx-auto flex max-w-[1140px] items-center gap-7 px-6 py-3">
        <Link href={ROUTES.home} className="flex-none">
          <Image src="/logo.png" alt="Hanna Filia" width={656} height={305} priority
                 className="h-8 w-auto md:h-9" />
        </Link>

        <nav aria-label={t('mainNavigation')} className="ml-auto hidden items-center gap-6 md:flex">
          {topNavKeys.map((key) => {
            const href = ROUTES[key];
            const active = href === ROUTES.home ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={
                  'font-body text-body-small font-semibold no-underline ' +
                  'transition-colors duration-200 ease-standard ' +
                  (active ? 'text-primary' : 'text-on-surface hover:text-primary')
                }
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-0">
          <LocaleToggle />
          <Button href={ROUTES.contact} variant="outlined" className="hidden lg:inline-flex">
            {tc('trial')}
          </Button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Write the bottom navigation bar**

Create `src/components/chrome/BottomNav.tsx`. This is the centrepiece of the mobile experience.

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ROUTES, bottomNavKeys, type RouteKey } from '@/content/site';
import { Icon, type IconName } from '@/components/Icon';

const ICONS: Record<RouteKey, IconName> = {
  home: 'home',
  programs: 'school',
  studyAbroad: 'flight',
  gallery: 'photo',
  contact: 'chat',
  about: 'home',
  teachers: 'school',
  articles: 'photo',
};

export function BottomNav() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <nav
      aria-label={t('mainNavigation')}
      className="fixed bottom-0 left-0 right-0 z-30 border-t-[1.5px] border-outline-variant
                 bg-surface-container elevation-2 md:hidden
                 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex h-20 items-stretch justify-around">
        {bottomNavKeys.map((key) => {
          const href = ROUTES[key];
          const active = href === ROUTES.home ? pathname === '/' : pathname.startsWith(href);

          return (
            <li key={key} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className="flex h-full min-h-12 flex-col items-center justify-center gap-1
                           no-underline text-on-surface-variant"
              >
                <span className="relative flex h-8 w-16 items-center justify-center">
                  {/* M3 active indicator: a pill that grows from the centre. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-secondary-container
                               transition-transform duration-[240ms] ease-emphasized"
                    style={{ transform: active ? 'scaleX(1)' : 'scaleX(0)' }}
                  />
                  <Icon
                    name={ICONS[key]}
                    filled={active}
                    size={24}
                    className={
                      'relative transition-colors duration-[240ms] ease-emphasized ' +
                      (active ? 'text-on-secondary-container' : 'text-on-surface-variant')
                    }
                  />
                </span>
                <span
                  className={
                    'text-label-nav font-heading transition-colors duration-[240ms] ease-emphasized ' +
                    (active
                      ? 'font-bold text-on-secondary-container'
                      : 'font-medium text-on-surface-variant')
                  }
                >
                  {t(key)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 5: Write the skip link and footer**

`src/components/chrome/SkipLink.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function SkipLink() {
  const t = useTranslations('nav');
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50
                 focus:rounded-sm focus:bg-primary focus:px-4 focus:py-3
                 focus:font-heading focus:text-label-large focus:text-on-primary"
    >
      {t('skipToContent')}
    </a>
  );
}
```

`src/components/chrome/Footer.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ROUTES, footerKeys, site } from '@/content/site';
import { t as tr } from '@/content/types';
import type { Locale } from '@/content/types';

export function Footer() {
  const t = useTranslations('nav');
  const tf = useTranslations('footer');
  const locale = useLocale() as Locale;

  return (
    <footer className="border-t-[1.5px] border-on-surface bg-primary text-on-primary">
      <div className="mx-auto grid max-w-[1140px] gap-12 px-6 pb-8 pt-16
                      md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <p className="font-heading text-headline-small">{tf('orgName')}</p>
          <p className="mt-1.5 text-body-small text-secondary-container">
            {tr(site.foundation, locale)}
          </p>
          <p className="mt-5 font-quote text-title-large italic text-tertiary-container">
            {site.motto}
          </p>
          <address className="mt-5 not-italic text-body-small text-secondary-container">
            {site.addressLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </address>
        </div>

        <nav aria-label={tf('pages')}>
          <p className="mb-3.5 font-heading text-label-medium text-secondary-container">
            {tf('pages')}
          </p>
          {footerKeys.map((key) => (
            <Link
              key={key}
              href={ROUTES[key]}
              className="block py-1 text-body-medium text-on-primary no-underline
                         transition-colors duration-200 ease-standard hover:text-tertiary-container"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div>
          <p className="mb-3.5 font-heading text-label-medium text-secondary-container">
            {tf('contact')}
          </p>
          <p className="text-body-medium">{site.phone}</p>
          <a href={`https://wa.me/${site.whatsappE164}`} className="block text-body-medium text-on-primary no-underline hover:text-tertiary-container">
            {site.whatsapp}
          </a>
          <a href={`mailto:${site.email}`} className="block text-body-medium text-on-primary no-underline hover:text-tertiary-container">
            {site.email}
          </a>
          <p className="mt-4 text-body-medium">Instagram {site.instagram}</p>
          <p className="text-body-medium">Facebook {site.facebook}</p>
          <div className="mt-5 text-body-small text-secondary-container">
            {site.hours.map((h) => (
              <p key={h.day.en}>
                {tr(h.day, locale)} {tr(h.open, locale)}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1140px] flex-wrap justify-between gap-6 border-t-[1.5px]
                      border-secondary-container/40 px-6 pb-10 pt-5 text-body-small
                      text-secondary-container">
        <span>{tr(site.accreditationNote, locale)}</span>
        <span>{tf('rights')}</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Wire the chrome into the layout**

In `src/app/[locale]/layout.tsx`, replace the `<body>` contents:

```tsx
      <body className="bg-surface text-on-surface">
        <NextIntlClientProvider>
          <SkipLink />
          <TopAppBar />
          <div id="main" className="pb-20 md:pb-0">
            {children}
          </div>
          <Footer />
          <BottomNav />
        </NextIntlClientProvider>
      </body>
```

Add the imports at the top of the file:

```tsx
import { SkipLink } from '@/components/chrome/SkipLink';
import { TopAppBar } from '@/components/chrome/TopAppBar';
import { Footer } from '@/components/chrome/Footer';
import { BottomNav } from '@/components/chrome/BottomNav';
```

The `pb-20` on the `#main` wrapper is what keeps the last section clear of the fixed bottom bar; `md:pb-0` removes it once the bar is hidden.

- [ ] **Step 7: Verify the responsive behaviour by hand**

```bash
npm run build && npm run dev
```

Check all of these:
1. At 375px wide: bottom nav visible, five items, top bar shows only logo and locale toggle.
2. Tap through all five destinations — the pill indicator animates and the icon fills.
3. At 768px: bottom nav gone, six nav links visible in the top bar, no wrapping.
4. At 1024px: the "Daftar kelas percobaan" button appears.
5. Tab from the top of the page — the skip link appears first and jumps to `#main`.
6. Switch language — the URL keeps the same path with a different prefix.
7. Scroll down — the top bar gains a shadow.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add top app bar, M3 bottom navigation, footer, and skip link"
```

---

## Task 7: Scroll reveal and the animated counter

**Files:**
- Create: `src/components/Reveal.tsx`
- Test: none — this is presentation-only and has no branch worth locking.

**Interfaces:**
- Produces:
  - `function useInView<T extends Element>(options?: { once?: boolean; rootMargin?: string }): [RefObject<T | null>, boolean]`
  - `<Reveal delay?={number} className?={string} as?={'div'|'section'|'li'}>` — fades and rises its children when scrolled into view.
  - `<CountUp to={number} format?={(n:number)=>string} durationMs?={number} />`

- [ ] **Step 1: Write the hook and components**

Create `src/components/Reveal.tsx`:

```tsx
'use client';

import {
  useEffect, useRef, useState,
  type ElementType, type ReactNode, type RefObject,
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

export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div' as ElementType,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const [ref, inView] = useInView<HTMLElement>();

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(16px)',
        transition:
          `opacity var(--md-duration-medium4) var(--ease-emphasized-decelerate) ${delay}ms, ` +
          `transform var(--md-duration-medium4) var(--ease-emphasized-decelerate) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
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
```

- [ ] **Step 2: Verify reduced motion behaviour**

```bash
npm run dev
```

In Chrome DevTools open the Rendering panel and set "Emulate CSS prefers-reduced-motion" to `reduce`. Reload. Expected: all revealed content is visible immediately at full opacity, and the counter shows its final number rather than animating. This is the exact failure mode the `[data-reveal]` rule in `globals.css` exists to prevent — confirm it works before moving on.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: add scroll reveal hook, Reveal wrapper, and CountUp"
```

---

## Task 8: Photo pipeline — manifest, download script, PhotoSlot, Monogram

**Files:**
- Create: `scripts/fetch-photos.mjs`, `src/content/images.ts`
- Create: `src/components/media/PhotoSlot.tsx`, `src/components/media/Monogram.tsx`
- Create: `public/images/CREDITS.md`
- Test: extend `test/content.test.ts`

**Interfaces:**
- Consumes: `Localized`, `t` from `@/content/types`.
- Produces:
  - `const images: Record<string, { src: string; ratio: string; alt: Localized }>`
  - `type ImageKey = keyof typeof images`
  - `<PhotoSlot imageKey={string} className?={string} sizes?={string} priority?={boolean} />`
  - `<Monogram initials={string} className?={string} />`

- [ ] **Step 1: Write the download script**

Create `scripts/fetch-photos.mjs`. Every Unsplash ID below was verified to return HTTP 200 before this plan was written.

```js
// Downloads placeholder photographs into public/images/.
// Run once after cloning: `npm run photos`
// Every file here is a placeholder. To use a real photograph, simply overwrite
// the file of the same name — nothing else in the codebase needs to change.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'public', 'images');

/** key → Unsplash photo id (https://unsplash.com/photos/<id>) */
const PHOTOS = {
  'building-front': 'Ucr4Yp-t364',
  'class-kids': '5QTQz-oYk1A',
  'class-teens': '7ixTyur7opE',
  'class-conversation': '-uHVRvDr7pg',
  'class-toefl': '6RTM8EsD1T8',
  'class-business': 'faEfWCdOKIg',
  'hfos-hero': '6zlgM-GUd6I',
  'gallery-kids-class': 'BPXSTl_HBhk',
  'gallery-phonics': 'Pw0vMMWnSWU',
  'gallery-teens-discussion': '90ctJcyrRLs',
  'gallery-teens-presentation': 'gMsnXqILjp4',
  'gallery-conversation-roleplay': 'f0DKiz23tlw',
  'gallery-native-speaker': 'VBLHICVh-lI',
  'gallery-toefl-simulation': '7Wf684C9nwU',
  'gallery-business-inhouse': 'KdeqA3aTnBY',
  'gallery-english-camp': 'adQAb-L-YkE',
  'gallery-graduation': 'm7yOJx0ALME',
  'gallery-speaking-day': '_2NZCoWRJSo',
  'gallery-study-tour': 'z8XO8BfqpYc',
  'article-1': '93W0xn4961g',
  'article-2': 'MiZd3-92iDE',
  'article-3': 'omeaHbEFlN4',
};

const exists = async (p) => access(p).then(() => true, () => false);

async function main() {
  await mkdir(OUT, { recursive: true });
  let downloaded = 0;
  let skipped = 0;
  const failed = [];

  for (const [key, id] of Object.entries(PHOTOS)) {
    const file = join(OUT, `${key}.jpg`);

    // Never overwrite: once the client drops in a real photo, re-running this
    // script must not clobber it.
    if (await exists(file)) {
      skipped++;
      console.log(`skip     ${key}.jpg (already present)`);
      continue;
    }

    try {
      const res = await fetch(`https://unsplash.com/photos/${id}/download?w=1600`, {
        redirect: 'follow',
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      await writeFile(file, buf);
      downloaded++;
      console.log(`download ${key}.jpg (${(buf.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed.push(`${key} (${id}): ${err.message}`);
      console.error(`FAIL     ${key}: ${err.message}`);
    }

    // Be a polite client.
    await new Promise((r) => setTimeout(r, 1200));
  }

  console.log(`\n${downloaded} downloaded, ${skipped} skipped, ${failed.length} failed`);
  if (failed.length) {
    console.error('\nFailed:\n' + failed.join('\n'));
    process.exitCode = 1;
  }
}

main();
```

- [ ] **Step 2: Run it**

```bash
npm run photos
```

Expected: 22 files in `public/images/`. If any fail, pick a replacement id from the verified spares and edit the map: `U0dBV_QeiYk`, `T-tVt4xsCdE`, `iggWDxHTAUQ`, `hpRGrfOIybc`, `LLfRMRT-9AY`, `ggeZ9oyI-PE`, `ONe-snuCaqQ`, `ewGMqs2tmJI`, `31NIsz-f5G0`.

- [ ] **Step 3: Write the credits file**

Create `public/images/CREDITS.md`:

```markdown
# Placeholder photographs

Every `.jpg` in this directory is a temporary placeholder from Unsplash, used
under the [Unsplash License](https://unsplash.com/license). None of them show
Hanna Filia, its students, or its staff.

**To replace one:** save your own photograph over the file of the same name,
keeping the `.jpg` extension. Nothing in the code needs to change. Match the
aspect ratio listed in `src/content/images.ts` so the layout does not shift.

Source for each file: `https://unsplash.com/photos/<id>`, with the ids listed in
`scripts/fetch-photos.mjs`.

The six teacher cards deliberately use no photograph at all. They render initials
instead, because showing a stranger's face beside a named teacher would
misrepresent a real person. Add `teacher-1.jpg` … `teacher-6.jpg` to this folder
and the cards switch to photographs automatically.
```

- [ ] **Step 4: Write the manifest**

Create `src/content/images.ts`:

```ts
import type { Localized } from './types';

export type ImageEntry = {
  /** Path under /public, or an absolute URL. Empty string = no photo yet. */
  src: string;
  /** CSS aspect-ratio value, e.g. '4/3'. */
  ratio: string;
  alt: Localized;
};

/**
 * The single place a photograph is swapped.
 *
 * To use a real photo: save it as public/images/<key>.jpg (overwriting the
 * placeholder) and leave this file alone. Only change `src` here if you want a
 * different filename or extension.
 */
export const images = {
  'building-front': {
    src: '/images/building-front.jpg', ratio: '4/3',
    alt: { id: 'Gedung Hanna Filia di Nagoya Newton, Batam', en: 'The Hanna Filia building at Nagoya Newton, Batam' },
  },
  'class-kids': {
    src: '/images/class-kids.jpg', ratio: '4/3',
    alt: { id: 'Anak-anak membaca buku bersama di kelas English for Kids', en: 'Children reading together in an English for Kids class' },
  },
  'class-teens': {
    src: '/images/class-teens.jpg', ratio: '4/3',
    alt: { id: 'Siswa remaja berdiskusi di meja kelas', en: 'Teenage students working together at a classroom table' },
  },
  'class-conversation': {
    src: '/images/class-conversation.jpg', ratio: '4/3',
    alt: { id: 'Sekelompok orang mengobrol santai', en: 'A group of people in relaxed conversation' },
  },
  'class-toefl': {
    src: '/images/class-toefl.jpg', ratio: '4/3',
    alt: { id: 'Seseorang mengerjakan latihan soal di buku tulis', en: 'Someone working through practice questions in a notebook' },
  },
  'class-business': {
    src: '/images/class-business.jpg', ratio: '4/3',
    alt: { id: 'Rapat kerja di meja panjang dengan laptop', en: 'A work meeting around a long table with laptops' },
  },
  'hfos-hero': {
    src: '/images/hfos-hero.jpg', ratio: '16/9',
    alt: { id: 'Mahasiswa berjalan di area kampus', en: 'Students walking across a university campus' },
  },
  'gallery-kids-class': {
    src: '/images/gallery-kids-class.jpg', ratio: '4/3',
    alt: { id: 'Anak membaca buku di meja kayu', en: 'A child reading a book at a wooden table' },
  },
  'gallery-phonics': {
    src: '/images/gallery-phonics.jpg', ratio: '4/3',
    alt: { id: 'Anak-anak berdiri di depan rak buku', en: 'Children standing in front of a bookshelf' },
  },
  'gallery-teens-discussion': {
    src: '/images/gallery-teens-discussion.jpg', ratio: '4/3',
    alt: { id: 'Dua siswa belajar bersama sambil tersenyum', en: 'Two students smiling while studying together' },
  },
  'gallery-teens-presentation': {
    src: '/images/gallery-teens-presentation.jpg', ratio: '16/9',
    alt: { id: 'Seseorang presentasi di depan peserta yang duduk', en: 'Someone presenting to a seated audience' },
  },
  'gallery-conversation-roleplay': {
    src: '/images/gallery-conversation-roleplay.jpg', ratio: '4/3',
    alt: { id: 'Dua orang membaca buku bersama', en: 'Two people reading a book together' },
  },
  'gallery-native-speaker': {
    src: '/images/gallery-native-speaker.jpg', ratio: '16/9',
    alt: { id: 'Diskusi kelompok di ruang rapat', en: 'A group discussion in a meeting room' },
  },
  'gallery-toefl-simulation': {
    src: '/images/gallery-toefl-simulation.jpg', ratio: '4/3',
    alt: { id: 'Seseorang menulis di meja belajar dengan tumpukan buku', en: 'Someone writing at a desk stacked with books' },
  },
  'gallery-business-inhouse': {
    src: '/images/gallery-business-inhouse.jpg', ratio: '16/9',
    alt: { id: 'Peserta rapat mencatat di meja', en: 'Meeting participants taking notes at a table' },
  },
  'gallery-english-camp': {
    src: '/images/gallery-english-camp.jpg', ratio: '16/9',
    alt: { id: 'Sekelompok orang duduk di bangku taman', en: 'A group sitting on benches among trees' },
  },
  'gallery-graduation': {
    src: '/images/gallery-graduation.jpg', ratio: '4/3',
    alt: { id: 'Seseorang mengenakan toga wisuda', en: 'Someone in a graduation cap and gown' },
  },
  'gallery-speaking-day': {
    src: '/images/gallery-speaking-day.jpg', ratio: '4/3',
    alt: { id: 'Tiga orang berbincang di meja perpustakaan', en: 'Three people talking at a library table' },
  },
  'gallery-study-tour': {
    src: '/images/gallery-study-tour.jpg', ratio: '16/9',
    alt: { id: 'Rombongan berkumpul di area terbuka', en: 'A group gathered in an open area' },
  },
  'article-1': {
    src: '/images/article-1.jpg', ratio: '16/9',
    alt: { id: 'Seseorang membaca di ruang kuliah yang kosong', en: 'Someone reading in an empty lecture hall' },
  },
  'article-2': {
    src: '/images/article-2.jpg', ratio: '16/9',
    alt: { id: 'Seseorang menulis di buku terbuka', en: 'Someone writing in an open notebook' },
  },
  'article-3': {
    src: '/images/article-3.jpg', ratio: '16/9',
    alt: { id: 'Dua orang membaca dan menulis di meja luar ruangan', en: 'Two people reading and writing at an outdoor table' },
  },

  // Teacher portraits render as initials until a real photograph is supplied.
  // See public/images/CREDITS.md for why these are deliberately empty.
  'teacher-1': { src: '', ratio: '1/1', alt: { id: 'Foto Anna, S.Pd.', en: 'Photograph of Anna, S.Pd.' } },
  'teacher-2': { src: '', ratio: '1/1', alt: { id: 'Foto Rachel Simorangkir', en: 'Photograph of Rachel Simorangkir' } },
  'teacher-3': { src: '', ratio: '1/1', alt: { id: 'Foto Daniel Whitmore', en: 'Photograph of Daniel Whitmore' } },
  'teacher-4': { src: '', ratio: '1/1', alt: { id: 'Foto Fitriani Nasution', en: 'Photograph of Fitriani Nasution' } },
  'teacher-5': { src: '', ratio: '1/1', alt: { id: 'Foto Marcus Tanjung', en: 'Photograph of Marcus Tanjung' } },
  'teacher-6': { src: '', ratio: '1/1', alt: { id: 'Foto Sri Wahyuni', en: 'Photograph of Sri Wahyuni' } },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof images;
```

- [ ] **Step 5: Write PhotoSlot and Monogram**

Create `src/components/media/Monogram.tsx`:

```tsx
export function Monogram({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center bg-primary-container ${className}`}
    >
      <span className="font-heading text-display-small text-on-primary-container">
        {initials}
      </span>
    </div>
  );
}
```

Create `src/components/media/PhotoSlot.tsx`:

```tsx
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { images, type ImageKey } from '@/content/images';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';

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
```

- [ ] **Step 6: Extend the content test with manifest integrity**

Append to `test/content.test.ts`:

```ts
import { images } from '../src/content/images.ts';

test('every imageKey referenced by content exists in the manifest', () => {
  const keys = new Set(Object.keys(images));
  const referenced = [
    ...programs.map((p) => p.imageKey),
    ...teachers.map((x) => x.imageKey),
    ...galleryItems.map((g) => g.imageKey),
    ...articles.map((a) => a.imageKey),
    'building-front',
    'hfos-hero',
  ];
  for (const key of referenced) {
    assert.ok(keys.has(key), `imageKey "${key}" is referenced but missing from images.ts`);
  }
});

test('every non-teacher image has a src and a ratio', () => {
  for (const [key, entry] of Object.entries(images)) {
    assert.match(entry.ratio, /^\d+\/\d+$/, `${key} has an invalid ratio "${entry.ratio}"`);
    if (!key.startsWith('teacher-')) {
      assert.ok(entry.src.length > 0, `${key} has no src`);
    }
  }
});
```

- [ ] **Step 7: Run the tests and build**

```bash
npm test && npm run build
```

Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add photo manifest, download script, PhotoSlot and Monogram"
```

---

## Task 9: Shared page furniture and the homepage

**Files:**
- Create: `src/components/sections/PageHero.tsx`, `Section.tsx`, `Marquee.tsx`, `StatsBar.tsx`, `LevelLadder.tsx`, `PathFinder.tsx`, `ProgramGrid.tsx`, `HfosTeaser.tsx`, `Testimonials.tsx`, `TrialCta.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Interfaces:**
- Consumes: everything from Tasks 2, 5, 7, 8.
- Produces:
  - `<Section className?={string} tone?={'surface'|'primary'|'sand'} bordered?={boolean}>` — the standard 1140px-wide, 24px-gutter container used by every page.
  - `<PageHero eyebrow?={string} title={string} lead?={string} />` — the crimson header block used by every page except the homepage.
  - `<Marquee text={string} />`, `<StatsBar />`, `<LevelLadder />`, `<PathFinder />`, `<ProgramGrid />`, `<HfosTeaser />`, `<Testimonials />`, `<TrialCta />`

- [ ] **Step 1: Write Section and PageHero**

Create `src/components/sections/Section.tsx`:

```tsx
import type { ReactNode } from 'react';

const TONES = {
  surface: 'bg-surface text-on-surface',
  primary: 'bg-primary text-on-primary',
  sand: 'bg-secondary-container text-on-secondary-container',
} as const;

export function Section({
  children,
  tone = 'surface',
  bordered = true,
  className = '',
  innerClassName = '',
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  bordered?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section className={`${TONES[tone]} ${bordered ? 'border-b-[1.5px] border-on-surface' : ''} ${className}`}>
      <div className={`mx-auto max-w-[1140px] px-6 py-14 md:py-18 ${innerClassName}`}>{children}</div>
    </section>
  );
}
```

Create `src/components/sections/PageHero.tsx`:

```tsx
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b-[1.5px] border-on-surface bg-primary text-on-primary">
      <div className="mx-auto max-w-[1140px] px-6 py-14 md:py-16">
        {eyebrow ? (
          <p className="mb-3.5 font-heading text-label-medium text-secondary-container">{eyebrow}</p>
        ) : null}
        <h1 className="max-w-[24ch] text-display-medium text-balance">{title}</h1>
        {lead ? (
          <p className="mt-4 max-w-[56ch] text-body-large text-secondary-container">{lead}</p>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Write Marquee and StatsBar**

`src/components/sections/Marquee.tsx`:

```tsx
export function Marquee({ text }: { text: string }) {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-[1.5px] border-on-surface bg-primary py-3.5"
    >
      <div className="flex w-max animate-[hf-marquee_38s_linear_infinite]">
        {[0, 1].map((i) => (
          <span
            key={i}
            className="whitespace-nowrap font-heading text-title-large text-secondary-container"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
```

`src/components/sections/StatsBar.tsx`:

```tsx
'use client';

import { useLocale } from 'next-intl';
import { stats } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { CountUp, Reveal } from '@/components/Reveal';

/** 4.200+ style thousands separator, matching Indonesian convention. */
const idThousands = (n: number) => {
  const s = String(Math.round(n));
  return s.length > 3 ? `${s.slice(0, -3)}.${s.slice(-3)}` : s;
};

export function StatsBar() {
  const locale = useLocale() as Locale;

  return (
    <section className="border-b-[1.5px] border-on-surface bg-surface">
      <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-y-8 px-6 py-11 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal
            key={s.label.en}
            delay={i * 90}
            className={
              'px-4 md:px-7 ' +
              (i % 2 === 1 ? 'border-l border-outline-variant ' : '') +
              (i >= 2 ? 'md:border-l ' : '') +
              (i === 0 ? 'md:pl-0' : '')
            }
          >
            <div className="font-heading text-headline-large leading-none text-primary">
              {s.countTo === null ? (
                s.value
              ) : (
                <CountUp
                  to={s.countTo}
                  format={(n) => (s.countTo === 4200 ? `${idThousands(n)}+` : idThousands(n))}
                />
              )}
            </div>
            <div className="mt-2 text-body-small text-on-surface-variant">{t(s.label, locale)}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

The `border-l` logic reproduces the original vertical dividers, but only where a divider makes sense: at two columns it separates the pairs, at four columns it separates every cell after the first.

- [ ] **Step 3: Write LevelLadder**

`src/components/sections/LevelLadder.tsx` — the interactive level list in the homepage hero:

```tsx
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { programs } from '@/content/programs';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';

export function LevelLadder() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');
  const [active, setActive] = useState(2);

  return (
    <div className="border-[1.5px] border-secondary-container/55">
      <p className="mx-5 mb-3.5 mt-4 font-heading text-label-medium text-secondary-container">
        {th('levelLadder')}
      </p>

      {programs.map((p, i) => {
        const on = i === active;
        return (
          <Link
            key={p.slug}
            href={`${ROUTES.programs}/${p.slug}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            className={
              'state-layer relative flex items-center gap-3 px-5 py-4 text-on-primary no-underline ' +
              (i > 0 ? 'border-t-[1.5px] border-secondary-container/55' : '')
            }
            style={{
              animation: `hf-rise var(--md-duration-long2) var(--ease-emphasized) ${120 + i * 80}ms both`,
            }}
          >
            <span className="flex w-12 flex-none items-center">
              <span
                className="block h-3 border-[1.5px] border-secondary-container origin-left"
                style={{
                  width: `${14 + i * 8}px`,
                  background: on ? 'var(--color-tertiary-container)' : 'rgb(245 214 174 / 0.22)',
                  animation: `hf-step var(--md-duration-medium4) var(--ease-emphasized) ${200 + i * 80}ms both`,
                }}
              />
            </span>
            <span className="w-4 flex-none font-heading text-title-small opacity-70">{p.n}</span>
            <span
              className={
                'whitespace-nowrap font-heading text-title-medium ' +
                (on ? 'text-tertiary-container' : 'text-on-primary')
              }
            >
              {t(p.shortName, locale)}
            </span>
            <span className="ml-auto flex-none whitespace-nowrap text-body-small text-secondary-container/85">
              {t(p.audienceShort, locale)}
            </span>
          </Link>
        );
      })}

      <Link
        href={ROUTES.studyAbroad}
        className="state-layer relative flex items-center gap-3 border-t-[1.5px]
                   border-secondary-container/55 px-5 py-4 font-heading text-title-medium
                   text-tertiary-container no-underline"
      >
        {th('studyAbroadRow')}
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Write PathFinder**

`src/components/sections/PathFinder.tsx` — the "which class fits?" chooser:

```tsx
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { programs } from '@/content/programs';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale, ProgramSlug } from '@/content/types';
import { Button } from '@/components/m3/Button';

const CHOICES: { key: string; target: ProgramSlug | 'hfos' }[] = [
  { key: 'kids', target: 'kids' },
  { key: 'teens', target: 'teens' },
  { key: 'conversation', target: 'conversation' },
  { key: 'toefl', target: 'toefl-ielts' },
  { key: 'business', target: 'business' },
  { key: 'hfos', target: 'hfos' },
];

export function PathFinder() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');
  const tp = useTranslations('pick');
  const tc = useTranslations('cta');
  const [picked, setPicked] = useState<number | null>(null);

  const choice = picked === null ? null : CHOICES[picked];
  const program = choice && choice.target !== 'hfos'
    ? programs.find((p) => p.slug === choice.target)
    : null;

  const result = choice
    ? choice.target === 'hfos'
      ? { name: tp('hfosName'), meta: tp('hfosMeta'), href: ROUTES.studyAbroad }
      : {
          name: t(program!.name, locale),
          meta: `${t(program!.audience, locale)} · ${t(program!.duration, locale)}, ${t(program!.schedule, locale)}, ${t(program!.minutes, locale)}`,
          href: `${ROUTES.programs}/${program!.slug}`,
        }
    : null;

  return (
    <section className="border-b-[1.5px] border-on-surface bg-secondary-container">
      <div className="mx-auto max-w-[1140px] px-6 py-16">
        <h2 className="text-headline-large text-on-secondary-container">{th('pickTitle')}</h2>
        <p className="mb-7 mt-2 max-w-[60ch] text-body-large text-on-surface-variant">
          {th('pickBody')}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CHOICES.map((c, i) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={picked === i}
              onClick={() => setPicked(i)}
              className={
                'state-layer relative rounded-sm border-[1.5px] px-4 py-4 text-left ' +
                'font-heading text-title-medium cursor-pointer ' +
                'transition-colors duration-200 ease-standard ' +
                (picked === i
                  ? 'border-primary bg-surface text-on-surface'
                  : 'border-on-surface bg-transparent text-on-secondary-container')
              }
            >
              {tp(c.key)}
            </button>
          ))}
        </div>

        {result ? (
          <div
            className="mt-5 flex flex-wrap items-center justify-between gap-6 border-[1.5px]
                       border-on-surface bg-surface p-6"
            style={{ animation: 'hf-rise var(--md-duration-medium2) var(--ease-emphasized) both' }}
          >
            <div>
              <p className="font-heading text-label-medium text-on-surface-variant">
                {th('pickRecommendation')}
              </p>
              <p className="mt-1.5 font-heading text-headline-small text-on-surface">{result.name}</p>
              <p className="mt-1.5 text-body-small text-on-surface-variant">{result.meta}</p>
            </div>
            <Button href={result.href} variant="outlined">
              {tc('openPage')}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write ProgramGrid, HfosTeaser, Testimonials, TrialCta**

`src/components/sections/ProgramGrid.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { programs } from '@/content/programs';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Card } from '@/components/m3/Card';
import { Reveal } from '@/components/Reveal';

export function ProgramGrid() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');
  const tc = useTranslations('cta');

  return (
    <section className="border-b-[1.5px] border-on-surface bg-surface">
      <div className="mx-auto max-w-[1140px] px-6 py-18">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-6">
          <h2 className="text-headline-large">{th('levelsTitle')}</h2>
          <Link href={ROUTES.programs} className="font-heading text-title-medium text-primary">
            {tc('allPrograms')}
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <Card href={`${ROUTES.programs}/${p.slug}`} className="h-full p-6">
                <span className="font-heading text-headline-large leading-none text-primary">
                  {p.n}
                </span>
                <p className="mt-4 font-heading text-title-large">{t(p.name, locale)}</p>
                <p className="mt-1.5 text-body-small text-on-surface-variant">
                  {t(p.audience, locale)} · {t(p.duration, locale)}, {t(p.schedule, locale)}
                </p>
                <p className="mt-3 text-body-medium">{t(p.summary, locale)}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

`src/components/sections/HfosTeaser.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';
import { PhotoSlot } from '@/components/media/PhotoSlot';

export function HfosTeaser() {
  const th = useTranslations('home');
  const tc = useTranslations('cta');

  return (
    <section className="border-b-[1.5px] border-on-surface bg-primary text-on-primary">
      <div className="mx-auto grid max-w-[1140px] items-start gap-10 px-6 py-18 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="mb-8 text-display-small">{th('hfosTitle')}</h2>
          <PhotoSlot
            imageKey="hfos-hero"
            className="border-[1.5px] border-secondary-container/55"
            sizes="(max-width: 768px) 100vw, 520px"
          />
        </div>
        <div>
          <p className="mb-5 text-body-large text-secondary-container">{th('hfosBody')}</p>
          <Button
            href={ROUTES.studyAbroad}
            variant="outlined"
            className="border-on-primary text-on-primary"
          >
            {tc('learnHfos')}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

`src/components/sections/Testimonials.tsx`:

```tsx
import { useLocale, useTranslations } from 'next-intl';
import { testimonials } from '@/content/testimonials';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Reveal } from '@/components/Reveal';

export function Testimonials() {
  const locale = useLocale() as Locale;
  const th = useTranslations('home');

  return (
    <section className="border-b-[1.5px] border-on-surface bg-surface">
      <div className="mx-auto max-w-[1140px] px-6 py-18">
        <h2 className="mb-8 text-headline-large">{th('testimonialsTitle')}</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delay={i * 80}>
              <blockquote className="h-full bg-secondary-container p-7">
                <p className="font-quote text-title-large italic leading-[1.5] text-on-secondary-container">
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
```

`src/components/sections/TrialCta.tsx`:

```tsx
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/m3/Badge';
import { EnrolmentForm } from '@/components/sections/EnrolmentForm';

export function TrialCta() {
  const th = useTranslations('home');

  return (
    <section className="bg-surface">
      <div className="mx-auto grid max-w-[1140px] items-start gap-10 px-6 py-18 md:grid-cols-2 md:gap-16">
        <div>
          <Badge>{th('trialBadge')}</Badge>
          <h2 className="mb-4 mt-4 text-display-small">{th('trialTitle')}</h2>
          <p className="max-w-[52ch] text-body-large">{th('trialBody')}</p>
        </div>
        <div className="border-[1.5px] border-on-surface p-7">
          <EnrolmentForm compact />
        </div>
      </div>
    </section>
  );
}
```

`EnrolmentForm` is built in Task 15. Until then, `TrialCta` will not compile — that is expected and is why the homepage build is verified only after Task 15. To keep the tree compiling now, create a stub at `src/components/sections/EnrolmentForm.tsx`:

```tsx
export function EnrolmentForm({ compact = false }: { compact?: boolean }) {
  return <div data-compact={compact} />;
}
```

- [ ] **Step 6: Assemble the homepage**

Replace `src/app/[locale]/page.tsx`:

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import type { Locale } from '@/content/types';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';
import { LevelLadder } from '@/components/sections/LevelLadder';
import { Marquee } from '@/components/sections/Marquee';
import { StatsBar } from '@/components/sections/StatsBar';
import { PathFinder } from '@/components/sections/PathFinder';
import { ProgramGrid } from '@/components/sections/ProgramGrid';
import { HfosTeaser } from '@/components/sections/HfosTeaser';
import { Testimonials } from '@/components/sections/Testimonials';
import { TrialCta } from '@/components/sections/TrialCta';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });
  return { title: t('heroTitle'), description: t('heroBody') };
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tc = await getTranslations('cta');

  return (
    <main>
      <section className="bg-primary text-on-primary">
        <div className="mx-auto grid max-w-[1140px] items-start gap-12 px-6 pb-18 pt-20
                        md:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] md:gap-16">
          <div>
            <h1 className="mb-6 text-display-large text-balance">{t('heroTitle')}</h1>
            <p className="mb-9 max-w-[46ch] text-body-large text-secondary-container">
              {t('heroBody')}
            </p>
            <div className="flex flex-wrap items-center gap-3.5">
              <Button href={ROUTES.contact} variant="tonal">{tc('trial')}</Button>
              <Button href={ROUTES.programs} variant="outlined" className="border-on-primary text-on-primary">
                {tc('seePrograms')}
              </Button>
            </div>
          </div>
          <LevelLadder />
        </div>
      </section>

      <Marquee text={t('marquee')} />
      <StatsBar />
      <PathFinder />
      <ProgramGrid />
      <HfosTeaser />
      <Testimonials />
      <TrialCta />
    </main>
  );
}
```

- [ ] **Step 7: Verify**

```bash
npm run typecheck && npm run build && npm run dev
```

Check at 375px and at 1280px: the hero stacks on mobile, the ladder rows animate in with a stagger, the stats count up once scrolled into view, choosing a PathFinder option reveals the recommendation card, and no horizontal scrollbar appears at 320px.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: build the homepage with hero, stats, path finder, and program grid"
```

---

## Task 10: Programs list and programme detail pages

**Files:**
- Create: `src/app/[locale]/programs/page.tsx`, `src/app/[locale]/programs/[slug]/page.tsx`

**Interfaces:**
- Consumes: `programs`, `programBySlug`, `SHOW_PRICES`, `crossProgramBenefits`, `PhotoSlot`, `Badge`, `Button`, `PageHero`, `Section`.
- Produces: the route `/[locale]/programs/[slug]` for all five slugs, statically generated.

- [ ] **Step 1: Write the programs list page**

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { Link } from '@/i18n/navigation';
import { programs } from '@/content/programs';
import { crossProgramBenefits } from '@/content/about';
import { ROUTES, SHOW_PRICES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tp = await getTranslations({ locale, namespace: 'programs' });
  return { title: tp('title'), description: tp('body') };
}

export default async function ProgramsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tp = await getTranslations('programs');

  return (
    <main>
      <PageHero eyebrow={tp('eyebrow')} title={tp('title')} lead={tp('body')} />

      <section className="border-b-[1.5px] border-on-surface bg-surface">
        <div className="mx-auto max-w-[1140px] px-6">
          {programs.map((p) => (
            <Link
              key={p.slug}
              href={`${ROUTES.programs}/${p.slug}`}
              className="state-layer relative grid items-center gap-4 border-b-[1.5px]
                         border-outline-variant py-8 text-on-surface no-underline
                         md:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-7"
            >
              <span className="font-heading text-headline-large leading-none text-primary">{p.n}</span>
              <span>
                <span className="block font-heading text-headline-small">{t(p.name, locale)}</span>
                <span className="text-body-small text-on-surface-variant">{t(p.audience, locale)}</span>
              </span>
              <span className="text-body-medium">{t(p.summary, locale)}</span>
              <span className="font-heading text-title-small text-primary md:text-right">
                {SHOW_PRICES ? t(p.price, locale).split(' · ')[0] : tp('fee')}
              </span>
            </Link>
          ))}

          <Link
            href={ROUTES.studyAbroad}
            className="state-layer relative grid items-center gap-4 py-8 text-on-surface no-underline
                       md:grid-cols-[72px_minmax(0,1.1fr)_minmax(0,1fr)_auto] md:gap-7"
          >
            <span className="font-heading text-headline-large leading-none text-tertiary">6</span>
            <span>
              <span className="block font-heading text-headline-small">{tp('studyAbroadName')}</span>
              <span className="text-body-small text-on-surface-variant">{tp('studyAbroadMeta')}</span>
            </span>
            <span className="text-body-medium">{tp('studyAbroadBody')}</span>
            <span className="font-heading text-title-small text-primary md:text-right">
              {tp('consultation')}
            </span>
          </Link>
        </div>
      </section>

      <Section bordered={false}>
        <h2 className="mb-5 text-headline-small">{tp('crossProgram')}</h2>
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {crossProgramBenefits.map((c) => (
            <p key={c.en} className="border-t-[1.5px] border-outline-variant py-3.5 text-body-medium">
              {t(c, locale)}
            </p>
          ))}
        </div>
      </Section>
    </main>
  );
}
```

Note the mobile behaviour: without `md:grid-cols-*` the grid falls back to one column, so each programme row stacks into a readable card. This is the fix for original problem #1 on this page.

- [ ] **Step 2: Write the programme detail page**

`src/app/[locale]/programs/[slug]/page.tsx`:

```tsx
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { programs, programBySlug } from '@/content/programs';
import { routing } from '@/i18n/routing';
import { ROUTES, SHOW_PRICES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Badge } from '@/components/m3/Badge';
import { Button } from '@/components/m3/Button';
import { Link } from '@/i18n/navigation';
import { PhotoSlot } from '@/components/media/PhotoSlot';
import { Section } from '@/components/sections/Section';

type Params = { locale: Locale; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    programs.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const program = programBySlug(slug);
  if (!program) return {};
  return {
    title: t(program.name, locale),
    description: t(program.summary, locale),
    alternates: {
      canonical: `/${locale}/programs/${slug}`,
      languages: { id: `/id/programs/${slug}`, en: `/en/programs/${slug}` },
    },
  };
}

export default async function ProgramDetailPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const program = programBySlug(slug);
  if (!program) notFound();

  const tp = await getTranslations('programs');
  const tc = await getTranslations('cta');

  const summaryRows: [string, string][] = [
    [tp('forWhom'), t(program.audience, locale)],
    [tp('duration'), t(program.duration, locale)],
    [tp('meetings'), `${t(program.schedule, locale)} · ${t(program.minutes, locale)}`],
    [tp('fee'), SHOW_PRICES ? t(program.price, locale) : tc('askPrice')],
  ];

  return (
    <main>
      <section className="border-b-[1.5px] border-on-surface bg-primary text-on-primary">
        <div className="mx-auto max-w-[1140px] px-6 pb-16 pt-14">
          <Link
            href={ROUTES.programs}
            className="mb-6 block w-fit font-heading text-body-small text-secondary-container"
          >
            {tc('allPrograms')}
          </Link>
          <Badge>{`${tp('level')} ${program.n}`}</Badge>
          <h1 className="mb-4 mt-4 text-display-medium">{t(program.name, locale)}</h1>
          <p className="max-w-[52ch] text-body-large text-secondary-container">
            {t(program.summary, locale)}
          </p>
        </div>
      </section>

      <section className="border-b-[1.5px] border-on-surface bg-surface">
        <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-y-6 px-6 py-10 md:grid-cols-4">
          {summaryRows.map(([label, value], i) => (
            <div
              key={label}
              className={
                'px-4 md:px-6 ' +
                (i % 2 === 1 ? 'border-l border-outline-variant ' : '') +
                (i >= 2 ? 'md:border-l ' : '') +
                (i === 0 ? 'md:pl-0' : '')
              }
            >
              <p className="mb-2 font-heading text-label-medium text-on-surface-variant">{label}</p>
              <p className="font-heading text-title-large">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{tp('syllabus')}</h2>
            {program.syllabus.map((item) => (
              <p key={item.en} className="border-t-[1.5px] border-outline-variant py-3.5 text-body-medium">
                {t(item, locale)}
              </p>
            ))}
          </div>
          <div>
            <h2 className="mb-5 text-headline-small">{tp('afterwards')}</h2>
            <p className="mb-7 bg-secondary-container p-6 text-body-large text-on-secondary-container">
              {t(program.outcome, locale)}
            </p>
            <PhotoSlot
              imageKey={program.imageKey as never}
              className="border-[1.5px] border-on-surface"
              sizes="(max-width: 768px) 100vw, 540px"
            />
          </div>
        </div>
      </Section>

      <Section bordered={false} innerClassName="flex flex-wrap items-center justify-between gap-8">
        <div>
          <p className="font-heading text-headline-medium">{tp('trySessionTitle')}</p>
          <p className="mt-1.5 text-body-medium text-on-surface-variant">{tp('trySessionBody')}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={ROUTES.contact} variant="tonal">{tc('trial')}</Button>
          <Button href={ROUTES.contact} variant="outlined">{tc('askPrice')}</Button>
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 3: Verify all ten detail routes prerender**

```bash
npm run build
```

Expected: the build output lists `/id/programs/kids`, `/en/programs/kids`, and the other eight as static (`●` or `○`, not `ƒ`). Then check `/id/programs/nonsense` returns 404.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add programs list and programme detail pages"
```

---

## Task 11: About and Teachers pages

**Files:**
- Create: `src/app/[locale]/about/page.tsx`, `src/app/[locale]/teachers/page.tsx`

**Interfaces:**
- Consumes: `about`, `teachers`, `PhotoSlot`, `hasPhoto`, `Monogram`, `PageHero`, `Section`, `Reveal`.

- [ ] **Step 1: Write the About page**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { about } from '@/content/about';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { PhotoSlot } from '@/components/media/PhotoSlot';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const ta = await getTranslations({ locale, namespace: 'about' });
  return {
    title: ta('title'),
    description: t(about.vision, locale),
    alternates: { canonical: `/${locale}/about`, languages: { id: '/id/about', en: '/en/about' } },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ta = await getTranslations('about');

  return (
    <main>
      <PageHero eyebrow={ta('eyebrow')} title={ta('title')} />

      <Section>
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14">
          <div className="max-w-[68ch]">
            {about.history.map((para) => (
              <p key={para.en} className="mb-5 text-body-large last:mb-0">
                {t(para, locale)}
              </p>
            ))}
          </div>
          <PhotoSlot
            imageKey="building-front"
            className="border-[1.5px] border-on-surface"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        </div>
      </Section>

      <Section tone="sand">
        <p className="mb-4 font-heading text-label-medium text-on-surface-variant">{ta('vision')}</p>
        <p className="max-w-[40ch] font-quote text-quote italic">{t(about.vision, locale)}</p>
      </Section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{ta('mission')}</h2>
            {about.mission.map((m) => (
              <p key={m.en} className="border-t-[1.5px] border-outline-variant py-4 text-body-medium">
                {t(m, locale)}
              </p>
            ))}
          </div>
          <div>
            <h2 className="mb-5 text-headline-small">{ta('values')}</h2>
            {about.values.map((v) => (
              <div key={v.title.en} className="border-t-[1.5px] border-outline-variant py-4">
                <p className="font-heading text-title-large text-primary">{t(v.title, locale)}</p>
                <p className="mt-1 text-body-medium">{t(v.body, locale)}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section bordered={false}>
        <h2 className="mb-6 text-headline-small">{ta('facilities')}</h2>
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {about.facilities.map((f) => (
            <p key={f.en} className="border-t-[1.5px] border-outline-variant py-3.5 text-body-medium">
              {t(f, locale)}
            </p>
          ))}
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 2: Write the Teachers page**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { teachers } from '@/content/teachers';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Card } from '@/components/m3/Card';
import { Reveal } from '@/components/Reveal';
import { PhotoSlot, hasPhoto } from '@/components/media/PhotoSlot';
import { Monogram } from '@/components/media/Monogram';
import type { ImageKey } from '@/content/images';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tt = await getTranslations({ locale, namespace: 'teachers' });
  return {
    title: tt('title'),
    alternates: { canonical: `/${locale}/teachers`, languages: { id: '/id/teachers', en: '/en/teachers' } },
  };
}

export default async function TeachersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tt = await getTranslations('teachers');

  return (
    <main>
      <PageHero eyebrow={tt('eyebrow')} title={tt('title')} />

      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1140px] gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((person, i) => (
            <Reveal key={person.name} delay={i * 70}>
              <Card className="h-full overflow-hidden">
                <div className="border-b-[1.5px] border-on-surface">
                  {hasPhoto(person.imageKey as ImageKey) ? (
                    <PhotoSlot imageKey={person.imageKey as ImageKey} sizes="(max-width: 640px) 100vw, 360px" />
                  ) : (
                    <div className="relative">
                      <Monogram initials={person.initials} className="aspect-square w-full" />
                      <span className="absolute bottom-3 left-3 text-label-small font-heading
                                       text-on-primary-container/70">
                        {tt('portraitPending')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="font-heading text-title-large">{person.name}</p>
                  <p className="mt-1 text-body-small font-semibold text-primary">
                    {t(person.role, locale)}
                  </p>
                  <p className="mt-3 text-body-small text-on-surface-variant">
                    {t(person.credential, locale)}
                  </p>
                  <p className="mt-3.5 font-quote text-title-large italic">
                    {t(person.quote, locale)}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run build && npm run dev
```

Check `/id/about`, `/en/about`, `/id/teachers`, `/en/teachers`. On the teachers page confirm six monogram cards render with initials AN, RS, DW, FN, MT, SW and the "Foto asli menyusul" note. Then drop any JPEG into `public/images/teacher-1.jpg`, set that entry's `src` to `/images/teacher-1.jpg` in `images.ts`, reload, and confirm that card switches to the photograph while the other five stay as monograms. Revert the change afterwards.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add about and teachers pages with monogram portraits"
```

---

## Task 12: Study Abroad (HFOS) page

**Files:**
- Create: `src/app/[locale]/study-abroad/page.tsx`, `src/components/sections/RouteMap.tsx`

**Interfaces:**
- Consumes: `hfosServices`, `hfosCountries`, `hfosSteps`, `hfosTestimonial`.
- Produces: `<RouteMap />` — the animated SVG showing routes out of Batam.

- [ ] **Step 1: Write the animated route map**

Create `src/components/sections/RouteMap.tsx`. It draws only once it scrolls into view, so the animation is not wasted above the fold.

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { useInView } from '@/components/Reveal';

const CITIES: { x: number; y: number; label: string; path: string }[] = [
  { x: 170, y: 152, label: 'Singapore', path: 'M 60 240 Q 100 180 170 152' },
  { x: 260, y: 84, label: 'Malaysia', path: 'M 60 240 Q 130 140 260 84' },
  { x: 400, y: 58, label: 'Canada', path: 'M 60 240 Q 200 100 400 58' },
  { x: 320, y: 210, label: 'Australia', path: 'M 60 240 Q 180 246 320 210' },
  { x: 470, y: 244, label: 'New Zealand', path: 'M 60 240 Q 280 310 470 244' },
];

const LABELS: Record<string, { id: string; en: string }> = {
  Singapore: { id: 'Singapura', en: 'Singapore' },
  Malaysia: { id: 'Malaysia', en: 'Malaysia' },
  Canada: { id: 'Kanada', en: 'Canada' },
  Australia: { id: 'Australia', en: 'Australia' },
  'New Zealand': { id: 'Selandia Baru', en: 'New Zealand' },
};

export function RouteMap({ locale }: { locale: 'id' | 'en' }) {
  const th = useTranslations('home');
  const [ref, inView] = useInView<SVGSVGElement>();

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 290"
      width="100%"
      role="img"
      aria-label={th('hfosMapAlt')}
      className="block max-w-[520px]"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className="text-secondary-container">
        {CITIES.map((c, i) => (
          <path
            key={c.label}
            d={c.path}
            strokeDasharray="700"
            style={{
              strokeDashoffset: inView ? 0 : 700,
              transition: `stroke-dashoffset 1600ms var(--ease-standard-decelerate) ${i * 90}ms`,
            }}
          />
        ))}
      </g>

      <g className="fill-secondary-container">
        {CITIES.map((c) => (
          <circle key={c.label} cx={c.x} cy={c.y} r="5" />
        ))}
      </g>

      <circle cx="60" cy="240" r="9" className="fill-tertiary-container stroke-on-primary" strokeWidth="1.5" />

      <g fontFamily="var(--font-heading)" fontSize="15" fontWeight="600" className="fill-on-primary">
        {CITIES.map((c) => (
          <text key={c.label} x={c.x + 12} y={c.y + 5}>
            {LABELS[c.label][locale]}
          </text>
        ))}
        <text x="60" y="272" className="fill-tertiary-container">Batam</text>
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Write the page**

`src/app/[locale]/study-abroad/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { hfosServices, hfosCountries, hfosSteps } from '@/content/hfos';
import { hfosTestimonial } from '@/content/testimonials';
import { ROUTES } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { Section } from '@/components/sections/Section';
import { RouteMap } from '@/components/sections/RouteMap';
import { Button } from '@/components/m3/Button';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const th = await getTranslations({ locale, namespace: 'hfos' });
  return {
    title: th('title'),
    description: th('lead'),
    alternates: {
      canonical: `/${locale}/study-abroad`,
      languages: { id: '/id/study-abroad', en: '/en/study-abroad' },
    },
  };
}

export default async function StudyAbroadPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const th = await getTranslations('hfos');
  const tc = await getTranslations('cta');

  return (
    <main>
      <section className="border-b-[1.5px] border-on-surface bg-primary text-on-primary">
        <div className="mx-auto grid max-w-[1140px] items-center gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="mb-3.5 font-heading text-label-medium text-secondary-container">
              {th('eyebrow')}
            </p>
            <h1 className="mb-6 text-display-medium">{th('title')}</h1>
            <p className="max-w-[44ch] font-quote text-quote italic text-secondary-container">
              {th('lead')}
            </p>
          </div>
          <RouteMap locale={locale} />
        </div>
      </section>

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{th('services')}</h2>
            {hfosServices.map((s) => (
              <p key={s.en} className="border-t-[1.5px] border-outline-variant py-4 text-body-large">
                {t(s, locale)}
              </p>
            ))}
          </div>
          <div>
            <h2 className="mb-5 text-headline-small">{th('countries')}</h2>
            <div className="flex flex-wrap gap-2.5">
              {hfosCountries.map((c) => (
                <span
                  key={c.en}
                  className="border-[1.5px] border-on-surface px-3.5 py-2 font-heading text-title-medium"
                >
                  {t(c, locale)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="mb-10 text-headline-large">{th('process')}</h2>
        <ol className="ml-2 border-l-2 border-primary">
          {hfosSteps.map((step, i) => (
            <Reveal key={step.n} as="li" delay={i * 70} className="relative list-none pb-9 pl-9">
              <span
                aria-hidden="true"
                className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full bg-primary"
              />
              <p className="mb-1.5 font-heading text-label-medium text-on-surface-variant">
                {th('step')} {step.n}
              </p>
              <p className="mb-1.5 font-heading text-title-large">{t(step.title, locale)}</p>
              <p className="max-w-[60ch] text-body-medium">{t(step.body, locale)}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section bordered={false} innerClassName="flex flex-wrap items-center justify-between gap-8">
        <blockquote className="max-w-[52ch] bg-secondary-container p-6">
          <p className="font-quote text-title-large italic leading-[1.5] text-on-secondary-container">
            {t(hfosTestimonial.quote, locale)}
          </p>
          <footer className="mt-3.5 text-body-small text-on-surface-variant">
            <strong className="font-heading">{hfosTestimonial.name}</strong> ·{' '}
            {t(hfosTestimonial.role, locale)}
          </footer>
        </blockquote>
        <Button href={ROUTES.contact} variant="tonal">{tc('scheduleConsult')}</Button>
      </Section>
    </main>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run build && npm run dev
```

Check `/id/study-abroad` and `/en/study-abroad`. Scroll to the map and confirm the five routes draw themselves once, staggered. Confirm the country labels change language. With reduced motion emulated, the routes must appear already drawn, not invisible.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add study abroad page with animated route map"
```

---

## Task 13: Gallery page with category filter

**Files:**
- Create: `src/app/[locale]/gallery/page.tsx`, `src/components/sections/GalleryGrid.tsx`

**Interfaces:**
- Consumes: `galleryItems`, `galleryCategories`, `activities`, `Chip`, `PhotoSlot`.
- Produces: `<GalleryGrid />` — a client component holding the filter state.

- [ ] **Step 1: Write the filterable grid**

Create `src/components/sections/GalleryGrid.tsx`. The filter is a proper tablist with arrow-key navigation, which is what makes it usable by keyboard.

```tsx
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
                'px-4 py-2 min-h-10 font-heading text-title-small cursor-pointer ' +
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
```

- [ ] **Step 2: Write the page**

`src/app/[locale]/gallery/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { activities } from '@/content/gallery';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { GalleryGrid } from '@/components/sections/GalleryGrid';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tg = await getTranslations({ locale, namespace: 'gallery' });
  return {
    title: tg('title'),
    alternates: { canonical: `/${locale}/gallery`, languages: { id: '/id/gallery', en: '/en/gallery' } },
  };
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tg = await getTranslations('gallery');

  return (
    <main>
      <PageHero eyebrow={tg('eyebrow')} title={tg('title')} />

      <Section>
        <GalleryGrid />
      </Section>

      <Section bordered={false}>
        <h2 className="mb-7 text-headline-large">{tg('activities')}</h2>
        <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a) => (
            <div key={a.title.en} className="border-t-[1.5px] border-outline-variant py-4.5">
              <p className="font-heading text-title-large text-primary">{t(a.title, locale)}</p>
              <p className="mt-1 text-body-medium">{t(a.body, locale)}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 3: Verify keyboard access**

```bash
npm run build && npm run dev
```

Tab to the filter row: exactly one chip should be in the tab order. Press Left/Right — the selection moves and the grid updates. At 375px the chip row scrolls horizontally rather than wrapping into three lines.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add gallery page with accessible category filter"
```

---

## Task 14: Articles page

**Files:**
- Create: `src/app/[locale]/articles/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { articles } from '@/content/articles';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import type { ImageKey } from '@/content/images';
import { PageHero } from '@/components/sections/PageHero';
import { Card } from '@/components/m3/Card';
import { Reveal } from '@/components/Reveal';
import { PhotoSlot } from '@/components/media/PhotoSlot';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const ta = await getTranslations({ locale, namespace: 'articles' });
  return {
    title: ta('title'),
    description: ta('body'),
    alternates: { canonical: `/${locale}/articles`, languages: { id: '/id/articles', en: '/en/articles' } },
  };
}

export default async function ArticlesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ta = await getTranslations('articles');

  return (
    <main>
      <PageHero eyebrow={ta('eyebrow')} title={ta('title')} lead={ta('body')} />

      <section className="bg-surface">
        <div className="mx-auto grid max-w-[1140px] gap-6 px-6 py-16 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a, i) => (
            <Reveal key={a.imageKey} delay={i * 70}>
              <Card className="h-full overflow-hidden">
                <div className="border-b-[1.5px] border-on-surface">
                  <PhotoSlot
                    imageKey={a.imageKey as ImageKey}
                    sizes="(max-width: 640px) 100vw, 360px"
                  />
                </div>
                <div className="p-6">
                  <p className="mb-2.5 font-heading text-label-medium text-on-surface-variant">
                    {t(a.category, locale)}
                  </p>
                  <p className="font-heading text-title-large leading-[1.25]">{t(a.title, locale)}</p>
                  <p className="mt-2 text-body-small text-on-surface-variant">{t(a.date, locale)}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}
```

Cards are deliberately not links: there is nothing to link to yet. Wrapping them in an anchor to nowhere is exactly the `href="#"` defect being removed from the original site.

- [ ] **Step 2: Verify and commit**

```bash
npm run build
git add -A
git commit -m "feat: add articles placeholder page"
```

---

## Task 15: Contact page, enrolment form, and FAQ

**Files:**
- Modify: `src/components/sections/EnrolmentForm.tsx` (replace the Task 9 stub)
- Create: `src/app/[locale]/contact/page.tsx`

**Interfaces:**
- Consumes: `normalizeWhatsApp`, `buildWhatsAppUrl` from `@/lib/whatsapp`; `TextField`, `SelectField`, `Button`, `Accordion`; `programs`, `faq`, `site`.
- Produces: `<EnrolmentForm compact?={boolean} />` — `compact` omits the age and message fields, for the homepage.

- [ ] **Step 1: Write the enrolment form**

Replace `src/components/sections/EnrolmentForm.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { programs } from '@/content/programs';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { buildWhatsAppUrl, normalizeWhatsApp } from '@/lib/whatsapp';
import { Button } from '@/components/m3/Button';
import { SelectField, TextField } from '@/components/m3/TextField';

type Errors = Partial<Record<'name' | 'whatsapp' | 'program', string>>;

export function EnrolmentForm({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const tf = useTranslations('form');
  const tc = useTranslations('cta');

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [age, setAge] = useState('');
  const [program, setProgram] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const options = [
    ...programs.map((p) => ({ value: t(p.name, locale), label: t(p.name, locale) })),
    { value: 'HFOS', label: locale === 'id' ? 'Studi ke Luar Negeri (HFOS)' : 'Study Abroad (HFOS)' },
  ];

  function validate(): Errors {
    const next: Errors = {};
    if (!name.trim()) next.name = tf('errorNameRequired');
    if (!whatsapp.trim()) next.whatsapp = tf('errorWhatsappRequired');
    else if (normalizeWhatsApp(whatsapp) === null) next.whatsapp = tf('errorWhatsappInvalid');
    if (!program) next.program = tf('errorProgramRequired');
    return next;
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    const firstInvalid = (['name', 'whatsapp', 'program'] as const).find((k) => found[k]);
    if (firstInvalid) {
      const el = event.currentTarget.querySelector<HTMLElement>(`[name="${firstInvalid}"]`);
      el?.focus();
      return;
    }

    const url = buildWhatsAppUrl(
      { name, whatsapp, age: compact ? undefined : age, program, message: compact ? undefined : message },
      tf('opening'),
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <TextField
        label={tf('name')} name="name" value={name} onChange={setName}
        error={errors.name} placeholder={tf('namePlaceholder')} required
      />
      <TextField
        label={tf('whatsapp')} name="whatsapp" value={whatsapp} onChange={setWhatsapp}
        error={errors.whatsapp} placeholder={tf('whatsappPlaceholder')} type="tel" required
      />
      {compact ? null : (
        <TextField label={tf('age')} name="age" value={age} onChange={setAge} />
      )}
      <SelectField
        label={tf('program')} name="program" value={program} onChange={setProgram}
        error={errors.program} placeholder={tf('programPlaceholder')} options={options} required
      />
      {compact ? null : (
        <TextField
          label={tf('message')} name="message" value={message} onChange={setMessage} multiline
        />
      )}

      <Button type="submit" variant="tonal" className="justify-start">
        {tc('sendViaWhatsapp')}
      </Button>
      <p className="text-body-small text-on-surface-variant">{tf('hint')}</p>
    </form>
  );
}
```

- [ ] **Step 2: Write the contact page**

`src/app/[locale]/contact/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { faq } from '@/content/faq';
import { site } from '@/content/site';
import { t } from '@/content/types';
import type { Locale } from '@/content/types';
import { PageHero } from '@/components/sections/PageHero';
import { Section } from '@/components/sections/Section';
import { Accordion } from '@/components/m3/Accordion';
import { EnrolmentForm } from '@/components/sections/EnrolmentForm';

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const tk = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: tk('title'),
    alternates: { canonical: `/${locale}/contact`, languages: { id: '/id/contact', en: '/en/contact' } },
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tk = await getTranslations('contact');

  const rows: [string, string, string | null][] = [
    [tk('phone'), site.phone, `tel:${site.phone.replace(/\D/g, '')}`],
    [tk('whatsapp'), site.whatsapp, `https://wa.me/${site.whatsappE164}`],
    [tk('email'), site.email, `mailto:${site.email}`],
    [tk('instagram'), site.instagram, `https://instagram.com/${site.instagram.replace('@', '')}`],
  ];

  const mapQuery = encodeURIComponent('Komplek Nagoya Newton Blok C, Lubuk Baja, Batam');

  return (
    <main>
      <PageHero eyebrow={tk('eyebrow')} title={tk('title')} />

      <Section>
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div>
            <h2 className="mb-5 text-headline-small">{tk('address')}</h2>
            <address className="mb-7 not-italic text-body-large">
              {site.addressLines.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </address>

            {rows.map(([label, value, href]) => (
              <div key={label} className="flex gap-4 border-t-[1.5px] border-outline-variant py-3.5">
                <span className="w-28 flex-none text-body-small text-on-surface-variant">{label}</span>
                {href ? (
                  <a href={href} className="font-semibold text-primary">{value}</a>
                ) : (
                  <span className="font-semibold">{value}</span>
                )}
              </div>
            ))}

            <h2 className="mb-5 mt-9 text-headline-small">{tk('hours')}</h2>
            {site.hours.map((h) => (
              <div key={h.day.en} className="flex gap-4 border-t-[1.5px] border-outline-variant py-3.5">
                <span className="w-28 flex-none text-body-small text-on-surface-variant">
                  {t(h.day, locale)}
                </span>
                <span className="font-semibold">{t(h.open, locale)}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="mb-6 border-[1.5px] border-on-surface p-7">
              <h2 className="mb-5 text-headline-small">{tk('formTitle')}</h2>
              <EnrolmentForm />
            </div>

            <iframe
              title={tk('mapLabel')}
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-video w-full border-[1.5px] border-on-surface"
            />
          </div>
        </div>
      </Section>

      <Section bordered={false}>
        <h2 className="mb-7 text-headline-large">{tk('faqTitle')}</h2>
        <div className="max-w-[800px]">
          <Accordion
            items={faq.map((item, i) => ({
              id: String(i),
              question: t(item.q, locale),
              answer: t(item.a, locale),
            }))}
          />
        </div>
      </Section>
    </main>
  );
}
```

The map is a plain `<iframe>` embed with `loading="lazy"` — no API key, no script, and it costs nothing until scrolled into view.

- [ ] **Step 3: Verify the form end to end**

```bash
npm run build && npm run dev
```

1. Submit with everything empty → three error messages appear, focus lands on the name field, WhatsApp does not open.
2. Enter a name, type `0812` in the WhatsApp field, submit → the "not valid" error appears.
3. Enter `0812-7000-1234`, pick a program, submit → a new tab opens at `wa.me/6281270001234` with the message pre-filled and correctly line-broken.
4. Switch to `/en/contact` and repeat — the opening line must be in English.
5. Open the FAQ with the keyboard: Tab to a question, press Enter, confirm `aria-expanded` flips and the answer becomes reachable by Tab.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact page, WhatsApp enrolment form, and FAQ accordion"
```

---

## Task 16: SEO, documentation, and final verification

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/[locale]/not-found.tsx`, `README.md`

- [ ] **Step 1: Write the sitemap and robots files**

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { ROUTES } from '@/content/site';
import { programs } from '@/content/programs';

const BASE = 'https://hannafilia.co.id';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...Object.values(ROUTES),
    ...programs.map((p) => `${ROUTES.programs}/${p.slug}`),
  ];

  return routing.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${BASE}/${locale}${path === '/' ? '' : path}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${BASE}/${l}${path === '/' ? '' : path}`]),
        ),
      },
    })),
  );
}
```

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://hannafilia.co.id/sitemap.xml',
  };
}
```

- [ ] **Step 2: Write the 404 page**

`src/app/[locale]/not-found.tsx`:

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { ROUTES } from '@/content/site';
import { Button } from '@/components/m3/Button';

export default function NotFound() {
  const t = useTranslations('nav');

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-[1140px] flex-col items-start justify-center gap-6 px-6">
      <p className="font-heading text-display-large text-primary">404</p>
      <Button href={ROUTES.home} variant="outlined">{t('home')}</Button>
    </main>
  );
}
```

- [ ] **Step 3: Write the README**

Create `README.md`:

```markdown
# Hanna Filia English Course — website

Next.js 15 · TypeScript · Tailwind v4 · Material 3 tokens · Indonesian and English.

## Running it

Requires Node 22.18 or newer.

    npm install
    npm run photos    # downloads the placeholder photographs, run once
    npm run dev

Other commands: `npm run build`, `npm run typecheck`, `npm test`.

## Replacing a photograph

Save your photograph over the matching file in `public/images/`, keeping the
same filename and the `.jpg` extension. Nothing in the code changes.

Match the aspect ratio listed for that key in `src/content/images.ts` (`4/3`,
`16/9`, or `1/1`) so the layout does not shift.

The six teacher cards show initials instead of a photograph, on purpose — see
`public/images/CREDITS.md`. To use real portraits, add `teacher-1.jpg` through
`teacher-6.jpg` to `public/images/` and set each `src` in `src/content/images.ts`
to `/images/teacher-N.jpg`.

## Changing text

- **Page copy, programmes, teachers, FAQ:** the files in `src/content/`. Every
  string is an object with an `id` and an `en` field. Both are required — leaving
  one out is a build error, not a silent blank.
- **Buttons, labels, navigation:** `messages/id.json` and `messages/en.json`.
  The two files must have exactly the same keys; `npm test` enforces this.

## Showing prices

Prices are hidden and the site says "Tanya biaya" instead. To show them, set
`SHOW_PRICES = true` in `src/content/site.ts`. The values themselves already
live in `src/content/programs.ts`.

## Adding a third language

1. Add the code to `locales` in `src/i18n/routing.ts`.
2. Add `messages/<code>.json` with the same keys as `id.json`.
3. Add the field to `Localized` in `src/content/types.ts` and fill it in
   throughout `src/content/`. TypeScript will list every place that needs it.

## The design system

`src/styles/tokens.css` holds the entire Material 3 system — colour, shape,
type, motion, elevation. It is the only file with hex values in it. Every colour
used anywhere else goes through a token name such as `bg-primary` or
`text-on-surface-variant`.

`npm test` checks the contrast of every colour pair against WCAG AA, so changing
a colour to something unreadable fails the build rather than the audit.

One brand-specific rule the test guards: gold (`tertiary-container`) on crimson
(`primary`) is 4.51:1, which passes only for text at 18px or larger in bold. It
is used for the "Gratis" and "Level N" badges. Never use it for body text.

## Layout

The breakpoint is 768px. Below it, navigation is a Material 3 bottom navigation
bar with five destinations. At and above it, a top app bar with six links; the
"Daftar kelas percobaan" button appears from 1024px.

## The enrolment form

There is no backend. The form validates in the browser and then opens WhatsApp
at 0812-7000-1234 with the enquiry already written out. The visitor can edit it
before sending.
```

- [ ] **Step 4: Run the full verification**

```bash
npm run typecheck
npm test
npm run build
```

All three must be clean. In the build output, confirm every route is marked static, not dynamic.

- [ ] **Step 5: Verify the definition of done by hand**

```bash
npm run dev
```

Walk this list and fix anything that fails:

1. All 13 routes load in both `/id` and `/en`; none shows a raw translation key such as `home.heroTitle`.
2. At 320px, 375px, 768px, 1024px and 1440px there is no horizontal scrollbar on any page.
3. Bottom nav appears below 768px only; the pill indicator and filled icon track the current page.
4. The last section of every page clears the bottom nav.
5. Switching language keeps you on the same page.
6. The enrolment form opens WhatsApp with a correctly formatted message from both the homepage and the contact page.
7. With `prefers-reduced-motion: reduce` emulated, nothing animates and nothing is invisible.
8. Tab through the homepage: skip link first, focus ring visible at every stop, no focus trap.
9. Run Lighthouse on `/id` — Accessibility should be 100. Investigate anything below.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots, 404 page, and project documentation"
```

---

## Self-Review Notes

Checked against the spec after writing:

- **§3.1 colour** → Task 1 Step 3, verified by Task 1 Step 5.
- **§3.2 shape, §3.3 typography, §3.4 motion, §3.5 state layer, §3.6 elevation** → Task 1 Steps 3–4.
- **§4.1 file structure** → the File Structure table; every listed file is created by a task.
- **§4.2 routing and metadata** → Task 4; per-page `alternates.languages` in Tasks 9–15.
- **§4.3 content/UI string split** → Task 2.
- **§4.4 photo manifest, §4.4.1 monograms** → Task 8, applied in Task 11.
- **§5.1 bottom nav, §5.2 desktop bar** → Task 6.
- **§5.3 layout fixes** → distributed: hero and stats Task 9, programme rows Task 10, teacher grid Task 11, gallery filter Task 13, footer Task 6.
- **§6 animation** → Task 7 (reveal, counter), Task 9 (marquee, ladder), Task 12 (route map), Task 5 (accordion), Task 6 (nav indicator).
- **§7 WhatsApp** → Task 3, wired up in Task 15.
- **§8 accessibility** → skip link and landmarks Task 6, accordion semantics Task 5, tablist Task 13, form labels and errors Tasks 5 and 15, contrast Task 1.
- **§9 tests** → invariants 1, 2 and 5 in Task 2 and Task 8; invariant 3 in Task 1; invariant 4 in Task 3.
- **§10 definition of done** → Task 16 Step 5.

Two deviations from the spec, both deliberate and noted where they occur:

1. **View Transitions are not implemented.** The spec listed them under §6. They are omitted because Next.js 15's support is still experimental and enabling it would add a config flag whose behaviour changes between minor releases — a poor trade for a 300ms flourish. Every other animation in §6 is implemented. Add it later behind the experimental flag if wanted.
2. **The accordion's collapse is not animated**, only its expand. `hidden` is toggled alongside the grid-rows transition so collapsed answers stay out of the tab order and the accessibility tree, which removes the element before the exit transition can play. Correct semantics were judged worth more than the exit animation.
