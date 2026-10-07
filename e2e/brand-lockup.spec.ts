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

    // The animated visual uses outlines; the separate h1 is for screen readers.
    const typed = (await page.locator("[data-lockup-flip]").innerText()).trim();
    expect(typed).toBe("");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(LABEL);
  });

  test("the lockup settles into place during the wine opening", async ({ page }) => {
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

  test("no loader or central overlay; the complete photograph is shown immediately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "done", { timeout: 8_000 });
    await expect(page.locator(".mj-preloader")).toBeHidden();
    await expect(page.locator(".landing-hero-photo")).toHaveCSS("opacity", "1");
    await expect(page.locator(".landing-hero-copy")).toBeHidden();
    await expect(page.locator(".landing-hero-copy")).toHaveAttribute("inert", "");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(LABEL);
    await expect(page.getByRole("link", { name: "Manish Jewellers", exact: true })).toBeVisible();
  });
});

for (const viewport of [
  { width: 1440, height: 900, name: "desktop" },
  { width: 390, height: 844, name: "mobile" },
]) {
  test(`opening visibly progresses from logo to wine to photograph on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    // Observe actual rendered properties throughout the animation, including the
    // trace/letter assembly; a data attribute alone cannot prove the sequence.
    await page.addInitScript(() => {
      type Frame = { phase: string; photo: number; fill: number; stroke: number; glyph: number; copy: number; overlay: number };
      const target = window as typeof window & { openingFrames: Frame[] };
      target.openingFrames = [];
      let previous = 0;
      const sample = (time: number) => {
        const hero = document.querySelector<HTMLElement>(".landing-hero");
        if (hero && time - previous > 60) {
          previous = time;
          const opacity = (selector: string) => Number(getComputedStyle(hero.querySelector(selector)!).opacity);
          target.openingFrames.push({
            phase: hero.dataset.openingStage!,
            photo: opacity(".landing-hero-photo"),
            fill: opacity("[data-mono-fill]"),
            stroke: parseFloat(getComputedStyle(hero.querySelector("[data-mono-draw] path")!).strokeDashoffset),
            glyph: opacity("[data-glyph]"),
            copy: opacity(".landing-hero-lede"),
            overlay: opacity(".landing-hero-copy"),
          });
        }
        if (time < 15_000) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
    });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hero = page.locator(".landing-hero");
    const photo = hero.locator(".landing-hero-photo");
    await expect(hero).toHaveAttribute("data-opening-stage", "brand");
    await expect(photo).toHaveCSS("opacity", "0");
    const logo = await hero.locator("[data-lockup-flip]").boundingBox();
    expect(logo).not.toBeNull();
    expect(Math.abs(logo!.y + logo!.height / 2 - viewport.height / 2)).toBeLessThan(2);
    await expect(hero.locator("[data-mono-fill]")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `docs/screenshots/intro-${viewport.name}-brand.png` });

    await expect(hero).toHaveAttribute("data-opening-stage", "wine");
    await expect(page.locator(".mj-preloader")).toBeHidden();
    await expect(photo).toHaveCSS("opacity", "0");
    await expect(hero.locator(".landing-hero-lede")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `docs/screenshots/intro-${viewport.name}-wine.png` });

    await expect(hero).toHaveAttribute("data-opening-stage", "photograph");
    await expect(photo).toHaveCSS("opacity", "1");
    const photoBounds = await photo.boundingBox();
    expect(photoBounds).toMatchObject({ x: 0, y: 0, width: viewport.width, height: viewport.height });
    await expect(photo.locator("img").first()).toHaveJSProperty("complete", true);
    expect(await photo.locator("img").first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    const copy = hero.locator(".landing-hero-copy");
    await expect(copy).toBeHidden();
    await expect(copy).toHaveCSS("opacity", "0");
    await expect(copy).toHaveAttribute("inert", "");
    await expect(copy.locator("[data-lockup-flip]")).toBeHidden();
    await expect(copy.locator(".landing-hero-lede")).toBeHidden();
    for (const link of await copy.locator("a").all()) await expect(link).toBeHidden();
    await page.screenshot({ path: `docs/screenshots/intro-${viewport.name}-photograph.png` });
    // The vanished buttons must also disappear from keyboard navigation.
    const lastHeaderControl = viewport.name === "desktop"
      ? page.getByRole("link", { name: "Visit our showroom", exact: true })
      : page.getByRole("button", { name: "Open menu", exact: true });
    await lastHeaderControl.focus();
    await page.keyboard.press("Tab");
    await expect(hero.getByRole("region", { name: "House photographs", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(hero.locator(".landing-discover")).toBeFocused();
    expect(await page.evaluate(() => scrollY)).toBe(0);

    const frames = await page.evaluate(() => (window as typeof window & {
      openingFrames: { phase: string; photo: number; fill: number; stroke: number; glyph: number; copy: number; overlay: number }[];
    }).openingFrames);
    const brand = frames.filter((frame) => frame.phase === "brand");
    expect(brand.some((frame) => frame.stroke > 1 && frame.fill < 1 && frame.glyph < 1)).toBe(true);
    expect(brand.some((frame) => frame.stroke === 0 && frame.fill === 1 && frame.glyph === 1)).toBe(true);
    expect(brand.every((frame) => frame.photo === 0)).toBe(true);
    const wine = frames.filter((frame) => frame.phase === "wine");
    expect(wine.some((frame) => frame.photo === 0 && frame.copy === 1 && frame.overlay === 1)).toBe(true);
    expect(frames.some((frame) => frame.phase === "photograph-reveal" && frame.photo > 0 && frame.photo < 1)).toBe(true);
    expect(frames.some((frame) => frame.phase === "photograph-reveal" && frame.overlay > 0 && frame.overlay < 1)).toBe(true);
    expect(errors).toEqual([]);
  });
}
