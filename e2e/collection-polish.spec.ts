import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 320, height: 640 },
]) {
  test(`house imagery opens, advances and restores focus at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/collections");
    await expect(page.locator('main img[src*="%2Fhouse%2F"]')).toHaveCount(8);
    const opener = page.getByRole("button", { name: "Take a closer look: Gold, with a presence." });
    await opener.click();
    const gallery = page.getByRole("dialog", { name: "Gold, with a presence." });
    await expect(gallery).toBeVisible();
    await expect(gallery.getByRole("button", { name: "Close closer look" })).toBeFocused();
    await expect(page.locator("html")).toHaveClass(/is-locked/);
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("dialog")).toHaveAccessibleName("A world of possibilities.");
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("dialog")).toHaveAccessibleName("Beauty, beyond the jewel.");
    await page.getByRole("button", { name: "Next house image" }).click();
    await expect(page.getByRole("dialog")).toHaveAccessibleName("Gold, with a presence.");
    expect(await gallery.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    await page.screenshot({ path: `docs/screenshots/collection-closer-look-${viewport.width}.png` });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(opener).toBeFocused();
    await expect(page.locator("html")).not.toHaveClass(/is-locked/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `docs/screenshots/collection-house-edit-${viewport.width}.png` });
    const phone = page.locator("footer").getByRole("link", { name: "Call Parth Karnavat on +91 9929295123" });
    await expect(phone).toHaveAttribute("href", "tel:+919929295123");
    await expect(page.locator("footer")).toContainText("Parth Karnavat");
    expect(errors).toEqual([]);
  });
}

test("brand color and transparent glass controls stay consistent across the site", async ({ page, request }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of ["/collections", "/bespoke", "/campaign", "/diamond-guide", "/visit", "/about"]) {
    await page.goto(route);
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-brand").trim()),
    ).toBe("#793f48");
    const controls = await page
      .locator("button, .mj-button, .glass-control, .house-text-link")
      .evaluateAll((elements) =>
        elements
          .filter(
            (element) =>
              (element as HTMLElement).offsetWidth > 0 && !element.classList.contains("house-nav-category-toggle"),
          )
          .map((element) => ({
            name: element.getAttribute("aria-label") || element.textContent?.trim(),
            background: getComputedStyle(element).backgroundColor,
            blur: getComputedStyle(element).backdropFilter,
          })),
      );
    for (const control of controls) {
      expect(control.background, `${route}: ${control.name}`).toMatch(/^rgba\(/);
      const alpha = Number(control.background.split(",").at(-1)?.replace(")", ""));
      expect(alpha, `${route}: ${control.name}`).toBeLessThanOrEqual(0.3);
      expect(control.blur, `${route}: ${control.name}`).toContain("blur(");
    }
  }
  const image = await request.get("/opengraph-image");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/png");
});
