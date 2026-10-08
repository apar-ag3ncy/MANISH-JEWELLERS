import { test, expect } from "@playwright/test";

test("the footer belongs only to home and all collection routes, including without JavaScript", async ({ browser }) => {
  test.setTimeout(60000);
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const route of [
    "/",
    "/home",
    "/collections",
    "/collections/necklaces",
    "/collections/rings",
    "/collections/bangles",
    "/collections/earrings",
    "/collections/ornaments",
  ]) {
    await page.goto(`http://localhost:3000${route}`);
    await expect(page.locator("footer")).toHaveCount(1);
    await expect(page.locator("#diamond-experience")).toHaveCount(1);
  }
  for (const route of ["/diamond-guide", "/about", "/bespoke", "/campaign", "/visit", "/missing-page"]) {
    await page.goto(`http://localhost:3000${route}`);
    await expect(page.locator("footer, [data-house-finale], #diamond-experience")).toHaveCount(0);
  }
  await context.close();
});

test("client navigation removes the entire finale and restores one footer when returning to collections", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/collections");
  await page.locator("footer").getByRole("link", { name: "Diamond guide", exact: true }).click();
  await expect(page).toHaveURL(/\/diamond-guide$/);
  await expect(page.locator("footer, [data-house-finale]")).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Collections", exact: true })
    .click();
  await expect(page).toHaveURL(/\/collections$/);
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(page.locator("[data-footer-wordmark]")).toHaveCount(1);
  await page.locator("footer").getByRole("link", { name: "About us", exact: true }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("footer, [data-house-finale]")).toHaveCount(0);
  expect(errors).toEqual([]);
});
