import { test, expect, type Page } from "@playwright/test";

const names = ["Round", "Oval", "Pear", "Emerald", "Cushion"];

function captureErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (e) => {
    if (e.type() === "error" || (e.type() === "warning" && /THREE|Shader Error|INVALID_/i.test(e.text())))
      errors.push(e.text());
  });
  return errors;
}

async function ready(page: Page) {
  await page.goto("/diamond-guide");
  await expect(page.locator("#cut-studio")).toHaveAttribute("data-ready", "true", { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".cut-fallback")).toHaveCSS("opacity", "0");
}

async function assembled(page: Page, cut: string) {
  const scene = page.locator(".cut-webgl");
  await expect(scene).toHaveAttribute("data-cut", cut.toLowerCase());
  await expect.poll(async () => Number(await scene.getAttribute("data-scatter"))).toBeLessThan(0.012);
}

test("all five silhouettes re-form, interrupted selections settle correctly, and controls inspect the crystal", async ({
  page,
}) => {
  test.setTimeout(60000);
  const errors = captureErrors(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await ready(page);
  await expect(page.locator(".cut-webgl")).toHaveAttribute("data-scatter", "1.000");
  await page.screenshot({ path: "docs/screenshots/diamond-cut-fragments-1440.png" });
  for (const name of names) {
    await page.getByRole("button", { name, exact: true }).click();
    await assembled(page, name);
    await expect(page.getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".cut-selected h2")).toHaveText(name);
    await page.screenshot({ path: `docs/screenshots/diamond-cut-${name.toLowerCase()}-1440.png` });
  }
  await page.getByRole("button", { name: "Oval", exact: true }).click();
  await page.getByRole("button", { name: "Emerald", exact: true }).click();
  await page.getByRole("button", { name: "Pear", exact: true }).click();
  await assembled(page, "Pear");
  await page.getByRole("button", { name: "Show facet detail" }).click();
  await expect(page.getByRole("button", { name: "Show facet detail" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Turn the diamond" }).click();
  await expect
    .poll(async () => Number((await page.locator(".cut-webgl").getAttribute("data-rotation"))!.split(",")[1]))
    .toBeGreaterThan(1.5);
  await page.getByRole("button", { name: "03 Light path" }).click();
  await expect(page.locator(".cut-webgl")).toHaveAttribute("data-light", "1.000");
  await page.screenshot({ path: "docs/screenshots/diamond-cut-light-1440.png" });
  expect(errors).toEqual([]);
});

test("scroll reveals formation and light reversibly without overriding a manual choice", async ({ page }) => {
  const errors = captureErrors(page);
  await ready(page);
  const distance = await page.locator("#cut-studio").evaluate((e) => e.getBoundingClientRect().height - innerHeight);
  await page.evaluate((y) => scrollTo(0, y), distance * 0.28);
  await expect
    .poll(async () => Number(await page.locator(".cut-webgl").getAttribute("data-scatter")))
    .toBeLessThan(0.8);
  await expect
    .poll(async () => Number(await page.locator(".cut-webgl").getAttribute("data-scatter")))
    .toBeGreaterThan(0.15);
  await page.evaluate((y) => scrollTo(0, y), distance * 0.97);
  await assembled(page, "Round");
  await expect
    .poll(async () => Number(await page.locator(".cut-webgl").getAttribute("data-light")))
    .toBeGreaterThan(0.95);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator(".cut-webgl")).toHaveAttribute("data-scatter", "1.000");
  await page.getByRole("button", { name: "Emerald", exact: true }).click();
  await assembled(page, "Emerald");
  await page.evaluate((y) => scrollTo(0, y), distance * 0.8);
  await expect(page.locator(".cut-webgl")).toHaveAttribute("data-cut", "emerald");
  await expect(page.locator(".cut-webgl")).toHaveAttribute("data-scatter", "0.000");
  await page.getByRole("button", { name: "01 Fragments" }).click();
  await expect(page.locator(".cut-webgl")).toHaveAttribute("data-scatter", "1.000");
  await page.getByRole("button", { name: "02 The cut" }).click();
  await assembled(page, "Emerald");
  expect(errors).toEqual([]);
});

for (const width of [1440, 390, 320]) {
  test(`studio fits and keyboard controls work at ${width}px`, async ({ page }) => {
    const errors = captureErrors(page);
    await page.setViewportSize({ width, height: width === 1440 ? 900 : width === 320 ? 640 : 844 });
    await ready(page);
    await page.getByRole("button", { name: "Oval", exact: true }).click();
    await assembled(page, "Oval");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const controls = await page
      .locator(".cut-shapes button")
      .evaluateAll((es) =>
        es.map((e) => ({ w: e.getBoundingClientRect().width, h: e.getBoundingClientRect().height })),
      );
    for (const box of controls) {
      expect(box.w).toBeGreaterThanOrEqual(44);
      expect(box.h).toBeGreaterThanOrEqual(44);
    }
    const stage = page.getByRole("group", { name: "Interactive diamond cutting scene" });
    await stage.focus();
    await stage.press("ArrowRight");
    await assembled(page, "Pear");
    await page.screenshot({ path: `docs/screenshots/diamond-cut-studio-${width}.png` });
    expect(errors).toEqual([]);
  });
}

test("horizontal touch changes shape, vertical touch scrolls normally, and mouse drag rotates", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  const errors = captureErrors(page);
  await ready(page);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 280, y: 360 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 145, y: 365 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await assembled(page, "Oval");
  const y = await page.evaluate(() => scrollY);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 210, y: 420 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 212, y: 250 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 40);
  await expect(page.locator(".cut-webgl")).toHaveAttribute("data-cut", "oval");
  expect(errors).toEqual([]);
  await context.close();
});

