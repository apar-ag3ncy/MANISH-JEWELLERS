"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK_DESKTOP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * ParallaxLayer — lets a server component (Invitation, Bespoke) drift a decorative
 * layer without itself becoming a client component. Wrap the layer, not the section.
 *
 * Desktop and motion-friendly only. Under reduced motion or below md nothing runs:
 * the layer sits static and fully visible.
 */

type Props = {
  children: ReactNode;
  className?: string;
  /** Travel in % of the layer's own height: -y at the bottom of the viewport, +y at the top. Default 6. */
  y?: number;
  /** Degrees of rotation across the same scrub. Default 0. */
  rotate?: number;
  /** [from, to] scale across the scrub. Omit for none. */
  scale?: [number, number];
  scrub?: number | boolean;
};

export function ParallaxLayer({ children, className, y = 6, rotate = 0, scale, scrub = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_DESKTOP, () => {
        gsap.fromTo(
          inner,
          { yPercent: -y, rotation: 0, ...(scale ? { scale: scale[0] } : null) },
          {
            yPercent: y,
            rotation: rotate,
            ...(scale ? { scale: scale[1] } : null),
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div ref={innerRef} data-layer className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
