"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, useGSAP, HOVER_OK } from "@/lib/gsap";
import { cn, pad2 } from "@/lib/utils";
import { campaign } from "@/data/content";
import type { Slide } from "@/types";
import { SplitText } from "@/components/ui/SplitText";
import { Monogram } from "@/components/ui/Monogram";
import { BrandWordmark } from "@/components/ui/brand/BrandLockup";

const SLIDE_SECONDS = 5.5;

type Props = { slides?: readonly Slide[]; id?: string };

/**
 * Full-bleed campaign slides cut like film: two frames always in motion (the outgoing
 * plate pushes in as it fades, the incoming one drifts out of a slow zoom), the caption
 * assembles word by word, and the dash row keeps a memory of the frames already seen.
 */
export function CampaignSlides({ slides = campaign.slides, id = campaign.id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const progress = useRef<gsap.core.Tween | null>(null);
  const startX = useRef<number | null>(null);
  const prevIndex = useRef(0);
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

  /* choreographed arrows — one small timeline each, attached once */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(HOVER_OK, () => {
        const off: Array<() => void> = [];
        el.querySelectorAll<HTMLElement>("[data-arrow]").forEach((btn) => {
          const chev = btn.querySelector("[data-chev]");
          const dir = btn.dataset.arrow === "prev" ? -3 : 3;
          const enter = () => {
            gsap.to(chev, { x: dir, duration: 0.45, ease: "power3.out", overwrite: true });
            gsap.to(btn, { scale: 1.06, duration: 0.45, ease: "power3.out", overwrite: true });
          };
          const leave = () => {
            gsap.to(chev, { x: 0, duration: 0.45, ease: "power3.out", overwrite: true });
            gsap.to(btn, { scale: 1, duration: 0.45, ease: "power3.out", overwrite: true });
          };
          btn.addEventListener("mouseenter", enter);
          btn.addEventListener("mouseleave", leave);
          off.push(() => {
            btn.removeEventListener("mouseenter", enter);
            btn.removeEventListener("mouseleave", leave);
          });
        });
        return () => off.forEach((fn) => fn());
      });
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      progress.current?.kill();
      const previous = prevIndex.current;
      prevIndex.current = index;

      gsap.utils.toArray<HTMLElement>("[data-slide]", el).forEach((layer, i) => {
        const active = i === index;
        const img = layer.querySelector("[data-zoom]");
        if (reduced) {
          gsap.set(layer, { opacity: active ? 1 : 0 });
          gsap.set(img, { scale: 1, yPercent: 0 });
          return;
        }
        gsap.to(layer, { opacity: active ? 1 : 0, duration: 1.2, ease: "power2.out", overwrite: true });
        if (active) {
          /* the incoming frame drifts out of a slow zoom, with a direction */
          gsap.fromTo(
            img,
            { scale: 1.12, yPercent: 1.5 },
            { scale: 1, yPercent: 0, duration: SLIDE_SECONDS + 1.6, ease: "none", overwrite: true },
          );
        } else if (i === previous) {
          /* the outgoing frame keeps moving — that is what reads as a cut, not a fade */
          gsap.to(img, { scale: 1.04, duration: 1.2, ease: "power2.out", overwrite: true });
        }
      });

      gsap.utils.toArray<HTMLElement>("[data-caption]", el).forEach((c, i) => {
        const active = i === index;
        const words = c.querySelectorAll("[data-split]");
        if (reduced) {
          gsap.set(c, { opacity: active ? 1 : 0, yPercent: 0 });
          gsap.set(words, { yPercent: 0 });
          return;
        }
        if (active) {
          gsap.set(c, { opacity: 1, yPercent: 0 });
          gsap.fromTo(
            words,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.045, delay: 0.22, overwrite: true },
          );
        } else {
          gsap.to(c, { opacity: 0, yPercent: -60, duration: 0.45, ease: "power3.in", overwrite: true });
        }
      });

      /* the dash row remembers: seen frames hold, the live one fills, a wrap clears it */
      const bars = gsap.utils.toArray<HTMLElement>("[data-bar]", el);
      const wrapped = index === 0 && previous > 0;
      gsap.set(bars, { transformOrigin: "left center" });

      if (reduced) {
        bars.forEach((b, i) => gsap.set(b, { scaleX: i <= index ? 1 : 0, opacity: i < index ? 0.45 : 1 }));
        return;
      }

      if (wrapped) {
        gsap.to(bars.slice(1), { scaleX: 0, opacity: 1, duration: 0.5, stagger: 0.04, ease: "power2.out" });
        gsap.set(bars[0], { scaleX: 0, opacity: 1 });
      } else {
        bars.forEach((b, i) => {
          if (i < index) gsap.set(b, { scaleX: 1, opacity: 0.45 });
          else if (i > index) gsap.set(b, { scaleX: 0, opacity: 1 });
          else gsap.set(b, { scaleX: 0, opacity: 1 });
        });
      }

      progress.current = gsap.to(bars[index], {
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
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="100vw"
              priority={i === 0}
              className={cn("object-cover", s.focus)}
            />
          </div>
        </div>
      ))}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-wine-deep/90 via-wine-deep/10 to-wine-deep/20"
      />

      <div className="absolute inset-x-0 bottom-0 container-x pb-[clamp(20px,4.5vh,44px)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 sm:flex-1">
            <p className="eyebrow text-cream/70 tabular">
              {pad2(index + 1)} / {pad2(count)}
            </p>
            <div
              aria-live={paused ? "polite" : "off"}
              className="relative mt-3 h-[1.35em] overflow-hidden font-display text-[clamp(1.35rem,3.6vw,3.25rem)] leading-[1.2] tracking-[-0.01em]"
            >
              {slides.map((s, i) => (
                <p
                  key={s.src}
                  data-caption
                  className={cn(
                    "absolute inset-x-0 top-0 will-change-transform",
                    i === 0 ? "opacity-100" : "opacity-0",
                  )}
                >
                  <SplitText text={s.caption} />
                </p>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-5 sm:justify-end">
            <div className="flex items-center gap-3">
              <button
                type="button"
                data-arrow="prev"
                aria-label={campaign.prev}
                onClick={() => go(index - 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 transition-colors duration-500 will-change-transform hover:bg-cream hover:text-wine"
              >
                <ChevronLeft data-chev className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                data-arrow="next"
                aria-label={campaign.next}
                onClick={() => go(index + 1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 transition-colors duration-500 will-change-transform hover:bg-cream hover:text-wine"
              >
                <ChevronRight data-chev className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
            <span className="flex items-center gap-2.5 text-cream/90" aria-hidden="true">
              <Monogram className="h-6 w-auto" />
              <BrandWordmark className="h-[11px] w-auto" />
            </span>
          </div>
        </div>

        <div
          className="mt-6 flex items-center gap-2 border-t border-cream/20 pt-4"
          role="group"
          aria-label={campaign.label}
        >
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`${campaign.goTo} ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i)}
              className="flex h-6 flex-1 items-center"
            >
              <span className="relative block h-px w-full overflow-hidden bg-cream/35">
                <span data-bar className="absolute inset-0 origin-left [transform:scaleX(0)] bg-cream" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
