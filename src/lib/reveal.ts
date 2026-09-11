"use client";

/**
 * Tiny pub/sub so the Hero and Navbar can wait for the Preloader's wipe
 * without prop drilling. On pages without a Preloader every subscriber
 * runs immediately.
 */
type State = "idle" | "pending" | "done";

let state: State = "idle";
let subscribers: Array<() => void> = [];

export function holdReveal() {
  state = "pending";
}

export function releaseReveal() {
  state = "done";
  const list = subscribers;
  subscribers = [];
  list.forEach((fn) => fn());
}

export function resetReveal() {
  state = "idle";
  subscribers = [];
}

/** Runs `fn` now, or when the preloader releases. Returns an unsubscribe. */
export function onReveal(fn: () => void): () => void {
  if (state !== "pending") {
    fn();
    return () => {};
  }
  subscribers.push(fn);
  return () => {
    subscribers = subscribers.filter((s) => s !== fn);
  };
}

export function isRevealPending() {
  return state === "pending";
}
