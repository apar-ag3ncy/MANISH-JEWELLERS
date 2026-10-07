// Copy owned by the chrome group. Prefix every export "chrome".

export const chromeEnhance = { version: 1 } as const;

/** 404, in miniature. One line replaces the old two-sentence paragraph. */
export const chromeNotFound = {
  body: "This page could not be found. Explore the collection or return to the house.",
} as const;
