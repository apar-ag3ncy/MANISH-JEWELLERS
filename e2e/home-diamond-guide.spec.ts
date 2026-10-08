import { test, expect } from "@playwright/test";

for (const [route, width, height] of [
  ["/", 1440, 900],
  ["/", 320, 640],
  ["/home", 390, 844],
] as const) {
  test(`the interactive guide leads directly into the burst on ${route} at ${width}px`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const studio = page.locator("#cut-studio");
    await expect(studio).toHaveAttribute("data-enhanced", "true");
    await expect(studio.locator("canvas")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "From fragments, to fascination.", level: 2 })).toHaveCount(1);
    expect(
      await studio.evaluate(
        (el) => el.parentElement?.id === "main-content" && el === el.parentElement.lastElementChild,
      ),
    ).toBe(true);
    expect(
      await page.locator("#main-content").evaluate((el) => el.nextElementSibling?.hasAttribute("data-house-finale")),
    ).toBe(true);
    await studio.evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY));
    await expect(studio).toHaveAttribute("data-ready", "true", { timeout: 15000 });
    await studio.getByRole("button", { name: "Emerald", exact: true }).click();
    await expect(studio.locator(".cut-webgl")).toHaveAttribute("data-cut", "emerald");
    await expect(studio.getByRole("heading", { level: 3 })).toHaveText("Emerald");
    await expect(studio.getByRole("button", { name: "Emerald", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.mouse.move(50, 100);
    await expect(studio.getByRole("button", { name: "Emerald", exact: true })).toHaveCSS(
      "background-color",
      "rgba(121, 63, 72, 0.26)",
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({
      path: `docs/screenshots/home-diamond-guide-${route === "/" ? "landing" : "home"}-${width}.png`,
    });
    if (width === 320) {
      await studio.getByRole("link", { name: "Explore the full diamond guide" }).click();
      await expect(page).toHaveURL(/\/diamond-guide$/);
      await expect(page.locator("footer")).toHaveCount(0);
    } else {
      if (width >= 900) await studio.getByRole("link", { name: "Continue to the diamond burst" }).click();
      else await page.locator("#diamond-experience").scrollIntoViewIfNeeded();
      await expect(page.locator("#diamond-experience")).toBeInViewport();
      await expect(page.locator("footer")).toHaveCount(1);
    }
    expect(errors).toEqual([]);
  });
}

test("the home guide forms and reverses with scroll before entering the burst", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#cut-studio");
  const studio = page.locator("#cut-studio");
  await expect(studio).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  const layout = await studio.evaluate((el) => ({
    top: el.getBoundingClientRect().top + scrollY,
    travel: el.getBoundingClientRect().height - innerHeight,
  }));
  const scene = studio.locator(".cut-webgl");
  await page.evaluate((top) => scrollTo(0, top), layout.top + layout.travel * 0.97);
  await expect(scene).toHaveAttribute("data-scatter", "0.000");
  await expect.poll(async () => Number(await scene.getAttribute("data-light"))).toBeGreaterThan(0.95);
  await page.evaluate((top) => scrollTo(0, top), layout.top);
  await expect(scene).toHaveAttribute("data-scatter", "1.000");
  await studio.getByRole("link", { name: "Continue to the diamond burst" }).click();
  await expect(page.locator("#diamond-experience")).toBeInViewport();
  await expect(page.locator("#diamond-experience")).toHaveAttribute("data-renderer", "webgl", { timeout: 15000 });
});
