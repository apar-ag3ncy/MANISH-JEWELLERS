// src/data/content.ts — single source of truth for ALL copy.
// Becomes Supabase queries in Phase 2. No component may hard-code copy.

import type {
  CategoryTile,
  CraftNote,
  Cut,
  FooterColumn,
  NavLink,
  Piece,
  Slide,
  Step,
  StoreHours,
  Testimonial,
} from "@/types";

/* ------------------------------------------------------------------ */
/*  Brand                                                              */
/* ------------------------------------------------------------------ */
export const brand = {
  name: "Manish Jewellers",
  short: "Manish",
  wordmark: ["Manish", "Jewellers"],
  motto: "Crafted through generations",
  tagline: "Fine jewellery, made to be lived in.",
  lede: "Handcrafted in 18k and 22k gold, set with certified stones.",
  description:
    "Manish Jewellers, Beawar. Fine jewellery handcrafted in 18k and 22k gold, set with certified stones. Bespoke commissions and private viewings by appointment.",
  since: 1986,
  url: "https://manishjewellers.in",
} as const;

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */
// Phase 1: anchors into the two built pages. Phase 2 swaps these for
// /collections, /bespoke, /craft, /visit.
export const nav: readonly NavLink[] = [
  { label: "Collections", href: "/home#collections" },
  { label: "Bespoke", href: "/home#bespoke" },
  { label: "Campaign", href: "/#campaign" },
  { label: "Visit", href: "/home#visit" },
] as const;

export const navCta = { label: "Book a viewing", href: "/home#visit" } as const;

export const mobileMenu = {
  open: "Open menu",
  close: "Close menu",
  homeLink: { label: "Home", href: "/home" },
  landingLink: { label: "The story", href: "/" },
} as const;

/* ------------------------------------------------------------------ */
/*  Landing — Preloader + Hero                                          */
/* ------------------------------------------------------------------ */
export const hero = {
  lockupLabel: "Manish Jewellers. Crafted through generations.",
  tagline: { text: "Fine jewellery, made to be lived", italic: "in." },
  primary: { label: "Explore the collection", href: "/home" },
  secondary: { label: "Book a private viewing", href: "/home#visit" },
  stats: [
    { label: "Since", value: 1986, counter: true },
    { label: "BIS Hallmarked", value: null, counter: false },
    { label: "IGI Certified Stones", value: null, counter: false },
  ],
} as const;

/* ------------------------------------------------------------------ */
/*  Landing — Marquee                                                  */
/* ------------------------------------------------------------------ */
export const marquee = ["Rings", "Necklaces", "Earrings", "Bangles", "Bridal", "Solitaires"] as const;

/* ------------------------------------------------------------------ */
/*  Campaign — landscape slides, one line each                          */
/* ------------------------------------------------------------------ */
export const campaign = {
  id: "campaign",
  label: "The bridal campaign",
  prev: "Previous slide",
  next: "Next slide",
  goTo: "Show slide",
  slides: [
    {
      src: "/campaign/mj-396.jpg",
      alt: "A bride seated among rose petals in a crimson room, wearing a polki set",
      caption: "The Bridal Edit, 2026.",
      focus: "object-[50%_45%]",
    },
    {
      src: "/campaign/mj-186.jpg",
      alt: "Two brides in close-up wearing polki chokers and nath",
      caption: "Polki, set by hand.",
      focus: "object-[50%_26%]",
    },
    {
      src: "/campaign/mj-247.jpg",
      alt: "A bride leaning on a cushion in a red lehenga and emerald necklace",
      caption: "Heirlooms, made new.",
      focus: "object-[40%_40%]",
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
      src: "/campaign/mj-538.jpg",
      alt: "A bride framed by a carved wooden arch, holding a red rose",
      caption: "Crafted through generations.",
      focus: "object-[50%_28%]",
    },
  ] satisfies Slide[],
} as const;

