---
name: Hanna Filia English Course
description: Category-standard language-course site. White ground, warm ink, brand crimson for actions.
colors:
  primary: "#A21C42"
  on-primary: "#FFFFFF"
  primary-container: "#FCE8EC"
  on-primary-container: "#5C0A22"
  secondary-container: "#F6F1F2"
  on-secondary-container: "#1D1719"
  tertiary: "#725C00"
  tertiary-container: "#F2C230"
  on-tertiary-container: "#231B00"
  error: "#BA1A1A"
  surface: "#FFFFFF"
  on-surface: "#1D1719"
  on-surface-variant: "#5F5559"
  surface-container-low: "#FAF7F8"
  surface-container: "#F6F1F2"
  surface-container-high: "#EFE9EB"
  outline: "#857A7E"
  outline-variant: "#E3DADD"
  inverse-surface: "#1D1719"
  inverse-on-surface: "#F6F1F2"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(38px, 5vw, 64px)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  display-medium:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.4vw, 56px)"
    fontWeight: 800
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  display-small:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.4vw, 44px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  headline-small:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title-medium:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  body-small:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1.2
  label-medium:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.09em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  grid-gap: "16px"
  card: "20px"
  gutter: "24px"
  panel: "28px"
  section-y: "56px"
  section-y-md: "72px"
components:
  button-filled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  button-outlined:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
    height: "48px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "20px"
  quote-panel:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.on-secondary-container}"
    rounded: "{rounded.lg}"
    padding: "28px"
  text-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
    height: "48px"
  badge:
    backgroundColor: "{colors.tertiary-container}"
    textColor: "{colors.on-tertiary-container}"
    typography: "{typography.label-medium}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  choice-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-secondary-container}"
    typography: "{typography.title-medium}"
    rounded: "{rounded.md}"
    padding: "16px"
  bottom-nav:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface-variant}"
    height: "80px"
  footer:
    backgroundColor: "{colors.inverse-surface}"
    textColor: "{colors.inverse-on-surface}"
---

# Design System: Hanna Filia English Course

## Overview

**Creative North Star: "The Familiar Front Desk"**

