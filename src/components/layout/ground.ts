"use client";

/**
 * A one-bit store: does the current route paint its own wine ground?
 *
 * The Navbar decides its transparent-state colours from the pathname, which works for
 * the landing page but cannot know about a wine page reached at an arbitrary URL — the
 * 404. Such a page renders <WineRoute /> and the Navbar goes cream over it.
 */

let wineGround = false;
const subscribers = new Set<() => void>();

export function setWineGround(next: boolean) {
  if (wineGround === next) return;
  wineGround = next;
  subscribers.forEach((fn) => fn());
}

export function subscribeGround(fn: () => void) {
  subscribers.add(fn);
  return () => {
    subscribers.delete(fn);
  };
}

export function getWineGround() {
  return wineGround;
}

/** The server always renders the light chrome; the wine route corrects it on mount. */
export function getWineGroundServer() {
  return false;
}