export const lookbook = {
  id: "lookbook",
  slides: [
    {
      src: "/campaign/mj-182.jpg",
      alt: "Two brides wearing emerald polki necklaces and nath",
      caption: "Two brides, one heirloom.",
      focus: "object-[50%_30%]",
    },
    {
      src: "/campaign/mj-160.jpg",
      alt: "Two brides seated beside brass urns in embroidered lehengas",
      caption: "The full set, head to hem.",
      focus: "object-[50%_55%]",
    },
    {
      src: "/campaign/mj-271.jpg",
      alt: "A bride wearing a layered emerald polki necklace",
      caption: "Emerald polki, 22k gold.",
      focus: "object-[50%_38%]",
    },
    {
      src: "/campaign/mj-490.jpg",
      alt: "A hennaed hand with gold rings and bangles holding a red rose",
      caption: "Rings, worn together.",
      focus: "object-[50%_36%]",
    },
    {
      src: "/campaign/mj-372.jpg",
      alt: "A bride seated on a carved chair among rose petals",
      caption: "Made to be lived in.",
      focus: "object-[50%_32%]",
    },
  ] satisfies Slide[],
} as const;

/* ------------------------------------------------------------------ */
/*  Catalogue placeholders                                             */
/* ------------------------------------------------------------------ */
export const signature: Piece[] = [
  {
    id: "aurelia-solitaire",
    name: "The Aurelia Solitaire",
    category: "rings",
    metal: "18k yellow gold",
    stone: "1.20 ct round brilliant, IGI",
    priceFrom: 240000,
    blurb: "A single stone, held by almost nothing.",
    image: "/campaign/mj-255.jpg",
    art: "ring",
  },
  {
    id: "meher-collar",
    name: "Meher Collar",
    category: "necklaces",
    metal: "22k gold",
    stone: "Uncut polki, hand-set",
    priceFrom: 680000,
    blurb: "Twenty-two karat, worked flat so it sits like cloth.",
    image: "/campaign/mj-182.jpg",
    art: "necklace",
  },
  {
    id: "noor-drops",
    name: "Noor Drops",
    category: "earrings",
    metal: "18k white gold",
    stone: "Pear-cut diamonds, IGI",
    priceFrom: 185000,
    blurb: "Two pear cuts that move when you do.",
    image: "/campaign/mj-372.jpg",
    art: "earrings",
  },
  {
    id: "rukh-bangle",
    name: "Rukh Bangle",
    category: "bangles",
    metal: "22k gold",
    stone: "Hand-engraved, no stones",
    priceFrom: 320000,
    blurb: "Engraved by one hand, start to finish.",
    image: "/campaign/mj-183.jpg",
    art: "bangle",
  },
];

export const featured: Piece[] = [
  {
    id: "sitara-band",
    name: "Sitara Band",
    category: "rings",
    metal: "18k yellow gold",
    stone: "Eleven round diamonds, IGI",
    priceFrom: 96000,
    blurb: "A half-eternity that disappears into the hand.",
    image: "/campaign/mj-1832.jpg",
    art: "ring",
  },
  {
    id: "ambar-studs",
    name: "Ambar Studs",
    category: "earrings",
    metal: "18k rose gold",
    stone: "0.50 ct pair, round brilliant",
    priceFrom: 72000,
    blurb: "Four prongs each. Nothing else.",
    image: "/campaign/mj-403.jpg",
    art: "earrings",
  },
  {
    id: "veda-pendant",
    name: "Veda Pendant",
    category: "necklaces",
    metal: "18k white gold",
    stone: "Emerald-cut diamond, IGI",
    priceFrom: 140000,
    blurb: "Step-cut, on a chain you forget you are wearing.",
    image: "/campaign/mj-186.jpg",
    art: "necklace",
  },
];

/* ------------------------------------------------------------------ */
/*  Landing — Signature Rail, Craft, Invitation                        */
/* ------------------------------------------------------------------ */
export const signatureRail = {
  eyebrow: "Signature pieces",
  heading: "The signature four.",
  fromLabel: "From",
  scrollHint: "Scroll",
} as const;

export const craft = {
  id: "craft",
  eyebrow: "The atelier",
  heading: "Cut, set, and finished by hand.",
  notes: [
    {
      label: "The stone",
      title: "Chosen before it is cut.",
      body: "Every stone is sourced with its certificate and graded again on our bench. If it does not hold light the way we want, it does not go in.",
    },
    {
      label: "The setting",
      title: "Metal that holds, then disappears.",
      body: "Prongs are drawn thin, then hardened. Bezels are burnished by hand. The aim is a setting you notice only when you look for it.",
    },
    {
      label: "The finish",
      title: "Polished to be worn, not displayed.",
      body: "We finish for the hand, not the case. Edges are softened, undersides are polished, and each piece is worn by us before it is worn by you.",
    },
  ] satisfies CraftNote[],
} as const;

