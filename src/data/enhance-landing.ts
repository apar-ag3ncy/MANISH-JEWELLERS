// Copy owned by the landing group. Prefix every export "landing".
import type { Slide } from "@/types";

/** Hero — the scroll cue that sits in the void between the buttons and the stats. */
export const landingHero = { scrollCue: "Scroll" } as const;

/** Invitation — the eyebrow the section never had. */
export const landingInvitation = { eyebrow: "The invitation" } as const;

/**
 * The campaign slider, recut to four portraits.
 * The two landscapes (mj-396, mj-247) leave the slider — 396 becomes the hero band,
 * 247 belongs to the home reel — and mj-538 moves to the Invitation arch.
 */
export const landingCampaign = {
  slides: [
    {
      src: "/campaign/mj-186.jpg",
      alt: "Two brides in close-up wearing polki chokers and a nath",
      caption: "Polki, set by hand.",
      focus: "object-[50%_26%]",
    },
    {
      src: "/campaign/mj-475.jpg",
      alt: "A bride in close-up wearing a nath, maang tikka and emerald polki necklace",
      caption: "Worn close. Kept for generations.",
      focus: "object-[50%_40%]",
    },
    {
      src: "/campaign/mj-318.jpg",
      alt: "A bride with a hennaed hand across her face, stacked gold bangles and rings",
      caption: "Gold that moves with you.",
      focus: "object-[50%_36%]",
    },
    {
      src: "/campaign/mj-403.jpg",
      alt: "A bride standing in a red lehenga, hand on hip, wearing a polki choker",
      caption: "The Bridal Edit, 2026.",
      focus: "object-[50%_30%]",
    },
  ] satisfies Slide[],
} as const;

/** The photograph that carries the Invitation arch. */
export const landingInvitationImage = {
  src: "/campaign/mj-538.jpg",
  alt: "A bride framed by a carved wooden arch, holding a red rose",
  focus: "object-[50%_30%]",
} as const;

/** The decorative band at the foot of the hero. */
export const landingHeroBand = { src: "/campaign/mj-396.jpg" } as const;
