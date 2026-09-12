"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { isRevealPending } from "@/lib/reveal";
import { Monogram } from "@/components/ui/Monogram";

/**
 * RouteCurtain — a wine curtain carrying the monogram, between / and /home.
 *
 * The App Router remounts a template on every navigation, so this is an ENTER
 * curtain: the new page is already painted underneath, the panel covers it on
 * mount and lifts away, monogram first.
 *
 * It must never fight the loader. `firstMount` skips the very first mount of the
 * session (that is a cold page load, which the Preloader owns), `lastPath` makes sure a
 * curtain only ever answers a real change of route, and `isRevealPending()` skips any
 * navigation that hands the screen back to the Preloader. Together they also survive
 * React StrictMode, which runs every effect twice in development.
 *
 * REDUCED MOTION: the panel is rendered with the `hidden` attribute and is only ever
 * revealed inside the MOTION_OK matchMedia — so the page simply appears, with nothing
 * covering it and nothing to wait for.
 */

let firstMount = true;
let lastPath: string | null = null;

export function RouteCurtain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  /* Survives StrictMode's simulated remount, so the second effect replays the same
     decision instead of taking the cold-load branch. */
  const playing = useRef(false);

  useGSAP(
    () => {
      const panel = ref.current;
      if (!panel) return;

      const cold = firstMount;
      const samePath = lastPath === pathname;
      firstMount = false;
      lastPath = pathname;

      /* A cold load, a re-mount at the same route, or a navigation the Preloader has
         taken over: no curtain. */
      if (cold) return;
      if (samePath && !playing.current) return;
      if (isRevealPending()) return;
      playing.current = true;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const mono = panel.querySelector<HTMLElement>("[data-curtain-mono]");

        panel.hidden = false;
        gsap.set(panel, { yPercent: 0 });
        if (mono) gsap.set(mono, { scale: 1.04, opacity: 1 });

        let tl: gsap.core.Timeline | null = null;

        const play = () => {
          tl = gsap.timeline({
            onComplete: () => {
              panel.hidden = true;
              /* SmoothScroll refreshes on pathname change; one more after the lift is
                 cheap insurance for the pinned sequences that just measured under it. */
              ScrollTrigger.refresh();
            },
          });

          if (mono) tl.to(mono, { scale: 1, opacity: 0, duration: 0.35, ease: "power2.out" }, 0);
          tl.to(
            panel,
            {
              yPercent: -100,
              duration: 0.9,
              ease: "expo.inOut",
              onStart: () => panel.classList.add("pointer-events-none"),
            },
            0.1,
          );
        };

        /**
         * Hold the curtain closed until the new page has stopped working. Lenis runs the
         * ticker with lag smoothing off, so a long hydration frame would advance the lift
         * in a single jump and the viewer would see nothing at all. Two consecutive light
         * frames mean the stage is ready — and the wait is capped, so a slow page lifts
         * the curtain anyway rather than sitting behind it.
         */
        const t0 = performance.now();
        let prev = t0;
        let calm = 0;
        let raf = 0;

        const settle = () => {
          const now = performance.now();
          calm = now - prev < 40 ? calm + 1 : 0;
          prev = now;
          if (calm >= 2 || now - t0 > 900) {
            play();
            return;
          }
          raf = requestAnimationFrame(settle);
        };
        raf = requestAnimationFrame(settle);

        return () => {
          cancelAnimationFrame(raf);
          tl?.kill();
          panel.hidden = true;
        };
      });
    },
    { scope: ref },
  );

  return (
    <>
      <div
        ref={ref}
        data-route-curtain
        hidden
        aria-hidden="true"
        className="fixed inset-0 z-[90] flex items-center justify-center bg-wine will-change-transform"
      >
        <span data-curtain-mono className="block will-change-transform">
          <Monogram className="h-14 w-auto text-rose/80" />
        </span>
      </div>
      {children}
    </>
  );
}