export const invitation = {
  heading: "Come see them in person.",
  body: "Private viewings at our Beawar atelier, by appointment.",
  cta: { label: "Book an appointment", href: "/home#visit" },
} as const;

/* ------------------------------------------------------------------ */
/*  Home — Hero, Categories, Featured                                  */
/* ------------------------------------------------------------------ */
export const homeHero = {
  eyebrow: "New · Autumn edit",
  heading: "The Aurelia Edit",
  lede: "Eleven pieces in 18k gold, cut for the long light of October evenings.",
  link: { label: "View the edit", href: "#featured" },
  stack: {
    rearSrc: "/campaign/mj-160.jpg",
    rearAlt: "Two brides seated in crimson lehengas wearing polki sets",
    frontSrc: "/campaign/mj-258.jpg",
    frontAlt: "A bride in a polki choker and maang tikka",
  },
} as const;

export const categories = {
  id: "collections",
  eyebrow: "Collections",
  heading: "By category.",
  tiles: [
    {
      slug: "rings",
      image: "/campaign/mj-490.jpg",
      label: "Rings",
      blurb: "Solitaires, bands, cocktail.",
      href: "#featured",
      art: "ring",
    },
    {
      slug: "necklaces",
      image: "/campaign/mj-271.jpg",
      label: "Necklaces",
      blurb: "Collars, chains, pendants.",
      href: "#featured",
      art: "necklace",
    },
    {
      slug: "earrings",
      image: "/campaign/mj-411.jpg",
      label: "Earrings",
      blurb: "Studs, drops, hoops.",
      href: "#featured",
      art: "earrings",
    },
    {
      slug: "bangles",
      image: "/campaign/mj-265.jpg",
      label: "Bangles",
      blurb: "Kada, engraved, stacking.",
      href: "#featured",
      art: "bangle",
    },
  ] satisfies CategoryTile[],
} as const;

export const featuredSection = {
  id: "featured",
  eyebrow: "Featured",
  heading: "Worn most this season.",
  viewAll: { label: "View all", href: "#collections" },
  fromLabel: "From",
} as const;

/* ------------------------------------------------------------------ */
/*  Home — Cut Studio (interactive)                                    */
/* ------------------------------------------------------------------ */
export const cutStudio = {
  id: "cut-studio",
  eyebrow: "The cut studio",
  heading: "Choose the cut. We will do the rest.",
  intro:
    "Move between the five cuts we set most often. Slide the carat weight to see how the stone sits. Then bring the result to us.",
  caratLabel: "Carat weight",
  caratUnit: "ct",
  sizeLabel: "Approx. length",
  facetsLabel: "Facets",
  ratioLabel: "Ratio",
  bestForLabel: "Best for",
  noteLabel: "Our note",
  cta: { label: "Enquire about this stone", href: "#bespoke" },
  hint: "Move your cursor over the stone",
  cuts: [
    {
      id: "round",
      name: "Round brilliant",
      facets: 57,
      ratio: "1.00",
      mmFactor: 6.5,
      bestFor: "Solitaires and studs. The most light return of any cut.",
      note: "We set it with four prongs, never six, so the stone reads larger.",
    },
    {
      id: "oval",
      name: "Oval",
      facets: 56,
      ratio: "1.35",
      mmFactor: 7.8,
      bestFor: "Lengthening the finger. Reads larger than a round of the same weight.",
      note: "We look for a stone with a faint bow-tie, then set it north–south.",
    },
    {
      id: "pear",
      name: "Pear",
      facets: 58,
      ratio: "1.55",
      mmFactor: 8.4,
      bestFor: "Drops and pendants. Movement, when hung from the point.",
      note: "The tip is the fragile part. We always cap it with a V-prong.",
    },
    {
      id: "emerald",
      name: "Emerald",
      facets: 57,
      ratio: "1.40",
      mmFactor: 7.2,
      bestFor: "Clean stones. Step facets hide nothing, so clarity matters most.",
      note: "We pair it with a plain band. Anything busier fights the hall-of-mirrors.",
    },
    {
      id: "cushion",
      name: "Cushion",
      facets: 64,
      ratio: "1.10",
      mmFactor: 6.0,
      bestFor: "Halo settings and antique-leaning designs. Soft corners, warm light.",
      note: "Our favourite for 22k. The rounded corners suit the softer gold.",
    },
  ] satisfies Cut[],
} as const;

