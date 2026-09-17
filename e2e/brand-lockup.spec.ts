import { test, expect } from "@playwright/test";
import { LOCKUP } from "../src/components/ui/brand/lockup-data";

/**
 * The brand requirement, as a permanent check: the loading and landing page use
 * strictly the real Manish Jewellers lockup — the vector outlines taken from the
 * master logo PDF — and replicate it in animation. If anyone swaps it for typed
 * text, drops the tagline, or breaks the loader's hand-off, this fails.
 */

const LABEL = "Manish Jewellers. Crafted through generations.";

test.describe("landing: the real lockup, animated", () => {
  test("the loader plays, then hands off to the hero", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-intro", "done", { timeout: 12_000 });
    // the loader records its own sequence, so a fast hand-off cannot be missed
    await expect(html).toHaveAttribute("data-intro-log", "playing,done");
    await expect(page.locator(".mj-preloader")).toBeHidden();
  });

  test("the hero renders the lockup from the master logo vectors, not typed text", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 12_000 });

    const lockup = page.locator("[data-lockup-flip] svg[role=img]").first();
    await expect(lockup).toHaveAttribute("aria-label", LABEL);

    // the monogram on screen is byte-for-byte the outline from the PDF
    const monoPath = await lockup.locator("[data-mono-fill] path").first().getAttribute("d");
    expect(monoPath).toBe(LOCKUP.monogram.d);

    // every wordmark and tagline glyph is present as a vector
    await expect(lockup.locator("[data-glyph]")).toHaveCount(LOCKUP.wordmark.glyphs.length);
    await expect(lockup.locator("[data-tag]")).toHaveCount(LOCKUP.tagline.glyphs.length);

    // and the h1 carries no typed brand name that could drift from the mark
    const typed = (await page.locator("h1[data-lockup-flip]").innerText()).trim();
    expect(typed).toBe("");
  });

  test("after the intro the lockup is fully visible and in place", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 12_000 });
    const flip = page.locator("[data-lockup-flip]");
    const state = await flip.evaluate((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const fill = el.querySelector("[data-mono-fill]") as HTMLElement | null;
      return {
        transform: cs.transform,
        raised: el.classList.contains("z-[120]"),
        monoOpacity: fill ? getComputedStyle(fill).opacity : null,
        onScreen: r.top >= 0 && r.bottom <= window.innerHeight,
      };
    });
    expect(state.raised).toBe(false);
    expect(state.monoOpacity).toBe("1");
    expect(state.onScreen).toBe(true);
    expect(["none", "matrix(1, 0, 0, 1, 0, 0)"]).toContain(state.transform);
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no loader, and the lockup is simply there", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 8_000 });
    await expect(page.locator(".mj-preloader")).toBeHidden();
    const lockup = page.locator("[data-lockup-flip] svg[role=img]").first();
    await expect(lockup).toBeVisible();
    await expect(lockup).toHaveAttribute("aria-label", LABEL);
  });
});
