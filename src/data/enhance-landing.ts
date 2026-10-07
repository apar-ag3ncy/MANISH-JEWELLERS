// Copy owned by the landing group. Prefix every export "landing".
import type { Slide } from "@/types";

/** Hero — the scroll cue that sits in the void between the buttons and the stats. */
export const landingHero = {
  eyebrow: "Beawar, Rajasthan · Since 1916",
  lede: "For the moments you hold close, and the stories you pass on.",
  scrollCue: "Discover the house",
  collection: "The bridal collection",
  image: {
    src: "/campaign/mj-258.jpg",
    alt: "A bride wearing an emerald polki necklace, gold bangles and a maang tikka",
  },
} as const;

export const landingCollections = {
  eyebrow: "The collections",
  heading: "Treasures for every chapter.",
  lede: "From everyday favourites to once-in-a-lifetime pieces. Find a little of yourself in every detail.",
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
  eyebrow: "Our story · Since 1916",
  heading: "Some things only grow more precious with time.",
  body: "Rooted in Beawar, our story began in 1916. Through changing times and generations of families, one thing endures: the care that goes into every piece.",
  cta: "Journey through 110 years",
  href: "/about#heritage",
} as const;

export const landingVisit = {
  id: "visit",
  eyebrow: "A personal invitation",
  heading: "Your next heirloom begins with a visit.",
  body: "Discover the collection at our Beawar showroom. Take your time, try on your favourites, and find the piece that feels like you.",
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
