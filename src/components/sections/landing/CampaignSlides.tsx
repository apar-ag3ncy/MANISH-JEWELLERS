"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn, pad2 } from "@/lib/utils";
import { campaign } from "@/data/content";
import type { Slide } from "@/types";

const SLIDE_MS = 5500;
type Props = { slides?: readonly Slide[]; id?: string };

export function CampaignSlides({ slides = campaign.slides, id = campaign.id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const count = slides.length;
  const active = count ? index % count : 0;
  const held = paused || hovered || focused || reduced || !inView || !visible;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(query.matches);
    const visibility = () => setVisible(!document.hidden);
    motion();
    visibility();
    query.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    if (ref.current) observer.observe(ref.current);
    return () => {
      query.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (held || count < 2) return;
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [active, held, count]);

  function go(next: number) {
    if (!count) return;
    setPaused(true);
    setIndex(((next % count) + count) % count);
  }

  if (!count) return null;

  return (
    <section
      ref={ref}
      id={id}
      role="region"
      aria-roledescription="carousel"
      aria-label={campaign.label}
      className="on-wine relative h-[78svh] max-h-[900px] min-h-[560px] w-full scroll-mt-24 overflow-hidden bg-wine-deep text-cream"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          go(active + (e.key === "ArrowRight" ? 1 : -1));
        }
      }}
      onPointerDown={(e) => {
        if (e.pointerType === "touch") start.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerCancel={() => {
        start.current = null;
      }}
      onPointerUp={(e) => {
        if (!start.current) return;
        const dx = e.clientX - start.current.x;
        const dy = e.clientY - start.current.y;
        start.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(active + (dx < 0 ? 1 : -1));
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${count}`}
          aria-hidden={i !== active}
          className={cn(
            "campaign-photo absolute inset-0",
            i === active ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image src={slide.src} alt={slide.alt} fill sizes="100vw" className={cn("object-cover", slide.focus)} />
        </div>
      ))}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-wine-deep via-wine-deep/10 to-wine-deep/30"
      />
      <div className="absolute inset-x-0 top-10 container-x">
        <p className="eyebrow">{campaign.label}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 container-x pb-7 sm:pb-10">
        <div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
          <div className="max-w-[760px]">
            <p className="eyebrow text-cream/75 tabular">
              {pad2(active + 1)} / {pad2(count)}
            </p>
            <h2 aria-live={held ? "polite" : "off"} aria-atomic="true" className="campaign-caption mt-4">
              {slides[active].caption}
            </h2>
          </div>
          <div role="group" aria-label="Campaign controls" className="flex shrink-0 items-center gap-3">
            {!reduced && count > 1 ? (
              <button
                type="button"
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
                className="glass-control flex h-12 w-12 items-center justify-center rounded-full border border-cream/60 transition-colors hover:bg-cream hover:text-wine"
              >
                {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              </button>
            ) : null}
            <button
              type="button"
              aria-label={campaign.prev}
              onClick={() => go(active - 1)}
              className="glass-control flex h-12 w-12 items-center justify-center rounded-full border border-cream/60 transition-colors hover:bg-cream hover:text-wine"
            >
              <ChevronLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={campaign.next}
              onClick={() => go(active + 1)}
              className="glass-control flex h-12 w-12 items-center justify-center rounded-full border border-cream/60 transition-colors hover:bg-cream hover:text-wine"
            >
              <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mt-5 flex gap-3" role="group" aria-label="Choose a campaign photograph">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`${campaign.goTo} ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => go(i)}
              className="flex h-11 flex-1 items-center"
            >
              <span className={cn("block h-px w-full", i === active ? "bg-cream" : "bg-cream/35")} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
