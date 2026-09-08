# SDD ledger — plan: docs/superpowers/plans/2026-09-06-hanna-filia-website.md

Spec: docs/superpowers/specs/2026-09-06-hanna-filia-nextjs-design.md (read, binding authority)
Branch: build/nextjs-m3 (repo initialised at 12fc8bf; no worktree — new empty repo, nothing to isolate from)

## Pre-flight conflict scan

### Cross-task: shared files and interfaces

| A | B | A produces / B consumes | Finding |
|---|---|---|---|
| T1 | T4 | `src/app/layout.tsx`, `src/app/page.tsx` | Clean — T4 explicitly deletes both and creates `[locale]/` equivalents |
| T1 | T4 | `next.config.ts` | Clean — T4 wraps with `createNextIntlPlugin`, no contradiction |
| T1 | all | `tokens.css` token names → Tailwind utilities | Clean — every utility used downstream (`bg-primary`, `text-on-surface-variant`, `ease-emphasized`, `text-label-nav`, `rounded-sm`, `font-heading`, `font-quote`) maps to a token defined in T1 |
| T2 | T3 | `site.whatsappE164` | **DEFECT — see R1** (Node ESM extensionless import) |
| T2 | T8,T10-T14 | `Program.imageKey: string` vs `PhotoSlot(imageKey: ImageKey)` | **DEFECT — see R3** (T10 uses `as never`, T11/T13/T14 use `as ImageKey`) |
| T2 | T8 | `test/content.test.ts` | **DEFECT — see R4** (T8 appends an `import` below existing tests; ESM requires top-of-file) |
| T5 | T13 | `Chip.tsx` vs T13's inline tablist button | **DEFECT — see R2** (near-verbatim duplication; Chip otherwise unused) |
| T5 | T15 | `TextField`/`SelectField` signatures | Clean — T15 passes exactly the declared props |
| T5 | T15 | `Accordion(items)` | Clean — T15 supplies `{id,question,answer}` |
| T6 | T4 | layout `<body>` composition | Clean — T6 Step 6 rewrites the body T4 created |
| T6 | T2 | `ROUTES`, `topNavKeys`, `bottomNavKeys`, `footerKeys`, `RouteKey` | Clean — all defined in T2 site.ts |
| T7 | T9,T12,T13 | `Reveal`, `useInView`, `CountUp` | **RISK — see R5** (`Reveal as="li"` ref typing under strict) |
| T8 | T11 | `hasPhoto`, `Monogram` | Clean |
| T9 | T15 | `EnrolmentForm` stub → real | Clean — T9 declares the stub explicitly, T15 replaces it |
| T3 | T15 | `normalizeWhatsApp`, `buildWhatsAppUrl` | Clean — signatures match |
| T2 | T16 | `ROUTES`, `programs` for sitemap | Clean |

### Per-task: internal self-agreement

| Task | Tests vs code | Files created vs later touched | Finding |
|---|---|---|---|
| T1 | Contrast test parses the file it writes | — | Clean; test is not a value-copy, it reads `tokens.css` |
| T2 | Invariant tests cover every module created | — | Clean |
| T3 | 16 cases cover every branch of `normalizeWhatsApp` | Step 3 writes an import Step 4 immediately rewrites | **DEFECT — see R1** |
| T4 | No test (config wiring; verified by build) | Deletes T1's temp files | Clean |
| T5 | No test (presentational) | — | Clean apart from R2 |
| T6 | No test; 7-point manual check | Modifies T4 layout | Clean |
| T7 | No test; reduced-motion check | — | Clean |
| T8 | 2 tests appended | Writes `public/images/` | R4 |
| T9–T15 | No unit tests; per-task manual checks | — | Clean |
| T16 | Full verification sweep | — | Clean |

### Plan-mandated vs review rubric

No task mandates a test that asserts nothing. R2 is the one duplication the rubric would flag; ruled below.

## Pre-flight rulings

Ruling R1: All relative imports inside `src/content/**` and `src/lib/**` use explicit `.ts` extensions, and `tsconfig.json` gains `"allowImportingTsExtensions": true`. T3 Step 3 writes the relative `.ts` import directly; T3 Step 4 becomes a verification step, not a rewrite.
  — Why: `node --test` resolves ESM by real filename. `import from './types'` fails, so every invariant test in T2/T3/T8 would fail at import time, not on a real defect. This was a genuine plan defect, not a style choice.
  — Cost if wrong: if `next build` rejects `.ts` specifiers, tests must instead run through a loader (`tsx` as a devDependency, breaking the four-runtime-dependency constraint only in devDeps). Detected immediately at T1/T2 build.

Ruling R2: Delete `src/components/m3/Chip.tsx` from Task 5. Task 13's gallery filter keeps its inline tablist button.
  — Why: the tablist needs `role`, `tabIndex`, ref forwarding and arrow-key handling that `Chip` does not expose; keeping both leaves a near-verbatim duplicate of the same class string with one consumer each. Chip has no other consumer anywhere in the plan.
  — Cost if wrong: if a second chip consumer appears later, extract it then — cheaper than maintaining an unused abstraction now.

Ruling R3: `imageKey` stays typed `string` in `src/content/types.ts`; use sites cast with `as ImageKey`. Task 10's `as never` is corrected to `as ImageKey`.
  — Why: typing it `ImageKey` makes `types.ts` import from `images.ts`, which already imports `Localized` from `types.ts` — a circular import. The T8 test already guarantees every referenced key exists in the manifest, so the cast is checked at test time rather than compile time.
  — Cost if wrong: a typo'd imageKey surfaces in `npm test` instead of `tsc`. Acceptable — the test runs in the same commit.

Ruling R4: Task 8's `import { images }` addition goes at the top of `test/content.test.ts` with the other imports; only the two new `test(...)` blocks are appended.
  — Why: ESM requires imports at module top level. The plan's wording said "append" for both.
  — Cost if wrong: none; this is unambiguous.

