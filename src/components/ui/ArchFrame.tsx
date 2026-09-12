"use client";

import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ArchFrame — the monogram's arch (flat base, true semicircular crown) as a real
 * photographic clip.
 *
 * Static clip-path. NEVER animated, and it has no motion of its own, so reduced
 * motion is unaffected. Used exactly three times site-wide: the landing Invitation,
 * the home hero and Bespoke. It is a brand mark, not a rounded card — do not reach
 * for it as decoration.
 *
 * Callers always pass an <ImageFrame className="h-full w-full"> as the child, so the
 * curtain peels back inside the arch.
 */

type Props = {
  children: ReactNode;
  className?: string;
  /** width / height of the frame. Default 0.8 (a 4:5 portrait). */
  ratio?: number;
};

export function ArchFrame({ children, className, ratio = 0.8 }: Props) {
  /* React 19's useId returns non-ident characters; strip them so the value is safe
     inside url(#…) and any querySelector a caller might write. */
  const id = `mj-arch-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const a = Math.min(Math.max(ratio, 0.2), 2);
  /* objectBoundingBox units: rx = 0.5 (half the width) and ry = a/2, so the crown is
     a true semicircle at the declared ratio rather than an ellipse. */
  const d = `M0,1 L0,${a / 2} A0.5,${a / 2} 0 0 1 1,${a / 2} L1,1 Z`;

  return (
    <>
      <svg aria-hidden="true" className="absolute h-0 w-0" focusable="false">
        <defs>
          <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={d} />
          </clipPath>
        </defs>
      </svg>
      <div className={cn("relative", className)} style={{ clipPath: `url(#${id})` }}>
        {children}
      </div>
    </>
  );
}
