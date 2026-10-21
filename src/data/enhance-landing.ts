// Copy owned by the landing group. Prefix every export "landing".
import type { Slide } from "@/types";
import { foundingYear, sinceFounding } from "./house-history";

/** Hero — the scroll cue that sits in the void between the buttons and the stats. */
export const landingHero = {
  eyebrow: `Beawar, Rajasthan · ${sinceFounding}`,
  lede: "Jewellery to treasure.",
  scrollCue: "Discover the house",
  collection: "The bridal collection",
  image: {
    src: "/campaign/mj-258.jpg",
    alt: "A bride wearing an emerald polki necklace, gold bangles and a maang tikka",
  },
} as const;

export const landingCollections = {
  eyebrow: "The collections",
  heading: "Find your signature.",
  lede: "Explore the collection by category.",
  cta: "View the house brochure",
  href: "/#brochure",
  items: [
    {
      name: "Necklaces",
      note: "Made to be remembered",
      src: "/brochure/br-set-emerald.jpg",
      alt: "Gold necklace with green and red stones, matching earrings and bangles",
    },
    {
      name: "Rings",
      note: "A little everyday wonder",
      src: "/brochure/br-ring-peacock.jpg",
      alt: "Sculptural gold peacock ring on a blush pink background",
    },
    {
      name: "Bangles",
      note: "Tradition, in every detail",
      src: "/brochure/br-bangles-trio.jpg",
      alt: "Three ornate gold bangles arranged on a stone dish",
    },
  ],
} as const;

export const landingHeritage = {
  eyebrow: `Our story · ${sinceFounding}`,
  heading: "A legacy of trust.",
  body: `A family journey begun in Beawar in ${foundingYear}, carried forward through craft and your trust.`,
  cta: "Our story",
  href: "/about#heritage",
} as const;

export const landingVisit = {
  id: "visit",
  eyebrow: "A personal invitation",
  heading: "Visit us in Beawar.",
  body: "Discover the collection in person.",
  directions: "Find our showroom",
} as const;

export const landingFooter = {
  heading: "A little closer to the craft.",
  body: "Explore our story and the jewellery in the house brochure.",
  cta: "Open the brochure",
} as const;

/** Portraits from the house campaign. */
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