Ruling R5 (advisory, carried into T7's dispatch): if `Reveal`'s polymorphic `as` prop fights `strict` ref typing, type the component with `ComponentPropsWithoutRef` and attach the ref via a plain `<div>`/`<li>` branch rather than reaching for `any`.
  — Why: the Global Constraints forbid `any`; the plan did not anticipate the polymorphic-ref friction.
  — Cost if wrong: a slightly more verbose Reveal. No behavioural impact.

## Progress

Task 1: implementer reported DONE_WITH_CONCERNS (commit 6208490). typecheck+build clean; 17/18 tests, 1 failing by design.
Task 1: R1 probe PASSED — `.ts` import specifiers survive both `tsc --noEmit` and `next build`. Ruling R1 stands; no fallback loader needed.

Ruling R6: gold-on-crimson is 4.507238:1, which PASSES WCAG AA for normal text. The spec's "large text only / >=18px / weight >=700" restriction is removed, and the contrast test's upper-bound assertion (`r < 4.5`) is replaced with `r >= 4.5`. Spec §3.1 and plan Global Constraints already amended.
  — Why: I derived the restriction from a rounded reading of "4.51" and then wrongly reasoned it was below the AA threshold. It is above it. The test's tripwire fired exactly as designed and told me to relax the rule; ignoring it and forcing the test green would have inverted the tool's purpose. The margin is 0.007, so `>= 4.5` is now a real guard: any change to either token that drops below AA fails the build.
  — Cost if wrong: if 4.5072 is judged too marginal to rely on, darken `--color-tertiary-container` for headroom. One token change, one test run. No layout or code impact.

Ruling R7: replace `"noUncheckedSideEffectImports": false` in tsconfig with a targeted ambient declaration (`declare module '*.css';`) so the flag returns to its TS 6 default.
  — Why: the implementer disabled a project-wide safety check to solve a single side-effect import of a stylesheet. The flag exists to catch typo'd and unresolvable side-effect imports across the whole project; an ambient CSS declaration fixes the one real case without surrendering that check everywhere else.
  — Cost if wrong: if the ambient declaration does not satisfy TS 6 here, the flag goes back off with a comment recording why. Costs one build.

Accepted without change: `"test": "node --test 'test/**/*.test.ts'"` replaces the plan's `node --test test/`. The directory form is broken on this Node build. Behaviour is identical; plan text is superseded.

Harness constraint: SendMessage is disabled in this session, so implementers cannot be resumed. Every fix round dispatches a FRESH implementer carrying the brief path, the report-file path, and the verbatim findings. The report file is the persistent memory across rounds.
Task 1: pre-review fix (R6 + R7 applied by fresh implementer, commit 76348e2). 18/18 tests, typecheck+build clean. R7 ambient declaration worked; global flag NOT disabled.
Task 1: task review dispatched over 12fc8bf..76348e2 (sonnet).
Task 1: review returned Approved — 0 Critical, 0 Important, 2 Minor, 1 warning item.
Task 1: warning item RESOLVED by controller. Probed all 18 M3 utilities (bg-primary, text-on-surface-variant, ease-emphasized, text-display-large, text-label-nav, rounded-sm, font-heading, font-quote, elevation-2, state-layer, ...) via a temporary page that uses them, then grepped .next/static/css. All 18 emit real CSS. Probe deleted, tree clean. The @theme pipeline every later task depends on is verified, not assumed.
Task 1: minor (deferred): @types/node ^26.4.1 is well ahead of the Node 22 target. Types are additive; no observed breakage. Flagged for the final review.

Ruling R8: the `lint` script shipped by Task 1 is broken, not merely version-drifted as the review graded it. `next lint` is deprecated, no ESLint config exists, and the command HANGS on an interactive setup prompt. Fix rather than delete: add a flat `eslint.config.mjs`, pin `eslint-config-next` to ^15 to match next@15, and change the script to `eslint .`.
  — Why: I escalated this from the reviewer's Minor after running it myself. A repo script that hangs is worse than no script. Fixing beats deleting because `react-hooks/exhaustive-deps` catches dependency-array bugs that `tsc` cannot, and Tasks 7, 13 and 15 all ship real useEffect/useState hooks — I would rather have that net before writing them than discover the need after.
  — Cost if wrong: if the flat config proves fiddly, delete the lint script and both eslint devDependencies instead. Nothing in the plan's verification steps depends on lint; only a human running it would notice.
Task 1: lint fix applied (commit 178b432). `npm run lint` is now non-interactive and exits 0. eslint-config-next pinned ^16 -> ^15.

Ruling R9: declare `@eslint/eslintrc` and `@eslint/js` as devDependencies, and amend the plan's Global Constraints dev-dependency list from 8 packages to 10.
  — Why: `eslint.config.mjs` imports both, but neither was declared — they resolved only as transitive dependencies of `eslint`. That works until a hoisting change or an eslint release drops them, and then lint fails with a module-not-found in someone else's checkout. I checked whether a leaner path existed: eslint-config-next@15.5.25 ships no flat-config export (only eslintrc-format files: index.js, core-web-vitals.js, typescript.js), so FlatCompat is genuinely required rather than boilerplate. Verified the constraint I was about to relax before relaxing it.
  — Cost if wrong: two extra devDependencies. If the lint setup is later judged not worth its weight, delete the script, the config, and all four eslint packages together.
Task 1: R9 applied (commit 3228d8a). Verified by controller: runtime deps = 4 exactly, dev deps = 10 exactly, lint exit 0, 18/18 tests, build clean.
Task 1: complete (commits 12fc8bf..3228d8a, review Approved; 1 minor deferred: @types/node major drift)

Task 2: BASE = 3228d8aba503a7cab83cbcf6ed2b433a81edd842. Dispatching implementer (sonnet — 1185-line brief, ~180 exact bilingual strings; transcription volume and exactness outweigh the cheap-tier default).
Task 2: first implementer (sonnet) terminated mid-task by an API rate limit. No commits. Left untracked partial work: src/content/types.ts (complete, 65 lines) and src/content/programs.ts (all 5 programmes, 152 lines), plus an empty messages/ dir.
Task 2: controller assessed the partial work rather than discarding it — types.ts matches the brief and already reflects ruling R3 (imageKey: string); programs.ts uses the './types.ts' extension per R1 and probes as bilingually balanced (73 id / 73 en). Kept. The re-dispatched implementer is told to VERIFY both files against the brief before building on them, not to assume they are correct.
Task 2: BASE updated to 4df101c (a docs commit landed after the original BASE was recorded). Re-dispatching on sonnet.
Task 2: implementer reported DONE (commit d321be6). 24/24 tests; typecheck/lint/build clean. Walker visits 207 localized values. Inherited types.ts and programs.ts verified against brief and used unmodified.
Task 2: implementer self-disclosed a real limitation — the walker detects a Localized by the exact shape {id, en}, so a fully DELETED `en` key makes the object unrecognisable as Localized and it is silently skipped rather than failing. Empty strings ARE caught. Implementer argues tsc under strict makes deletion unreachable. Passed to the reviewer to assess on its merits rather than pre-judged by me: tightening the heuristic to `has id OR has en` would catch deletions but risks false positives on any future content object using `id` as an identifier, so this is a genuine trade, not an obvious fix.
Task 2: task review dispatched over 4df101c..d321be6 (sonnet).
Task 2: review returned NEEDS FIXES — 0 Critical, 3 Important (one of them plan-mandated), 1 Minor.
Task 2: warning item RESOLVED by controller. Grepped the plan: `navItems`/`bottomNavItems`/`footerLinks` appear exactly once, in my own summary prose at plan line 550. Every downstream code sample (Task 6 top bar, Task 6 footer) uses the shipped names ROUTES/topNavKeys/bottomNavKeys/footerKeys. The implementation is right and my prose was wrong; plan line 550 corrected. `site.addressLines` is consumed as string[] by Task 6 and Task 15, consistent with what shipped — no downstream churn.

Ruling R10 (review finding 1 — ACCEPTED): convert every `as Localized[]` / `as Localized` / `as Value[]` / `as Hours[]` assertion in about.ts and site.ts to a direct type annotation.
  — Why: I reproduced the reviewer's claim independently with the project's own tsc. `[{id:'foo'}] as Localized[]` compiles with exit 0; `const x: Localized[] = [{id:'foo'}]` fails with TS2741. So for 8 fields in about.ts/site.ts a deleted `en` evaded BOTH tsc and the walker's shape check — the implementer's safety argument was sincere but false, and this is exactly the "test that cannot fail on the data it guards" case. Global Constraints amended so every later task inherits the rule.
  — Cost if wrong: none identified. Direct annotations are strictly stronger here.

Ruling R11 (review finding 2 — ACCEPTED): add `stats` to the CONTENT map in test/content.test.ts.
  — Why: 4 user-visible Localized labels shipped completely untested. Plan-mandated (my own Step 5 code omitted it), which does not make it less of a hole.
  — Cost if wrong: none.

Ruling R12 (review finding 3 — PARTIALLY ACCEPTED, deliberately not fixed as proposed): `site.addressLines` stays `string[]`. The reviewer is right that it silently violates the "both languages, no exceptions" constraint; it is wrong that translating it is the fix.
  — Why: a postal address is an identifier, not prose. "Kec. Lubuk Baja" rendered as "Lubuk Baja District" yields an address that fails when typed into Google Maps or written on an envelope — worse for an English-speaking visitor, not better. The real defect was that the exception was accidental and undocumented. Fixed by making it explicit: Global Constraints now names this as the single permitted exception, and site.ts must carry a comment saying why, so no later task "corrects" it.
  — Cost if wrong: if the client wants an English gloss of the address, add it as a separate `addressNote: Localized` line beneath the address rather than translating the address itself.

Task 2: minor (folded into the fix, not deferred): the two JSON walkers in test/content.test.ts handle arrays inconsistently — keyPaths treats an array as an opaque leaf while the empty-string walker recurses into it. Harmless today (no arrays in the messages JSON) but a latent trap. Folded in because the fix dispatch already opens that exact file and the change is one comment; deferring it would cost more than doing it.
Task 2: fix round 1/5 (4 addressed per implementer, 0 open; commit d321be6..4ed1550). 8 `as` assertions -> direct annotations via new About/Site types; `stats` added to CONTENT (207 -> 211 localized values); addressLines exception documented in code; keyPaths unified to recurse into arrays (root cause fixed rather than commented). Deletion experiments now fail with TS2741 where they previously compiled clean.
Task 2: scoped re-review dispatched over d321be6..4ed1550 (haiku).
Task 2: re-review verdict — all 4 findings ADDRESSED, no new breakage, no out-of-scope observations. About/Site types confirmed to constrain rather than widen (no unknown, no any).
Task 2: complete (commits 4df101c..4ed1550, review clean after 1 fix round)

Task 3: BASE = HEAD below. Dispatching implementer on haiku — the brief carries complete code plus a 16-case test table, so this is transcription plus verification, the cheapest tier per Model Selection.
Task 3: implementer reported DONE (commit fbb9602). 28/28 tests; typecheck/lint/build clean. Full-width-digit case present and passing as written.
Task 3: task review dispatched over 1ab2ddb..fbb9602 (sonnet — small diff, but this is the project's only data-loss path, so risk outranks size in model choice). Reviewer explicitly told NOT to trust the case table: tests and implementation were written by the same agent in one sitting, so a misunderstood rule would be encoded identically in both and pass. Asked to trace 8 inputs by hand and state its conclusion for each, plus 3 uncovered inputs.
Task 3: review returned Approved — 0 Critical, 0 Important, 2 Minor. Reviewer independently hand-traced all 8 required inputs plus 3 uncovered ones and reached the expected result for every one; it confirmed the full-width digit is stripped (not coerced) and the test table was reproduced verbatim, not weakened.
Task 3: warning item RESOLVED by controller — site.whatsappE164 is declared `whatsappE164: string` on the Site type (site.ts:9), holds '6281270001234' (site.ts:23), and runtime typeof is string. No `any`.
Task 3: minor (deferred): empty `if (digits.startsWith('62')) {}` block kept for flow symmetry (whatsapp.ts:33-34).
Task 3: minor (deferred): no explicit test for a 9-leading digit string or '+' with no country code; both hand-traced correct.
Task 3: complete (commits 1ab2ddb..fbb9602, review clean, no fix round)

Task 4: BASE = fbb9602. next-intl 4.14.2 confirmed installed, so the brief's defineRouting/createNavigation/hasLocale APIs are the correct v4 surface. Dispatching implementer on sonnet — integration work across middleware, next.config, fonts and file deletions, not transcription.
Task 4: implementer reported DONE_WITH_CONCERNS (commit ce0f70b). 28/28 tests; typecheck/lint/build clean. next-intl v4 API matched the brief exactly, verified against installed type declarations before writing.
Task 4: controller verified the three quiet-failure modes independently — src/app/layout.tsx and src/app/page.tsx are both gone (only [locale]/ remains); build legend marks /[locale] as "● (SSG) prerendered as static HTML" with /id and /en listed, not dynamic; implementer checked computed font-family in a live browser and got Archivo, not the system fallback.
Task 4: implementer's concern (locale list duplicated between types.ts:3 LOCALES and routing.ts:4 defineRouting) confirmed present. Passed to the reviewer to grade rather than pre-judged by me — it is a latent single-source-of-truth issue, not a current defect, and unifying it depends on whether next-intl's defineRouting accepts a readonly tuple, which I have not tested.
Task 4: task review dispatched over fbb9602..ce0f70b (sonnet).
Task 4: review returned Approved — 0 Critical, 1 Important, 2 Minor, 1 warning item.

Ruling R13 (review finding, Important — ACCEPTED): unify the locale list. `src/i18n/routing.ts` imports LOCALES from `@/content/types` instead of hardcoding ['id','en'].
  — Why: I had flagged this as possibly infeasible because LOCALES is annotated `readonly Locale[]`, which widens away the literal tuple next-intl might need. The reviewer settled it empirically — it typechecked the alternative against next-intl's real defineRouting.d.ts (`defineRouting<const AppLocales extends Locales>` where `Locales = ReadonlyArray<string>`) and confirmed it compiles and still narrows locales[0] to 'id'|'en'. My uncertainty was the only thing blocking the obvious fix, and it was resolved by measurement rather than argument.
  — Cost if wrong: revert to the hardcoded array. One line.

Ruling R14 (warning item — set explicitly, AGAINST the apparent default): set `localeDetection: false` in defineRouting.
  — Why: next-intl defaults it to true, so `/` would redirect on Accept-Language. My Global Constraint says "/ redirects to /id", which under the default is only true for a client expressing no preference. Deciding this on audience rather than on convention: English-configured browsers are very common among Indonesians, so Accept-Language is a poor proxy for reading preference in this specific market — auto-detection would send a large share of the primary Indonesian audience to the English site. The language toggle sits in the top app bar on every page, so correcting it is one click, and both locales are indexed separately so most visitors arrive on a deep link in their own language rather than at `/`. Deterministic beats clever here, and it makes the stated constraint literally true instead of approximately true.
  — Cost if wrong: if the client reports English-speaking visitors complaining they always land on Indonesian, flip it to true (or add a cookie-only variant). One line, no structural impact.

Task 4: minor (deferred, but ACTIONED as process): reviewer notes each of the ~11 remaining pages must independently remember `await params` then `setRequestLocale(locale)`, with no compile-time enforcement — a forgotten call silently makes that route dynamic. Not fixed in code (a wrapper would be premature abstraction for a one-line call), but added to the standing dispatch checklist for Tasks 9-15 and to the controller's own build-output check after each page task.
Task 4: minor (deferred): routing.ts had no `as const` marker of its own; moot once R13 lands.
Task 4: fix round 1/5 (2 addressed, 0 open; commits ce0f70b..3de6a78). Narrowing survived (routing.locales[0] still 'id'|'en'); both curl probes to / now return location: /id including the Accept-Language: en-US case; SSG classification preserved; types.ts untouched; only 1 file changed.
Task 4: complete (commits fbb9602..3de6a78, review clean after 1 fix round)

Task 5: BASE = 3de6a78. Dispatching implementer on sonnet — the brief carries complete code, but the Button component is a discriminated union over `href` whose destructuring may not typecheck as written, which needs judgment rather than transcription.
Task 5: carries pre-flight Ruling R2 — Chip.tsx is DROPPED from this task. The brief still contains it.
Task 5: implementer reported DONE (commit 87cb7a2). typecheck/lint/build clean, 28/28 tests, both locales still prerender.
Task 5: implementer found a real defect IN MY PLAN — `home`, `school` and `flight` had byte-identical outlined/filled path pairs in the brief. Since the bottom-nav active state reads partly through the icon filling, 3 of the 5 nav icons would have shown no fill change at all, with a green build. It authored genuine hollow outlined variants and verified distinctness by rendering all 36 paths in a browser and comparing getBBox() dimensions — measurement, not assertion. This is exactly the failure class I asked it to hunt.
Task 5: controller verified two facts for the reviewer — `Card.as` has 0 consumers anywhere in the plan and `Badge.tone` has 0 (both <Badge> usages pass no tone); both appear ONLY in my Interfaces prose at plan lines 2124/2126. Also confirmed every external URL (wa.me, mailto, tel) is rendered with a plain <a>, never through Button/Card, so the implementer's concern about next-intl Link prefixing an external href is not exercised anywhere in the plan.
Task 5: task review dispatched over 3de6a78..87cb7a2 (sonnet).
Task 5: review returned NEEDS FIXES — 0 Critical, 2 Important, 3 Minor, 2 warning items.
Task 5: reviewer independently verified the icon claim by computing shoelace signed areas of each outer/inner path pair (opposite signs = genuine nonzero-fill-rule holes). It did not take "confirmed distinct" on trust.
Task 5: warning items RESOLVED by controller. (1) The global prefers-reduced-motion block exists at globals.css:68-75 and neutralises animation-duration and transition-duration project-wide. (2) Accordion trigger height = py-5 (40px) + text-title-large content (20px x 1.25 = 25px) = 65px, comfortably over the 48px touch target.

Ruling R16 (review finding 1, Important — ACCEPTED after independent verification): remove horizontal padding from Button's BASE string and give every variant its own explicit px-*.
  — Why: I did not take the reviewer's Tailwind-cascade claim on trust; I built a probe page using `px-5 px-1` together and read the compiled stylesheet. `.px-1` lands at byte offset 27123 and `.px-5` at 27302, so px-5 is declared later and wins regardless of className order. Every `variant="text"` button was therefore rendering 20px of horizontal padding instead of 4px — the variant's entire visual distinction was inert, with a green build and passing tests. Global Constraints amended so no later task reintroduces a base-vs-variant conflict on the same property.
  — Cost if wrong: purely visual; revert by moving padding back into BASE.

Ruling R15 (review finding 2 + Card minor — ACCEPTED, going further than the reviewer proposed): delete `Badge.tone` and `Card.as` outright rather than making `tone` optional.
  — Why: the reviewer suggested defaulting `tone` to 'gold'. But both props exist only because my Interfaces prose named them; neither has a single consumer anywhere in the plan (Card is used 3x, never with `as`; Badge 2x, never with `tone`). Defaulting a required prop fixes the compile break while keeping dead API. Deleting fixes both. `tone` as shipped was also strictly broken — required with no default, so it would have failed tsc at its very first call site in Task 9.
  — Cost if wrong: if a second badge style is ever needed, add the prop then with a real consumer.

Ruling R17 (standing, applies to Tasks 6-16): where a brief's "Interfaces / Produces" prose disagrees with its code sample, the code sample is authoritative and the discrepancy must be reported, not silently resolved. Added to plan Global Constraints.
  — Why: this drift has now produced a defect three times running. Left unstated it would produce eight more.
  — Cost if wrong: an interface genuinely intended by the prose gets deferred until a task actually needs it. That is the correct default anyway.

Task 5: minor (deferred): Button's button branch forwards only type/onClick/disabled, so an icon-only button has no way to supply aria-label. No planned consumer needs one; flagged for whichever task first does.
Task 5: minor (deferred): Button/Card href always routes through next-intl Link; no plan consumer passes an external URL. Verified — all wa.me/mailto/tel links use a plain <a>.
Task 5: fix round 1/5 (2 addressed, 0 open; commits 4b5f00a..28ce77f). Re-reviewer also ran the property-by-property audit of BASE vs VARIANTS and confirmed no other same-property Tailwind conflict remains — the class of bug, not just the instance.
Task 5: complete (commits 3de6a78..28ce77f, review clean after 1 fix round)

Task 6: BASE = 28ce77f. Dispatching implementer on sonnet — navigation chrome is integration work with real behavioural and layout requirements, not transcription.
Task 6: this is the task the user explicitly asked for (mobile bottom nav behaving like an app). Dispatch carries the M3 navigation-bar specifics plus a design question about the ICONS map typing that the brief gets wrong.
Task 6: implementer reported DONE (commit 70f7766). Found and fixed 5 defects during its own browser verification, all of which built clean: CTA visible at every width (Button base `inline-flex` beat a `hidden lg:inline-flex` passed via className — the Tailwind cascade trap again, fixed structurally with a wrapper); "Studi ke Luar Negeri" wrapping in the TOP bar at 768px; skip link scrolling without moving focus (a div is not focusable — fixed with tabIndex={-1}); LocaleToggle at 36px under the 48px touch target; temporary stub pages used then deleted.
Task 6: controller ran its own browser verification (the client asked for this feature by name, so "it builds" proves nothing here).
  PASSED at 768px: six top-bar links on ONE row (distinctRows=1, wrapped=false), bottom nav hidden, no horizontal scroll, footer in 3 columns. This is the original site's defect #2 confirmed fixed at the exact breakpoint.
  PASSED at 375px: bottom nav 82px tall, pill indicator on the active item, icons render, aria-current present, brand palette and Archivo correct.
  PASSED: /en serves html lang="en" with English labels, so ruling R14 (localeDetection: false) did not break the English route.

Ruling R18 (controller finding, NOT reported by the implementer): the bottom-nav labels are too long and must get their own short forms.
  — Measured at 375px, slot width 75px: "Studi ke Luar Negeri" renders 75px wide across TWO lines (labelH 29 vs lineHeight 14) while every other label is one line, so its icon+label block is taller and the label baselines no longer align. In English "Study Abroad" is 74px in a 75px slot — one pixel of margin, so it survives 375px by luck and wraps on anything narrower.
  — Why the implementer missed it: it verified the TOP bar wrapping at 768px (and fixed a real bug there) but checked the bottom nav for indicator/icon/label-weight behaviour rather than for label geometry. The label text comes from `nav.*`, which I wrote for the top bar where the long form reads better.
  — Fix: a separate `navShort` message namespace used only by the bottom nav — ID: Beranda / Program / Luar Negeri / Galeri / Kontak; EN: Home / Programs / Abroad / Gallery / Contact. Keep the long forms in `nav.*` for the top bar and footer, where they are clearer and fit.
  — Cost if wrong: if "Luar Negeri" reads as too terse to the client, any short phrase fits as long as it stays one line at 320px. Label text only, no structural impact.
Task 6: holding R18 to combine with the task review's findings into a single fix dispatch rather than running two rounds.
Task 6: review returned NEEDS FIXES — 0 Critical, 3 Important, 5 Minor, 1 warning item.

Ruling R19 (review finding 1, Important, plan-mandated — ACCEPTED and verified by controller): move the bottom-bar clearance so it applies to the whole document, not just #main.
  — Verified empirically in the browser at 375px: at maximum scroll (atMaxScroll true), the footer's "© 2026 Yayasan Hanna Filia Internasional" line has bottom=772 while the fixed bar's top is 731 — 42px behind the bar, with no further scroll available. 82px of the footer is permanently unreachable.
  — Root cause is mine: the brief's Step 6 puts `pb-20` on #main, which precedes <Footer>. BottomNav is position:fixed so it occupies no flow space, and nothing after #main compensates.
  — I had this on screen in my own first screenshot (the address line was visibly clipped) and read past it. The reviewer found it by reasoning about the DOM structure rather than by looking. Seeing is not verifying.
  — Fix: clearance moves to <body> as pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0, and the pb-20 on #main is removed so the padding is not applied twice.
  — Cost if wrong: a wrapper div around main+footer is the alternative if body-level padding interacts badly with anything later.

Ruling R20 (review finding 2, Important — ACCEPTED): the compensation must include env(safe-area-inset-bottom), not a flat 80px.
  — The bar renders at 80px + env(safe-area-inset-bottom) on notched devices because the inset padding sits on the <nav> and stacks after the 80px row. A flat pb-20 is short by exactly the inset on every iPhone with a home indicator. Folded into R19's single change.

Ruling R21 (review finding 3, Important — ACCEPTED): LocaleToggle needs a minimum width, not only a minimum height.
  — The earlier fix added min-h-12 only. With px-3 and two-letter labels the buttons render roughly 42-46px wide, under the 48px the constraint requires on BOTH axes. The implementer's own verification checked height and stopped there.

Task 6: minor (folded in, one line, prevents recurrence): document on Button's BASE that its unconditional `inline-flex` cannot be overridden through a consumer's className. This exact hazard has now cost time twice — Task 5's px-* and Task 6's CTA visibility.
Task 6: minor (deferred): SkipLink is marked 'use client' but uses no client-only API; unnecessary client JS.
Task 6: minor (deferred): TopAppBar and BottomNav share the same nav aria-label; safe only because display:none removes the inactive one from the a11y tree.
Task 6: minor (deferred): pathname.startsWith(href) has no segment-boundary check; safe for current ROUTES.
Task 6: warning item (build legend still SSG) — will be confirmed by the controller after the fix round rather than now.

OPERATIONAL NOTE (applies to every remaining task): `npm run build` and `npm run dev` share the .next directory. Running a build while a dev server is live corrupts the dev server's cached chunks, producing "Cannot find module './vendor-chunks/next-intl.js'" and "__webpack_modules__[moduleId] is not a function" 500s that look like application bugs and are not. Both the Task 6 implementer and the controller hit this. Remedy: rm -rf .next and restart. Dispatches from Task 7 on must tell implementers to stop the dev server before building, or to build first and browse second.
Task 6: fix round 1/5 (4 addressed + 1 doc comment; commits 70f7766..f573b89). Controller independently re-measured in a browser at 375px and confirms every claim: footer last line bottom 692.1 vs bar top 730.5 = 38.4px CLEAR at atMaxScroll (was 42px BEHIND the bar); LocaleToggle exactly 48x48; all five bottom-nav labels single-line, "Luar Negeri" 62.4px. The implementer's reported numbers match mine exactly, so its report was accurate.
Task 6: scoped re-review dispatched over 70f7766..f573b89 (haiku). Dev server stopped first to avoid the .next collision documented above.
Task 6: re-review verdict — all 5 findings ADDRESSED, no new breakage, no out-of-scope observations. Confirmed pb-20 was REMOVED from #main (not duplicated), md:pb-0 present, navShort added to BOTH message files with identical key paths, nav.* untouched, Button change comment-only.
Task 6: complete (commits 28ce77f..f573b89, review clean after 1 fix round)

Task 7: BASE = f573b89. Dispatching implementer on sonnet — the polymorphic `as` prop's ref typing under strict with no `any` is genuine type work, not transcription.
Task 7: implementer reported DONE (commit 94da097). typecheck/lint/build clean, 28/28 tests, /[locale] still SSG.
Task 7: implementer found the brief's `ElementType` polymorphic ref to be a REAL type hole under strict — it accepted a bogus ref and an unknown prop — so it branched Reveal to concrete div/section/li elements sharing one contravariant callback ref instead of reaching for `any`. Advisory R5 was correct and it verified the hole rather than assuming it.
Task 7: implementer honestly disclosed it could NOT toggle Chrome's real prefers-reduced-motion emulation in this sandbox, so its opacity measurement was mechanism-level rather than a literal OS toggle.
Task 7: controller CLOSED that gap by compositional verification instead: globals.css:68-75 contains `[data-reveal] { opacity: 1 !important; transform: none !important; }` inside the reduced-motion media query, and Reveal.tsx renders `data-reveal=""` on all three branches (section:73, li:81, div:88). The inline style sets `opacity` WITHOUT !important, so the stylesheet's !important rule wins. Both halves present and composition sound — the safety net is armed. Also confirms the `as="li"` branch Task 12 needs exists.
Task 7: implementer added `autoPort: true` to .claude/launch.json after a port-3000 conflict. Dev tooling only, no runtime impact.
Task 7: task review dispatched over f573b89..94da097 (sonnet).
Task 7: review returned Approved — 0 Critical, 1 Important (plan-mandated), 2 Minor.
Task 7: reviewer independently REPRODUCED the ElementType type hole (a bogus `(x: string) => {}` ref plus an unknown `data-bogus-prop-xyz` typechecked with zero errors), then reasoned through why the concrete-union replacement is genuinely sound rather than a relocated hole — ref-callback contravariance makes an HTMLElement-typed callback safely assignable to all three concrete slots. It also traced CountUp's easing arithmetic and confirmed it lands exactly on target (p clamped by Math.min, so at p=1 the value is exactly `to`).

Ruling R22 (review finding, Important, plan-mandated — PARTIALLY ACCEPTED; I deliberately rejected the larger fix I first designed):
  The finding is real: Reveal ships opacity:0 in the server-rendered HTML, so if JS never hydrates the content is permanently invisible. Three failure modes — JS disabled, slow bundle, hydration failure elsewhere on the page.
  I first designed a full replacement using CSS scroll-driven animations (`animation-timeline: view()`) with an @supports fallback to always-visible. It removes the JS dependency entirely, is less code than the current component, and keeps the same props so nothing downstream changes. I rejected it: view() timelines are SCRUBBED by scroll position, so reveals become reversible — scrolling back up re-hides content. That is a behaviour change affecting every visitor, traded for a failure mode affecting a minority. Wrong trade, and the fact that it kept growing was the signal.
  What ships instead, proportionate to each risk:
    (a) a <noscript> style override in the layout, which fully covers JS-disabled;
    (b) a new Global Constraint — the first screenful of every page renders OUTSIDE Reveal, so a slow bundle means "below-the-fold content appears late", never "the page is blank on arrival". This matters specifically because this audience arrives on Indonesian mobile data. Already true of the plan's heroes and PageHero; now stated so Tasks 9-15 cannot regress it.
    (c) residual risk (bundle loads but hydration fails) accepted and recorded for the final review.
  — Cost if wrong: if the client reports blank sections in the wild, the CSS scroll-driven version is the escape hatch, accepting reversible reveals.

Task 7: minor (folded into the fix): `setRef` is a new function identity every render, so React detaches and reattaches the ref on every re-render across every Reveal on the page. One-line useCallback fix while the file is open.
Task 7: minor (deferred): .claude/launch.json gained autoPort outside the brief's file list; disclosed, dev-tooling only.
Task 7: fix round 1/5 (2 addressed; commits fa42064..4192500). Implementer's phrasing "measured opacity with CSS override applied" was ambiguous about whether JS was genuinely disabled, so the controller verified it a different and decisive way: curl the dev server and inspect the raw server HTML, since curl executes no JavaScript and therefore receives exactly what a no-JS browser receives. Confirmed the <noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript> block is present in the markup, positioned before the skip link, and that real content (the hero headline) is in the HTML rather than a JS shell. Fix 1 genuinely verified.
Task 7: scoped re-review dispatched over fa42064..4192500 (haiku).
Task 7: re-review verdict — both findings ADDRESSED, no new breakage. noscript confirmed as first child of <body> at layout.tsx:78-80; useCallback dep [ref] confirmed stable because useRef returns a stable object across renders.
Task 7: complete (commits f573b89..4192500, review clean after 1 fix round)

Task 8: BASE = HEAD below. Dispatching implementer on sonnet — a download script with retry/skip semantics plus a 28-entry manifest plus two components plus test extensions is integration work.
Task 8: implementer reported DONE (commit de38dd5). 30/30 tests, 22/22 images downloaded first run, all 22 skipped on the second run (idempotency confirmed), deliberate-breakage on the manifest test observed failing then reverted.

Ruling R23 (controller — REVERSING a change the implementer made in good faith): the manifest's `ratio` is the SLOT ratio (design intent), not the file's native ratio. Restore the plan's 4/3 and 16/9 values, and swap gallery-graduation's photo instead of declaring its slot portrait.
  — I verified the implementer's change: it made all 22 declared ratios match the downloaded files exactly, producing `800/507` for one slot and `2/3` PORTRAIT for gallery-graduation. Its stated reason — "so object-cover doesn't crop oddly" — misreads what object-cover is for: it always crops to fill, and a 3:2 photo in a 4:3 slot loses 11% of its width without distortion, which is invisible.
  — Why the reversal matters more than aesthetics: encoding each placeholder's accidental dimensions breaks the promise the README makes to the client. If the slot ratio tracks whatever file happens to sit there, then every photo they swap in shifts the layout — the exact opposite of "save your photo over the file of the same name and change nothing else". `800/507` is also not a design token anyone would choose; it exists only because one Unsplash file was that shape.
  — The one genuine problem in the implementer's finding: gallery-graduation really is portrait (1600x2400), and cropping a portrait into a landscape slot cuts a person's head and feet. The fix is a different photo, not a portrait slot. I downloaded and measured the spares: hpRGrfOIybc is 1600x1067 landscape (graduates throwing caps) — usable. iggWDxHTAUQ is also landscape as backup. LLfRMRT-9AY is square-ish, rejected.
  — images.ts must document that `ratio` means the slot, so nobody "corrects" it back.
  — Cost if wrong: if a client photo is badly cropped by a slot ratio, change that one slot's ratio deliberately. That is a design decision made once, not an accident of what Unsplash served.

Ruling R24 (controller — my own earlier ruling was over-read): add `images` to the CONTENT map in test/content.test.ts so the manifest's 28 alt pairs are actually walked.
  — The implementer left them unwalked because R4 said only two test blocks were to be appended. R4 governed IMPORT PLACEMENT (imports at the top, ESM requirement), not the contents of the CONTENT map. My wording was ambiguous enough that a careful agent read it as a prohibition, and it disclosed the resulting coverage gap rather than hiding it. 28 alt objects x 2 languages = 56 localized values currently unchecked.
  — Cost if wrong: none identified.

Task 8: task review dispatched over 4192500..de38dd5 (sonnet), with both rulings passed as context for the reviewer to challenge.
Task 8: review returned NEEDS FIXES — 0 Critical, 3 Important, 3 Minor, 2 warning items. Reviewer AGREED with both R23 and R24 after testing them adversarially: it opened the actual JPEGs looking for a counterexample where a designer-chosen slot ratio crops badly, found gallery-phonics the closest case, measured the crop at ~7.75% per side (clipping at most a shoulder at the frame edge), and concluded the reversal holds. It confirmed gallery-graduation is the one genuine exception and that it is a photo-selection problem, not a ratio problem.
Task 8: warning items RESOLVED by controller from the plan. (1) Monogram is aria-hidden, which is correct only if the teacher's name is adjacent accessible text — Task 11 renders `<p>{person.name}</p>` in the same card (plan line 4462), so no information is dropped. (2) hasPhoto has no consumer in this diff but is imported and used by Task 11 (plan lines 4419, 4449) — not dead code.

Ruling R25 (controller — refining my own R23 fix after looking at the photographs): use `iggWDxHTAUQ` for gallery-graduation, not `hpRGrfOIybc` as I first proposed.
  — I fetched and viewed both. hpRGrfOIybc is landscape and crops fine, but it shows a grand European building with CYRILLIC signage clearly legible on the facade. Under a gallery caption reading "Graduation" on a Batam language school's site, an identifiably Russian university reads as wrong rather than as neutral filler.
  — iggWDxHTAUQ is a sea of mortarboards photographed from behind: landscape 1600x1066, no identifiable location, no signage, and no recognisable faces. The absent faces matter beyond composition — a placeholder with visible faces under a Hanna Filia caption implies those are Hanna Filia students, which is the same misrepresentation problem that put monograms on the teacher cards.
  — Cost if wrong: any landscape graduation photo works; this is one manifest line.
Task 8: fix round 1/5 (5 addressed; commits de38dd5..06f666a). Controller verified independently: declared ratios are now exclusively 4/3 (13), 16/9 (9) and 1/1 (6) with no accidental values remaining; gallery-graduation is 1600x1066 LANDSCAPE; all 22 src paths resolve to files that exist. Localized-value count rose 211 -> 239, and blanking building-front.alt.en made the suite fail naming that exact path, so the new alt coverage is real rather than nominal.
Task 8: scoped re-review dispatched over de38dd5..06f666a (haiku).
Task 8: re-review verdict — all 5 findings ADDRESSED, no new breakage. Confirmed the gallery-graduation alt was genuinely rewritten from singular to crowd wording, the slot-vs-file comment is explicit ("Do not 'correct' ratio to match whatever placeholder happens to be sitting in the slot"), and the content-type guard routes a mismatch through the same failure path as an HTTP error.
Task 8: complete (commits 4192500..06f666a, review clean after 1 fix round)

Task 9: BASE = 06f666a. Largest brief in the plan (581 lines) — ten section components plus the homepage assembly. Dispatching on sonnet.
Task 9: dispatch carries the full accumulated ruling set, because this is the first task that consumes almost every component built so far: R2 (no Chip), R3 (imageKey cast), R15 (Badge takes only children, Card has no `as`), R17 (code sample beats Interfaces prose), R22 (first screenful outside Reveal), R23 (ratio is the slot), plus the Tailwind cascade rule, the setRequestLocale requirement, and the .next/dev-server collision note.
Task 9: implementer reported DONE_WITH_CONCERNS (commit b719c34). 30/30 tests, typecheck/lint/build clean, SSG preserved. It found and fixed two REAL overflow bugs during its own verification: a LevelLadder grid blowout at 320-375px, and a 3px TopAppBar overflow at exactly 768px that was a pre-existing Task 6 defect my own browser check had missed (my check ran before the homepage sections existed, so the page was shorter and the scrollbar did not narrow the viewport).
Task 9: implementer's central concern was WRONG, and the correction matters. It reported that scroll-reveal and reduced-motion "could not be verified" because its Browser pane had document.hidden === true and it observed a bare IntersectionObserver never firing in 9s.
  Controller re-tested in its own pane: document.hidden is ALSO true here, yet IntersectionObserver fires correctly — of 12 [data-reveal] elements, the 4 in the viewport measured opacity 1 and those outside measured 0. So IO is not gated on document visibility; the implementer's probe was faulty, not the environment.
  Reduced-motion then verified end-to-end on the real homepage: injecting the exact pair of declarations the media block carries (the transition-duration kill plus the [data-reveal] opacity override) drove ALL 12 reveals to opacity 1, with "1" the only distinct computed value.
  My own first attempt at that probe returned a false negative — I injected only the opacity rule, omitted the transition-duration override, and sampled 100ms in, catching an element mid-transition at 0.793. The test was wrong, not the code. Worth recording because the failure mode looked exactly like a real defect.
Task 9: controller re-measured overflow after the fixes at real emulated viewports (not by constraining documentElement, which produces artefacts): 320px, 768px and 1440px all report scrollWidth === clientWidth, overflow 0.
Task 9: task review dispatched over 06f666a..b719c34 (sonnet).
Task 9: review returned NEEDS FIXES — 0 Critical, 2 Important, 3 Minor.

Ruling R26 (review finding 1, Important, plan-mandated — ACCEPTED; more severe than the reviewer graded it): add an inverse outlined variant to Button instead of overriding colours through className.
  — The reviewer found that page.tsx:41 and HfosTeaser.tsx:26 pass `className="border-on-primary text-on-primary"` to Button's `outlined` variant, which already sets `text-on-surface border-on-surface`. Same properties, same element, so Tailwind's compiled-stylesheet order decides.
  — I verified in the freshly built CSS: .border-on-primary at offset 25584 vs .border-on-surface at 25640, and .text-on-primary at 33371 vs .text-on-surface at 33755. The on-surface classes are declared later and win both times.
  — Severity is higher than "wrong colour". Intended on-primary #FFFDFA on primary #A21C42 is 7.44:1; what actually ships is on-surface #1C1A19 on crimson at 2.30:1, which fails WCAG AA (4.5) and also fails the 3:1 large-text floor. Two prominent CTAs, one of them in the hero.
  — The sting: test/tokens.test.ts passes, because every individual token pair is fine. The test can only see tokens, not compositions. An automated check that cannot fail on this class of defect is exactly why the review seat exists.
  — This is the THIRD form of the same cascade trap on this project (Task 5 px-*, Task 6 display/inline-flex, now border-color/color). Ruling 8 was already in the dispatch and was still hit, because the brief's own code sample does it. Global Constraints now name the Button-colour case explicitly.
  — Cost if wrong: one extra variant on a component with two real consumers. Not speculative.

Ruling R27 (review finding 2, Important — ACCEPTED): give PathFinder's recommendation card an aria-live region and associate it with the buttons.
  — Pressing an option updates aria-pressed on that button, but the recommendation appears elsewhere on the page with no role, id, or live region. A screen-reader user hears "pressed" and is told nothing about the content that just appeared, and would have to tab blindly past the whole option grid to find it.

Task 9: minor (folded in): idThousands applies Indonesian "." grouping in BOTH locales, so the English homepage renders "4.200+", which an English reader parses as four point two. Replacing the hand-rolled helper with Intl.NumberFormat keyed on the active locale is both correct and less code.
Task 9: minor (folded in): PathFinder's `program!` non-null assertion is safe today only because CHOICES and programs happen to stay in 1:1 sync, with nothing enforcing it.
Task 9: minor (deferred): the Section primitive ships unconsumed — every homepage section inlines its own container, matching the brief's code samples. Tasks 10-15 consume it.
Task 9: fix round 1/5 (4 addressed; commits 556ec3b..2140f5e). Controller verified at source level: Button gained an `outlinedInverse` variant (bg-transparent text-on-primary border-on-primary px-5); BOTH call sites now use it with no colour classes in className, so the override path is removed rather than patched; PathFinder has aria-controls pointing at an always-mounted `#pathfinder-result` with aria-live="polite" and a comment explaining why it is always mounted; Intl.NumberFormat replaced idThousands; zero `program!` assertions remain. Implementer measured the CTA at 7.44:1 against #A21C42, matching the intended value and up from the 2.30:1 that was shipping.
Task 9: scoped re-review dispatched over 556ec3b..2140f5e (haiku).
Task 9: re-review verdict — all 4 findings ADDRESSED, no new breakage. Confirmed outlinedInverse is a genuine fifth variant supplying its own px-5 (BASE still carries no colour or horizontal padding, so the cascade trap is not reintroduced), min-h-12 intact, the aria-live region is ALWAYS mounted with only the inner card conditional, Intl.NumberFormat receives the active locale, and the `!` removal became an explicit null guard rather than a silent swallow.
Task 9: complete (commits 06f666a..2140f5e, review clean after 1 fix round)

Task 10: BASE = HEAD below. Dispatching on sonnet — two page types plus generateStaticParams across 10 routes.
Task 10: NOTE — this brief's own code sample contains `imageKey={program.imageKey as never}`, which ruling R3 corrects to `as ImageKey`. Carried explicitly in the dispatch.
Task 10: implementer reported DONE (commit 7ebc2a3). 30/30 tests, typecheck/lint/build clean. 16 overflow checks (2 page types x 4 widths x 2 locales) all report scrollWidth == clientWidth. Programme rows confirmed stacking to one column below 768px and four-column above — the original site's worst layout defect, not reproduced. All ten programme routes static in the build legend with .html files present under .next/server/app/{id,en}/programs/. Unknown slug returns a real HTTP 404.
Task 10: implementer hit the same hidden-Browser-pane artefact seen in Task 9 (blank screenshots mid-run) and correctly diagnosed it as tooling rather than a page bug, completing those checks via get_page_text and getBoundingClientRect instead. That is the right response; the Task 9 implementer drew the opposite conclusion from the same symptom and was wrong.
Task 10: task review dispatched over 2140f5e..7ebc2a3 (sonnet).
Task 10: controller decision — NOT parallelising the next implementer with this review. Task 11 does not consume anything from Task 10, so it would be safe on file-conflict grounds, but interleaved commits would muddle the diff ranges the review packages depend on, and the ledger is the recovery map after a compaction. Clean ranges are worth more than the wall-clock saving.
Task 10: review returned NEEDS FIXES — 0 Critical, 1 Important (plan-mandated), 2 Minor.
Task 10: reviewer confirmed the headline risk is genuinely fixed, by reading the classes rather than trusting screenshots: the row Link carries NO base grid-cols, only md:grid-cols-[...], so below 768px CSS falls back to a single implicit column and the row truly stacks. It also hand-traced the summary-cell divider arithmetic through both the 2-col and 4-col layouts and found no stray border, and confirmed notFound() precedes any dereference of the possibly-undefined programme.

Ruling R28 (review finding, Important, plan-mandated — ACCEPTED): every page's generateMetadata must declare its own `alternates`.
  — The reviewer verified this against Next's actual mergeMetadata source rather than inferring it: metadata merges per key, so a page whose object omits `alternates` inherits the root layout's unchanged. The programmes list page therefore declares the HOMEPAGE as its canonical URL and its hreflang targets — a duplicate-content signal, with no error, no warning and no visible difference.
  — I checked how far this spreads. Of the four pages shipped so far: layout has alternates; the detail page has them; the programmes list page is missing them (the real defect); the homepage is also missing them but inherits `canonical: /${locale}`, which happens to be correct for the homepage — right by accident, not by intent. Every remaining page brief (about, teachers, study-abroad, gallery, articles, contact) already declares them, so the defect is isolated to one page.
  — Fix covers both: add alternates to the programmes list page, and make the homepage's explicit rather than leaving it to inheritance. Global Constraints updated so Tasks 11-15 cannot regress it.
  — Cost if wrong: none. Explicit per-page canonicals are correct regardless.

Task 10: minor (deferred): a one-line list-row class string duplicated across the two pages; not worth extracting at two call sites.
Task 10: minor (deferred): the "All programs" back-link is an unpadded inline link under 48px, consistent with the same pattern already accepted in Task 9's ProgramGrid rather than a new deviation.
Task 10: fix round 1/5 (1 addressed + 1 preventive; commits f400156..519b48e). Controller verified against the PRERENDERED HTML rather than the source: canonical is /id/programs, /en/programs and /id respectively on the three pages, and both hreflang alternates are present on the programmes list pointing at the two programme URLs. All four pages with generateMetadata now declare their own alternates.
Task 10: note — my first hreflang grep returned nothing and looked like a half-applied fix. Next emits the attribute as `hrefLang` (camelCase) in its rendered output, so a lowercase `hreflang` pattern misses it. Third time in this run that my own measuring instrument produced a false negative that resembled a product defect (the others: injecting only half the reduced-motion rule, and constraining documentElement instead of the viewport). Check the instrument before believing the reading.
Task 10: scoped re-review dispatched over f400156..519b48e (haiku).
Task 10: re-review verdict — finding ADDRESSED, root layout confirmed untouched, detail page's existing alternates undisturbed, nothing outside metadata changed.
Task 10: complete (commits 2140f5e..519b48e, review clean after 1 fix round)

Task 11: BASE = HEAD below. About + Teachers pages. Dispatching on sonnet — two pages, one with the Monogram/PhotoSlot fallback branch that carries the misrepresentation decision.
Task 11: implementer reported DONE_WITH_CONCERNS (commit 8455303). 30/30 tests, all four commands clean, no horizontal overflow at 320/375/768/1440 on either page in either locale, both new routes static.
Task 11: the photograph-fallback branch was EXERCISED for the first time in the project. Pointing teacher-1.src at an existing image switched only that card to a photograph while the other five stayed monograms; reverting restored all six. Until now only the monogram half of hasPhoto() had ever run — the half that matters to the client (drop in a photo, the card changes itself) was untested code that merely typechecked.

Ruling R29 (implementer's concern, which is MY defect from Task 6 — ACCEPTED, and my earlier verification was wrong): the bottom-nav clearance is 1.5px short, and the fix is to remove the duplicated constant rather than add 1.5px.
  — Arithmetic: the bar is `h-20` (80px) plus `border-t-[1.5px]` = 81.5px. The body reserves `pb-[calc(5rem+env(safe-area-inset-bottom))]` = 80px. Shortfall 1.5px.
  — My Task 6 verification measured the wrong element. I measured the last text SPAN's bottom (692.1 against a bar top of 730.5, so 38.4px clear) and passed it. That was true and irrelevant: the text was never at risk; the footer ELEMENT's bottom edge is what overlaps.
  — The deeper defect is that the layout contract "body reserves the bar's height" is false — it reserves the bar's CONTENT height. 1.5px is nearly invisible today, but changing the border width to 2px or 4px widens the gap with nothing to catch it.
  — Fix: define the bar height once as a CSS custom property covering content + border, and consume it in both the nav and the body padding, so the two cannot drift.
  — Cost if wrong: none identified; this strictly removes a duplicated magic number.
Task 11: the implementer spawned a background-task chip for this rather than fixing out of scope, which was the right call. Controller withdrew the chip since it is being fixed inside this run.
Task 11: task review dispatched over 519b48e..8455303 (sonnet).
Task 11: review returned Approved — 0 Critical, 0 Important, 1 Minor, 1 warning item. All four named risks resolved under inspection: the portraitPending note lives only in the monogram branch so it cannot survive alongside a photograph; Reveal's wrapper IS the grid item so align-items:stretch propagates and Card's h-full resolves (six cards measured 570px each); Monogram's aria-hidden is correct because the name renders as a sibling <p> in the same Card; and the About page uses the shared Section primitive rather than reimplementing the container.
Task 11: warning item resolved by controller with git show --stat (below) — the commit touched only the two new page files, so the content modules and message files were genuinely unchanged.
Task 11: minor (deferred): generateMetadata boilerplate repeats across pages; consistent with the established pattern, not introduced here.
Task 11: complete (commits 519b48e..8455303, review clean, no fix round)
R29 fix applied (commit 74ce5f0): --hf-bottom-nav-h: calc(5rem + 1.5px) added to globals.css :root, consumed by the body padding and mirrored as min-h on the nav.
R29 verification: the implementer reported one page clearing by 0.09px and another still overlapping by 0.27px, calling the second "sub-pixel overlap within rounding". That is the kind of phrase that can hide a residual off-by-something, so the controller measured the thing that actually settles it rather than the symptom: bodyPaddingBottom is 81.5px, the nav's rendered height is 81.5px, difference exactly 0 — the contract now holds precisely. Where the footer's edge lands within +/-0.5px is fractional scroll-offset rounding, which no padding value controls. The implementer's assertion was right; now it is verified.
R29: closed. Ledger entry for Task 6's original mis-verification stands as the record of how it was missed.

Task 12: BASE = HEAD below. HFOS page plus the animated RouteMap SVG. Dispatching on sonnet — this is the first consumer of useInView with a non-HTML element (SVGSVGElement) and of Reveal's `as="li"` branch, both of which exist but have never been exercised.
Task 12: implementer reported DONE (commit e3877f0). 30/30 tests, all commands clean, no overflow at any of the four widths in either locale. Both previously-unexercised code paths worked first time: useInView<SVGSVGElement> needed no change, and the timeline renders as a real <ol> with six <li> children, confirmed by DOM read in both locales. Reduced-motion stroke-dashoffset settled to 0px on all five paths, measured after injecting the COMPLETE globals.css reduced-motion block (the lesson from the earlier half-injection false negative was applied).

Ruling R30 (implementer's flagged judgment call — MY ERROR, reverting): the final CTA section returns to the plan's surface tone with variant="tonal".
  — My dispatch asserted "This page has a crimson (bg-primary) hero and a crimson CTA area". The hero is crimson; the CTA area is NOT. The plan specifies `<Section bordered={false}>` (default tone="surface") with `variant="tonal"`. The implementer reasonably trusted my factual claim and shipped tone="primary" with outlinedInverse, then flagged it for sanity-check — exactly the right response.
  — This is a hazard specific to context-rich dispatches: every extra sentence I write is treated as authoritative, and correctly so. My RULINGS get verified against the code; my incidental factual claims do not. A wrong sentence is more dangerous than a missing one.
  — Reverting rather than keeping the change, because it was made on a false premise rather than a design argument, and because the surface+tonal CTA matches the programme detail page and the homepage TrialCta. Two large crimson blocks on one page also breaks the page's rhythm.
  — Cost if wrong: if the client wants a heavier conversion block on this page, that is a deliberate design decision to make once, not a side effect of my typo.

Task 12: implementer's second judgment call ACCEPTED and it improves on my plan: my brief hardcoded an English LABELS table inside RouteMap, violating the no-hardcoded-English rule. It replaced it with a lookup into hfosCountries keyed on the English name, throwing if an entry is missing — so a mismatch fails the static build loudly instead of rendering a blank label. The five English strings that remain are lookup keys, not user-visible text, and it documented that.
Task 12: task review dispatched over 74ce5f0..e3877f0 (sonnet).
Task 12: review returned Approved — 0 Critical, 0 Important, 2 Minor (one of which is the R30 revert I already own).
Task 12: the reviewer answered the question I actually asked — it explained the reduced-motion mechanism rather than accepting the measured 0px. globals.css's `transition-duration: 0.01ms !important` is an author-important declaration, which beats the paths' non-important INLINE `transition: stroke-dashoffset 1600ms`. transition-property and transition-delay are untouched by that block, so once inView flips the paths still animate to 0, just near-instantly — landing DRAWN rather than frozen at 700. The measured number is the only possible outcome of that cascade, not a coincidence of timing.
Task 12: reviewer also supplied evidence for R30 that I did not have — programs/[slug]/page.tsx uses the identical `<Section bordered={false}>` + `variant="tonal"` shape in the same final-CTA position, so the revert restores an established sitewide pattern rather than merely undoing my error. It also confirmed outlinedInverse stays used in two other places, so the revert does not orphan the variant.
Task 12: minor (folded into the fix): the SVG's decorative <g> groups have no explicit aria-hidden inside a role="img" element. Modern browsers suppress descendants under role="img", so this is belt-and-braces rather than a live defect.
Task 12: fix round 1 dispatch terminated by an API rate limit before touching anything. Working tree verified clean, HEAD still e3877f0, CTA section still tone="primary"/outlinedInverse. Re-dispatching unchanged.
Task 12: fix round 1/5 (2 addressed; commits e3877f0..ddef479). CTA reverted to Section bordered={false} + variant="tonal"; aria-hidden added in RouteMap.

Controller checked two things in the fix report that looked right and were not quite:
  (a) The reported contrast, 16.84:1, is the WRONG PAIR — it measured the button's text colour against the SECTION background. The pair that decides legibility is text against the BUTTON background: on-tertiary-container #231B00 on tertiary-container #F2C230 = 10.21:1, matching the Task 1 token table exactly. The button is fine; the evidence simply did not measure what it claimed to validate. My instruction was ambiguous (I asked for three values and "the" ratio), so this is partly mine.
  (b) aria-hidden was applied to the country-LABEL group as well as the dots group, though my instruction named only the decorative dots and the Batam marker. Country names are the map's informational content, so this looked wrong. Ruling: ACCEPTABLE. The svg carries role="img" with an aria-label that already enumerates every country ("...dari Batam ke Malaysia, Singapura, Australia, Kanada, dan Selandia Baru"), so descendants are ignored by AT anyway and no information is lost.
  — Residual concern, deferred to the final review rather than spending a round on one comment: the code now marks informational text as decorative with nothing explaining why that is safe. The next reader will either delete the aria-hidden believing it a mistake, or add a competing label.
Task 12: scoped re-review dispatched over e3877f0..ddef479 (haiku).
Task 12: re-review verdict — both findings ADDRESSED, no new breakage. Re-reviewer independently reached the same reading as the controller on the contrast figure: "the report's math is wrong, but the fix's colour choice is right" — it confirmed the rendered pair is rgb(35,27,0) on rgb(242,194,48) = ~10.21:1, matching the token table.
Task 12: minor (deferred to the final review's fix wave, endorsed by the re-reviewer): add a one-line comment beside RouteMap's aria-hidden on the country-label group explaining that the svg's aria-label already enumerates every destination. Without it the next reader either deletes the attribute believing it a mistake, or adds a competing label. Deferred rather than spending a whole agent round-trip on one comment; the final fix wave batches minors by design.
Task 12: complete (commits 74ce5f0..ddef479, review clean after 1 fix round)

Task 13: BASE = HEAD below. Gallery page with the category filter. Dispatching on sonnet — the filter is a roving-tabindex tablist with arrow-key navigation, which is the most accessibility-sensitive interactive component in the project and the one place a11y is easiest to get subtly wrong.
Task 13: implementer reported DONE (commit 49bb9ef). 30/30 tests, all commands clean, gallery route SSG in both locales.
Task 13: every keyboard measurement came back correct, and they were real measurements rather than code reading — 2 Tab presses to cross the whole filter row, exactly one chip with tabIndex 0 at any moment, and Right arrow moving document.activeElement and aria-selected together in lockstep. No page-level overflow at any of the four widths in either locale; the chip row scrolls only inside its own container.
Task 13: implementer found ANOTHER defect in my plan — the brief's chip code used `min-h-10` (40px), below the project's 48px touch-target minimum that Button, BottomNav, LocaleToggle and TextField all honour. It raised it to min-h-12 and measured 48px in the browser. This is the same class as the Task 5 Chip removal: my brief's chip styling was written before the touch-target constraint was being enforced consistently.
Task 13: task review dispatched over ddef479..49bb9ef (sonnet).
Task 13: review returned Approved — 0 Critical, 0 Important, 3 Minor. It verified the roving tabindex from the code as well as the measurements: tabIndex derives from the SAME `selected` boolean that drives aria-selected, so focus and selection cannot drift; on first render only 'all' is selected, so exactly one chip is focusable before any interaction; preventDefault fires only for horizontal arrows so other keys are not swallowed; wrap-around is modular; focus moves imperatively via ref rather than trusting re-render order.
Task 13: the reviewer answered the ARIA question by reasoning from behaviour rather than pattern-matching, which is what I asked for. It judged the missing aria-controls/role="tabpanel" DEFENSIBLE here — one grid re-filtering in place is not separate panels, and forcing the full tabs pattern would make screen readers announce a panel switch that does not happen. It then identified what is actually missing: no announcement of the RESULT of a filter change. A user hears "Kids, selected" and is not told the grid went from 12 items to 2.
Task 13: minor (deferred to the final fix wave): add an aria-live region announcing the filtered item count. Same class as the PathFinder aria-live gap fixed in Task 9, so consistency argues for closing it.
Task 13: minor (deferred): no Home/End key support in the tablist; the brief asked only for Left/Right.
Task 13: minor (deferred): chips set min-h-12 but not min-w-12; every current label clears 48px via padding, so this is an inexact guarantee rather than a live defect.
Task 13: complete (commits ddef479..49bb9ef, review clean, no fix round)

Task 14: BASE = HEAD below. Articles placeholder page. Dispatching on haiku — 80-line brief, one static page, complete code, no interactivity: transcription plus verification, the cheapest tier per Model Selection.
Task 14: implementer reported DONE (commit ae001eb). 30/30 tests, no overflow at any of the four widths in either locale, both article routes prerendered static.
Task 14: card root confirmed to be a DIV with no wrapping <a> — the original site wrapped every one of these in href="#", which is defect #8 (an anchor announced as a link that does nothing on activation). Controller grepped the whole of src/ for href="#": none anywhere, so that defect is eliminated project-wide, not just on this page.
Task 14: task review dispatched over 49bb9ef..ae001eb (haiku — one static page, complete code in the brief, low risk).
Task 14: review returned Approved — 0 Critical, 0 Important, 0 Minor. Card root confirmed a plain div; date text confirmed sourced from articles.ts rather than hardcoded; all three imageKeys present with non-empty src; grid/Reveal/h-full chain matches the teachers page precedent.
Task 14: complete (commits 49bb9ef..ae001eb, review clean, no fix round)

Controller ran a project-wide invariant audit while Task 14's review was in flight, rather than waiting idle. All clean: zero hex outside tokens.css, zero direct next/link imports, 8/8 pages carry both setRequestLocale AND alternates, zero `any`/@ts-ignore, deps exactly 4 runtime + 10 dev. Run now rather than at Task 16 because both setRequestLocale and alternates omissions are symptomless — one silently makes a route dynamic, the other silently claims the homepage as canonical — and the alternates one had already slipped through once on the programmes list page.

Task 15: BASE = HEAD below. Contact page, the real EnrolmentForm, and the FAQ accordion. Dispatching on sonnet.
Task 15: this is the business's conversion path. The site has no backend, so a validation or URL-format defect here silently loses a prospective student's enquiry with no error anywhere. It is also the first UI consumer of the Task 3 WhatsApp library and the first consumer of Task 5's Accordion.
Task 15: implementer reported DONE (commit 19d5a91). 30/30 tests, all commands clean, /[locale]/contact prerendered SSG in both locales.
Task 15: every NEGATIVE proof came back correct — empty submit produced three errors, moved focus to the name field, and window.open was never called. The valid submission's decoded URL contains the opening line, Nama, WhatsApp and Program, and correctly OMITS Usia and Pesan when empty. FAQ aria-expanded went false->true with the panel's hidden attribute removed on expand and still hidden (untabbable) when collapsed.
Task 15: the Tailwind cascade trap appeared for a FOURTH time, and all four originated in my plan's code samples — Task 5 px-*, Task 6 inline-flex/display, Task 9 colour, now justify-start against Button's base justify-center. The implementer recognised it unaided from the carried ruling and fixed it before reporting. That shows the rule finally being internalised, and also its limit: a written rule does not stop a wrong code sample being copied, it only helps someone recognise the mistake after copying it.
Task 15: implementer's flagged deviation — it replaced justify-start with justify-self-start, which avoids the collision but changes behaviour: the submit button now shrinks to content width instead of filling the form's grid column. Controller ruling to follow after the review weighs in.
Task 15: task review dispatched over ae001eb..19d5a91 (sonnet).
Task 15: review returned Approved — 0 Critical, 0 Important, 3 Minor. It confirmed the stub is fully gone (pre-diff file was literally `return <div data-compact={compact} />`), that all WhatsApp logic routes through the tested library with no shadowing, that validate() trims before the empty check so whitespace-only input cannot pass as a blank enquiry, that every field including the select carries a `name` so the focus-on-invalid query finds its target, and that the map iframe passes all four attribute checks.
Task 15: my popup-blocker concern was ANSWERED rather than assumed away — window.open fires synchronously inside onSubmit with no await or timer between, so it stays inside the user-activation window. The risk does not hold.
Task 15: reviewer agreed with my inclination on the submit button and gave a better reason than mine: justify-self-start solves the property collision by choosing the worse layout, when the free option (no class at all) both compiles and looks right. grid's default justify-items resolves to stretch, so dropping the class yields a full-width button whose label stays centred via BASE's justify-center.
Task 15: minor (deferred to final fix wave): remove className from the submit Button entirely — full width, centred label, zero classes, zero clash risk.
Task 15: minor (deferred to final fix wave): window.open's return value is unchecked. The reviewer is right that blocking is unrealistic here, but this is the sole conversion path on a backendless site with no logging — if an aggressive extension did block it, the visitor presses send, nothing happens, and nothing anywhere records the attempt. A visible wa.me fallback link turns a silent failure into a visible one.
Task 15: minor (deferred to final fix wave): the contact rows' `href: null` branch is dead code; no row has a null href.
Task 15: complete (commits ae001eb..19d5a91, review clean, no fix round)

Final fix wave now carries five deferred minors: RouteMap aria-hidden comment (T12), gallery filter aria-live count announcement (T13), submit button className removal (T15), window.open fallback (T15), dead href branch (T15).

Task 16: BASE = HEAD below. sitemap, robots, 404, README, final verification sweep. Dispatching on sonnet.
Task 16: implementer reported DONE (commit 5be79e7). 30/30 tests, all commands clean. Sitemap 26 URLs, 404 renders with chrome, and all four hygiene greps returned 0 (hex outside tokens.css / next-link imports / any+ts-ignore / href="#").
Task 16: it found and fixed TWO real bugs outside the brief's scope, and the first was severe. Without an explicit catch-all, the nested not-found never fired for genuinely unmatched URLs, and its absence corrupted the build status of sitemap.xml and robots.txt to 404 — meaning every piece of SEO work in this project (per-page canonicals, hreflang, alternates, a 26-URL sitemap) would have been unreachable in production, with a green build and correct-looking pages. It surfaced because the dispatch required reading the EMITTED artefact rather than the source: a perfect sitemap.ts is worthless if its route 404s.
Task 16: second bug — a `/85` opacity modifier in LevelLadder.tsx failed WCAG AA. Same class as the Task 9 className override: every individual token is fine, the COMPOSITION is not, and the token contrast test cannot see a composited colour. Lighthouse accessibility 97 -> 100.
Task 16: README correction reported — the brief's "add a third language" step pointed at src/i18n/routing.ts, but LOCALES/Locale actually live in src/content/types.ts. Fixed in the shipped README.
Task 16: controller verified the emitted artefacts independently on a free port. /sitemap.xml 200 with 26 <loc> entries each carrying xhtml:link alternates for both locales; /robots.txt 200 pointing at the sitemap; /nonsense -> /id/nonsense -> 404; /fr -> /id/fr -> 404 (invalid locale correctly rejected); / -> /id 200; /programs -> /id/programs 200. 29 prerendered routes in the manifest.

CONTROLLER MEASUREMENT-ERROR TALLY (4): my first run of the above reported /sitemap.xml, /robots.txt AND /id/contact as 404 — which read as a catastrophic regression. Cause: `next start` failed with EADDRINUSE and I measured responses from an unrelated process on that port. This is the fourth time my own instrument produced an alarming false signal in this project; the others were injecting only half the reduced-motion rule and sampling mid-transition, constraining documentElement instead of the viewport, and grepping lowercase `hreflang` when Next emits `hrefLang`. Every one looked exactly like a real product defect. The habit that caught all four was checking whether the reading is consistent with things already known to be true before acting on it.
Task 16: task review dispatched over 19d5a91..5be79e7 (sonnet).
Task 16: review returned NEEDS FIXES — 0 Critical, 3 Important, 2 Minor. It confirmed the catch-all cannot shadow real routes (sibling of about/, programs/, etc.; Next prefers a static or dynamic-segment match over a catch-all sibling), and that sitemap.ts derives its 13 paths from ROUTES + programs rather than hand-listing them.

Ruling R32 (review finding 1, Important — ACCEPTED, and the most consequential of the three): the README's teacher-photo procedure is FALSE.
  — It says dropping teacher-1.jpg into public/images/ makes the card switch automatically, "no code change needed". But images.ts hardcodes src: '' for all six teachers and hasPhoto gates on that string, never on filesystem state. The client would follow the instructions exactly, see nothing change, and reasonably conclude the site is broken.
  — This is the single most likely thing the client will actually try, and it is the exact "almost right is worse than absent" failure the task was reviewed against. Fix: state both steps.

Ruling R33 (review finding 2, Important — ACCEPTED after independent computation): LevelLadder.tsx:48's `opacity-70` fails AA.
  — I composited it myself: on-primary #FFFDFA at 70% over primary #A21C42 gives #e3bac3 = 4.34:1, under the 4.5 minimum. The text is 15px/700, which does not qualify as WCAG large text. It is the level number 1-5 in the homepage hero — real content, not decoration.
  — Notably this survives two lines from the /85 modifier the same task "fixed", and I computed that 85% actually yields 5.73:1 and PASSES. So the fix landed on the wrong instance and the reported Lighthouse 100 does not hold.
  — I audited all 8 opacity modifiers in src/: only this one fails. teachers/page.tsx:45's on-primary-container/70 composites to 6.04:1 and passes; the rest are decorative borders at 40-55% or a disabled-state opacity, none of which are held to text contrast.
  — Fix is to REMOVE the opacity, not raise it: replace with the `text-secondary-container` token (5.43:1), which is already this component's muted-on-crimson role. That converts an invisible composited colour into a token pair the contrast test can actually see — fixing the class, not just the instance.

Ruling R34 (review finding 3, Important, plan-mandated — ACCEPTED): centralise the domain. `https://hannafilia.co.id` is hardcoded three times (robots.ts, sitemap.ts, layout.tsx metadataBase); this task added two of them. Currently consistent, nothing enforces it.

Final fix round now carries 8 items: R32, R33, R34, plus the five minors deferred from Tasks 12, 13 and 15. Folding them in here rather than into the post-final-review wave so the whole-branch reviewer sees clean code.

FINAL WHOLE-BRANCH REVIEW (opus, over 12fc8bf..8108a80, 37 commits): verdict "mergeable after four small fixes, none architectural". It judged coherence high — could not identify task boundaries from reading the code — and confirmed the content traces back to the client's original bundle rather than being invented (testimonial names, teacher credentials, founding year, alumni figure all diffed against the source HTML; unverified accreditation honestly rendered as "menunggu data"). It triaged all 13 deferred minors as fine-as-is with per-item reasoning, and explicitly declined to manufacture findings.

Four Important, all confirmed independently by the controller before acting:
  F1. public/images/CREDITS.md still carries the teacher-photo falsehood that was corrected in README — and README POINTS THE READER AT IT for that exact topic, so the corrected instruction and the uncorrected one arrive in the same sitting with the wrong one last. Worse than reported: it also says "Nothing in the code needs to change" and "Match the aspect ratio listed in images.ts", the latter inviting the one edit all three documents agree must not happen. Invisible to task review because CREDITS.md was written in Task 8 and README in Task 16 — two diffs, each internally consistent.
  F2. programs/page.tsx renders `tp('fee')` — the LABEL "Biaya"/"Fee" — in the value cell, where the constraint requires "Tanya biaya"/"Ask for pricing". The detail page uses the same key correctly as a label. The row directly beneath shows a proper value ("Konsultasi"), making the inconsistency visible on screen. This defect is IN MY PLAN at line 4117, which is why Task 10's review passed it.
  F3. README's "add a third language" recipe is incomplete in a way that makes the new language unreachable: LocaleToggle.tsx:19 hardcodes (['id','en'] as const), so the switcher would still offer two. Also unlisted: eight per-page `languages` literals and layout.tsx's og:locale ternary.
  F4. The homepage "Halaman lain / More pages" block specified in spec §5.1 and §5.2 was never built; `home.moreLinks` shipped in both message files, unused. On mobile — five bottom-nav slots, no top-bar links — About, Teachers and Articles have no entry point above the footer. Confirmed: zero occurrences of moreLinks in src/.

Controller verified all four directly (CREDITS.md text, the tp('fee') call site, the LocaleToggle literal, and zero src/ references to the three dead keys).

Single fix wave dispatched (sonnet) covering the four Important plus eight Minor: the decimal `rgb(245 214 174 / 0.22)` brand colour that escaped every "zero raw hex" sweep because it is written in decimal; the missing secondary-container/primary contrast pair (12 occurrences, the site's most-used text pairing, untested); a filesystem existence check in the manifest test; the gallery tablist's missing tabpanel; the 404 page having no heading or sentence; the contradictory ratio comment inside images.ts itself; the two remaining dead keys; and `prebuild: npm test` to make the README's "fails the build" claim true.

FINAL FIX WAVE re-review: all 12 findings ADDRESSED, no new breakage. Reviewer confirmed the two structurally riskiest changes hold up under direct inspection — I4's new homepage block links exactly the four routes absent from the bottom nav, uses existing nav.* labels and ROUTES with no new strings; and M8's ARIA swap removed an ORPHANED role="tab" (invalid without a tabpanel) in favour of a valid role="group"+aria-pressed pattern, with the roving tabIndex and arrow-key handler byte-for-byte unchanged. Verdict: "Would merge this branch now."
PROJECT COMPLETE. 16 tasks, 39 commits, 31 tests, 14 routes all statically prerendered.
