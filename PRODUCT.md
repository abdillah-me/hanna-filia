# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (confirmed by the owner, 2026-11-18): teenagers and adults in Batam who enrol for themselves — SMA students, university students and working people who need English for a test score (TOEFL/IELTS), for work (meetings with Singaporean vendors, business English), or to study abroad. They browse on a phone, compare a few local courses, and contact the one they trust through WhatsApp.

Secondary: parents choosing a course for a child aged 6–17; families using the study-abroad service (HFOS); HR managers looking for in-house business English.

## Product Purpose

The marketing website of Hanna Filia English Course, an English course (LKP) in Komplek Nagoya Newton, Batam, run by Yayasan Hanna Filia Internasional. The site exists to turn a visitor into a WhatsApp enquiry for a free trial class, and to rank for local searches such as "kursus bahasa Inggris Batam". Success is a sent WhatsApp message.

## Positioning

One local school that takes a learner along a single path: five sequential levels (Kids, Teens, Conversation, TOEFL & IELTS, Business English) in classes of at most eight, and then, through Hanna Filia Overseas Service (HFOS), the paperwork and placement for studying abroad. Batam sits a ferry ride from Singapore; the course sells English as the way out and up from here.

## Operating Context

- Enrolment happens over WhatsApp. The site has no backend: the form validates in the browser and opens WhatsApp with the enquiry prewritten.
- A free placement test and one free trial session precede enrolment.
- Indonesian is the default language; English is a full second locale.
- Prices are hidden site-wide (`SHOW_PRICES = false`); the site says "Tanya biaya".

## Capabilities and Constraints

- Next.js 15 App Router, statically generated, Tailwind v4, next-intl. Every route lives under `/id` or `/en` (spec decision).
- All colour lives in `src/styles/tokens.css`; `npm test` checks WCAG AA contrast for every pair used.
- Content lives in `src/content/` (bilingual, type-checked) and `messages/*.json`.
- Mobile uses a bottom navigation bar with five destinations; the breakpoint is 768px.
- The Articles page is `noindex` and unlinked until real articles exist.

## Brand Commitments

- Name: Hanna Filia English Course. Foundation: Yayasan Hanna Filia Internasional. Motto: "Soli Deo Gloria".
- Logo: `public/logo.png` (crimson and gold; hand, heart, ribbon). Brand crimson `#A21C42`.
- Voice: plain, specific, colloquial Indonesian where a person is speaking; no superlatives.
- Tagline in use: "Learning English is Fun and Easy".
- Standing visual preference (owner, 2026-11-18): the category-standard look, chosen over more distinctive directions. Craft references: EF English First, British Council, Wall Street English, Cakap.

## Evidence on Hand

Confirmed by the owner on 2026-11-18: **everything below is sample data, not yet supplied by the client.** Design must not lean on it as proof, and none of it may be presented as verified.

- WhatsApp number, phone, email, Instagram handle (`src/content/site.ts`).
- The six teachers, their names, credentials and quotes (`src/content/teachers.ts`).
- All testimonials (`src/content/testimonials.ts`).
- Statistics: founded 2003, 4,200+ alumni, 37 alumni abroad (`src/content/site.ts`).
- Programme prices (`src/content/programs.ts`).
- Every photograph in `public/images/` is an Unsplash placeholder. No real photography exists yet. Teacher cards deliberately show initials rather than a stock portrait.
- Accreditation numbers (NILEK/NPSN, BAN PAUD & PNF) are not yet available.

## Product Principles

1. The next step is always a WhatsApp message; nothing should stand between a convinced visitor and sending it.
2. Say what is true and specific. Sample data and stock photos are never dressed up as evidence.
3. One path, shown whole: a visitor should see where they start and how far the school can take them.
4. The phone is the primary screen.
5. Fast and indexable first: static pages, small JavaScript, real text.

## Accessibility & Inclusion

WCAG AA contrast is enforced by test. Reduced-motion and no-JavaScript fallbacks exist and must be kept.
