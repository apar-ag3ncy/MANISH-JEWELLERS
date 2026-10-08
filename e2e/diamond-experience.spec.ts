import { test, expect, type Page, type Locator } from "@playwright/test";

async function openExperience(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/#diamond-experience");
  await page.locator("#diamond-experience").scrollIntoViewIfNeeded();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  const root = page.locator("#diamond-experience");
  await expect(root).toHaveAttribute("data-renderer", "webgl", { timeout: 15000 });
  // Capture the finished renderer, after its handover from the lightweight SVG preview.
  await expect(root.locator(".diamond-experience-canvas")).toHaveCSS("opacity", "1");
  await expect(root.locator(".diamond-experience-fallback")).toHaveCSS("visibility", "hidden");
  return { root, errors };
}

async function seek(page: Page, root: Locator, fraction: number) {
  const bounds = await root.evaluate((element) => ({
    top: element.getBoundingClientRect().top + scrollY,
    height: element.getBoundingClientRect().height,
  }));
  await page.evaluate(({ top, height, fraction }) => scrollTo(0, top + (height - innerHeight) * fraction), {
    ...bounds,
    fraction,
  });
}

async function imageDifference(page: Page, first: Buffer, second: Buffer) {
  return page.evaluate(
    async ({ first, second }) => {
      const pixels = async (base64: string) => {
        const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
        const image = await createImageBitmap(new Blob([bytes], { type: "image/png" }));
        const canvas = new OffscreenCanvas(image.width, image.height);
        const context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height).data;
      };
      const a = await pixels(first),
        b = await pixels(second);
      let difference = 0;
      for (let i = 0; i < a.length; i++) difference += Math.abs(a[i] - b[i]);
      return difference / a.length;
    },
    { first: first.toString("base64"), second: second.toString("base64") },
  );
}

test("a high-density mobile display resolves to the full crisp resting resolution", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const { root, errors } = await openExperience(page);
  await seek(page, root, 0.52);
  await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeLessThan(0.01);
  const host = root.locator(".diamond-experience-canvas");
  await expect.poll(async () => Number(await host.getAttribute("data-pixel-ratio"))).toBe(1.75);
  expect(
    await host.locator("canvas").evaluate((element) => (element as HTMLCanvasElement).width / element.clientWidth),
  ).toBeGreaterThan(1.7);
  expect(errors).toEqual([]);
  await context.close();
});

