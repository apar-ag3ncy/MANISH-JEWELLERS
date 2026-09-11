import { useId } from "react";
import { cn } from "@/lib/utils";
import { LOCKUP, type Box } from "./lockup-data";

const W = LOCKUP.viewBox.w;
const H = LOCKUP.viewBox.h;
const centerX = (b: Box) => b.x + b.w / 2;
const WORDMARK_CX = centerX(LOCKUP.wordmark.box);
const TAGLINE_CX = centerX(LOCKUP.tagline.box);

/** Distance (lockup units) the sheen band travels to cross the whole lockup. */
export const SHINE_TRAVEL = W * 1.8;

const safeId = (raw: string) => raw.replace(/[^a-zA-Z0-9_-]/g, "");

type EmbossProps = {
  id: string;
  blur: number;
  drop: [number, number];
  dropOpacity: number;
  low: [number, number];
  high: [number, number];
  highOpacity: number;
};

/** Raised-metal finish: soft cast shadow, dark lower rim, bright upper rim, then the metal face. */
function EmbossFilter({ id, blur, drop, dropOpacity, low, high, highOpacity }: EmbossProps) {
  return (
    <filter
      id={id}
      filterUnits="userSpaceOnUse"
      x={-W * 0.5}
      y={-H * 0.5}
      width={W * 2}
      height={H * 2}
      colorInterpolationFilters="sRGB"
    >
      <feGaussianBlur in="SourceAlpha" stdDeviation={blur} result="blur" />
      <feOffset in="blur" dx={drop[0]} dy={drop[1]} result="drop" />
      <feFlood className="[flood-color:var(--color-wine-deep)]" floodOpacity={dropOpacity} />
      <feComposite in2="drop" operator="in" result="shadow" />
      <feOffset in="SourceAlpha" dx={low[0]} dy={low[1]} result="lowOffset" />
      <feFlood className="[flood-color:var(--color-rose-shadow)]" />
      <feComposite in2="lowOffset" operator="in" result="low" />
      <feOffset in="SourceAlpha" dx={high[0]} dy={high[1]} result="highOffset" />
      <feFlood className="[flood-color:var(--color-rose-glow)]" floodOpacity={highOpacity} />
      <feComposite in2="highOffset" operator="in" result="high" />
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="low" />
        <feMergeNode in="high" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  );
}

type LockupProps = { className?: string; label: string };

/**
 * The real Manish Jewellers lockup, outlined from the master logo PDF:
 * monogram, wordmark and tagline, finished as embossed rose gold.
 *
 * Renders static and fully visible. Motion is applied by the parent via:
 * [data-mono-fill] [data-mono-draw] [data-glyph] [data-tag] [data-shine].
 * Each glyph carries `data-dx`, its horizontal offset from its line's centre,
 * so a parent can animate tracking (letters closing in on the centre).
 */
