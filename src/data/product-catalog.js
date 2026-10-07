import brochureProducts from "./brochure-products.json";

export const products = brochureProducts;

export const productCategories = [
  { slug: "necklaces", name: "Necklaces" },
  { slug: "bangles", name: "Bangles" },
  { slug: "rings", name: "Rings" },
  { slug: "earrings", name: "Earrings" },
  { slug: "ornaments", name: "Hand ornaments" },
];

export function categoryName(slug) {
  return productCategories.find((category) => category.slug === slug)?.name ?? slug;
}

// A varied introduction. The complete, unduplicated edit lives in collections.
export const featuredProducts = [
  products.find((piece) => piece.category === "necklaces"),
  products.find((piece) => piece.category === "bangles"),
  products.find((piece) => piece.category === "earrings"),
  products.find((piece) => piece.category === "rings"),
  products.find((piece) => piece.category === "ornaments"),
  products.filter((piece) => piece.category === "necklaces").at(-1),
].filter(Boolean);