test("the surrounding rock field lifts, settles and reverses without an idle animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { root, errors } = await openExperience(page);
  const host = root.locator(".diamond-experience-canvas");
  await expect(host).toHaveAttribute("data-rock-motion", "0.000");
  await expect(host).toHaveAttribute("data-rocks", "6,20");
  const scene = root.getByRole("group", { name: "Rotate the diamond and stones", exact: true });
  // Focus can align the full-height scene with the viewport; settle that before comparing pixels.
  await scene.focus();
  const bounds = (await host.boundingBox())!;
  const clip = {
    x: bounds.x + bounds.width * 0.06,
    y: bounds.y + bounds.height * 0.57,
    width: bounds.width * 0.27,
    height: bounds.height * 0.26,
  };
  const settled = await page.screenshot({ clip });
  await scene.press("Space");
  await expect(host).toHaveAttribute("data-rock-motion", "1.000");
  const lifted = await page.screenshot({ clip });
  expect(await imageDifference(page, lifted, settled)).toBeGreaterThan(2);
  await scene.press("Space");
  await expect(host).toHaveAttribute("data-rock-motion", "0.000");
  const returned = await page.screenshot({ clip });
  // Resting geometry and lighting must return to the same appearance after a burst.
  expect(await imageDifference(page, returned, settled)).toBeLessThan(0.5);
  await page.waitForTimeout(400);
  expect(await imageDifference(page, await page.screenshot({ clip }), returned)).toBeLessThan(0.01);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(host).toHaveAttribute("data-rocks", "6,12");
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 640 },
]) {
  test(`the 3D diamond gathers, bursts and reverses before the footer at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const { root, errors } = await openExperience(page);
    await expect(root).toHaveAttribute("data-scroll", "true");
    expect(
      await root.evaluate(
        (element) =>
          element.parentElement!.hasAttribute("data-house-finale") && element.nextElementSibling?.id === "house-footer",
      ),
    ).toBe(true);
    await seek(page, root, 0.015);
    await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeGreaterThan(0.97);
    await expect
      .poll(async () => Number(await root.locator(".diamond-experience-canvas").getAttribute("data-rock-motion")))
      .toBeGreaterThan(0.97);
    await page.screenshot({ path: `docs/screenshots/diamond-burst-${viewport.width}.png` });
    const scattered = await root.locator("canvas").screenshot();
    await seek(page, root, 0.52);
    await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeLessThan(0.01);
    await expect
      .poll(async () => Number(await root.locator(".diamond-experience-canvas").getAttribute("data-rock-motion")))
      .toBeLessThan(0.01);
    await expect(root.locator("[data-experience-status]")).toHaveText("02 / Gather");
    await expect(root.getByRole("group", { name: "Diamond scroll chapters" })).toHaveCount(0);
    // After the scrub settles, adaptive interaction quality must resolve back to a crisp image.
    await expect
      .poll(async () => Number(await root.locator(".diamond-experience-canvas").getAttribute("data-pixel-ratio")))
      .toBe(1);
    await page.screenshot({ path: `docs/screenshots/diamond-gather-${viewport.width}.png` });
    const gathered = await root.locator("canvas").screenshot();
    expect(gathered.equals(scattered)).toBe(false);
    await seek(page, root, 0.965);
    await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeGreaterThan(0.95);
    await expect(root).toHaveAttribute("data-phase", "radiate");
    await seek(page, root, 0.52);
    await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeLessThan(0.01);
    const scene = root.getByRole("group", { name: "Rotate the diamond and stones", exact: true });
    await scene.focus();
    await scene.press("Home");
    await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeGreaterThan(0.97);
    await scene.press("Space");
    await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeLessThan(0.01);
    await scene.press("Home");
    await expect(root).toHaveAttribute("data-phase", "scatter");
    await root.getByRole("link", { name: "Continue to footer" }).click();
    await expect(page.locator("footer")).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator("html")).not.toHaveClass(/is-locked/);
    expect(errors).toEqual([]);
  });
}

test("scroll refresh keeps the chapter status synchronized with the rendered stone field", async ({ page }) => {
  const { root, errors } = await openExperience(page);
  await seek(page, root, 0.4);
  await expect(root).toHaveAttribute("data-phase", "gather");
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect
    .poll(async () =>
      root.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const actualProgress = -bounds.top / (bounds.height - innerHeight);
        return Math.abs(Number(element.dataset.progress) - actualProgress);
      }),
    )
    .toBeLessThan(0.015);
  const host = root.locator(".diamond-experience-canvas");
  await expect
    .poll(async () =>
      Math.abs(Number(await host.getAttribute("data-rock-motion")) - Number(await root.getAttribute("data-burst"))),
    )
    .toBeLessThan(0.001);
  // Responsive layout can move the native scroll position into a different chapter.
  // The chapter label must follow that physical position, rather than stay on Gather.
  await expect
    .poll(async () =>
      root.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const progress = -bounds.top / (bounds.height - innerHeight);
        const expected = progress < 0.37 ? 0 : progress > 0.7 ? 2 : 1;
        const phases = ["Scatter", "Gather", "Radiate"];
        return (
          element.dataset.phase === phases[expected].toLowerCase() &&
          element.querySelector("[data-experience-status]")?.textContent === `0${expected + 1} / ${phases[expected]}`
        );
      }),
    )
    .toBe(true);
  expect(errors).toEqual([]);
});

test("hover, dragging and keyboard turn the rendered scene and Reset restores it", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const { root, errors } = await openExperience(page);
  await seek(page, root, 0.52);
  await expect(root).toHaveAttribute("data-burst", "0.000");
  const canvas = root.locator(".diamond-experience-canvas");
  const rotation = async () => (await canvas.getAttribute("data-rotation"))!.split(",").map(Number);
  const before = await canvas.locator("canvas").screenshot();
  await page.mouse.move(260, 400);
  await page.waitForTimeout(900);
  const left = await rotation();
  await page.mouse.move(1100, 400);
  await expect.poll(async () => (await rotation())[1] - left[1]).toBeGreaterThan(0.15);
  await page.mouse.move(620, 430);
  await page.mouse.down();
  await page.mouse.move(970, 480, { steps: 20 });
  await page.mouse.up();
  await expect(root).not.toHaveAttribute("data-dragging");
  await expect.poll(async () => (await rotation())[1]).toBeGreaterThan(1.8);
  const after = await canvas.locator("canvas").screenshot();
  expect(after.equals(before)).toBe(false);
  await root.getByRole("button", { name: "Reset view", exact: true }).click();
  await expect.poll(async () => Math.abs((await rotation())[1])).toBeLessThan(0.1);
  await root.getByRole("group", { name: "Rotate the diamond and stones", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(async () => (await rotation())[1]).toBeGreaterThan(0.2);
  expect(errors).toEqual([]);
});

test("reduced motion retains instant keyboard interaction and resizing preserves one usable scene", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const { root, errors } = await openExperience(page);
  await seek(page, root, 0.52);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(root).not.toHaveAttribute("data-scroll");
  const scene = root.getByRole("group", { name: "Rotate the diamond and stones", exact: true });
  await scene.focus();
  await scene.press("Space");
  await expect(root).toHaveAttribute("data-burst", "1.000");
  await scene.press("Space");
  await expect(root).toHaveAttribute("data-burst", "0.000");
  await page.setViewportSize({ width: 390, height: 844 });
  await root.scrollIntoViewIfNeeded();
  await expect(root.locator("canvas")).toHaveCount(1);
  await expect(scene).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(root).toHaveAttribute("data-scroll", "true");
  expect(errors).toEqual([]);
});

test("the complete scene remains visible with JavaScript or WebGL unavailable", async ({ browser }) => {
  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await staticContext.newPage();
  await staticPage.goto("http://localhost:3000/#diamond-experience");
  const staticRoot = staticPage.locator("#diamond-experience");
  await expect(staticRoot.getByRole("heading")).toBeVisible();
  await expect(staticRoot.locator(".diamond-experience-fallback")).toHaveCSS("opacity", "1");
  await expect(staticRoot.locator(".diamond-fallback-rocks path")).toHaveCount(5);
  await staticRoot.getByRole("link", { name: "Continue to footer" }).click();
  await expect(staticPage.locator("footer")).toBeInViewport();
  await staticContext.close();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type, ...args) {
      if (type === "webgl" || type === "webgl2") return null;
      return Reflect.apply(original, this, [type, ...args]);
    } as typeof original;
  });
  await page.goto("http://localhost:3000/#diamond-experience");
  const root = page.locator("#diamond-experience");
  await expect(root).toHaveAttribute("data-renderer", "fallback");
  await expect(root).toHaveAttribute("data-scroll", "true");
  await seek(page, root, 0.52);
  await expect.poll(async () => Number(await root.getAttribute("data-burst"))).toBeLessThan(0.01);
  await expect(root.locator(".diamond-experience-fallback")).toHaveCSS("opacity", "1");
  await context.close();
});
