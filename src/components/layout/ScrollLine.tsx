"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * ScrollLine — the loader's rose-gold hairline, continued as the page's progress line.
 *
 * The Preloader draws a rose hairline once and the metal then disappears for the rest
 * of the site. This keeps a single strand of it at the very top of every page, filling
 * left to right as you read. The 0.4 scrub lag is deliberate: it reads as a needle
 * settling behind you, not a bar tracking you.
 *
 * REDUCED MOTION: never animated. It rests at its CSS scaleX(0) and stays invisible —
 * it only duplicates the scrollbar, so nothing is lost.
 *
 * TAILWIND v4 NOTE: the resting state is `[transform:scaleX(0)]`, not `scale-x-0`.
 * v4's scale utilities write the standalone `scale` property, which COMPOSES with
 * GSAP's inline `transform` rather than being replaced by it — the line would then
 * stay at zero width forever.
 */
export function ScrollLine() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const line = ref.current?.querySelector<HTMLElement>("[data-line]");
      if (!line) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
        const tween = gsap.to(line, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "max",
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-px">
      <div
        data-line
        className="h-px w-full origin-left [transform:scaleX(0)] bg-linear-to-r from-rose-deep/0 via-rose/80 to-rose-light"
      />
    </div>
  );
}
