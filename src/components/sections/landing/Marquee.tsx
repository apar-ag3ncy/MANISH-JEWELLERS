"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK, HOVER_OK } from "@/lib/gsap";
import { marquee } from "@/data/content";
import { Monogram } from "@/components/ui/Monogram";

/**
 * marquee — duplicated track, xPercent -50 loop. The timeScale rides scroll velocity
 * (1–3) and settles over 1.8s; hovering slows the strip to a quarter speed, so it
 * acknowledges being looked at. The separator is the brand monogram in its own metal.
 */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = ref.current;
      const track = host?.querySelector("[data-track]");
      if (!host || !track) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track, { xPercent: -50, repeat: -1, duration: 22, ease: "none" });
        let settle: gsap.core.Tween | null = null;
        let hovered = false;

        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            if (hovered) return;
            const v = Math.abs(self.getVelocity()) / 400;
            const ts = gsap.utils.clamp(1, 3, 1 + v);
            settle?.kill();
            loop.timeScale(ts);
            settle = gsap.to(loop, { timeScale: 1, duration: 1.8, ease: "power2.out", delay: 0.15 });
          },
        });

        const hover = gsap.matchMedia();
        hover.add(HOVER_OK, () => {
          const enter = () => {
            hovered = true;
            settle?.kill();
            gsap.to(loop, { timeScale: 0.25, duration: 0.8, ease: "power2.out", overwrite: true });
          };
          const leave = () => {
            hovered = false;
            gsap.to(loop, { timeScale: 1, duration: 1.2, ease: "power2.out", overwrite: true });
          };
          host.addEventListener("mouseenter", enter);
          host.addEventListener("mouseleave", leave);
          return () => {
            host.removeEventListener("mouseenter", enter);
            host.removeEventListener("mouseleave", leave);
          };
        });

        return () => {
          st.kill();
          settle?.kill();
          hover.revert();
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="overflow-hidden border-y border-cream-deep bg-cream edge-fade-x py-5 text-wine">
      <p className="sr-only">{marquee.join(", ")}</p>
      <div data-track aria-hidden="true" className="flex w-max whitespace-nowrap will-change-transform">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center">
            {marquee.map((item) => (
              <span
                key={item}
                className="flex items-center font-display text-[clamp(1.25rem,2.2vw,2rem)] tracking-[0.12em] uppercase"
              >
                <span className="px-5 md:px-8">{item}</span>
                <Monogram className="h-3 w-auto text-rose-deep/55" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
