import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/data/content";
import { LOCKUP } from "@/components/ui/brand/lockup-data";

const mono = LOCKUP.monogram.box;
const wm = LOCKUP.wordmark.box;

export const runtime = "nodejs";
export const alt = `${brand.name} — ${brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Colours are read from globals.css so the token block stays the only place a hex lives. */
async function tokens() {
  const css = await readFile(join(process.cwd(), "src/app/globals.css"), "utf8");
  const pick = (name: string) => css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1] ?? "";
  return { wine: pick("wine"), cream: pick("cream") };
}

export default async function OpenGraphImage() {
  const { wine, cream } = await tokens();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: wine,
        color: cream,
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <svg width="42" height="40" viewBox={`${mono.x} ${mono.y} ${mono.w} ${mono.h}`} fill={cream}>
          <path d={LOCKUP.monogram.d} />
        </svg>
        <svg
          width={Math.round((wm.w / wm.h) * 20)}
          height="20"
          viewBox={`${wm.x} ${wm.y} ${wm.w} ${wm.h}`}
          fill={cream}
        >
          {LOCKUP.wordmark.glyphs.map((g, i) => (
            <path key={i} d={g.d} />
          ))}
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 88, lineHeight: 1, letterSpacing: "-0.02em" }}>{brand.tagline}</div>
        <div style={{ fontSize: 26, opacity: 0.8, fontFamily: "sans-serif" }}>{brand.lede}</div>
      </div>
    </div>,
    size,
  );
}
