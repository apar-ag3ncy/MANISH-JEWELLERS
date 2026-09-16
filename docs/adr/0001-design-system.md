# ADR-0001: A token-first design system for spacing, proportion and structure

**Status:** Proposed
**Date:** 2026-09-16
**Deciders:** Apar (owner), whoever maintains the site after Phase 1

## Context

The site was built in three passes: a spec-driven Phase 1, a parallel four-agent
enhancement pass, and a series of direct edits. Colour came through that intact —
every colour resolves to one of fourteen `@theme` tokens, and there is not a single
raw hex outside the token block. Motion came through intact too: every effect sits
inside `useGSAP` behind a `matchMedia` guard, with a static reduced-motion fallback.

Three other dimensions did not, and one structural seam is now load-bearing for the
wrong reason. Measured on the current tree (17 sections, 18 primitives):

| Dimension | Today | Symptom |
|---|---|---|
| Spacing | 21 distinct arbitrary clamps + 55 distinct scale steps | Every section invents its own rhythm; `section-y` exists but is bypassed |
| Type | 9 named utilities, but 11 arbitrary sizes bypass them; `text-[15px]` appears 13× | An unnamed body size is doing real work |
| Proportion | 8 aspect ratios, 4 of them used once (`10/9`, `5/4`, `16/10`, `4/3`) | Frames drift; no family the eye can learn |
| Structure | `data/enhance-{landing,home,home-bottom,chrome}.ts` + 4 matching CSS partials | Module names encode *who built them*, not *what they are* |
| Reuse | `SectionHead` in 10 sections, `ImageFrame` in 7, raw `next/image` in 6 | Two ways to place a photograph |
| Breakpoint gating | `min-width` + `min-height` strings repeated per component | Already caused a real bug: heritage pinned at 768 while its layout needed 1024 |

The forces: this is a small site with a long tail of small edits, maintained mostly by
one person plus an assistant. It is image-led and proportion-sensitive — a jewellery
house reads as cheap the moment rhythm wobbles. It is also nearly finished, so the
appetite for churn is low.

## Decision

Adopt a **token-first design system in place**, not a separate package. Four scales
(space, type, ratio, gate) become tokens; the section and primitive layers consume
them; a cheap audit script keeps drift from returning. Rename the `enhance-*` seam to
domain modules, because that seam is now permanent and its current name is a lie.

## Options Considered

### Option A: Leave it

| Dimension | Assessment |
|---|---|
| Complexity | None |
| Cost | Zero now, compounding later |
| Scalability | Poor — every new section adds another one-off rhythm |
| Team familiarity | Highest |

**Pros:** Ships nothing, breaks nothing. Colour and motion are already disciplined, so the site does not look broken today.
**Cons:** The next ten edits each make a fresh spacing decision. Proportion drift is the failure mode most visible to a luxury client, and the one hardest to argue about after the fact.

### Option B: Token-first consolidation in place (recommended)

| Dimension | Assessment |
|---|---|
| Complexity | Low–medium, and stageable |
| Cost | ~1 focused session for stages 1–2; stage 3 opportunistic |
| Scalability | Good — new sections compose from a fixed vocabulary |
| Team familiarity | High — same Tailwind v4 `@theme` mechanism already used for colour |

**Pros:** Uses the mechanism that already worked. Each stage is independently shippable and independently revertable. The audit script turns taste into a check.
**Cons:** Touches many files in one pass, so it wants a quiet moment and a careful visual diff. Renaming the data modules is churn with no visible payoff.

### Option C: Extract a `packages/ui` design system

| Dimension | Assessment |
|---|---|
| Complexity | High (workspace, build, versioning) |
| Cost | Days, plus permanent overhead |
| Scalability | Excellent for many consumers |
| Team familiarity | Low |

**Pros:** Correct if a second property appears (a shop, a booking app).
**Cons:** There is exactly one consumer. Monorepo overhead on a one-site project is cost without benefit.

## Trade-off Analysis

The real trade-off is **churn now against drift later**, and the tiebreaker is how the
failure shows up. Colour drift would have been loud and instantly visible; that is
partly why it never happened. Spacing and proportion drift is quiet — each section
looks fine alone, and the page reads slightly unresolved as a whole. That is precisely
the defect a jewellery client feels but cannot name, so it is worth paying down while
the surface is still small.

Option C is the right answer to a question nobody has asked yet. Option A is defensible
only if the site is frozen, and it is not — the last four requests each added a section.

Within Option B, the sub-trade-off is how strict to be. A scale narrow enough to force
consistency will occasionally fight a genuine one-off (the brochure's `1322/585` is a
real page ratio and should stay an exception). The answer is a small named family plus
an explicit escape hatch, not a rule with no exit.

## The system

**Space.** One 4px base, eight steps, three section rhythms:

```
--space-2xs 8   --space-xs 12  --space-s 16   --space-m 24
--space-l 32    --space-xl 48  --space-2xl 64 --space-3xl 96
--section-tight clamp(56px, 8vw, 110px)
--section-base  clamp(96px, 12vw, 200px)   /* the existing section-y */
--section-loose clamp(120px, 16vw, 240px)
```
Component spacing snaps to the steps; section padding uses one of the three rhythms.

**Type.** Complete the scale rather than fight it: add `body-s` (the 15px that appears
13 times) and `display-num` (the heritage numeral). Nine named utilities plus two = the
whole vocabulary; arbitrary `text-[…]` becomes a lint error.

**Ratio.** A family drawn from the brand's own geometry — the lockup is 2.2:1, the arch
is 4:5:

```
portrait 4/5   ·   tall 3/4   ·   square 1/1   ·   wide 16/9   ·   banner 2.2/1
```
Retire `10/9`, `5/4`, `16/10`, `4/3`. Document `1322/585` (brochure page) as a
deliberate exception.

**Gate.** One module owns the motion and pin gates, so a pin can never again be enabled
at a width its layout does not support:

```ts
MOTION_OK · HOVER_OK · PIN_OK (min-width 1024 AND min-height 720) · PIN_BUDGET = 3
```

**Structure.** `data/enhance-*.ts` → `data/{landing,home,house,chrome}.ts`;
`styles/enhance-*.css` → `styles/sections.css` with the twelve one-off classes grouped
and commented. `ImageFrame` becomes the only way a photograph enters a section.

## Consequences

**Easier:** new sections compose from a fixed vocabulary; visual review has something to
check against; the pin bug class disappears; a newcomer reads the data layer by domain.

**Harder:** one-off compositions now need an explicit, commented exception. The
consolidation pass touches ~20 files at once and needs a careful before/after sweep.

**To revisit:** if a second property appears, revisit Option C. If the type scale grows
past twelve names, it has stopped being a scale.

## Action Items

1. [ ] Stage 1 — tokens only: add space, ratio and the two type steps to `@theme`; no component edits. Zero visual change.
2. [ ] Add `npm run audit:design`: fails on raw hex, off-scale `text-[…]`, and aspect ratios outside the family. Wire into the build.
3. [ ] Stage 2 — adopt: convert section padding to the three rhythms, `text-[15px]` to `body-s`, retire the four one-off ratios. Visual diff at 1440 / 768 / 390 before and after.
4. [ ] Stage 3 — structure: rename data and style modules to domains; move the 6 raw `next/image` uses to `ImageFrame`; introduce `lib/gates.ts` and delete the per-component media strings.
5. [ ] Record the outcome here (Accepted / amended) once stage 2 ships.
