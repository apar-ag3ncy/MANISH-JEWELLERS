import { test, expect, type Locator, type Page } from "@playwright/test";
import { stat } from "node:fs/promises";
import path from "node:path";
import products from "../src/data/brochure-products.json";

const categories = [
  { slug: "necklaces", name: "Necklaces" },
  { slug: "bangles", name: "Bangles" },
  { slug: "rings", name: "Rings" },
  { slug: "earrings", name: "Earrings" },
  { slug: "ornaments", name: "Hand ornaments" },
];

const runtimeErrors = new WeakMap<Page, string[]>();

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  runtimeErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page), "No browser runtime or hydration errors").toEqual([]);
});

async function decoded(image: Locator) {
  await expect(image).toHaveJSProperty("complete", true);
  expect(
    await image.evaluate(async (element: HTMLImageElement) => {
      await element.decode();
      return element.naturalWidth > 0 && element.naturalHeight > 0;
    }),
  ).toBe(true);
}

async function productIds(gallery: Locator) {
  return gallery
    .locator("[data-product-id]")
    .evaluateAll((cards) => cards.map((card) => card.getAttribute("data-product-id")));
}

test("all sixteen original product photographs are available, decoded and shown once", async ({ page, request }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/collections#all-pieces");
  const gallery = page.locator("#all-pieces");
  expect(products).toHaveLength(16);
  const ids = await productIds(gallery);
  expect(new Set(ids).size).toBe(16);
  expect(ids).toEqual(products.map((piece) => piece.id));
  for (const piece of products) {
    const file = await stat(path.join(process.cwd(), "public", piece.image));
    expect(file.isFile(), piece.image).toBe(true);
    expect(file.size, piece.image).toBeGreaterThan(1000);
    const response = await request.get(piece.image);
    expect(response.ok(), piece.image).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/webp");
    const card = gallery.locator(`[data-product-id="${piece.id}"]`);
    await card.scrollIntoViewIfNeeded();
    const image = card.getByRole("img", { name: piece.alt, exact: true });
    await decoded(image);
    await expect(image).toHaveCSS("object-fit", "contain");
    await expect(card).toHaveCSS("opacity", "1");
    await expect(card.getByRole("link", { name: `Take a closer look: ${piece.name}`, exact: true })).toHaveAttribute(
      "href",
      piece.image,
    );
  }
});

test("five jewellery filters show the complete matching category and preserve native links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/collections#all-pieces");
  const gallery = page.locator("#all-pieces");
  const filters = gallery.getByRole("navigation", { name: "Filter jewellery" });
  for (const category of categories) {
    const matching = products.filter((piece) => piece.category === category.slug);
    const filter = filters.getByRole("link", {
      name: `${category.name} ${String(matching.length).padStart(2, "0")}`,
      exact: true,
    });
    await expect(filter).toHaveAttribute("href", `/collections/${category.slug}#the-edit`);
    await filter.click();
    await expect(filter).toHaveAttribute("aria-current", "true");
    await expect(gallery.locator("[data-product-id]")).toHaveCount(matching.length);
    expect(await productIds(gallery)).toEqual(matching.map((piece) => piece.id));
    await expect(gallery.locator(".product-edit-count")).toHaveText(
      `${String(matching.length).padStart(2, "0")} pieces to discover`,
    );
    await expect(page).toHaveURL(/\/collections#all-pieces$/);
  }
  const all = filters.getByRole("link", { name: "All pieces 16", exact: true });
  await all.click();
  await expect(all).toHaveAttribute("aria-current", "true");
  expect(await productIds(gallery)).toEqual(products.map((piece) => piece.id));
});

