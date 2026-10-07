import { test, expect } from "@playwright/test";

const years = [1916, 1932, 1952, 1988, 2025, 2026];

for (const viewport of [
  { width: 1440, height: 900, name: "desktop" },
  { width: 1280, height: 720, name: "laptop" },
  { width: 390, height: 844, name: "mobile" },
  { width: 320, height: 640, name: "small-mobile" },
]) {
  test(`the flowing heritage scenes animate and remain reachable on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/about");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const story = page.locator("#heritage");
    await expect(story).toHaveAttribute("data-enhanced", "true");
    const positions = [];
    for (const year of years) {
      const scene = page.locator(`#heritage-${year}`);
      const top = await scene.evaluate((element) => element.getBoundingClientRect().top + scrollY);
      positions.push(top);
      await page.evaluate((top) => window.scrollTo(0, top - 150), top);
      await expect(story).toHaveAttribute("data-active-year", String(year));
      await expect(scene.locator("[data-legacy-year]")).toHaveCSS("opacity", "1");
      await expect(scene).not.toHaveAttribute("aria-hidden");
      await expect(scene.locator("img")).toHaveJSProperty("complete", true);
      expect(await scene.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      expect(await scene.evaluate((element) => getComputedStyle(element).position)).toBe("relative");
      await expect(scene.locator(".legacy-object")).toBeVisible();
      if (year === 1916 || year === 2026)
        await page.screenshot({ path: `docs/screenshots/story-flow-${viewport.name}-${year}.png` });
    }
    for (let i = 1; i < positions.length; i++)
      expect(positions[i] - positions[i - 1]).toBeGreaterThan(viewport.height * 0.65);
    // Both the photography and the drawn symbol are actually driven by scrolling.
    const first = page.locator("#heritage-1916");
    await page.evaluate((top) => window.scrollTo(0, top - innerHeight * 0.75), positions[0]);
    await page.waitForTimeout(1100);
    const before = await first.locator("[data-object-core]").getAttribute("transform");
    const beforeStroke = await first
      .locator("[data-object-core] path")
      .first()
      .evaluate((path) => getComputedStyle(path).strokeDashoffset);
    await page.evaluate((top) => window.scrollTo(0, top + 100), positions[0]);
    await page.waitForTimeout(1100);
    expect(await first.locator("[data-object-core]").getAttribute("transform")).not.toBe(before);
    expect(
      await first
        .locator("[data-object-core] path")
        .first()
        .evaluate((path) => getComputedStyle(path).strokeDashoffset),
    ).not.toBe(beforeStroke);
    await story.getByRole("link", { name: "2026: The next generation", exact: true }).click();
    await expect(story).toHaveAttribute("data-active-year", "2026");
    await expect(page.locator("#heritage-2026 [data-legacy-year]")).toBeInViewport();
    await story.getByRole("link", { name: "1916: The beginning", exact: true }).click();
    await expect(story).toHaveAttribute("data-active-year", "1916");
    await expect(page.locator("html")).not.toHaveClass(/is-locked/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("chapter bookmarks and a live reduced-motion change keep all eras readable", async ({ page }) => {
  await page.goto("/about#heritage-2026");
  await expect(page.locator("#heritage")).toHaveAttribute("data-active-year", "2026");
  await expect(page.locator("#heritage-2026 [data-legacy-year]")).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#heritage")).not.toHaveAttribute("data-enhanced");
  for (const year of years) {
    await expect(page.locator(`#heritage-${year}`)).not.toHaveAttribute("aria-hidden");
    await expect(page.locator(`#heritage-${year} [data-legacy-text]`)).toHaveCSS("opacity", "1");
  }
});

for (const mode of ["reduced motion", "no JavaScript"]) {
  test(`${mode} retains the complete flowing story`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: mode !== "no JavaScript",
      reducedMotion: mode === "reduced motion" ? "reduce" : "no-preference",
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/about");
    await expect(page.locator("#heritage")).not.toHaveAttribute("data-enhanced");
    for (const year of years) {
      const heading = page.locator(`#heritage-${year} h3`);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeInViewport();
      await expect(heading).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await context.close();
  });
}

test("internal navigation, the collection and brochure work across routes", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/home");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("For a life beautifully celebrated.");
  await expect(page.locator("[data-pill]")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "docs/screenshots/collection-desktop.png", animations: "disabled" });
  await page.getByRole("link", { name: "Explore rings", exact: true }).click();
  await expect(page).toHaveURL(/\/collections\/rings$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A world in your hand.");
  await page.locator("footer").getByRole("link", { name: "Open the brochure", exact: true }).click();
  await expect(page).toHaveURL(/\/about#brochure$/);
  await expect(page.locator("#brochure")).toHaveAttribute("open", "");
  await expect(page.locator("#brochure")).toBeInViewport();
  await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Collections", exact: true })
    .click();
  await expect(page).toHaveURL(/\/collections$/);
  await page.getByRole("link", { name: "Discover our 110-year story", exact: true }).click();
  await expect(page).toHaveURL(/\/about#heritage$/);
  await expect(page.locator("#heritage")).toHaveAttribute("data-enhanced", "true");
  await page.locator("#heritage").getByRole("link", { name: "2026: The next generation", exact: true }).click();
  await expect(page.locator("#heritage")).toHaveAttribute("data-active-year", "2026");
  expect(errors).toEqual([]);
});
