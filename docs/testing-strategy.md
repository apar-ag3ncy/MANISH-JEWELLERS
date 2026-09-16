# Testing strategy — Manish Jewellers site

**Date:** 2026-09-16 · **Scope:** the whole site as it stands (`/`, `/home`, 404)

## Where coverage stands today

**Automated tests: none.** What exists is three gates — `tsc --noEmit`, ESLint
(`next/core-web-vitals`, which includes the React hooks rules) and `next build` — plus a
set of headless-Chrome scripts I ran by hand from a temp directory.

Those hand-run scripts are the important part, and the important gap. They found every
real bug in this project: the heritage section pinning at tablet width with an empty
band, the hero photograph escaping its frame, the loader silently skipped whenever
hydration took longer than five seconds, and the brochure images not yet placed. And
they have been **wiped twice** by temp-directory cleanup, because they never lived in
the repo. The first job of this plan is to make those checks permanent.

A second, structural gap: the logic that most deserves unit tests is trapped inside
components. `scaleFor`, the fitting-room geometry (`π·d`, `mm / stageMm`, the 10 mm
graticule share) and the heritage index-from-progress mapping are each a few lines of
arithmetic that currently cannot be imported without rendering React.

## Principle: test invariants, not pixels

This is a motion-heavy, image-led site. Pixel snapshots of animating sections are
flaky by construction. So the suite tests the things that are true regardless of the
frame you catch:

- **Brand invariants** (statically checkable): colours only via tokens, copy only in
  `src/data`, every `fill` image has `sizes`, every GSAP effect sits behind a
  `matchMedia` guard, aspect ratios inside the family, no animated layout properties.
- **Layout invariants** (per viewport): no horizontal overflow, no section hidden, no
  image outside its frame, pin count exactly 3 on `/home` at desktop and **0** below
  `lg` or under reduced motion.
- **Behaviour** (per interaction): the loader starts within 3 s in production; the Cut
  Studio, Fitting Room, brochure reader, testimonials and mobile menu respond correctly
  to input and keyboard.
- **Motion, tested in reduced-motion mode** for stability, with one separate probe that
  asserts the intro actually begins with motion on.

## The layers

| Layer | Tool | Runs in | What it covers | Target |
|---|---|---|---|---|
| Static | `tsc`, ESLint, `scripts/audit-design.mjs` | ~20 s, every commit | Types, hooks rules, the brand invariants above | 100% of invariants encoded; zero exceptions without a comment |
| Unit | Vitest | <2 s, every commit | Pure logic: `formatINR`, `pad2`, `cn`, the reveal store, `gemGeometry`, fitting and cut-studio maths, heritage step mapping, `newsletterSchema` | ≥90% lines on `src/lib` and the extracted maths |
| Component | Vitest + Testing Library (jsdom) | ~5 s, every commit | Markup and state without motion: reduced-motion renders the milestone list; Fitting Room readouts update on input; brochure legend matches pages; nav renders the real wordmark | Every interactive component has one test of its non-motion contract |
| E2E | Playwright, `channel: "chrome"` locally | ~3 min, every PR | Layout invariants at 320/390/768/1024/1440/1920, both pages, motion on and off; every interaction listed above; keyboard and focus trap; 404; sitemap/robots/OG | Every page × width × motion mode passes the invariant set; every interaction has one journey |
| Visual (opt-in) | Playwright screenshots, reduced motion only | nightly / on demand | Per-section baselines at 3 widths for the client-facing look | Baselines reviewed by a person; not a merge gate |
| Perf + a11y | Lighthouse CI, axe-core | pre-deploy, nightly | LCP / CLS / INP on both pages; WCAG violations; `will-change` count ≤ 30; image bytes per page | LCP < 2.5 s, CLS < 0.1, INP < 200 ms on the preview URL; zero serious axe violations |

Playwright is pointed at the installed Google Chrome locally (`channel: "chrome"`) so it
downloads no browser — the machine has under 200 MB free as I write this. CI uses the
bundled Chromium.

## Refactors the tests need

1. Extract `src/lib/measure.ts`: `circumference(mm)`, `plateScale(mm, stageMm)`,
   `gridShare(stageMm)`, `scaleForCarat(ct)`, `stepFromProgress(progress, count)`.
   The components import them; the tests import them.
2. Move the hand-run CDP scripts into `e2e/` as Playwright specs (they become the
   layout-invariant suite) and the design audit into `scripts/audit-design.mjs`.
3. Give the loader a machine-readable state: `data-intro="pending|playing|done"` on
   `<html>`, set from the Preloader. The "did the loader run" probe then reads one
   attribute instead of sniffing a class name.

## Example tests

