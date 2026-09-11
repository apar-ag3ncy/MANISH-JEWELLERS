import type { PieceArtKind } from "@/types";
import { cn } from "@/lib/utils";
import { GemGroup } from "./Gem";

type Props = {
  kind: PieceArtKind;
  className?: string;
  /** Meaningful description for assistive tech. Omit for decorative use. */
  alt?: string;
};

/**
 * Placeholder line illustrations (4:5) until real photography exists.
 * Stroke = currentColor, so they sit on cream, white or wine.
 */
export function PieceArt({ kind, className, alt }: Props) {
  return (
    <svg
      viewBox="0 0 200 250"
      className={cn("block h-full w-full", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={alt ? undefined : "true"}
      role={alt ? "img" : undefined}
    >
      {alt ? <title>{alt}</title> : null}
      {kind === "ring" && <Ring />}
      {kind === "necklace" && <Necklace />}
      {kind === "earrings" && <Earrings />}
      {kind === "bangle" && <Bangle />}
    </svg>
  );
}

function Ring() {
  return (
    <g>
      {/* band: two ellipses in perspective, thickness at the sides */}
      <ellipse cx="100" cy="152" rx="64" ry="42" />
      <ellipse cx="100" cy="152" rx="52" ry="31" />
      <path d="M36 152v10a64 42 0 0 0 128 0v-10" opacity="0.8" />
      {/* head: prongs + stone */}
      <path d="M84 111l-6-12M116 111l6-12M92 118l-4-14M108 118l4-14" opacity="0.8" />
      <g transform="translate(100 96) scale(22)">
        <GemGroup cut="round" strokeWidth={0.05} />
      </g>
    </g>
  );
}

function Necklace() {
  return (
    <g>
      {/* chain */}
      <path d="M38 14C36 96 64 152 100 158c36-6 64-62 62-144" strokeDasharray="2.4 4" strokeWidth="1.6" />
      {/* bail */}
      <path d="M96 158a4 4 0 0 1 8 0v8a4 4 0 0 1-8 0z" />
      {/* pendant: pear, point up */}
      <g transform="translate(100 200) scale(30)">
        <GemGroup cut="pear" strokeWidth={0.04} />
      </g>
    </g>
  );
}

function Earrings() {
  return (
    <g>
      {[64, 136].map((x) => (
        <g key={x} transform={`translate(${x} 0)`}>
          {/* post + stud */}
          <circle cx="0" cy="58" r="5" />
          <path d="M0 63v22" />
          {/* drop: pear, point up */}
          <g transform="translate(0 132) scale(38)">
            <GemGroup cut="pear" strokeWidth={0.032} />
          </g>
          {/* a second, smaller drop behind for depth */}
          <path d="M-9 190l9 32 9-32" opacity="0.6" />
        </g>
      ))}
    </g>
  );
}

function Bangle() {
  return (
    <g>
      <ellipse cx="100" cy="128" rx="82" ry="50" />
      <ellipse cx="100" cy="128" rx="62" ry="34" />
      {/* lower edge for thickness */}
      <path d="M18 128v14a82 50 0 0 0 164 0v-14" opacity="0.85" />
      {/* engraving along the front face */}
      <path
        d="M40 168c8 8 20 12 30 13M70 181c6 2 14 3 20 3M110 184c8 0 16-1 22-3M132 181c10-2 20-6 28-13"
        strokeDasharray="1.5 3.5"
        opacity="0.8"
      />
      {/* motif: tiny arches */}
      <path d="M86 150a7 7 0 0 1 14 0M100 150a7 7 0 0 1 14 0M93 146a7 7 0 0 1 14 0" opacity="0.7" />
    </g>
  );
}
