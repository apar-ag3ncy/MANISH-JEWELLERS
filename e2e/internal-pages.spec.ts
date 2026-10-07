import { test, expect } from "@playwright/test";

const routes = [
  "/collections",
  "/collections/necklaces",
  "/collections/rings",
  "/collections/bangles",
  "/collections/earrings",
  "/bespoke",
  "/campaign",
  "/diamond-guide",
  "/visit",
];

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 640 },
]) {
  test(`internal pages fit ${viewport.width}px with real assets and working canonical routes`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response!.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://manishjewellers.in${route}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const images = await page
        .locator("main img")
        .evaluateAll((elements) => elements.map((element) => (element as HTMLImageElement).src));
      for (const image of images) expect((await request.get(image)).ok()).toBe(true);
      if (
        viewport.width !== 320 &&
        ["/collections", "/campaign", "/bespoke", "/visit", "/collections/rings"].includes(route)
      ) {
        await page.screenshot({
          path: `docs/screenshots/internal-${route.slice(1).replaceAll("/", "-")}-${viewport.width}.png`,
        });
      }
    }
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const route of routes) expect(sitemap).toContain(`https://manishjewellers.in${route}`);
    expect(errors).toEqual([]);
  });
}

test("collection arrows, reverse navigation, mouse drag and category routes work", async ({ page }) => {
  await page.goto("/collections#collections");
  const track = page.getByRole("region", { name: "The house collection" });
  await expect(track).toBeInViewport();
  const next = page.getByRole("button", { name: "Next collection", exact: true });
  const previous = page.getByRole("button", { name: "Previous collection", exact: true });
  await expect(previous).toBeDisabled();
  for (const label of ["Explore rings", "Explore bangles", "Explore earrings"]) {
    await next.click();
    await expect(track).not.toHaveAttribute("data-sliding");
    const link = track.getByRole("link", { name: label, exact: true });
    const bounds = await link.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(-2);
    expect(bounds!.x + bounds!.width).toBeLessThan(page.viewportSize()!.width + 1);
  }
  await expect(next).toBeDisabled();
  await previous.click();
  await expect(track).not.toHaveAttribute("data-sliding");
  await expect(next).toBeEnabled();
  const before = await track.evaluate((element) => element.scrollLeft);
  const bounds = await track.boundingBox();
  await page.mouse.move(bounds!.x + 200, bounds!.y + 200);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + 650, bounds!.y + 200, { steps: 15 });
  await page.mouse.up();
  expect(await track.evaluate((element) => element.scrollLeft)).toBeLessThan(before - 100);
  await expect(page).toHaveURL(/\/collections#collections$/);
  await track.getByRole("link", { name: "Explore rings", exact: true }).focus();
  await expect(track).not.toHaveAttribute("data-sliding");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/collections\/rings$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("A world in your hand.");
});

test("desktop collection menu is keyboard accessible and reflects the active page", async ({ page }) => {
  await page.goto("/collections/rings");
  const primary = page.getByRole("navigation", { name: "Primary", exact: true });
  await expect(primary.getByRole("link", { name: "Collections", exact: true })).toHaveAttribute("aria-current", "page");
  const trigger = primary.getByRole("button", { name: "Show collection categories" });
  await expect(trigger).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(trigger).toHaveCSS("border-width", "0px");
  await expect(trigger).toHaveCSS("box-shadow", "none");
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const menu = page.locator("#collection-menu");
  await expect(menu.getByRole("link", { name: /Rings/ })).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.press("Enter");
  await page.keyboard.press("Tab");
  await expect(menu.getByRole("link", { name: /Necklaces/ })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/collections\/necklaces$/);
  await expect(menu).toBeHidden();
});

test("mobile menu opens a collection page and releases the page scroll", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/campaign");
  await expect(page.locator("[data-pill]")).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await menu.getByRole("link", { name: "Bangles", exact: true }).click();
  await expect(page).toHaveURL(/\/collections\/bangles$/);
  await expect(menu).toBeHidden();
  await expect(page.locator("html")).not.toHaveClass(/is-locked/);
  await expect(page.locator("main")).not.toHaveAttribute("inert");
});

test("GSAP scroll fades reverse, images uncover left to right and reduced motion restores content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/campaign");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  const copy = page.locator(".bridal-chapter-copy").first();
  const image = page.locator(".bridal-chapter-image").first();
  const box = await copy.evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    height: element.getBoundingClientRect().height,
  }));
  const start = box.top - 900 * 0.96;
  const travel = box.height + 900 * 0.9;
  await page.evaluate((top) => window.scrollTo(0, top), start + travel * 0.5);
  await expect
    .poll(async () => Number(await copy.evaluate((element) => getComputedStyle(element).opacity)))
    .toBeGreaterThan(0.98);
  await page.evaluate((top) => window.scrollTo(0, top), box.top + box.height + 120);
  await expect
    .poll(async () => Number(await copy.evaluate((element) => getComputedStyle(element).opacity)))
    .toBeLessThan(0.1);
  await page.evaluate((top) => window.scrollTo(0, top), start + travel * 0.5);
  await expect
    .poll(async () => Number(await copy.evaluate((element) => getComputedStyle(element).opacity)))
    .toBeGreaterThan(0.98);
  const imageTop = await image.evaluate((element) => element.getBoundingClientRect().top + scrollY);
  await page.evaluate((top) => window.scrollTo(0, top), imageTop - 900 * 0.9);
  await expect
    .poll(async () => await image.evaluate((element) => parseFloat(getComputedStyle(element).clipPath.split(" ")[1])))
    .toBeGreaterThan(75);
  await page.evaluate((top) => window.scrollTo(0, top), imageTop - 900 * 0.26);
  await expect(image).toHaveCSS("clip-path", "inset(0px 0% 0px 0px)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const element of await page.locator("[data-scroll-fade]").all()) await expect(element).toHaveCSS("opacity", "1");
  for (const element of await page.locator("[data-image-swipe]").all())
    await expect(element).toHaveCSS("clip-path", "none");
});

test("new pages stay readable without JavaScript and showroom details open natively", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  for (const route of ["/collections", "/collections/necklaces", "/bespoke", "/campaign", "/visit"]) {
    await page.goto(`http://localhost:3000${route}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const element of await page.locator("[data-image-swipe]").all())
      await expect(element).toHaveCSS("clip-path", "none");
  }
  await page.getByText("Can I discuss a bespoke piece?", { exact: true }).click();
  await expect(page.locator("details[open]")).toContainText("Bring a sketch");
  await expect(page.getByRole("link", { name: "Open in Google Maps" })).toHaveAttribute("href", /maps.google.com/);
  await context.close();
});
