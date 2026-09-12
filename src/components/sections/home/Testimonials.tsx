"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TESTIMONIAL_INTERVAL_MS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { testimonials, homeBottomTestimonials } from "@/data/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { Rule } from "@/components/ui/Rule";
import { ImageFrame } from "@/components/ui/ImageFrame";

/**
 * Testimonials — a face beside the words.
 *
 * The oversized quote glyph is gone (the eyebrow used to sit inside its bowl); a short
 * drawn hairline opens the quote instead. The crossfade, the pause on hover and focus,
 * the reduced-motion bail and the hairline-dash pagination are unchanged.
 */
export function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.items.length;

  /* auto-cycle every 6s; pauses on hover/focus and under reduced motion */
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), TESTIMONIAL_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  /* crossfade */
  useGSAP(
    () => {
      const items = ref.current?.querySelectorAll<HTMLElement>("[data-item]");
      if (!items) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      items.forEach((item, i) => {
        const active = i === index;
        if (reduced) {
          gsap.set(item, { opacity: active ? 1 : 0, y: 0 });
          return;
        }
        gsap.to(item, {
          opacity: active ? 1 : 0,
          y: active ? 0 : 12,
          duration: active ? 1.1 : 0.5,
          ease: "power3.out",
          overwrite: true,
          delay: active ? 0.25 : 0,
        });
      });
    },
    { scope: ref, dependencies: [index] },
  );

  return (
    <section
      ref={ref}
      className="bg-cream-soft section-y text-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x grid grid-cols-12 gap-x-6 gap-y-12">
        {/* left rail: the head, then the face */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <SectionHead
            eyebrow={testimonials.eyebrow}
            heading={homeBottomTestimonials.heading}
            headingClassName="max-w-[12ch]"
          />
          <ImageFrame
            src={homeBottomTestimonials.photo.src}
            alt={homeBottomTestimonials.photo.alt}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            focus="object-[52%_38%]"
            curtain="cream-soft"
            depth={3}
            delay={0.08}
            className="mt-10 aspect-[4/5] w-full"
          />
        </div>

        {/* the words */}
        <div className="col-span-12 md:col-span-6 lg:col-span-7 lg:col-start-6 lg:pt-14">
          <Rule tone="light" draw className="w-16" />

          <div className="relative mt-10 grid">
            {testimonials.items.map((t, i) => (
              <figure
                key={t.name}
                data-item
                aria-hidden={i !== index}
                className={cn("col-start-1 row-start-1", i !== index && "pointer-events-none")}
              >
                <blockquote className="max-w-[24ch] font-display text-[clamp(1.75rem,3.2vw,3rem)] leading-[1.12] tracking-[-0.01em]">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-8">
                  <span className="block text-[15px] text-ink">{t.name}</span>
                  <span className="mt-1 block caption text-ink-muted">{t.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          {/* hairline-dash pagination */}
          <div className="mt-12 flex items-center gap-3" role="group" aria-label={testimonials.eyebrow}>
            {testimonials.items.map((t, i) => (
              <button
                key={t.name}
                type="button"
                aria-label={`${testimonials.goTo} ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => setIndex(i)}
                className="group flex h-8 items-center"
              >
                <span
                  className={cn(
                    "block h-px transition-[width,background-color] duration-700 ease-[var(--ease-lux)]",
                    i === index ? "w-16 bg-wine" : "w-8 bg-cream-deep group-hover:bg-wine-soft",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
