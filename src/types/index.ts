export type Category = "rings" | "necklaces" | "earrings" | "bangles";

/** Which line illustration to draw until real photography exists. */
export type PieceArtKind = "ring" | "necklace" | "earrings" | "bangle";

export type Piece = {
  id: string;
  name: string;
  category: Category;
  metal: string;
  stone?: string;
  /** Rupees, integer. Never a float. */
  priceFrom: number;
  blurb: string;
  /** Path under /public/pieces/ once photography exists. */
  image: string;
  art: PieceArtKind;
};

export type NavLink = { label: string; href: string };

export type CraftNote = { label: string; title: string; body: string };

export type Step = { title: string; body: string };

export type Testimonial = { quote: string; name: string; city: string };

export type CategoryTile = {
  slug: Category;
  label: string;
  blurb: string;
  href: string;
  image: string;
  art: PieceArtKind;
};

export type CutId = "round" | "oval" | "pear" | "emerald" | "cushion";

export type Cut = {
  id: CutId;
  name: string;
  facets: number;
  /** length : width */
  ratio: string;
  /** mm of length per cube-root carat (approximate). */
  mmFactor: number;
  bestFor: string;
  note: string;
};

export type StoreHours = { days: string; time: string };

export type FooterColumn = { heading: string; links: NavLink[] };

export type Slide = { src: string; alt: string; caption: string; focus: string };