test("every category route contains every matching photograph, including hand ornaments", async ({ page }) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const category of categories) {
    const response = await page.goto(`/collections/${category.slug}#the-edit`);
    expect(response!.status()).toBe(200);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://manishjewellers.in/collections/${category.slug}`,
    );
    const gallery = page.locator("#the-edit");
    const matching = products.filter((piece) => piece.category === category.slug);
    expect(await productIds(gallery)).toEqual(matching.map((piece) => piece.id));
    for (const piece of matching) {
      const card = gallery.locator(`[data-product-id="${piece.id}"]`);
      await card.scrollIntoViewIfNeeded();
      await decoded(card.getByRole("img", { name: piece.alt, exact: true }));
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`product view wraps, supports keys and restores focus and scrolling at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/collections#all-pieces");
    const opener = page
      .locator("#all-pieces")
      .getByRole("link", { name: `Take a closer look: ${products[0].name}`, exact: true });
    await opener.click();
    const viewer = page.locator("#all-pieces dialog");
    await expect(viewer).toBeVisible();
    await expect(viewer).toHaveAccessibleName(products[0].name);
    await expect(viewer).toHaveAttribute("open", "");
    await expect(viewer.getByRole("button", { name: "Close product view" })).toBeFocused();
    await expect(page.locator("html")).toHaveClass(/is-locked/);
    await viewer.getByRole("button", { name: "Previous piece" }).click();
    await expect(viewer).toHaveAccessibleName(products.at(-1)!.name);
    await decoded(viewer.getByRole("img", { name: products.at(-1)!.alt, exact: true }));
    await viewer.getByRole("button", { name: "Next piece" }).click();
    await expect(viewer).toHaveAccessibleName(products[0].name);
    await page.keyboard.press("ArrowRight");
    await expect(viewer).toHaveAccessibleName(products[1].name);
    await page.keyboard.press("ArrowLeft");
    await expect(viewer).toHaveAccessibleName(products[0].name);
    expect(await viewer.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(viewer).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator("html")).not.toHaveClass(/is-locked/);
    const before = await page.evaluate(() => scrollY);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 100);
  });
}

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1280, height: 680 },
  { width: 390, height: 844 },
  { width: 320, height: 640 },
]) {
  test(`home opens with the model and two genuine product photographs at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/home");
    const opening = page.locator(".house-home-opening");
    await expect(opening.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(opening.locator(".house-home-model")).toBeInViewport();
    await decoded(opening.locator(".house-home-model"));
    await expect(opening.locator(".house-home-jewels img")).toHaveCount(2);
    for (const image of await opening.locator(".house-home-jewels img").all()) {
      if (viewport.width >= 1100) await expect(image).toBeInViewport();
      else await image.scrollIntoViewIfNeeded();
      await decoded(image);
      await expect(image).toHaveCSS("object-fit", "contain");
    }
    await expect(opening.getByRole("link", { name: "Discover the collection", exact: true })).toHaveAttribute(
      "href",
      "/collections#all-pieces",
    );
    await expect(page.locator("#collections [data-product-id]")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("root retains the original opening with six varied featured photographs immediately below", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator(".landing-hero");
  await expect(hero).toHaveAttribute("data-opening-stage", "photograph");
  await expect(hero.locator(".landing-hero-photo")).toHaveCSS("opacity", "1");
  await expect(hero.locator(".landing-hero-copy")).toBeHidden();
  await decoded(hero.locator(".landing-hero-photo img").first());
  const gallery = page.locator("#house-favourites");
  const ids = await productIds(gallery);
  expect(ids).toHaveLength(6);
  expect(new Set(ids).size).toBe(6);
  expect(new Set(ids.map((id) => products.find((piece) => piece.id === id)!.category)).size).toBe(5);
  for (const card of await gallery.locator("[data-product-id]").all()) {
    await card.scrollIntoViewIfNeeded();
    await decoded(card.locator("img"));
  }
  const heroBottom = await hero.evaluate((element) => element.getBoundingClientRect().bottom + scrollY);
  const galleryTop = await gallery.evaluate((element) => element.getBoundingClientRect().top + scrollY);
  expect(galleryTop - heroBottom).toBeLessThan(200);
  await expect(gallery.getByRole("link", { name: "Discover all 16 pieces" })).toHaveAttribute(
    "href",
    "/collections#all-pieces",
  );
});

test("without JavaScript the product photographs stay visible and category filters navigate natively", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    reducedMotion: "reduce",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/collections#all-pieces");
  const gallery = page.locator("#all-pieces");
  await expect(gallery.locator("[data-product-id]")).toHaveCount(16);
  const first = gallery.locator("[data-product-id]").first();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveCSS("opacity", "1");
  await decoded(first.locator("img"));
  await expect(
    first.getByRole("link", { name: `Take a closer look: ${products[0].name}`, exact: true }),
  ).toHaveAttribute("href", products[0].image);
  const nativeFilters = gallery.getByRole("navigation", { name: "Filter jewellery" });
  for (const category of categories) {
    await expect(nativeFilters.getByRole("link", { name: new RegExp(`^${category.name} `) })).toHaveAttribute(
      "href",
      `/collections/${category.slug}#the-edit`,
    );
  }
  await nativeFilters.getByRole("link", { name: "Hand ornaments 01", exact: true }).click();
  await expect(page).toHaveURL(/\/collections\/ornaments#the-edit$/);
  await expect(page.locator("#the-edit [data-product-id]")).toHaveCount(1);
  await decoded(page.locator("#the-edit img"));
  await expect(page.locator("html")).not.toHaveClass(/is-locked/);
  await page.goto("http://localhost:3000/home");
  await decoded(page.locator(".house-home-model"));
  for (const image of await page.locator(".house-home-jewels img").all()) {
    await image.scrollIntoViewIfNeeded();
    await decoded(image);
  }
  await context.close();
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`the product gallery has clear complete photographs at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/collections#all-pieces");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const firstRow = page.locator("#all-pieces [data-product-id]").first();
    await firstRow.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const grid = document.querySelector("#all-pieces .product-edit-grid")!;
      window.scrollTo(0, grid.getBoundingClientRect().top + scrollY - 95);
    });
    for (const image of await page.locator("#all-pieces [data-product-id] img").all()) {
      if (
        (await image.isVisible()) &&
        (await image.evaluate((element) => element.getBoundingClientRect().top < innerHeight))
      )
        await decoded(image);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `docs/screenshots/product-catalog-${viewport.width}.png` });
  });
}
