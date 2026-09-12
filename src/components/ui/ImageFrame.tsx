"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK, MOTION_OK_DESKTOP, HOVER_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { CurtainTone } from "@/types";

/**
 * ImageFrame — the house's single photographic gesture.
 *
 * A ground-coloured curtain retracts upward while the photograph settles out of a
 * push-in; on desktop the plate drifts inside its own frame; on hover a rose sheen
 * crosses and the plate eases in. This replaces every hand-rolled
 * `group-hover:scale-[1.04]` on the site.
 *
 * HOUSE RULES (all five primitives obey these; so must every caller):
 *  • Every GSAP effect lives inside useGSAP(() => {...}, { scope }) wrapped in
 *    gsap.matchMedia().add(MOTION_OK | MOTION_OK_DESKTOP | HOVER_OK).
 *  • Transform and opacity only. The single exception site-wide is
 *    MapIllustration's stroke-dashoffset draw-on (homeBottom).
 *  • Hidden start states come from JS only — never a CSS opacity-0 on real content.
 *    Decorative overlays (curtain, sheen) are the exception: they must default to
 *    hidden in CSS so reduced motion and a JS failure both leave the photo visible.
 *  • Budget: at most ~12 scrubbed ScrollTriggers per page. Pass depth={0} wherever a
 *    parent timeline already scrubs this element.
 *  • Radius max 4px, no new shadows, colours only via tokens.
 *
 * TAILWIND v4 NOTE — why the curtain and sheen carry `[transform:...]` arbitrary
 * properties instead of `scale-y-0` / `-translate-x-[140%]`: in v4 those utilities
 * compile to the standalone `scale` / `translate` CSS properties, which COMPOSE with
 * (rather than being overridden by) the `transform` GSAP writes inline. A curtain
 * classed `scale-y-0` would stay at scaleY 0 forever. Arbitrary `transform` values are
 * cleanly overridden by GSAP's inline transform, and still supply the static
 * reduced-motion fallback. Never put a Tailwind scale-/translate-/rotate- utility on
 * an element GSAP transforms.
 *
 * REDUCED MOTION: no matchMedia fires — the curtain stays collapsed, the plate is
 * untransformed and the sheen is parked off-frame, all from CSS. Every photograph is
 * fully visible and static. A JS failure has exactly the same result.
 */

const TONE: Record<CurtainTone, string> = {
  "cream-soft": "bg-cream-soft",
  cream: "bg-cream",
  white: "bg-white",
  wine: "bg-wine",
  "wine-deep": "bg-wine-deep",
};

type Props = {
  src: string;
  alt: string;
  /** Required. next/image sizes hint, e.g. "(min-width: 1024px) 30vw, 100vw". */
  sizes: string;
  /** Tailwind object-position class, e.g. "object-[52%_28%]". */
  focus?: string;
  /** Frame classes: aspect ratio, grid spans, `h-full w-full`. */
  className?: string;
  /** MUST match the ground the frame sits on. Default "cream-soft". */
  curtain?: CurtainTone;
  /** In-frame parallax travel in %. Default 4, clamped to 6. 0 disables. */
  depth?: number;
  hover?: boolean;
  /** Offset for the unveil, in seconds. Use to stagger a grid. */
  delay?: number;
  /** "none" = no unveil; the caller owns the entrance. */
  reveal?: "scroll" | "none";
  priority?: boolean;
  /** Rendered above the photo, inside the frame (captions, numerals, hairlines). */
  children?: ReactNode;
};

export function ImageFrame({
  src,
  alt,
  sizes,
  focus,
  className,
  curtain = "cream-soft",
  depth = 4,
  hover = true,
  delay = 0,
  reveal = "scroll",
  priority = false,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLSpanElement>(null);
  const sheenRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const frame = ref.current;
      const plate = plateRef.current;
      if (!frame || !plate) return;

      const mm = gsap.matchMedia();

      /* UNVEIL — curtain retracts, plate settles out of a push-in. */
      const curtainEl = curtainRef.current;
      if (reveal === "scroll" && curtainEl) {
        mm.add(MOTION_OK, () => {
          gsap.set(curtainEl, { scaleY: 1, transformOrigin: "bottom center" });
          gsap.set(plate, { scale: 1.16 });
          gsap
            .timeline({ scrollTrigger: { trigger: frame, start: "top 82%", once: true } })
            .to(curtainEl, { scaleY: 0, duration: 1.25, ease: "expo.out" }, delay)
            .to(plate, { scale: 1, duration: 1.6, ease: "expo.out" }, delay + 0.05);
        });
      }

      /* DEPTH — the plate drifts inside the frame. The -6% inset guarantees no edge
         is ever exposed. scale and yPercent are separate properties, so the unveil
         and the parallax never overwrite one another. */
      if (depth > 0) {
        mm.add(MOTION_OK_DESKTOP, () => {
          const d = Math.min(depth, 6);
          gsap.fromTo(
            plate,
            { yPercent: -d },
            {
              yPercent: d,
              ease: "none",
              scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      }

      /* HOVER — one small timeline: rose sheen crosses, plate eases in. */
      const sheen = sheenRef.current;
      if (hover) {
        mm.add(HOVER_OK, () => {
          if (sheen) gsap.set(sheen, { xPercent: -140, skewX: -12 });

          const enter = () => {
            if (sheen) {
              gsap.fromTo(
                sheen,
                { xPercent: -140 },
                { xPercent: 620, duration: 1.15, ease: "power2.inOut", overwrite: true },
              );
            }
            gsap.to(plate, { scale: 1.05, duration: 0.9, ease: "power3.out", overwrite: "auto" });
          };
          const leave = () => {
            gsap.to(plate, { scale: 1, duration: 1.1, ease: "power3.out", overwrite: "auto" });
          };

          frame.addEventListener("mouseenter", enter);
          frame.addEventListener("mouseleave", leave);
          return () => {
            frame.removeEventListener("mouseenter", enter);
            frame.removeEventListener("mouseleave", leave);
          };
        });
      }
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-wine-deep", className)}>
      <div ref={plateRef} data-plate className="absolute inset-x-0 -inset-y-[6%] will-change-transform">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", focus)} />
      </div>
      <span
        ref={sheenRef}
        data-sheen
        aria-hidden="true"
        className="pointer-events-none absolute -inset-y-[20%] left-0 w-[22%] [transform:translateX(-140%)_skewX(-12deg)] bg-linear-to-r from-transparent via-rose-light/20 to-transparent"
      />
      <span
        ref={curtainRef}
        data-curtain
        aria-hidden="true"
        className={cn("pointer-events-none absolute inset-0 origin-bottom [transform:scaleY(0)]", TONE[curtain])}
      />
      {children}
    </div>
  );
}
