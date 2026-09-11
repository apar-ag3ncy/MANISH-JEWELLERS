# Manish Jewellers — website (Phase 1)

Landing page (`/`) and Home page (`/home`), built to `manish-jewellers-build-spec.md`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # type-check + lint + production build
```

## Stack

Next.js 15 (App Router, TypeScript strict) · Tailwind CSS v4 (`@theme` tokens in `src/app/globals.css`) ·
GSAP 3 + ScrollTrigger + `@gsap/react` · Lenis · lucide-react · react-hook-form + zod.

## Where things live

| What | Where |
|---|---|
| Every colour token (the only place `#6E2D3C` exists) | `src/app/globals.css` |
| All copy, catalogue placeholders, store details | `src/data/content.ts` |
| Landing sections | `src/components/sections/landing/` |
| Home sections (incl. the interactive Cut Studio) | `src/components/sections/home/` |
| Nav, footer, smooth scroll, preloader gate | `src/components/layout/` |
| Primitives: Button, Rule, Reveal, SplitText, MagneticButton, Gem, PieceArt, Monogram, ArchPattern, MapIllustration | `src/components/ui/` |
| GSAP registration + motion media queries | `src/lib/gsap.ts` |
| Zod schemas reused server-side in Phase 2 | `src/lib/schemas.ts` |
| Phase 2 placeholders | `src/app/(future)/`, `src/app/api/`, `src/lib/supabase/` |

## Brand assets

The monogram and arch lattice from the brand deck are redrawn as SVG (`Monogram.tsx`, `ArchPattern.tsx`).
Product imagery is line-illustrated in `PieceArt.tsx` until photography exists. No AI-generated mockups are used.

## Notes for Phase 2

- Nav links currently anchor into the two built pages. Swap `nav` in `content.ts` for `/collections`, `/bespoke`, `/craft`, `/visit`.
- The newsletter and bespoke buttons are wired to local state only. Insert through Route Handlers using the schemas in `src/lib/schemas.ts`.
- The map in `VisitStore` is an SVG illustration. Replace with an embed when ready.
- `docs/screenshots/` holds reference renders of the finished sections.
