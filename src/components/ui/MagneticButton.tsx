"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, HOVER_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; className?: string; strength?: number };

/** magnetic — translate up to 8px toward the cursor with quickTo; elastic snap back. Hover devices only. */
export function MagneticButton({ children, className, strength = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(HOVER_OK, () => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          xTo(gsap.utils.clamp(-strength, strength, dx * strength));
          yTo(gsap.utils.clamp(-strength, strength, dy * strength));
        };
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.4)", overwrite: true });
        };

        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        return () => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  );
}