**Unit — the Fitting Room is arithmetic, so test the arithmetic**
```ts
import { circumference, plateScale, gridShare } from "@/lib/measure";

test("circumference is π·d", () => {
  expect(circumference(17)).toBeCloseTo(53.41, 2);
  expect(circumference(68)).toBeCloseTo(213.63, 2);
});
test("the plate is drawn to its measurement", () => {
  expect(plateScale(17, 64)).toBeCloseTo(0.2656, 4);
  expect(plateScale(68, 150)).toBeCloseTo(0.4533, 4);
});
test("a 10 mm square is the right share of the stage", () => {
  expect(gridShare(64)).toBeCloseTo(15.625, 3);
  expect(gridShare(150)).toBeCloseTo(6.667, 3);
});
```

**Unit — the reveal store, which the loader and hero coordinate through**
```ts
test("subscribers run immediately when nothing is pending, later when held", () => {
  const calls: string[] = [];
  onReveal(() => calls.push("a"));           // idle → runs now
  holdReveal();
  onReveal(() => calls.push("b"));           // pending → waits
  expect(calls).toEqual(["a"]);
  releaseReveal();
  expect(calls).toEqual(["a", "b"]);
});
```

**E2E — the bug that shipped, as a regression test**
```ts
test("heritage never pins below lg", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/home");
  await page.locator("#heritage").scrollIntoViewIfNeeded();
  await expect(page.locator(".pin-spacer")).toHaveCount(1); // the reel, gated at md, and nothing else
  await expect(page.locator("#heritage ol.mj-heritage-list")).toBeVisible();
});
```

**E2E — layout invariants, one spec, six widths**
```ts
for (const w of [320, 390, 768, 1024, 1440, 1920]) {
  test(`no overflow, nothing hidden at ${w}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto("/home");
    const { scrollWidth, innerWidth, hidden } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth,
      hidden: [...document.querySelectorAll("section")].filter(
        (s) => getComputedStyle(s).opacity === "0" || getComputedStyle(s).visibility === "hidden").length,
    }));
    expect(scrollWidth).toBe(innerWidth);
    expect(hidden).toBe(0);
  });
}
```

**E2E — the loader, in production, with motion on**
```ts
test("the loader plays the real lockup, then hands off", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "playing", { timeout: 3000 });
  await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 6000 });
  await expect(page.locator("[data-lockup-flip] svg[role=img]")).toHaveAttribute(
    "aria-label", "Manish Jewellers. Crafted through generations.");
});
```

**E2E — reduced motion is a real mode, not a flag**
```ts
test.use({ reducedMotion: "reduce" });
test("everything is visible and nothing is pinned", async ({ page }) => {
  await page.goto("/home");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("#heritage ol li")).toHaveCount(5);
});
```

**Static — the design audit that keeps the ADR honest**
```
scripts/audit-design.mjs
  ✗ raw hex outside src/app/globals.css
  ✗ text-[…] outside the type scale
  ✗ aspect-[…] outside {4/5, 3/4, 1/1, 16/9, 2.2/1, 1322/585}
  ✗ <Image fill> without sizes
  ✗ gsap.to / fromTo touching width|height|top|left
  ✗ useGSAP body without a matchMedia guard
```

## Regression list — every bug this project has had becomes a test

| Bug | Test |
|---|---|
| Heritage pinned at 768 with an empty band | E2E pin count at 768 = 1; list visible |
| Hero photo out of its arch frame | E2E image-in-frame audit (no `<img>` beyond its clipping ancestor by >3 px) |
| Loader skipped under slow hydration | E2E `data-intro` reaches `playing` in production; a second test asserts the failsafe reveals the page with JS disabled |
| Nav pill dropped at the bottom of the page | E2E pill has `bg-cream` at max scroll |
| Footer wordmark clipped | Visual baseline, footer, 1440 and 390 |
| Fitting-room markers unreadable when scaled | E2E marker `getBoundingClientRect().width` ≈ 20 px at both slider extremes |

## What not to test

Framework wiring, Tailwind output, `next/image` itself, the exact easing of a tween, and
pixel-perfect animation frames. Time spent there is time not spent on the invariants
that have actually broken.

## Order of work

1. Extract `lib/measure.ts`; add Vitest; write the unit tests above. *(one hour)*
2. `scripts/audit-design.mjs`; add to `npm run build` as a pre-step. *(one hour)*
3. Playwright with `channel: "chrome"`; port the CDP scripts to the layout-invariant
   suite; add the six regression tests. *(half a day)*
4. GitHub Action: lint → tsc → unit → audit → build → e2e. *(one hour)*
5. Lighthouse CI and axe on the preview URL once hosting exists.
