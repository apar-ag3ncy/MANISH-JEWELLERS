import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

// Usage: node scripts/build-rock-maps.mjs /absolute/path/to/generated-source.png
const source = process.argv[2];
if (!source) throw new Error("Pass the generated stone texture as the first argument.");
const output = resolve("public/house/stone");
await mkdir(output, { recursive: true });
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

for (const [suffix, size] of [
  ["", 1024],
  ["-mobile", 768],
]) {
  const pipeline = sharp(source).resize(size, size).removeAlpha();
  const { data } = await pipeline.clone().raw().toBuffer({ resolveWithObject: true });
  const blurred = await pipeline.clone().blur(1.2).raw().toBuffer();
  const surface = Buffer.alloc(size * size * 4);
  for (let i = 0; i < size * size; i++) {
    const r = data[i * 3],
      g = data[i * 3 + 1],
      b = data[i * 3 + 2];
    const grey = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const smooth = blurred[i * 3] * 0.2126 + blurred[i * 3 + 1] * 0.7152 + blurred[i * 3 + 2] * 0.0722;
    const vein = clamp((r - b - 5) / 32, 0, 1);
    const grain = Math.abs(grey - smooth) / 255;
    // R: relief, G: roughness, B: crevice occlusion. Keep alpha opaque so image
    // decoders never discard the packed material data in transparent pixels.
    surface[i * 4] = clamp(0.25 + smooth / 180, 0.15, 0.9) * 255;
    surface[i * 4 + 1] = clamp(0.64 - (smooth / 255) * 0.85 + grain * 0.7 - vein * 0.09, 0.34, 0.88) * 255;
    surface[i * 4 + 2] = clamp(0.72 + smooth / 180, 0.72, 1) * 255;
    surface[i * 4 + 3] = 255;
  }
  await pipeline
    .clone()
    .webp({ quality: 92 })
    .toFile(resolve(output, `anthracite-color${suffix}.webp`));
  // Packed material channels are linear data; lossless encoding preserves them.
  await sharp(surface, { raw: { width: size, height: size, channels: 4 } })
    .webp({ lossless: true })
    .toFile(resolve(output, `anthracite-surface${suffix}.webp`));
}
await sharp(source).resize(256, 256).webp({ quality: 78 }).toFile(resolve(output, "anthracite-preview.webp"));
console.log("Prepared desktop and mobile anthracite material maps in public/house/stone.");
