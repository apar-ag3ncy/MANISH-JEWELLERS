// Copy owned by the home-bottom group (CutStudio, Bespoke, Testimonials, VisitStore).
// Every export is prefixed "homeBottom" so `export *` through content.ts never collides.
// House rule: one line each, quiet and declarative, no exclamation marks.

export const homeBottomCutStudio = {
  intro: "Five cuts, one slider, and the stone as it will actually sit.",
  /** Accessible name for the five progress dashes under the stage. */
  goTo: "Show cut",
  progressLabel: "Cut sequence",
} as const;

export const homeBottomBespoke = {
  lede: "Most of what leaves the atelier began as a conversation.",
  steps: [
    "A sketch, a reference, or a stone you already own.",
    "Hand drawings first, then a CAD render and a firm quotation.",
    "Cut, set and finished in Beawar. Six to eight weeks.",
  ],
  photo: {
    src: "/campaign/mj-318.jpg",
    alt: "A hennaed hand across the face, stacked gold bangles and rings",
  },
} as const;

export const homeBottomTestimonials = {
  heading: "In their words.",
  photo: {
    src: "/campaign/mj-255.jpg",
    alt: "A bride seated behind a blurred brass lamp, wearing a polki choker",
  },
} as const;
