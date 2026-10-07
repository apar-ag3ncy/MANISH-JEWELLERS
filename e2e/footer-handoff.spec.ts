import { test, expect } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 900 },
  { width: 1280, height: 680 },
  { width: 390, height: 844 },
  { width: 320, height: 640 },
]) {
  test(`one wordmark holds, joins the footer and reverses at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/#diamond-experience");
    await page.evaluate(async () => {
      await document.fonts.ready;
    });
    const root = page.locator("[data-house-finale]");
    const diamond = page.locator("#diamond-experience");
    const mark = root.locator("[data-footer-wordmark] svg");
    const slot = root.locator(".house-footer-wordmark-slot");
    const visual = diamond.locator(".diamond-experience-visual");
    await expect(root).toHaveAttribute("data-footer-brand", "floating");
    await expect(diamond).toHaveAttribute("data-renderer", "webgl");
    await expect(diamond.locator(".diamond-experience-fallback")).toHaveCSS("visibility", "hidden");
    await expect(root.locator("[data-footer-wordmark]")).toHaveCount(1);
    await expect(diamond.locator(".diamond-experience-masthead svg")).toHaveCount(0);
    const layout = await diamond.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        end: box.top + scrollY + box.height - innerHeight,
        bottom: box.bottom + scrollY,
      };
    });
    const scroll = async (top: number) => {
      await page.evaluate((position) => scrollTo(0, position), top);
      await page.waitForTimeout(80);
    };
    await scroll(layout.end - 5);
    const before = (await mark.boundingBox())!;
    const sceneBefore = (await visual.boundingBox())!;
    await scroll(layout.end + viewport.height * 0.2);
    const held = (await mark.boundingBox())!;
    expect(Math.abs(held.y - before.y)).toBeLessThan(2);
    expect(Math.abs(held.x - before.x)).toBeLessThan(2);
    expect(Math.abs(held.width - before.width)).toBeLessThan(2);
    expect((await visual.boundingBox())!.y).toBeLessThan(sceneBefore.y - viewport.height * 0.15);
    await page.screenshot({ path: `docs/screenshots/footer-hold-${viewport.width}.png` });

    // Small scroll steps detect any teleport as the floating lettering reaches its final slot.
    let previous = held;
    const start = layout.end + viewport.height * 0.2;
    const step = (layout.bottom - start) / 24;
    for (let i = 1; i <= 24; i++) {
      await scroll(start + step * i);
      const current = (await mark.boundingBox())!;
      expect(Math.abs(current.y - previous.y)).toBeLessThan(step + 8);
      expect(Math.abs(current.width - previous.width)).toBeLessThan(18);
      previous = current;
    }
    await expect(root).toHaveAttribute("data-footer-brand", "docked");
    const docked = (await mark.boundingBox())!;
    const target = (await slot.boundingBox())!;
    expect(Math.abs(docked.y - target.y)).toBeLessThan(1.5);
    expect(Math.abs(docked.x - target.x)).toBeLessThan(1.5);
    expect(Math.abs(docked.width - target.width)).toBeLessThan(1.5);
    await expect(page.locator("footer")).toContainText("Parth Karnavat");
    await expect(page.locator("footer a[href='tel:+919929295123']")).toHaveCount(1);
    await page.screenshot({ path: `docs/screenshots/footer-docked-${viewport.width}.png` });

    await scroll(start);
    const returned = (await mark.boundingBox())!;
    expect(Math.abs(returned.y - held.y)).toBeLessThan(1.5);
    expect(Math.abs(returned.width - held.width)).toBeLessThan(1.5);
    await scroll(layout.top + (layout.end - layout.top) * 0.52);
    await expect.poll(async () => Number(await diamond.getAttribute("data-burst"))).toBeLessThan(0.01);
    await expect(root).toHaveAttribute("data-footer-progress", "0.0000");
    await expect(diamond.locator("canvas")).toHaveCount(1);
    await page.screenshot({ path: `docs/screenshots/footer-scene-${viewport.width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(root).not.toHaveAttribute("data-footer-brand");
    await expect(root.locator("[data-footer-wordmark]")).toHaveCSS("position", "absolute");
    await expect(root.locator("[data-footer-wordmark]")).toHaveCSS("transform", "none");
    expect(errors).toEqual([]);
  });
}

test("the old landing block is replaced by the working house edit and useful tools live on bespoke", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Bring us a sketch. Or an idea." })).toHaveCount(0);
  await expect(page.locator("#bespoke, #cut-studio, #fitting")).toHaveCount(0);
  const edit = page.locator("#house-edit");
  await edit.scrollIntoViewIfNeeded();
  await expect(edit.locator("img")).toHaveCount(6);
  await edit.getByRole("button", { name: "Take a closer look: Gold, with a presence." }).click();
  await expect(page.getByRole("dialog", { name: "Gold, with a presence." })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.locator("footer").getByRole("link", { name: "Sizing guide", exact: true }).click();
  await expect(page).toHaveURL(/\/bespoke#fitting$/);
  await expect(page.locator("#fitting")).toHaveAttribute("open", "");
  await expect(page.getByRole("slider", { name: "Inner diameter" })).toBeVisible();
});

test("the static footer has one complete wordmark and contacts without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto("http://localhost:3000/#house-footer");
    await expect(page.locator("[data-house-finale] [data-footer-wordmark]")).toHaveCount(1);
    await expect(page.locator("[data-footer-wordmark]")).toHaveCSS("position", "absolute");
    await expect(page.locator("footer")).toContainText("Parth Karnavat");
    await expect(page.locator("footer a[href='tel:+919929295123']")).toBeVisible();
  } finally {
    await context.close();
  }
});

test("a direct footer link docks after hydration and changing pages keeps one wordmark", async ({ page }) => {
  await page.goto("/#house-footer");
  const root = page.locator("[data-house-finale]");
  await expect(root).toHaveAttribute("data-footer-brand", "docked");
  await expect(root.locator("[data-footer-wordmark]")).toHaveCount(1);
  await expect(page.locator("footer")).toBeInViewport();
  await page.locator("footer").getByRole("link", { name: "Collections", exact: true }).click();
  await expect(page).toHaveURL(/\/collections$/);
  await expect(root).toHaveAttribute("data-footer-brand", "floating");
  await expect(root.locator("[data-footer-wordmark]")).toHaveCount(1);
  await page.locator("#diamond-experience").scrollIntoViewIfNeeded();
  await expect(page.locator("#diamond-experience canvas")).toHaveCount(1);
});
