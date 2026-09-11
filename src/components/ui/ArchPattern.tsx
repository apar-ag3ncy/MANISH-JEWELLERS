import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  /** Tile size in px. */
  size?: number;
  strokeWidth?: number;
};

/**
 * The brand's arch lattice: verticals every tile, overlapping semicircles
 * whose crossings form pointed arches. Decorative only. Colour = currentColor.
 */
export function ArchPattern({ className, size = 56, strokeWidth = 1 }: Props) {
  const id = useId();
  const s = size;
  return (
    <svg className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} aria-hidden="true">
      <defs>
        <pattern id={id} width={s} height={s} patternUnits="userSpaceOnUse">
          <path
            d={`M0 0V${s} M${-s} ${s}A${s} ${s} 0 0 1 ${s} ${s} M0 ${s}A${s} ${s} 0 0 1 ${2 * s} ${s}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
