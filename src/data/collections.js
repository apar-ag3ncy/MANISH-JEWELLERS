import { products } from "./product-catalog";

// Editorial copy is separate from the complete source-backed product inventory.
const collectionStories = [
  {
    slug: "necklaces",
    name: "Necklaces",
    phrase: "Close to the heart.",
    description:
      "A necklace can hold a whole occasion. Discover expressive silhouettes, intricate settings and the details that make a piece feel personal.",
    hero: "long-medallion-necklace",
    note: "From an intimate celebration to a grand entrance.",
    story:
      "Some pieces enter a family with a celebration. Years later, they tell that story again. Choose the necklace you love today, with room for all the memories still to come.",
  },
  {
    slug: "rings",
    name: "Rings",
    phrase: "A world in your hand.",
    description:
      "A small canvas for extraordinary detail. Explore sculptural forms, colour and character, from a quiet accent to a piece that starts a conversation.",
    hero: "sunburst-cocktail-ring",
    note: "Little treasures. Unmistakable character.",
    story:
      "The most personal piece is often the one you see every day. Let the shape, colour and feel guide you towards a ring that becomes part of your own story.",
  },
  {
    slug: "bangles",
    name: "Bangles",
    phrase: "Tradition in motion.",
    description:
      "A familiar gesture, beautifully reimagined. Explore sculptural kadas, open cuffs and considered combinations that move with you, from a single statement to a treasured stack.",
    hero: "peacock-kada",
    note: "The pieces that move through generations.",
    story:
      "A bangle is more than an ornament. It holds the memory of a hand, an occasion, a gift. Find the form that feels right, and let the next chapter begin with you.",
  },
  {
    slug: "earrings",
    name: "Earrings",
    phrase: "A beautiful finishing touch.",
    description:
      "Frame a moment with a little light. Discover delicate lines and expressive combinations, chosen to complement the way you dress and the way you move.",
    hero: "sculpted-loop-earrings",
    note: "A little light. A lasting impression.",
    story:
      "Sometimes the finishing touch is the part you remember most. Try a new silhouette, return to a favourite, or find a pair that will become your signature.",
  },
  {
    slug: "ornaments",
    name: "Hand ornaments",
    phrase: "Beauty in every gesture.",
    description:
      "Fine connecting chains, floral motifs and the smallest considered details. Discover an ornament that brings its own character to the hand that wears it.",
    hero: "blush-floral-hand-ornament",
    note: "A graceful detail for a special moment.",
    story:
      "There is beauty in the little gestures: a hand held, a gift received, a moment shared. Let an expressive ornament become part of yours.",
  },
];

export const collections = collectionStories.map(({ hero, ...collection }) => {
  const primary = products.find((piece) => piece.id === hero);
  return {
    ...collection,
    image: primary.image,
    alt: primary.alt,
    position: "50% 50%",
    pieces: products.filter((piece) => piece.category === collection.slug),
  };
});

export function findCollection(slug) {
  return collections.find((collection) => collection.slug === slug);
}