export function BrandLockup({ className, label }: LockupProps) {
  const uid = safeId(useId());
  const metal = `mj-metal-${uid}`;
  const embossBold = `mj-emboss-bold-${uid}`;
  const embossFine = `mj-emboss-fine-${uid}`;
  const clip = `mj-clip-${uid}`;
  const sheen = `mj-sheen-${uid}`;

  return (
    <span className={cn("relative block", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" role="img" aria-label={label}>
        <defs>
          <linearGradient id={metal} x1="0" y1="0" x2="0.28" y2="1">
            <stop offset="0" className="[stop-color:var(--color-rose-glow)]" />
            <stop offset="0.22" className="[stop-color:var(--color-rose-light)]" />
            <stop offset="0.58" className="[stop-color:var(--color-rose)]" />
            <stop offset="0.86" className="[stop-color:var(--color-rose-deep)]" />
            <stop offset="1" className="[stop-color:var(--color-rose)]" />
          </linearGradient>
          {/* Monogram and wordmark carry a deeper bevel; the fine tagline a light one. */}
          <EmbossFilter
            id={embossBold}
            blur={4.5}
            drop={[3, 7]}
            dropOpacity={0.7}
            low={[1.1, 1.6]}
            high={[-0.9, -1.2]}
            highOpacity={0.65}
          />
          <EmbossFilter
            id={embossFine}
            blur={2.2}
            drop={[1.2, 3]}
            dropOpacity={0.6}
            low={[0.45, 0.7]}
            high={[-0.35, -0.5]}
            highOpacity={0.4}
          />
        </defs>

        <g filter={`url(#${embossBold})`}>
          <g data-mono-fill>
            <path d={LOCKUP.monogram.d} fill={`url(#${metal})`} />
          </g>
          <g>
            {LOCKUP.wordmark.glyphs.map((g, i) => (
              <g key={i} data-glyph data-dx={(centerX(g.box) - WORDMARK_CX).toFixed(1)}>
                <path d={g.d} fill={`url(#${metal})`} />
              </g>
            ))}
          </g>
        </g>
        <g filter={`url(#${embossFine})`}>
          {LOCKUP.tagline.glyphs.map((g, i) => (
            <g key={i} data-tag data-dx={(centerX(g.box) - TAGLINE_CX).toFixed(1)}>
              <path d={g.d} fill={`url(#${metal})`} />
            </g>
          ))}
        </g>

        {/* Hairline tracing of the monogram contours, used only during the intro. */}
        <g data-mono-draw className="opacity-0" fill="none" strokeWidth="2.4" strokeLinejoin="round">
          {LOCKUP.monogram.subpaths.map((d, i) => (
            <path key={i} d={d} className="stroke-rose-light" />
          ))}
        </g>
      </svg>

      {/* Sheen: a separate layer so its sweep never repaints the embossed base. */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full overflow-visible mix-blend-screen"
      >
        <defs>
          <clipPath id={clip}>
            <path d={LOCKUP.monogram.d} />
            {LOCKUP.wordmark.glyphs.map((g, i) => (
              <path key={`w${i}`} d={g.d} />
            ))}
            {LOCKUP.tagline.glyphs.map((g, i) => (
              <path key={`t${i}`} d={g.d} />
            ))}
          </clipPath>
          <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" className="[stop-color:var(--color-rose-glow)]" stopOpacity="0" />
            <stop offset="0.5" className="[stop-color:var(--color-rose-glow)]" stopOpacity="0.95" />
            <stop offset="1" className="[stop-color:var(--color-rose-glow)]" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <g transform="skewX(-22)">
            <rect data-shine x={-W * 0.45} y={-H * 0.2} width={W * 0.22} height={H * 1.6} fill={`url(#${sheen})`} />
          </g>
        </g>
      </svg>
    </span>
  );
}

type MarkProps = { className?: string; title?: string };

function union(boxes: Box[]) {
  const x0 = Math.min(...boxes.map((b) => b.x));
  const y0 = Math.min(...boxes.map((b) => b.y));
  const x1 = Math.max(...boxes.map((b) => b.x + b.w));
  const y1 = Math.max(...boxes.map((b) => b.y + b.h));
  return `${x0} ${y0} ${x1 - x0} ${y1 - y0}`;
}

/** The real wordmark in currentColor. `words`: 0 = MANISH, 1 = JEWELLERS. */
export function BrandWordmark({ className, title, words }: MarkProps & { words?: number[] }) {
  const pick = words ?? LOCKUP.wordmark.words.map((_, i) => i);
  return (
    <svg
      viewBox={union(pick.map((i) => LOCKUP.wordmark.words[i]))}
      className={cn("block", className)}
      fill="currentColor"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {LOCKUP.wordmark.glyphs
        .filter((g) => pick.includes(g.word))
        .map((g, i) => (
          <path key={i} d={g.d} />
        ))}
    </svg>
  );
}

/** The real tagline, CRAFTED THROUGH GENERATIONS, in currentColor. */
export function BrandTagline({ className, title }: MarkProps) {
  return (
    <svg
      viewBox={union([LOCKUP.tagline.box])}
      className={cn("block", className)}
      fill="currentColor"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      {LOCKUP.tagline.glyphs.map((g, i) => (
        <path key={i} d={g.d} />
      ))}
    </svg>
  );
}
