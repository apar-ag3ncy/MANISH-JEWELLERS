"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, pad2 } from "@/lib/utils";
import { campaign } from "@/data/content";
import type { Slide } from "@/types";
import { Monogram } from "@/components/ui/Monogram";
import { BrandWordmark } from "@/components/ui/brand/BrandLockup";

const SLIDE_SECONDS = 5.5;

type Props = { slides?: readonly Slide[]; id?: string };

/** Full-bleed landscape campaign slides: crossfade + slow zoom, one line each, the real logo. */
export function CampaignSlides({ slides = campaign.slides, id = campaign.id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef<gsap.core.Tween | null>(null);
  const startX = useRef<number | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const hold = useRef(true);
  const count = slides.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* autoplay only while the slides are actually on screen */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      progress.current?.kill();

      gsap.utils.toArray<HTMLElement>("[data-slide]", el).forEach((layer, i) => {
        const active = i === index;
        const img = layer.querySelector("[data-zoom]");
        if (reduced) {
          gsap.set(layer, { opacity: active ? 1 : 0 });
          return;
        }
        gsap.to(layer, { opacity: active ? 1 : 0, duration: 1.2, ease: "power2.out", overwrite: true });
        if (active) {
          gsap.fromTo(img, { scale: 1.12 }, { scale: 1, duration: SLIDE_SECONDS + 1.6, ease: "none", overwrite: true });
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-caption]", el).forEach((c, i) => {
        const active = i === index;
        if (reduced) {
          gsap.set(c, { opacity: active ? 1 : 0, yPercent: 0 });
          return;
        }
        if (active) {
          gsap.fromTo(
            c,
            { opacity: 1, yPercent: 110 },
            { yPercent: 0, duration: 1.1, ease: "expo.out", delay: 0.2, overwrite: true },
          );
        } else {
          gsap.to(c, { opacity: 0, yPercent: -60, duration: 0.5, ease: "power3.in", overwrite: true });
        }
      });

      const bars = el.querySelectorAll("[data-bar]");
      gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
      const bar = el.querySelector(`[data-bar="${index}"]`);
      if (reduced) {
        gsap.set(bar, { scaleX: 1 });
        return;
      }
      progress.current = gsap.to(bar, {
        scaleX: 1,
        duration: SLIDE_SECONDS,
        ease: "none",
        onComplete: () => setIndex((i) => (i + 1) % count),
      });
      if (hold.current) progress.current.pause();
    },
    { scope: ref, dependencies: [index, reduced, count] },
  );

  useEffect(() => {
    hold.current = paused || !inView;
    const t = progress.current;
    if (!t) return;
    if (hold.current) t.pause();
    else t.resume();
  }, [paused, inView, index]);

  return (
    <section
      ref={ref}
      id={id}
      aria-roledescription="carousel"
      aria-label={campaign.label}
      className="on-wine relative h-[80svh] min-h-[520px] w-full scroll-mt-0 overflow-hidden bg-wine-deep text-cream select-none sm:h-[88svh]"
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={(e) => {
        startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          data-slide
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} / ${count}`}
          aria-hidden={i !== index}
          className={cn("absolute inset-0", i === 0 ? "opacity-100" : "opacity-0")}
        >
          <div data-zoom className="absolute inset-0 will-change-transform">
            <Image src={s.src} alt={s.alt} fill sizes="100vw" className={cn("object-cover", s.focus)} />
          </div>
        </div>
      ))}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-wine-deep/90 via-wine-deep/10 to-wine-deep/35"
      />

      <div className="absolute inset-x-0 bottom-0 container-x pb-[clamp(20px,4.5vh,44px)]">
        <div className="flex items-end justify-between gap-6">
          <div className="min-w-0 flex-1">
            <p className="eyebrow text-cream/70 tabular">
              {pad2(index + 1)} / {pad2(count)}
            </p>
            <div
              aria-live={paused ? "polite" : "off"}
              className="relative mt-3 h-[1.3em] overflow-hidden font-display text-[clamp(1.6rem,3.6vw,3.25rem)] leading-[1.2] tracking-[-0.01em]"
            >
              {slides.map((s, i) => (
                <p
                  key={s.src}
                  data-caption
                  className={cn("absolute inset-x-0 top-0 truncate", i === 0 ? "opacity-100" : "opacity-0")}
                >
                  {s.caption}
                </p>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              aria-label={campaign.prev}
              onClick={() => go(index - 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 transition-colors duration-500 hover:bg-cream hover:text-wine"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={campaign.next}
              onClick={() => go(index + 1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 transition-colors duration-500 hover:bg-cream hover:text-wine"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-6 border-t border-cream/20 pt-4">
          <div className="flex flex-1 items-center gap-2" role="group" aria-label={campaign.label}>
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-label={`${campaign.goTo} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => go(i)}
                className="flex h-6 max-w-[72px] flex-1 items-center"
              >
                <span className="relative block h-px w-full overflow-hidden bg-cream/25">
                  <span data-bar={i} className="absolute inset-0 origin-left scale-x-0 bg-cream" />
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2.5 text-cream/90" aria-hidden="true">
            <Monogram className="h-6 w-auto" />
            <BrandWordmark className="hidden h-[11px] w-auto sm:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