This is the category-standard language-course look, chosen deliberately by the owner over more distinctive directions (craft references: EF English First, British Council, Wall Street English, Cakap). A visitor comparing courses on a phone should recognise the arrangement at once: logo and trial button on top, headline beside a classroom photograph, a row of programme cards, proof, a form. The system earns trust by executing that familiar arrangement cleanly, not by surprising anyone. (The North Star name is the documenter's label, not yet confirmed by the owner.)

The ground is white, the ink a warm near-black, and the brand crimson appears only where something can be pressed or where a small fact needs emphasis. Sections are separated by hairline rules and by soft rose-grey tinted bands, never by colour floods. Corners are soft, shadows are faint and reserved for hover and floating chrome, and the page ends on a dark ink footer. It replaced an earlier crimson-flooded, ink-bordered Material 3 look; the token names keep their Material 3 roles, the values do not.

**Key Characteristics:**
- White surface, warm near-black text, crimson for actions only.
- One typeface (Figtree), heavy headings over regular body.
- Hairline borders and rose-grey bands structure the page; shadows respond to state.
- Photographs in rounded frames; cards carry a 16:9 photo flush to the top edge.
- Phone first: a five-destination bottom bar below 768px, a top bar with links above it.

## Colors

A near-neutral palette warmed slightly toward the brand crimson, with one action colour and one small gold accent.

### Primary
- **Brand Crimson** (`primary`): filled buttons, text links, the active top-nav link, programme numbers, stat figures, accordion icons, focus rings, the selected side of the language toggle. Taken from the logo.
- **Blush** (`primary-container`) with **Deep Crimson** (`on-primary-container`): the active pill in the bottom bar, teacher monogram tiles, the study-abroad timeline rail, text selection.

### Tertiary
- **Marigold** (`tertiary-container`) with **Dark Olive Ink** (`on-tertiary-container`): the pill badge ("Gratis", "Level N"), the origin dot on the route map, the footer motto and footer link hover.
- **Deep Gold** (`tertiary`): gold as text on white, where Marigold would fail contrast.

### Neutral
- **White** (`surface`): the page and every card.
- **Warm Ink** (`on-surface`, `inverse-surface`): all primary text, and the footer ground.
- **Mauve Grey** (`on-surface-variant`): supporting text, metadata, captions, resting bottom-nav labels.
- **Rose-Grey Band** (`secondary-container`, same value as `surface-container`): tinted section bands, testimonial and quote panels, the bottom bar, footer secondary text.
- **Faint Rose** (`surface-container-low`): page-hero bands and the closing trial section.
- **Photo Ground** (`surface-container-high`): shown behind a photograph while it loads.
- **Hairline** (`outline-variant`): every resting border and section rule.
- **Field Stroke** (`outline`): input borders and the outlined button, where a 3:1 boundary is needed.
- **Error Red** (`error`): invalid field border and message only.

### Named Rules
**The Pressable Crimson Rule.** Crimson fills only things that can be pressed. As text it marks links and small figures. It never fills a section, a card or a band.

**The Small Gold Rule.** Marigold is a pill, a dot or a line of footer text. Never a button, never a section ground.

**The Tested Pair Rule.** Every text/background pair in use is checked for WCAG AA by `test/tokens.test.ts`. Change a colour value only together with the test.

## Typography

**Display Font:** Figtree (with system-ui, sans-serif)
**Body Font:** Figtree (same family; one variable font file, normal and italic)

**Character:** A friendly humanist sans used plainly: extra-bold, tightly tracked headings over regular-weight body at a generous line height. The contrast is weight and size, never a second family.

### Hierarchy
- **Display** (800, clamp(38px, 5vw, 64px), 1.04, -0.02em): the homepage h1 only.
- **Display Medium** (800, clamp(32px, 4.4vw, 56px), 1.06): inner-page h1, capped near 24ch, balanced wrapping.
- **Display Small** (800, clamp(28px, 3.4vw, 44px), 1.1): the lead h2 of a two-column feature section; monogram initials.
- **Headline** (700, 32px, 1.12, -0.02em): section headings and stat figures. **Headline Small** (700, 24px) for sub-section headings.
- **Title** (700, 20px, 1.25): accordion questions, card names on inner pages. **Title Medium** (700, 17px) for programme card names, choice chips and inline section links.
- **Body** (400, 17px, 1.65): default paragraph text, capped between 46ch and 68ch. **Body Small** (400, 15px, 1.5) for metadata, captions and card detail; at weight 600 it is the top-nav link and field label.
- **Label** (700, 15px, 1.2): button text. **Label Medium** (700, 13px, 0.09em): footer column headings and field-group labels on detail pages.

### Named Rules
**The One Family Rule.** Figtree everywhere. Hierarchy comes from weight (800 display, 700 headings and labels, 600 for small emphasis, 400 body) and size.

**The Sentence Case Rule.** Headings, buttons and labels are sentence case. The only uppercase text in the build is the two-letter language codes in the toggle.

## Layout

One centred column, 1140px maximum, with a 24px gutter at every width. Sections stack full-bleed and each ends in a hairline bottom rule; vertical padding is 56px on phones and 64–72px from 768px. A section is either white or a tinted band, and bands alternate with white rather than stacking.

Two-column splits (hero, study-abroad teaser, trial form) are equal halves with a 40–64px gap and collapse to one column below 768px, copy first. Card grids run 1 → 2 → 5 columns for programmes and 1 → 2 → 3 for teachers, gallery and choices, with 16–20px gaps. The stats row is 2 columns on phones and 4 from 768px, divided by vertical hairlines.

Below 768px a fixed bottom bar (80px plus the safe-area inset) carries the five main destinations and the body reserves its height; the top bar keeps only the logo and language toggle. From 768px the top bar shows text links, and from 1024px it adds the filled trial button.

## Elevation & Depth

Flat at rest. Structure comes from hairline borders and tonal bands; shadows are soft, warm-tinted and tied to state or to chrome that floats above content.

### Shadow Vocabulary
- **Rest lift** (`box-shadow: 0 1px 2px rgb(29 23 25 / 0.06), 0 2px 6px rgb(29 23 25 / 0.06)`): the trial form panel, the language-toggle thumb, a filled button on hover.
- **Raised** (`box-shadow: 0 2px 4px rgb(29 23 25 / 0.06), 0 10px 24px rgb(29 23 25 / 0.10)`): a linked card on hover (with a 3px upward shift and a crimson border), the top bar once the page has scrolled, the bottom bar.

### Named Rules
**The Flat-At-Rest Rule.** Content surfaces have a border and no shadow until hovered. Only chrome and the one form panel carry a shadow at rest.

## Shapes

Soft, conventional corners on a short scale: inputs 8px, buttons and choice chips 12px, cards and panels 16px, the hero photograph 24px, pills fully round (badge, language toggle, gallery filters, country tags, the bottom-bar indicator). Borders are always 1px. Photographs are clipped to their frame's radius; inside a card the photo sits square-cornered against the top edge and the card's own 16px corner clips it.

## Components

### Buttons
Plain and sturdy; two variants only.
- **Shape:** 12px radius, 48px minimum height, 12px × 20px padding, 15px bold label, optional 20px trailing icon.
- **Filled:** crimson ground, white text. Hover adds the rest-lift shadow and an 8% state layer.
- **Outlined:** white ground, ink text, field-stroke border that darkens to ink on hover.
- **Press / Focus / Disabled:** scales to 97% on press; 2px crimson focus outline offset 2px (global); 45% opacity when disabled.

### Chips
- **Choice chip (path finder):** white, 12px radius, hairline border, 17px bold text, left-aligned; the selected one takes a crimson border.
- **Pill (gallery filter, country tag):** fully round, hairline border, 15px bold text.
- **Badge:** Marigold pill, 13px bold tracked text; used for "Level N" and "Gratis".

### Cards / Containers
- **Card:** white, 16px radius, hairline border, no rest shadow, 20–24px internal padding. When it is a link it lifts 3px, gains the raised shadow and a crimson border on hover.
- **Programme card:** a 16:9 photograph flush to the top, then crimson level number + name, two lines of grey metadata, one summary line.
- **Quote panel:** rose-grey ground, 16px radius, no border, 24–28px padding; quote in body text, attribution in small grey with the name bold.
- **Form panel:** a white card with 28px padding and the rest-lift shadow, set on the faint-rose band.

### Inputs / Fields
- **Style:** white, 8px radius, 1px field-stroke border, 48px minimum height, 17px text, a 15px semibold label above. Selects use a custom chevron.
- **Focus:** border turns crimson, plus the global focus outline.
- **Error:** red border and a small red message tied to the field with `aria-describedby`.

### Navigation
- **Top bar:** sticky, white, hairline bottom rule, gains the raised shadow after 8px of scroll. Links are 15px semibold ink; hover and the current page are crimson.
- **Language toggle:** a rose-grey pill track with a crimson thumb that slides between ID and EN.
- **Bottom bar (below 768px):** five icon-over-label items on rose-grey; the active item gets a blush pill behind a filled icon and a bold label.
- **Footer:** warm-ink ground, three columns, light text, gold italic motto, links turn gold on hover.

### Accordion
Rows divided by a top hairline; a 20px bold question with a crimson plus/minus on the right; the question turns crimson on hover and the answer opens by animating the row height over 200ms.

### Photo Frame
Every photograph sits in a rounded, clipped frame with a fixed aspect ratio (hero 6:5, cards 16:9). Where no photo exists the caller shows a blush monogram tile with initials instead of a stock portrait.

### Motion
Short and functional: 200ms state transitions, a 500ms staggered rise (16px) for hero copy on load, a 300ms fade for page changes, staggered reveal for card rows on scroll. All of it is removed under `prefers-reduced-motion`, with content left fully visible.

## Do's and Don'ts

### Do:
- **Do** keep the ground white and separate sections with a hairline rule or a rose-grey band.
- **Do** make the filled crimson button the single primary action in a view, with an outlined button beside it for the secondary.
- **Do** keep interactive targets at 48px minimum height.
- **Do** put photographs in rounded, clipped frames with a fixed aspect ratio.
- **Do** add colours only in `src/styles/tokens.css`, keeping the Material 3 role names, and run the contrast test.
- **Do** keep every motion effect inside the reduced-motion fallback.

### Don't:
- **Don't** flood a section, band or card with crimson; that was the look this system replaced.
- **Don't** use heavy ink borders around cards or sections; borders are 1px hairlines.
- **Don't** add a second typeface or set headings in uppercase.
- **Don't** give resting content cards a shadow.
- **Don't** use Marigold as a button or section ground.
- **Don't** present sample data or stock photos as proof; teacher cards show initials until real portraits exist.
