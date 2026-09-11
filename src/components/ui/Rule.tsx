"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  /** Animate with `ruleDraw` (scaleX 0 → 1, origin left) when scrolled into view. */
  draw?: boolean;
  /** Tone: on light grounds cream-deep, on wine grounds wine-soft @ 40%. */
  tone?: "light" | "wine" | "cream";
  className?: string;
  delay?: number;
};

const tones = {
  light: "bg-cream-deep",
  wine: "bg-wine-soft/40",
  cream: "bg-cream/18",
};

export function Rule({ draw = false, tone = "light", className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!draw || !ref.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(ref.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(ref.current, {
          scaleX: 1,
          duration: 0.8,
          ease: "power3.out",
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return <div ref={ref} aria-hidden="true" className={cn("h-px w-full", tones[tone], className)} />;
}
