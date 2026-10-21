import { test, expect } from "@playwright/test";

const chapters = ["1915", "craft", "trust", "2026"];

for (const viewport of [
  { width: 1440, height: 900, name: "desktop" },
  { width: 1280, height: 720, name: "laptop" },
  { width: 1024, height: 768, name: "small-laptop" },
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
    const heritageVisual = page.locator(".house-heritage-visual img");
    await expect(heritageVisual).toHaveJSProperty("complete", true);
    expect(await heritageVisual.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    await page.locator(".house-introduction").screenshot({
      path: `docs/screenshots/legacy-${viewport.name}-1915.png`,
    });
    const story = page.locator("#heritage");
    await expect(story).toHaveAttribute("data-enhanced", "true");
    const positions = [];
    for (const chapter of chapters) {
      const scene = page.locator(`#heritage-${chapter}`);
      const top = await scene.evaluate((element) => element.getBoundingClientRect().top + scrollY);
      positions.push(top);
      await page.evaluate((top) => window.scrollTo(0, top - 150), top);
      await expect(story).toHaveAttribute("data-active-chapter", chapter);
      await expect(scene.locator("[data-legacy-year]")).toHaveCSS("opacity", "1");
      await expect(scene).not.toHaveAttribute("aria-hidden");
      await expect(scene.locator("img")).toHaveJSProperty("complete", true);
      expect(await scene.locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
      expect(await scene.evaluate((element) => getComputedStyle(element).position)).toBe("relative");
      await expect(scene.locator(".legacy-object")).toBeVisible();
      if (chapter === "1915" || chapter === "2026")
        await page.screenshot({ path: `docs/screenshots/story-flow-${viewport.name}-${chapter}.png` });
    }
    for (let i = 1; i < positions.length; i++)
      expect(positions[i] - positions[i - 1]).toBeGreaterThan(viewport.height * 0.65);
    // Both the photography and the drawn symbol are actually driven by scrolling.
    const first = page.locator("#heritage-1915");
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
    await expect(story).toHaveAttribute("data-active-chapter", "2026");
    await expect(page.locator("#heritage-2026 [data-legacy-year]")).toBeInViewport();
    await story.getByRole("link", { name: "1915: The beginning", exact: true }).click();
    await expect(story).toHaveAttribute("data-active-chapter", "1915");
    await expect(page.locator("html")).not.toHaveClass(/is-locked/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("chapter bookmarks and a live reduced-motion change keep all eras readable", async ({ page }) => {
  await page.goto("/about#heritage-2026");
  await expect(page.locator("#heritage")).toHaveAttribute("data-active-chapter", "2026");
  await expect(page.locator("#heritage-2026 [data-legacy-year]")).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#heritage")).not.toHaveAttribute("data-enhanced");
  for (const chapter of chapters) {
    await expect(page.locator(`#heritage-${chapter}`)).not.toHaveAttribute("aria-hidden");
    await expect(page.locator(`#heritage-${chapter} [data-legacy-text]`)).toHaveCSS("opacity", "1");
  }
});

test("the website story stays grounded in the new brief", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator(".house-anniversary-founding")).toContainText(/Since\s+1915/);
  await expect(page.locator(".house-anniversary-dates")).toContainText("111 years in 2026");
  const story = page.locator("#heritage");
  await expect(story.locator("[data-legacy-scene]")).toHaveCount(4);
  await expect(story).toContainText("Your faith, support and blessings brought us here.");
  await expect(story).toContainText("honesty and care");
  await expect(story).not.toContainText(/silver|1932|1952|1988|2025/i);
  await page.locator("#brochure").evaluate((element: HTMLDetailsElement) => (element.open = true));
  await expect(page.locator('#brochure img[src*="page-04"]')).toHaveCount(0);
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
    for (const chapter of chapters) {
      const heading = page.locator(`#heritage-${chapter} h3`);
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeInViewport();
      await expect(heading).toBeVisible();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await context.close();
  });
}

test("the collection leads into the family story and selected brochure spreads", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/home");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("For every");
  await page.getByRole("link", { name: "Discover the collection", exact: true }).click();
  await expect(page).toHaveURL(/\/collections#all-pieces$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Little details.");
  await page.getByRole("link", { name: "Our story · Since 1915", exact: true }).click();
  await expect(page).toHaveURL(/\/about#heritage$/);
  await expect(page.locator("#heritage")).toHaveAttribute("data-enhanced", "true");
  await page.locator("#heritage").getByRole("link", { name: "2026: The next generation", exact: true }).click();
  await expect(page.locator("#heritage")).toHaveAttribute("data-active-chapter", "2026");
  await page.locator("#brochure summary").click();
  await expect(page.locator("#brochure")).toHaveAttribute("open", "");
  await expect(page.locator('#brochure img[src*="page-04"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
