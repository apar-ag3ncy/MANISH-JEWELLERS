"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/** Lock page scroll (preloader, mobile menu). Works with or without Lenis. */
export function lockScroll() {
  document.documentElement.classList.add("is-locked");
  instance?.stop();
}

export function unlockScroll() {
  document.documentElement.classList.remove("is-locked");
  instance?.start();
}
