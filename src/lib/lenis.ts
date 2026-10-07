"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;
const locks = new Set<string>();

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis() {
  return instance;
}

/** Lock page scroll (preloader, mobile menu). Works with or without Lenis. */
export function lockScroll(owner: string) {
  locks.add(owner);
  document.documentElement.classList.add("is-locked");
  instance?.stop();
}

export function unlockScroll(owner: string) {
  locks.delete(owner);
  if (locks.size) return;
  document.documentElement.classList.remove("is-locked");
  instance?.start();
}
