import type { SVGProps } from "react";
import type { CutId } from "@/types";
import { cn } from "@/lib/utils";

type Pt = [number, number];

const N = 16;
const TAU = Math.PI * 2;

/** Outline of each cut as a function of angle t ∈ [0, 2π). Height is normalised to [-1, 1]. */
function shape(cut: CutId, t: number): Pt {
  const c = Math.cos(t);
  const s = Math.sin(t);
  switch (cut) {
    case "round":
      return [c, s];
    case "oval":
      return [0.74 * c, s];
    case "cushion": {
      const n = 3.2;
      const sx = Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
      const sy = Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
      return [0.9 * sx, sy];
    }
    case "pear": {
      // teardrop: cusp at the top (t = 0 → y = -1)
      const a = t;
      return [0.84 * Math.sin(a) * Math.sin(a / 2), -Math.cos(a)];
    }
    case "emerald": {
      // octagon: rectangle 0.72 × 1 with cut corners
      const w = 0.72;
      const k = 0.22;
      const verts: Pt[] = [
        [-w + k, -1],
        [w - k, -1],
        [w, -1 + k],
        [w, 1 - k],
        [w - k, 1],
        [-w + k, 1],
        [-w, 1 - k],
        [-w, -1 + k],
      ];
      // map angle to the polygon by walking its perimeter
      const idx = Math.floor((t / TAU) * verts.length) % verts.length;
      const frac = ((t / TAU) * verts.length) % 1;
      const a = verts[idx];
      const b = verts[(idx + 1) % verts.length];
      return [a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac];
    }
  }
}

function ring(cut: CutId, scale: number, offset = 0, count = N): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const [x, y] = shape(cut, (i / count) * TAU + offset);
    pts.push([x * scale, y * scale]);
  }
  return pts;
}

const f = (n: number) => n.toFixed(3);
const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${f(x)} ${f(y)}`).join("L")}Z`;
const seg = (a: Pt, b: Pt) => `M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}`;

export type GemGeometry = { outline: string; facets: string; table: string };

/** Top-view facet drawing for a cut, in a unit box (x,y ∈ [-1,1]). */
export function gemGeometry(cut: CutId): GemGeometry {
  if (cut === "emerald") {
    const o = ring(cut, 1, 0, 8);
    const r1 = ring(cut, 0.86, 0, 8);
    const r2 = ring(cut, 0.72, 0, 8);
    const tb = ring(cut, 0.56, 0, 8);
    // step cut: concentric octagons + corner-to-corner lines
    const facets = [poly(r1), poly(r2), ...o.map((p, i) => seg(p, tb[i]))].join("");
    return { outline: poly(o), facets, table: poly(tb) };
  }

  const step = TAU / N;
  const o = ring(cut, 1);
  const girdle = ring(cut, 0.8, step / 2);
  const table = ring(cut, 0.5, 0, N / 2);
  const parts: string[] = [];
  // upper-girdle triangles: outline vertex → neighbouring girdle vertices
  for (let i = 0; i < N; i++) {
    parts.push(seg(o[i], girdle[i]));
    parts.push(seg(o[i], girdle[(i - 1 + N) % N]));
  }
  // star / bezel facets: girdle vertices → table vertices
  for (let i = 0; i < N; i++) {
    const t = table[Math.floor(i / 2) % table.length];
    const t2 = table[(Math.floor(i / 2) + 1) % table.length];
    parts.push(seg(girdle[i], i % 2 === 0 ? t : t2));
    if (i % 2 === 1) parts.push(seg(girdle[i], t));
  }
  parts.push(poly(girdle));
  return { outline: poly(o), facets: parts.join(""), table: poly(table) };
}

type GemProps = {
  cut: CutId;
  className?: string;
  /** stroke width in unit space (viewBox is 2.4 wide) */
  strokeWidth?: number;
  fill?: string;
  id?: string;
  title?: string;
};

/** Standalone line-drawn gem. Colour = currentColor. */
export function Gem({ cut, className, strokeWidth = 0.012, fill = "none", id, title }: GemProps) {
  const g = gemGeometry(cut);
  return (
    <svg
      viewBox="-1.2 -1.2 2.4 2.4"
      className={cn("block", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      id={id}
    >
      {title ? <title>{title}</title> : null}
      <path d={g.outline} fill={fill} />
      <path d={g.facets} opacity={0.7} />
      <path d={g.table} />
    </svg>
  );
}

/** Inline group version for composing inside a larger SVG. Scale via transform on the <g>. */
export function GemGroup({
  cut,
  strokeWidth = 0.012,
  fill = "none",
  opacity = 1,
  ...rest
}: { cut: CutId; strokeWidth?: number; fill?: string; opacity?: number } & SVGProps<SVGGElement>) {
  const g = gemGeometry(cut);
  return (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={opacity}
      {...rest}
    >
      <path d={g.outline} fill={fill} />
      <path d={g.facets} opacity={0.7} />
      <path d={g.table} />
    </g>
  );
}
