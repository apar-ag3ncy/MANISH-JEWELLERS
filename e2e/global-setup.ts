/**
 * Warm the production server before the suite runs. The first request after
 * `next start` pays for route data and image optimisation; if that lands after the
 * loader's 5 s CSS failsafe the intro is (correctly) skipped, and a test that
 * expects the intro would fail for a reason that has nothing to do with the brand.
 */
export default async function globalSetup() {
  for (const path of ["/", "/home", "/about"]) {
    await fetch(`http://localhost:3000${path}`).catch(() => undefined);
  }
}
