"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { holdReveal, releaseReveal, resetReveal } from "@/lib/reveal";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { INTRO } from "@/lib/constants";
import { WineGround } from "@/components/ui/brand/WineGround";

let playedThisSession = false;

/**
 * preloader — a lit wine curtain. The hero's real brand lockup is lifted above
 * it and performs its intro in the centre of the screen: the monogram traces
 * and fills with rose gold, the wordmark tracks in, the tagline follows, a
 * sheen crosses the metal. The curtain then wipes upward while the lockup
 * glides into its place in the hero.
 *
 * Plays once per session. Hidden under prefers-reduced-motion (CSS), and a CSS
 * failsafe hides it if JavaScript never takes over.
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const failsafeFired = getComputedStyle(el).visibility === "hidden";
      if (reduced || failsafeFired || playedThisSession) {
        gsap.set(el, { display: "none" });
        return;
      }

      el.classList.add("mj-live");
      if ("scrollRestoration" in history) history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      holdReveal();
      lockScroll();

      const bar = el.querySelector("[data-progress]");
      gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

      gsap
        .timeline({
          onComplete: () => {
            gsap.set(el, { display: "none" });
            unlockScroll();
            playedThisSession = true;
          },
        })
        .to(bar, { scaleX: 1, duration: INTRO.reveal - 0.15, ease: "power1.inOut" }, 0)
        .to(bar, { opacity: 0, duration: 0.3, ease: "power2.out" }, INTRO.reveal - 0.15)
        .to(el, { yPercent: -100, duration: INTRO.curtain, ease: "expo.inOut", onStart: releaseReveal }, INTRO.reveal);

      return () => unlockScroll();
    },
    { scope: ref },
  );

  useEffect(() => () => resetReveal(), []);

  return (
    <div
      ref={ref}
      className="mj-preloader on-wine fixed inset-0 z-[100] overflow-hidden will-change-transform"
      aria-hidden="true"
    >
      <WineGround />
      <div className="absolute bottom-[clamp(28px,6vh,56px)] left-1/2 w-[min(40vw,180px)] -translate-x-1/2">
        <div className="h-px bg-rose/25">
          <div data-progress className="h-px bg-rose" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-rose/50" />
    </div>
  );
}