/* ------------------------------------------------------------------ */
/*  Home — Bespoke, Testimonials, Visit                                */
/* ------------------------------------------------------------------ */
export const bespoke = {
  id: "bespoke",
  eyebrow: "Bespoke",
  heading: "Bring us a sketch. Or an idea.",
  lede: "Most of what leaves the atelier began as a conversation. Some began as a photograph of a grandmother's bangle.",
  steps: [
    {
      title: "Tell us",
      body: "A sketch, a reference, a stone you already own. We talk through metal, budget and how the piece will be worn.",
    },
    {
      title: "We draw it",
      body: "Hand drawings first, then a CAD render and a firm quotation. Nothing is made until you have approved both.",
    },
    {
      title: "We make it",
      body: "Cut, set and finished in Beawar. Six to eight weeks. Delivered with its certificates, in person if you prefer.",
    },
  ] satisfies Step[],
  cta: { label: "Start a bespoke enquiry", href: "#visit" },
  aside: "No obligation until the drawing is approved.",
} as const;

export const testimonials = {
  eyebrow: "Clients",
  items: [
    {
      quote: "I brought them my mother's broken kada and a rough idea. What came back was hers, and mine.",
      name: "Ritika S.",
      city: "Jaipur",
    },
    {
      quote:
        "The solitaire looks like it is floating. Three jewellers in Mumbai told me that setting was not possible.",
      name: "Aditya M.",
      city: "Mumbai",
    },
    {
      quote: "They talked me out of a bigger stone and into a better one. I have never been more sure of a purchase.",
      name: "Hannah W.",
      city: "London",
    },
  ] satisfies Testimonial[],
  prev: "Previous testimonial",
  next: "Next testimonial",
  goTo: "Show testimonial",
} as const;

export const store = {
  id: "visit",
  eyebrow: "Visit",
  heading: "Panch Batti, Beawar.",
  body: "The atelier is above the showroom. Ask, and we will take you up.",
  addressLines: ["Panch Batti", "Beawar 305901"],
  hours: [
    { days: "Mon – Sat", time: "11:00 – 20:00" },
    { days: "Sunday", time: "By appointment" },
  ] satisfies StoreHours[],
  phone: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  whatsapp: "+910000000000",
  whatsappLabel: "WhatsApp",
  whatsappHref: "https://wa.me/910000000000",
  instagram: "https://instagram.com/",
  directions: { label: "Get directions", href: "https://maps.google.com/?q=Panch+Batti+Beawar+305901" },
  hoursLabel: "Hours",
  addressLabel: "Address",
  contactLabel: "Contact",
  mapLabel: "Illustrated map showing the store at Panch Batti, Beawar",
  mapNote: "Illustrative map. Real map embed arrives in Phase 2.",
  geo: { lat: 26.1018, lng: 74.3203 },
} as const;

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
export const footer = {
  columns: [
    {
      heading: "Visit",
      links: [
        { label: store.addressLines[0], href: store.directions.href },
        { label: store.addressLines[1], href: store.directions.href },
        { label: "Mon – Sat, 11 – 8", href: "/home#visit" },
      ],
    },
    {
      heading: "Explore",
      links: [
        { label: "Collections", href: "/home#collections" },
        { label: "Bespoke", href: "/home#bespoke" },
        { label: "The campaign", href: "/#campaign" },
        { label: "The story", href: "/" },
      ],
    },
    {
      heading: "Client care",
      links: [
        { label: "Book a viewing", href: "/home#visit" },
        { label: "Sizing guide", href: "/home#cut-studio" },
        { label: "Care & repair", href: "/home#bespoke" },
        { label: "Contact", href: "/home#visit" },
      ],
    },
  ] satisfies FooterColumn[],
  newsletter: {
    heading: "Newsletter",
    placeholder: "Your email",
    submit: "Subscribe",
    success: "Thank you. We write rarely.",
    error: "Please enter a valid email.",
  },
  legal: {
    copyright: `© ${new Date().getFullYear()} Manish Jewellers`,
    marks: "BIS Hallmarked · IGI Certified",
    links: [
      { label: "Instagram", href: store.instagram },
      { label: "WhatsApp", href: store.whatsappHref },
      { label: "Privacy", href: "/" },
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Not found                                                          */
/* ------------------------------------------------------------------ */
export const notFound = {
  eyebrow: "404",
  heading: "This page is still on the bench.",
  body: "Collections, bespoke and appointments open in the next release. Until then, the home page has everything you need.",
  cta: { label: "Go to the home page", href: "/home" },
} as const;
