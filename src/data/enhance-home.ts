// Copy and layout owned by the home-top group. Prefix every export "homeTop".
// Re-exported through src/data/content.ts, so names must stay unique site-wide.

import type { Category, ReelFrame } from "@/types";

/* ------------------------------------------------------------------ */
/*  TopReel — the pinned, scrubbed lookbook that replaces the          */
/*  duplicated campaign carousel. Three frames, one line each.         */
/* ------------------------------------------------------------------ */
export const homeTopReel = {
  eyebrow: "The lookbook",
  frames: [
    {
      src: "/campaign/mj-247.jpg",
      alt: "A bride reclining in a crimson room behind a blurred brass lamp",
      line: "An afternoon in a red room.",
      focus: "object-[50%_45%]",
    },
    {
      src: "/campaign/mj-182.jpg",
      alt: "Two brides wearing emerald polki necklaces and nath",
      line: "Emerald polki, set by hand.",
      focus: "object-[50%_28%]",
    },
    {
      src: "/campaign/mj-372.jpg",
      alt: "A bride seated on a carved chair among rose petals",
      line: "Made to be lived in.",
      focus: "object-[50%_32%]",
    },
  ],
} as const satisfies { eyebrow: string; frames: readonly ReelFrame[] };

/* ------------------------------------------------------------------ */
/*  CategoryGrid — a mosaic of four brochure packshots.                */
/*                                                                     */
/*  The tiles used to show models wearing something adjacent to the    */
/*  label; they now show the piece itself, from the house brochure.    */
/*  Every packshot is LANDSCAPE (2000 × ~1500–1970) with the piece      */
/*  centred in a wide field of silk, marble or sand, so the frames     */
/*  here are landscape or square wherever the subject is wide and      */
/*  portrait only where the subject stands up in the frame. Widths and */
/*  vertical offsets carry the asymmetry: 7/5 over 5/7.                */
/*                                                                     */
/*  Source overrides live here, not in content.ts — that file is       */
/*  shared. Labels, blurbs and hrefs still come from `categories`.     */
/* ------------------------------------------------------------------ */
export const homeTopCategoryOrder = [
  "necklaces",
  "earrings",
  "bangles",
  "rings",
] as const satisfies readonly Category[];

export const homeTopCategoryLayout: Record<
  Category,
  { src: string; alt: string; focus: string; frame: string; aspect: string; sizes: string }
> = {
  necklaces: {
    src: "/brochure/br-necklace-green.jpg",
    alt: "A gold necklace set with green stones, laid on cream silk and marble",
    focus: "object-[50%_50%]",
    frame: "lg:col-span-6 lg:col-start-1",
    aspect: "aspect-[5/4]",
    sizes: "(min-width: 1024px) 44vw, (min-width: 768px) 48vw, 100vw",
  },
  earrings: {
    src: "/brochure/br-earrings-rose.jpg",
    alt: "A pair of rose gold and diamond drop earrings on white silk",
    focus: "object-[44%_50%]",
    frame: "lg:col-span-4 lg:col-start-9 lg:mt-[clamp(24px,3vw,64px)]",
    aspect: "aspect-[4/5]",
    sizes: "(min-width: 1024px) 30vw, (min-width: 768px) 48vw, 100vw",
  },
  bangles: {
    src: "/brochure/br-bangles-trio.jpg",
    alt: "Three gold bangles resting on a pale stone dish",
    focus: "object-[48%_50%]",
    frame: "lg:col-span-4 lg:col-start-2",
    aspect: "aspect-[1/1]",
    sizes: "(min-width: 1024px) 30vw, (min-width: 768px) 48vw, 100vw",
  },
  rings: {
    src: "/brochure/br-ring-peacock.jpg",
    alt: "A gold peacock ring, enamelled and beaded, on a soft pink ground",
    focus: "object-[50%_50%]",
    frame: "lg:col-span-6 lg:col-start-7 lg:-mt-[clamp(32px,5vw,88px)]",
    aspect: "aspect-[5/4]",
    sizes: "(min-width: 1024px) 44vw, (min-width: 768px) 48vw, 100vw",
  },
};

/* ------------------------------------------------------------------ */
/*  Home hero — crops for the offset two-photo stack.                  */
/*  The front card used to amputate the second bride in mj-160 mid-    */
/*  body; the rear crop moves from 60% to 46% to keep her whole.       */
/* ------------------------------------------------------------------ */
export const homeTopStack = {
  rearFocus: "object-[50%_46%]",
  frontFocus: "object-[50%_24%]",
} as const;

/* ------------------------------------------------------------------ */
/*  FeaturedPieces — the three named pieces, shot as product.          */
/*  Keyed by piece id so the order in content.ts can change safely.    */
/*  Names, metals and prices are untouched; only the photograph is.    */
/* ------------------------------------------------------------------ */
export const homeTopFeaturedShots: Record<string, { src: string; alt: string; focus: string }> = {
  "sitara-band": {
    src: "/brochure/br-ring-ruby.jpg",
    alt: "A ruby and gold cocktail ring standing on a marble slab",
    focus: "object-[50%_50%]",
  },
  "ambar-studs": {
    src: "/brochure/br-set-ruby.jpg",
    alt: "Rose gold flower earrings set with rubies and diamonds, with their matching collar",
    focus: "object-[57%_50%]",
  },
  "veda-pendant": {
    src: "/brochure/br-pendant-emerald.jpg",
    alt: "A round gold medallion set with emerald and ruby, on a marble dish",
    focus: "object-[46%_48%]",
  },
};
