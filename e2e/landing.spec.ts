import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 320, height: 640 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  test(`landing fits ${viewport.width}px and every collection is reachable`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page).toHaveTitle("Manish Jewellers — Crafted through generations");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator(".landing-hero-copy")).toBeHidden();
    if (viewport.width === 1440 || viewport.width === 390) {
      await page.screenshot({
        path: `docs/screenshots/landing-${viewport.width === 1440 ? "desktop" : "mobile"}-updated.png`,
      });
    }
    for (const label of ["Explore necklaces", "Explore rings", "Explore bangles"]) {
      const card = page.locator("#collections").getByRole("link", { name: label, exact: true });
      await card.scrollIntoViewIfNeeded();
      await expect(card).toBeInViewport();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });
}

test("campaign controls wrap, support keyboard navigation and pause", async ({ page }) => {
  await page.goto("/#campaign");
  const carousel = page.getByRole("region", { name: "The bridal campaign" });
  await expect(carousel).toBeInViewport();
  await carousel.getByRole("button", { name: "Pause slideshow" }).click();
  await expect(carousel.getByRole("button", { name: "Play slideshow" })).toBeVisible();
  await carousel.getByRole("button", { name: "Show slide 4" }).click();
  await expect(carousel.getByRole("heading")).toHaveText("The Bridal Edit, 2026.");
  await carousel.getByRole("button", { name: "Next slide" }).click();
  await expect(carousel.getByRole("heading")).toHaveText("Polki, set by hand.");
  await carousel.getByRole("button", { name: "Next slide" }).press("ArrowLeft");
  await expect(carousel.getByRole("heading")).toHaveText("The Bridal Edit, 2026.");
  await expect(carousel.getByRole("group", { name: /of 4/ })).toHaveCount(1);
});

test("direct landing anchors survive the intro", async ({ page }) => {
  await page.goto("/#visit");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "done");
  await expect(page.locator("#visit")).toBeInViewport();
  await expect(page.locator("html")).not.toHaveClass(/is-locked/);
});

test("short-screen menu traps focus, closes with Escape and releases scroll", async ({ page }) => {
  await page.setViewportSize({ width: 812, height: 375 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu).toBeVisible();
  await expect(page.locator("main")).toHaveAttribute("inert", "");
  await expect(page.locator("[data-house-finale]")).toHaveAttribute("inert", "");
  await expect(menu.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(menu.getByRole("link", { name: "Visit our showroom" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(page.locator("html")).not.toHaveClass(/is-locked/);
  await expect(page.locator("main")).not.toHaveAttribute("inert", "");
  await expect(page.locator("[data-house-finale]")).not.toHaveAttribute("inert", "");
});

test("landing links have real targets and images load", async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hrefs = await page.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
  for (const href of hrefs) {
    expect(href).not.toMatch(/000000|instagram\.com\/$/);
    if (href.startsWith("#") || href.startsWith("/#"))
      await expect(page.locator(href.slice(href.indexOf("#")))).toHaveCount(1);
  }
  const images = await page.locator("main img").evaluateAll((imgs) => imgs.map((img) => (img as HTMLImageElement).src));
  for (const src of images) expect((await request.get(src)).ok()).toBe(true);
  await expect(page.locator("footer form")).toHaveCount(0);
});

test("landing content and collections remain usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/");
  await expect(page.locator(".mj-preloader")).toBeHidden();
  await expect(page.locator(".landing-hero-copy")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const card = page.locator("#collections").getByRole("link", { name: "Explore bangles", exact: true });
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeInViewport();
  await expect(page.locator("html")).not.toHaveClass(/is-locked/);
  await context.close();
});

test("the restored internal pages have their own canonical URLs", async ({ page, request }) => {
  for (const path of ["/home", "/about"]) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
  }
  await page.goto("/home#collections");
  await expect(page).toHaveURL(/\/home#collections$/);
  await expect(page.locator("#collections")).toBeInViewport();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://manishjewellers.in/home");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/home");
  expect(sitemap).toContain("/about");
});

test("the bespoke tools and landing brochure stay interactive", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/bespoke");
  await page.getByText("Explore diamond cuts", { exact: true }).click();
  await page.getByRole("button", { name: "Oval", exact: true }).click();
  await expect(page.getByRole("img", { name: "Oval, 1.00 carats" })).toBeVisible();
  await page.getByRole("slider", { name: "Carat weight" }).press("ArrowRight");
  await expect(page.getByRole("img", { name: "Oval, 1.05 carats" })).toBeVisible();
  await page.getByText("Find your fit", { exact: true }).click();
  await page.getByRole("button", { name: "Kundan kada, pair" }).click();
  await expect(page.getByRole("slider", { name: "Inner diameter" })).toHaveValue("58");
  await page.goto("/#our-story");
  await page.getByText("Explore the house brochure", { exact: true }).click();
  await page.getByRole("button", { name: "Next page", exact: true }).click();
  await expect(page.locator("#brochure .eyebrow")).toHaveText("02 / 12");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
