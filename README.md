# Hanna Filia English Course — website

Next.js 15 · TypeScript · Tailwind v4 · Indonesian and English.

## Running it

Requires Node 22.18 or newer (see `engines` in `package.json`).

    npm install
    npm run photos    # downloads the placeholder photographs, run once
    npm run dev

`npm run photos` downloads a set of placeholder photos from Unsplash into
`public/images/`. It never overwrites a file that's already there, so once
you've dropped in a real photograph, re-running the script (e.g. after a
fresh clone) cannot destroy it — it just skips that file and reports it as
already present.

Other commands: `npm run build`, `npm run typecheck`, `npm test`, `npm run lint`.

## Replacing a photograph

Save your photograph over the matching file in `public/images/`, keeping the
same filename and the `.jpg` extension. Nothing in the code changes — the
manifest at `src/content/images.ts` points at the filename, not the file's
content, so overwriting the file is the entire job.

Each entry in `src/content/images.ts` also lists a `ratio` (`4/3`, `16/9`, or
`1/1`). This is the shape of the **slot** the photo sits in, not a
measurement of whatever placeholder is currently there — the image is
rendered with `object-cover`, which always crops the photograph to fill that
shape. Don't "correct" a ratio to match a new photo's actual dimensions:
every future photo the client drops in has to land in the same slot shape,
or the layout shifts every time a photo is swapped. If you genuinely need a
different shape for one photo, that's a layout change, not a photo swap —
expect to also adjust the component that renders it.

The six teacher cards deliberately show initials instead of a photograph.
This is intentional, not a placeholder gap: a stock or generic portrait
sitting next to a named, credentialled real teacher would misrepresent a
real person, which a placeholder building or classroom photo does not. See
`public/images/CREDITS.md`. To switch a teacher to a real portrait, **two
steps are required, not one**:

1. Add `teacher-1.jpg` through `teacher-6.jpg` (matching each person's
   `imageKey` in `src/content/teachers.ts`) to `public/images/`.
2. In `src/content/images.ts`, set that teacher's `src` to
   `/images/teacher-N.jpg`. Unlike every other entry in that file, the six
   `teacher-*` entries ship with `src: ''` on purpose — that empty string is
   what tells the card to render initials instead of a photo (see
   `hasPhoto()` in `src/components/media/PhotoSlot.tsx`). Dropping the file
   into `public/images/` alone does nothing: nothing on the site inspects
   the filesystem, so the card keeps showing initials until `src` is set.

## Changing text

- **Page copy, programmes, teachers, FAQ:** the files in `src/content/`. Every
  string is an object with an `id` and an `en` field. Both are required —
  TypeScript will refuse to build if either is missing, so a forgotten
  translation is a compile error, not a silent blank on the page. (A test
  additionally checks that neither field is present-but-empty.)
- **Buttons, labels, navigation:** `messages/id.json` and `messages/en.json`.
  The two files must have exactly the same set of keys; `npm test` enforces
  this and fails the build if they drift apart.

## Showing prices

Prices are hidden site-wide and the site says "Tanya biaya" ("Ask about
pricing") instead. To show them, set `SHOW_PRICES = true` in
`src/content/site.ts`. The actual price values already live in each
programme's entry in `src/content/programs.ts` — nothing else needs editing.

## Adding a third language

1. Add the new code to both the `Locale` type and the `LOCALES` array in
   `src/content/types.ts` (not `routing.ts` — `src/i18n/routing.ts` only
   imports `LOCALES` from there, it doesn't define it). `LocaleToggle` reads
   `LOCALES` too, so the switcher picks up the new language automatically —
   nothing to edit there.
2. Add `messages/<code>.json` with the same key set as `id.json`.
3. Add the field to the `Localized` type in `src/content/types.ts` and fill
   it in throughout `src/content/`. TypeScript will list every place that
   still needs it, since every existing `Localized` object literal will be
   missing the new field.
4. Canonical, hreflang and Open Graph tags come from `pageMetadata()` in
   `src/lib/seo.ts`, which every page's `generateMetadata` calls. It lists
   every locale in `LOCALES` automatically, so it assumes each page exists in
   each locale. Add the new locale to its `openGraph.locale` ternary.

## The design system

`src/styles/tokens.css` holds the entire design system — colour, shape,
type, motion, elevation. It is the only file in the codebase allowed to
contain a hex colour value. Every colour used anywhere else goes through a
token name such as `bg-primary` or `text-on-surface-variant`.

`npm test` checks the contrast of every colour pair against WCAG AA, so
changing a colour to something unreadable fails the build rather than a
manual audit later.

The look is the conventional language-course one, chosen by the owner: white
ground, warm ink, brand crimson for actions only, gold for the "Gratis" and
"Level N" tags, one typeface (Figtree), soft corners and hairline borders.
The token names keep their Material 3 roles (`primary`, `surface`, …) so
components did not have to change. `PRODUCT.md` records who the site is for;
`DESIGN.md` records the visual system.

## Layout

The breakpoint is 768px. Below it, navigation is a Material 3 bottom
navigation bar with five destinations. At and above it, a top app bar with
six links; the "Daftar kelas percobaan" (book a trial class) button appears
from 1024px.

## The enrolment form

There is no backend. The form validates in the browser and then opens
WhatsApp at 0812-7000-1234 with the enquiry already written out as the
message text. The visitor can edit it before sending. This is the only path
a real submission takes — there's no server-side storage of form
submissions anywhere in the app.

## Routing, 404s, sitemap

Every route is served under a locale prefix (`/id/...` or `/en/...`);
visiting a path with no locale prefix redirects to the default locale
(`id`) with the same path appended. A path that matches no real page (in
either case) renders a locale-aware 404 page with the site's normal header,
footer, and navigation — not a bare error page.

`/sitemap.xml` and `/robots.txt` are generated from `src/content/site.ts`
and `src/content/programs.ts`, so a new top-level route or programme slug
appears in the sitemap automatically once it's added to `ROUTES` or
`programs`.

## SEO

- `src/lib/seo.ts` builds each page's canonical, hreflang (including
  `x-default`) and Open Graph tags, plus the JSON-LD blocks: the school
  (every page, from `src/content/site.ts`), each programme as a `Course`, and
  the contact page's FAQ.
- `src/app/opengraph-image.tsx` is the share-preview image for every page.
- The Articles page is `noindex` and left out of the sitemap and navigation
  while it only holds placeholder cards. When real articles exist, remove
  `robots` from its `generateMetadata`, drop the filter in `src/app/sitemap.ts`,
  and add `'articles'` back to `footerKeys` and the homepage's `MORE_LINK_KEYS`.