test("only a held primary-button drag rotates; release, hover and context recovery preserve controls", async ({
  page,
}) => {
  const errors = captureErrors(page);
  await ready(page);
  await page.getByRole("button", { name: "Round", exact: true }).click();
  await assembled(page, "Round");
  const crystal = page.locator(".cut-webgl");
  await expect(crystal).toHaveAttribute("data-rotation", "0.000,0.000");
  await page.mouse.move(900, 390);
  await page.mouse.move(1000, 450, { steps: 8 });
  await expect(crystal).toHaveAttribute("data-rotation", "0.000,0.000");
  await page.mouse.move(850, 420);
  await page.mouse.down();
  await page.mouse.move(1000, 450, { steps: 8 });
  await expect
    .poll(async () => Number((await page.locator(".cut-webgl").getAttribute("data-rotation"))!.split(",")[1]))
    .toBeGreaterThan(1);
  await page.mouse.up();
  // The on-demand WebGL renderer paints its final held pose on the next frame.
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
  );
  const released = await crystal.getAttribute("data-rotation");
  await page.mouse.move(720, 350, { steps: 8 });
  await page.mouse.move(60, 120);
  await page.waitForTimeout(300);
  await expect(crystal).toHaveAttribute("data-rotation", released!);
  await page.mouse.move(850, 420);
  await page.mouse.down({ button: "right" });
  await page.mouse.move(1000, 450, { steps: 8 });
  await page.mouse.up({ button: "right" });
  await expect(crystal).toHaveAttribute("data-rotation", released!);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Cushion", exact: true }).click();
  await assembled(page, "Cushion");
  await page.mouse.move(850, 420);
  await page.mouse.down();
  await page.mouse.move(1000, 450, { steps: 8 });
  await page.mouse.up();
  await expect(crystal).toHaveAttribute("data-rotation", "0.150,1.350");
  await page.getByRole("button", { name: "Turn the diamond" }).click();
  await expect
    .poll(async () => Number((await page.locator(".cut-webgl").getAttribute("data-rotation"))!.split(",")[1]))
    .toBeGreaterThan(1.5);
  await page
    .locator(".cut-webgl canvas")
    .evaluate((c) => c.dispatchEvent(new Event("webglcontextlost", { cancelable: true })));
  await expect(page.locator("#cut-studio")).toHaveAttribute("data-ready", "false");
  await expect(page.locator(".cut-fallback")).toHaveAttribute("data-visible", "true");
  await page.locator(".cut-webgl canvas").evaluate((c) => c.dispatchEvent(new Event("webglcontextrestored")));
  await expect(page.locator("#cut-studio")).toHaveAttribute("data-ready", "true");
  expect(errors).toEqual([]);
});

test("static illustrated guide survives disabled WebGL and disabled JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.addInitScript(() => {
    const get = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type, ...args) {
      if (type.includes("webgl")) return null;
      return Reflect.apply(get, this, [type, ...args]);
    } as typeof get;
  });
  const page = await context.newPage();
  await page.goto("/diamond-guide");
  await expect(page.locator(".cut-fallback")).toHaveAttribute("data-visible", "true");
  await page.getByRole("button", { name: "Emerald", exact: true }).click();
  await expect(page.locator(".cut-fallback").getByRole("img", { name: "Emerald diamond outline" })).toBeVisible();
  await context.close();
  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await staticContext.newPage();
  await staticPage.goto("/diamond-guide");
  await expect(staticPage.locator(".diamond-shape-index .facet-stone")).toHaveCount(5);
  for (const id of ["round", "oval", "pear", "emerald", "cushion"])
    await expect(staticPage.locator(`#guide-${id}`)).toContainText(id[0].toUpperCase() + id.slice(1));
  expect(await staticPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await staticContext.close();
});
