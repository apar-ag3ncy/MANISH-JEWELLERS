"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { heritage, homeBottomHeritage } from "@/data/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { ImageFrame } from "@/components/ui/ImageFrame";

/**
 * Heritage — the house's own century, scrubbed.
 *
 * The section is held for 150% of a viewport while the five milestones step through a
 * single numeral: 1915, 1932, 1952, 1988, 2025. The goldsmith holds the left half and
 * pushes in slowly behind them; five hairline dashes fill as the reader advances, and
 * they are also the control — touching one hands the sequence over for good.
 *
 * ACCESSIBILITY AND FALLBACK. The stacked numeral is a decorative stage (aria-hidden):
 * the real content is the plain list beside it, which is what a screen reader reads,
 * what a reader without JavaScript sees, and what reduced motion shows. At md and up
 * with motion allowed, the list becomes sr-only and the stage takes the stage; below
 * md, or under reduced motion, the stage is hidden in CSS and nothing is ever pinned.
 * See src/styles/enhance-home-bottom.css.
 */

/** Pin only at lg and up: below that the section is one column and a pin would strand it. */
const STEP_OK = "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 720px)";

export function BottomHeritage() {
  const ref = useRef<HTMLElement>(null);
  const locked = useRef(false);
  const [index, setIndex] = useState(0);
  const count = heritage.milestones.length;

  /** Any deliberate input hands the sequence to the reader for the rest of the visit. */
  function take(i: number) {
    locked.current = true;
    setIndex(i);
  }

  /* PINNED STEP-THROUGH — the century advances with the scroll. */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const media = gsap.matchMedia();

      media.add(STEP_OK, () => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "+=150%",
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (locked.current) return;
            const i = Math.min(count - 1, Math.max(0, Math.floor(self.progress * count)));
            setIndex((prev) => (prev === i ? prev : i));
          },
        });
        return () => st.kill();
      });
    },
    { scope: ref },
  );

  /* the numeral rolls, its label follows, the dashes fill */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const years = gsap.utils.toArray<HTMLElement>("[data-year]", el);
      const labels = gsap.utils.toArray<HTMLElement>("[data-label]", el);
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", el);

      years.forEach((y, i) => {
        const active = i === index;
        if (reduced) {
          gsap.set(y, { opacity: active ? 1 : 0, yPercent: 0 });
          return;
        }
        if (active) {
          gsap.fromTo(
            y,
            { yPercent: 55, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", overwrite: true },
          );
        } else {
          gsap.to(y, { yPercent: -35, opacity: 0, duration: 0.45, ease: "power3.in", overwrite: true });
        }
      });

      labels.forEach((l, i) => {
        const active = i === index;
        if (reduced) {
          gsap.set(l, { opacity: active ? 1 : 0, yPercent: 0 });
          return;
        }
        if (active) {
          gsap.fromTo(
            l,
            { yPercent: 110, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.8, ease: "expo.out", delay: 0.1, overwrite: true },
          );
        } else {
          gsap.to(l, { yPercent: -60, opacity: 0, duration: 0.4, ease: "power3.in", overwrite: true });
        }
      });

      bars.forEach((b, i) => {
        const filled = i <= index;
        if (reduced) {
          gsap.set(b, { scaleX: filled ? 1 : 0, transformOrigin: "left center" });
          return;
        }
        gsap.to(b, {
          scaleX: filled ? 1 : 0,
          duration: 0.5,
          ease: "power2.out",
          transformOrigin: "left center",
          overwrite: true,
        });
      });
    },
    { scope: ref, dependencies: [index, count] },
  );

  return (
    <section
      id={heritage.id}
      ref={ref}
      className="on-wine relative scroll-mt-20 overflow-hidden bg-wine-deep text-cream"
    >
      <span aria-hidden="true" className="mj-grain pointer-events-none absolute inset-0" />

      <div className="relative container-x grid min-h-[88svh] grid-cols-12 items-center gap-x-6 gap-y-14 section-y">
        {/* the house, and the bench it was built on */}
        <div className="col-span-12 lg:col-span-5">
          <SectionHead
            tone="wine"
            eyebrow={heritage.eyebrow}
            heading={heritage.heading}
            lede={heritage.line}
            headingClassName="max-w-[12ch]"
          />
          <p className="mt-6 font-body text-[15px] tracking-[0.06em] text-rose/85">{heritage.hindiMark}</p>
          <ImageFrame
            src={heritage.bench.src}
            alt={heritage.bench.alt}
            sizes="(min-width: 1024px) 40vw, 100vw"
            focus="object-[50%_45%]"
            curtain="wine-deep"
            depth={0}
            delay={0.1}
            className="mt-10 aspect-[4/3] w-full"
          />
        </div>

        {/* the century */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          {/* decorative stage: one numeral at a time, gold leaf behind it */}
          <div aria-hidden="true" className="mj-heritage-stage relative">
            <span className="pointer-events-none absolute -inset-x-[8%] -top-[12%] h-[80%] [mask-image:radial-gradient(58%_62%_at_32%_45%,black,transparent_75%)] opacity-[0.10]">
              <Image src={heritage.foil.src} alt="" fill sizes="50vw" className="object-cover" />
            </span>
            <div className="relative grid overflow-hidden pb-2">
              {heritage.milestones.map((m, i) => (
                <span
                  key={m.year}
                  data-year
                  className={cn(
                    "col-start-1 row-start-1 block font-display text-[clamp(4.5rem,11vw,9rem)] leading-[0.9] tracking-[-0.02em] tabular will-change-transform",
                    i === 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {m.year}
                </span>
              ))}
            </div>
            <div className="relative mt-5 grid min-h-[2.8em] overflow-hidden">
              {heritage.milestones.map((m, i) => (
                <span
                  key={m.year}
                  data-label
                  className={cn(
                    "col-start-1 row-start-1 block font-display text-[clamp(1.15rem,2vw,1.6rem)] leading-[1.3] text-cream/85 will-change-transform",
                    i === 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* the real content: readable without JavaScript, and under reduced motion */}
          <ol className="mj-heritage-list space-y-6">
            {heritage.milestones.map((m) => (
              <li key={m.year} className="flex items-baseline gap-5">
                <span className="font-display text-[clamp(1.75rem,5vw,2.5rem)] leading-none text-cream tabular">
                  {m.year}
                </span>
                <span className="text-[15px] text-cream/80">{m.label}</span>
              </li>
            ))}
          </ol>

          {/* progress, and the control */}
          <div className="mt-12 flex items-center gap-2" role="group" aria-label={homeBottomHeritage.progressLabel}>
            {heritage.milestones.map((m, i) => (
              <button
                key={m.year}
                type="button"
                onClick={() => take(i)}
                aria-current={i === index ? "true" : undefined}
                aria-label={`${homeBottomHeritage.goTo} ${m.year}`}
                className="flex h-8 max-w-[72px] flex-1 items-center"
              >
                <span className="relative block h-px w-full overflow-hidden bg-cream/25">
                  <span data-bar className="absolute inset-0 [transform:scaleX(0)] bg-rose" />
                </span>
              </button>
            ))}
          </div>

          <p className="mt-10 display-m text-cream">{heritage.closing}</p>
        </div>
      </div>

      {/* the welcome, on its own */}
      <div className="relative container-x pb-[clamp(56px,8vw,110px)]">
        <p className="eyebrow text-cream/60">{homeBottomHeritage.welcome}</p>
      </div>
    </section>
  );
}
