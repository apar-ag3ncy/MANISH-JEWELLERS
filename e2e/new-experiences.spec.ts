import { test, expect } from "@playwright/test";

test("hero photographs crossfade every two seconds without buttons and keyboard interaction pauses and resumes", async ({
  page,
}) => {
  await page.goto("/");
  const show = page.locator(".hero-slideshow");
  await expect(show).toHaveAttribute("data-autoplay", "true", { timeout: 15000 });
  const changes = await show.evaluate(
    (element) =>
      new Promise<{ gaps: number[]; blended: boolean }>((resolve) => {
        const times: number[] = [];
        let blended = false;
        const sample = setInterval(() => {
          const alpha = [...element.querySelectorAll("[data-hero-slide]")].map((slide) =>
            Number(getComputedStyle(slide).opacity),
          );
          if (alpha.filter((value) => value > 0.05 && value < 0.95).length >= 2) blended = true;
        }, 40);
        const observer = new MutationObserver(() => {
          times.push(performance.now());
          if (times.length === 4) {
            observer.disconnect();
            clearInterval(sample);
            resolve({ gaps: times.slice(1).map((time, i) => time - times[i]), blended });
          }
        });
        observer.observe(element, { attributes: true, attributeFilter: ["data-active-slide"] });
      }),
  );
  for (const gap of changes.gaps) {
    expect(gap).toBeGreaterThan(1750);
    expect(gap).toBeLessThan(2300);
  }
  expect(changes.blended).toBe(true);
  await expect(show.locator("button")).toHaveCount(0);
  await show.focus();
  const held = await show.getAttribute("data-active-slide");
  await page.waitForTimeout(2300);
  await expect(show).toHaveAttribute("data-active-slide", held!);
  await show.press("ArrowRight");
  await expect(show).toHaveAttribute("data-active-slide", String((Number(held) % 4) + 1));
  await show.press("Space");
  await expect(show).toHaveAttribute("data-autoplay", "true");
  await page.locator("#collections").scrollIntoViewIfNeeded();
  await expect(show).toHaveAttribute("data-autoplay", "false");
});

test("diamond shapes, facets and turns work and scroll assembles the diamond and draws light", async ({ page }) => {
  test.setTimeout(60000);
  await page.setViewportSize({ width: 1440, height: 900 });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/diamond-guide");
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  await expect(page.locator("#cut-studio")).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  for (const name of ["Oval", "Pear", "Emerald", "Cushion", "Round"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(page.locator(".cut-webgl")).toHaveAttribute("data-cut", name.toLowerCase());
    await expect
      .poll(async () => Number(await page.locator(".cut-webgl").getAttribute("data-scatter")))
      .toBeLessThan(0.012);
  }
  await page.getByRole("button", { name: "Show facet detail" }).click();
  await expect(page.getByRole("button", { name: "Show facet detail" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Turn the diamond" }).click();
  await expect
    .poll(async () => Number((await page.locator(".cut-webgl").getAttribute("data-rotation"))!.split(",")[1]))
    .toBeGreaterThan(1.5);
  const story = page.locator("#light-story");
  await expect(story).toHaveAttribute("data-animated", "true");
  const bounds = await story.evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    height: element.getBoundingClientRect().height,
  }));
  const start = bounds.top - 900 * 0.25;
  const travel = bounds.height - 900 * 0.5;
  const stage = story.locator(".diamond-model-stage");
  const tableY = () =>
    stage
      .locator("[data-diamond-table]")
      .evaluate((element) => Number(getComputedStyle(element).transform.split(",")[5]?.replace(")", "") ?? 0));
  await page.evaluate((y) => scrollTo(0, y), start + travel * 0.49);
  await expect.poll(tableY).toBeLessThan(-55);
  await expect(stage.locator("[data-anatomy-labels]")).toHaveCSS("opacity", "1");
  await page.screenshot({ path: "docs/screenshots/diamond-anatomy-desktop.png" });
  await page.evaluate((y) => scrollTo(0, y), start + travel);
  await expect(stage.locator("[data-light-path]")).toHaveCSS("opacity", "1");
  await expect(stage.locator("[data-light-ray]").first()).toHaveCSS("stroke-dashoffset", "0px");
  await expect.poll(tableY).toBeGreaterThan(-1);
  await page.evaluate((y) => scrollTo(0, y), start + travel * 0.49);
  await expect.poll(tableY).toBeLessThan(-55);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(story).not.toHaveAttribute("data-animated");
  await expect(story.locator(".diamond-inline-model")).toHaveCount(3);
  for (const diagram of await story.locator(".diamond-inline-model").all()) await expect(diagram).toBeVisible();
  expect(errors).toEqual([]);
});

for (const width of [1440, 390, 320]) {
  test(`diamond guide and glass controls fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 1440 ? 900 : 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/diamond-guide");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#cut-studio")).toHaveAttribute("data-ready", "true", { timeout: 15000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const button = page.getByRole("button", { name: "Turn the diamond" });
    await button.focus();
    await button.press("Enter");
    await expect
      .poll(async () => Number((await page.locator(".cut-webgl").getAttribute("data-rotation"))!.split(",")[1]))
      .toBeGreaterThan(1.5);
    const style = await button.evaluate((element) => ({
      filter: getComputedStyle(element).backdropFilter,
      outline: getComputedStyle(element).outlineStyle,
      size: element.getBoundingClientRect().width,
    }));
    expect(style.filter).toContain("blur");
    expect(style.outline).not.toBe("none");
    expect(style.size).toBeGreaterThanOrEqual(44);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({ path: `docs/screenshots/diamond-guide-${width}.png` });
    if (width < 900) await expect(page.locator(".diamond-model-stage")).toBeHidden();
  });
}

test("reduced motion stops hero autoplay and the educational guide works without JavaScript", async ({ browser }) => {
  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const page = await reduced.newPage();
  await page.goto("http://localhost:3000/");
  await expect(page.locator(".hero-slideshow")).toHaveAttribute("data-autoplay", "false");
  await page.waitForTimeout(2300);
  await expect(page.locator(".hero-slideshow")).toHaveAttribute("data-active-slide", "1");
  await page.locator(".hero-slideshow").press("ArrowRight");
  await expect(page.locator(".hero-slideshow")).toHaveAttribute("data-active-slide", "2");
  await reduced.close();
  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await staticContext.newPage();
  await staticPage.goto("http://localhost:3000/diamond-guide");
  await expect(staticPage.locator(".diamond-inline-model")).toHaveCount(3);
  for (const diagram of await staticPage.locator(".diamond-inline-model").all()) await expect(diagram).toBeVisible();
  await expect(staticPage.locator(".diamond-shape-index dt")).toHaveText([
    "Round",
    "Oval",
    "Pear",
    "Emerald",
    "Cushion",
  ]);
  await staticContext.close();
});
