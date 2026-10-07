// Real photographs from public/brochure. Editorial names, without invented prices.
export const collections = [
  {
    slug: "necklaces",
    name: "Necklaces",
    phrase: "Close to the heart.",
    description:
      "A necklace can hold a whole occasion. Discover expressive silhouettes, intricate settings and the details that make a piece feel personal.",
    image: "/brochure/br-haram-pearl.jpg",
    alt: "An ornate gold necklace with pearl drops and green accents",
    position: "50% 50%",
    note: "From an intimate celebration to a grand entrance.",
    pieces: [
      {
        name: "The pearl haram",
        image: "/brochure/br-haram-pearl.jpg",
        alt: "Long gold necklace with pearl drops",
        detail: "A long silhouette, softened by pearls.",
      },
      {
        name: "The emerald expression",
        image: "/brochure/br-necklace-green.jpg",
        alt: "Gold necklace with green stones",
        detail: "Rich green accents and a sculpted gold rhythm.",
      },
      {
        name: "The pearl choker",
        image: "/brochure/br-choker-pearl.jpg",
        alt: "Gold choker with pearls and ruby coloured details",
        detail: "An intricate composition, worn close.",
      },
      {
        name: "The ceremonial set",
        image: "/brochure/br-set-emerald.jpg",
        alt: "Coordinated necklace, earrings and bangles with green stones",
        detail: "A complete expression for a moment to remember.",
      },
    ],
    story:
      "Some pieces enter a family with a celebration. Years later, they tell that story again. Choose the necklace you love today, with room for all the memories still to come.",
  },
  {
    slug: "rings",
    name: "Rings",
    phrase: "A world in your hand.",
    description:
      "A small canvas for extraordinary detail. Explore sculptural forms, colour and character, from a quiet accent to a piece that starts a conversation.",
    image: "/brochure/br-ring-peacock.jpg",
    alt: "A sculptural gold peacock ring against a pink background",
    position: "50% 50%",
    note: "Little treasures. Unmistakable character.",
    pieces: [
      {
        name: "The peacock",
        image: "/brochure/br-ring-peacock.jpg",
        alt: "Enamelled gold peacock ring",
        detail: "An expressive form, with colour in every curve.",
      },
      {
        name: "The ruby bloom",
        image: "/brochure/br-ring-ruby.jpg",
        alt: "Gold ring with a red centre and ornate circular setting",
        detail: "A vivid centre framed by intricate gold work.",
      },
      {
        name: "The floral composition",
        image: "/brochure/br-ring-flower.jpg",
        alt: "Statement floral ring with coloured stones",
        detail: "An open bloom, made for a bold expression.",
      },
    ],
    story:
      "The most personal piece is often the one you see every day. Let the shape, colour and feel guide you towards a ring that becomes part of your own story.",
  },
  {
    slug: "bangles",
    name: "Bangles",
    phrase: "Tradition in motion.",
    description:
      "A familiar gesture, beautifully reimagined. Explore ornate kadas and considered combinations that move with you, from a single statement to a treasured stack.",
    image: "/brochure/br-kada-emerald.jpg",
    alt: "An ornate gold kada with green accents on a stone surface",
    position: "50% 50%",
    note: "The pieces that move through generations.",
    pieces: [
      {
        name: "The emerald kada",
        image: "/brochure/br-kada-emerald.jpg",
        alt: "Ornate gold kada with green accents",
        detail: "Sculpted detail and a rich touch of colour.",
      },
      {
        name: "The golden pair",
        image: "/brochure/br-kada-sand.jpg",
        alt: "A pair of intricately crafted gold kadas on sand",
        detail: "A warm, intricate expression of the craft.",
      },
      {
        name: "The considered stack",
        image: "/brochure/br-bangles-trio.jpg",
        alt: "Three gold bangles on a stone dish",
        detail: "Three distinct rhythms, beautifully together.",
      },
      {
        name: "The vine bracelet",
        image: "/brochure/br-bracelet-vine.jpg",
        alt: "A delicate gold vine bracelet with coloured stones",
        detail: "An open, delicate line inspired by nature.",
      },
    ],
    story:
      "A bangle is more than an ornament. It holds the memory of a hand, an occasion, a gift. Find the form that feels right, and let the next chapter begin with you.",
  },
  {
    slug: "earrings",
    name: "Earrings",
    phrase: "A beautiful finishing touch.",
    description:
      "Frame a moment with a little light. Discover delicate lines and expressive combinations, chosen to complement the way you dress and the way you move.",
    image: "/brochure/br-earrings-rose.jpg",
    alt: "Rose toned earrings arranged on pale silk",
    position: "50% 50%",
    note: "A little light. A lasting impression.",
    pieces: [
      {
        name: "The rose loops",
        image: "/brochure/br-earrings-rose.jpg",
        alt: "Rose toned loop earrings on silk",
        detail: "A light, flowing silhouette with a contemporary spirit.",
      },
      {
        name: "The ruby pairing",
        image: "/brochure/br-set-ruby.jpg",
        alt: "Ruby coloured earrings alongside a matching necklace",
        detail: "A coordinated expression in a rich ruby hue.",
      },
      {
        name: "The ceremonial pairing",
        image: "/brochure/br-set-emerald.jpg",
        alt: "Green accented earrings displayed with a matching jewellery set",
        detail: "Earrings shown as part of the house’s ceremonial set.",
      },
    ],
    story:
      "Sometimes the finishing touch is the part you remember most. Try a new silhouette, return to a favourite, or find a pair that will become your signature.",
  },
];

export function findCollection(slug) {
  return collections.find((collection) => collection.slug === slug);
}
