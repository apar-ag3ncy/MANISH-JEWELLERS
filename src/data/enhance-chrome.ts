// Copy owned by the chrome group. Prefix every export "chrome".

export const chromeEnhance = { version: 1 } as const;

/** 404, in miniature. One line replaces the old two-sentence paragraph. */
export const chromeNotFound = {
  body: "Collections and appointments open in the next release.",
} as const;
