"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION_OK_DESKTOP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { homeTopReel } from "@/data/content";
import { Monogram } from "@/components/ui/Monogram";

/**
 * TopReel — home's pinned, scrubbed lookbook, and the first wine ground on the page.
 *
 * One timeline drives everything: each plate pushes in across its own third, the
 * hand-offs crossfade while BOTH plates are still travelling (never a still under a
 * zoom), the caption swaps inside its mask, and three hairline segments fill so the
 * viewer always sees how much of the reel is left. 150% of scrub is the ceiling.
 *
 * The pin exists only inside `(prefers-reduced-motion: no-preference) and
 * (min-width: 768px)` — in CSS as well as in GSAP. Below md, and at every width under
 * reduced motion, the three figures sit in normal vertical flow with their captions
 * beneath them, fully visible and static. See src/styles/enhance-home.css.
 */

/** Mobile counterpart to MOTION_OK_DESKTOP: the curtain runs, the pin never does. */
const MOTION_OK_MOBILE = "(prefers-reduced-motion: no-preference) and (max-width: 767px)";

/** Hand-off window and travel, in timeline units. One unit = one frame. */
const SWAP = 0.18;
const HOLD = 0.82;

export function TopReel() {
  const ref = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const pin = pinRef.current;
      if (!pin) return;

      const figs = gsap.utils.toArray<HTMLElement>("[data-frame]", pin);
      const plates = gsap.utils.toArray<HTMLElement>("[data-plate]", pin);
      const lines = gsap.utils.toArray<HTMLElement>("[data-line]", pin);
      const segs = gsap.utils.toArray<HTMLElement>("[data-seg]", pin);
      const curtains = gsap.utils.toArray<HTMLElement>("[data-curtain]", pin);
      const n = figs.length;
      if (n < 2) return;

      const mm = gsap.matchMedia();

      /* DESKTOP — one pinned, scrubbed sequence. */
      mm.add(MOTION_OK_DESKTOP, () => {
        gsap.set(figs, { opacity: (i: number) => (i === 0 ? 1 : 0) });
        gsap.set(plates, { scale: (i: number) => (i === 0 ? 1.14 : 1.12) });
        gsap.set(lines, {
          yPercent: (i: number) => (i === 0 ? 0 : 110),
          opacity: (i: number) => (i === 0 ? 1 : 0),
        });
        gsap.set(segs, { scaleY: 0, transformOrigin: "top center" });

        const tl = gsap.timeline({
          defaults: { ease: "none", immediateRender: false },
          scrollTrigger: {
            trigger: pin,
            pin,
            scrub: 0.6,
            start: "top top",
            end: "+=150%",
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        figs.forEach((_, i) => {
          const last = i === n - 1;
          /* The incoming plate starts moving one hand-off BEFORE it is seen, so the
             crossfade never happens between a moving plate and a still one. */
          const inAt = i === 0 ? 0 : i - SWAP;
          const outAt = i + HOLD;

          tl.fromTo(
            plates[i],
            { scale: i === 0 ? 1.14 : 1.12 },
            { scale: 1, duration: outAt - inAt, ease: "power1.out", immediateRender: false },
            inAt,
          );

          if (!last) {
            tl.fromTo(
              plates[i],
              { scale: 1 },
              { scale: 1.06, duration: SWAP, ease: "power1.in", immediateRender: false },
              outAt,
            );
          }

          if (i > 0) {
            tl.fromTo(figs[i], { opacity: 0 }, { opacity: 1, duration: SWAP, ease: "power1.inOut" }, inAt);
            tl.fromTo(figs[i - 1], { opacity: 1 }, { opacity: 0, duration: SWAP, ease: "power1.inOut" }, inAt);
            tl.fromTo(
              lines[i - 1],
              { yPercent: 0, opacity: 1 },
              { yPercent: -110, opacity: 0, duration: SWAP * 0.85, ease: "power2.in" },
              inAt,
            );
            tl.fromTo(
              lines[i],
              { yPercent: 110, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: SWAP * 1.15, ease: "power2.out" },
              inAt + SWAP * 0.35,
            );
          }

          /* Visible progress: one hairline segment per frame, always advancing. */
          tl.fromTo(segs[i], { scaleY: 0 }, { scaleY: 1, duration: 1 }, i);
        });
      });

      /* MOBILE — no pin, no scrub. Each frame keeps the house curtain unveil, and
         the head gets the same lift every section head uses. */
      mm.add(MOTION_OK_MOBILE, () => {
        const flow = pin.querySelector<HTMLElement>("[data-flow-head]");
        if (flow) {
          gsap.set(flow, { y: 14, opacity: 0 });
          gsap.to(flow, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: flow, start: "top 88%", once: true },
          });
        }

        figs.forEach((fig, i) => {
          const curtain = curtains[i];
          const plate = plates[i];
          if (!curtain || !plate) return;
          gsap.set(curtain, { scaleY: 1, transformOrigin: "bottom center" });
          gsap.set(plate, { scale: 1.12 });
          gsap
            .timeline({ scrollTrigger: { trigger: fig, start: "top 82%", once: true } })
            .to(curtain, { scaleY: 0, duration: 1.25, ease: "expo.out" }, 0)
            .to(plate, { scale: 1, duration: 1.6, ease: "expo.out" }, 0.05);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label={homeTopReel.eyebrow} className="on-wine relative bg-wine-deep text-cream">
      <div ref={pinRef} className="mj-reel-pin relative">
        {/* Flow head — mobile and reduced motion. Hidden where the pin runs. */}
        <div data-flow-head className="mj-reel-flow container-x pt-[clamp(80px,12vw,120px)] pb-10">
          <span aria-hidden="true" className="mb-6 block h-px w-6 bg-rose/60" />
          <p className="eyebrow text-cream/70">{homeTopReel.eyebrow}</p>
        </div>

        <div className="mj-reel-stack flex flex-col gap-16 pb-[clamp(80px,12vw,120px)]">
          {homeTopReel.frames.map((frame) => (
            <figure key={frame.src} data-frame className="mj-reel-frame relative">
              <div className="mj-reel-plate relative aspect-[4/5] overflow-hidden bg-wine-deep md:aspect-[16/10]">
                <div data-plate className="absolute inset-0 will-change-transform">
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes="100vw"
                    className={cn("object-cover", frame.focus)}
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-wine-deep/85 via-wine-deep/10 to-wine-deep/25"
                />
                <span
                  data-curtain
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 origin-bottom [transform:scaleY(0)] bg-wine-deep"
                />
              </div>
              <figcaption className="mj-reel-caption container-x mt-6">
                <span className="mask-line">
                  <span data-line className="block display-m text-cream will-change-transform">
                    {frame.line}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Overlaid chrome — only rendered where the pinned stage exists. */}
        <div className="mj-reel-chrome pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          <Monogram className="absolute top-[clamp(96px,14vh,140px)] right-[clamp(20px,5vw,80px)] h-6 w-auto text-cream/80" />

          <div className="absolute top-1/2 right-[clamp(20px,5vw,80px)] flex -translate-y-1/2 flex-col gap-4">
            {homeTopReel.frames.map((frame) => (
              <span key={frame.src} className="relative block h-14 w-px bg-cream/30">
                <span data-seg className="absolute inset-0 block origin-top [transform:scaleY(0)] bg-rose-light" />
              </span>
            ))}
          </div>

          <div className="mj-reel-eyebrow absolute inset-x-0 container-x">
            <span className="mb-4 block h-px w-6 bg-rose/60" />
            <p className="eyebrow text-cream/70">{homeTopReel.eyebrow}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
