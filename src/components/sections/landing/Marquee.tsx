"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { marquee } from "@/data/content";

/** marquee — duplicated track, xPercent -50 loop, timeScale rides scroll velocity (1–4). */
export function Marquee() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = ref.current?.querySelector("[data-track]");
      if (!track) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track, { xPercent: -50, repeat: -1, duration: 22, ease: "none" });
        let settle: gsap.core.Tween | null = null;
        const st = ScrollTrigger.create({
          onUpdate: (self) => {
            const v = Math.abs(self.getVelocity()) / 400;
            const ts = gsap.utils.clamp(1, 4, 1 + v);
            settle?.kill();
            loop.timeScale(ts);
            settle = gsap.to(loop, { timeScale: 1, duration: 1.4, ease: "power2.out", delay: 0.15 });
          },
        });
        return () => {
          st.kill();
          settle?.kill();
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="overflow-hidden border-y border-cream-deep bg-cream py-5 text-wine">
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
                <span className="text-wine-soft">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
