"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { TESTIMONIAL_INTERVAL_MS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { testimonials } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

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
      className="bg-white section-y text-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-x grid grid-cols-12 gap-6">
        <div className="relative col-span-12 md:col-span-10 md:col-start-2">
          <Reveal>
            <p className="eyebrow text-wine-soft">{testimonials.eyebrow}</p>
          </Reveal>

          <div className="relative mt-10">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[0.55em] -left-[0.08em] font-display text-[clamp(8rem,20vw,16rem)] leading-none text-cream select-none"
            >
              “
            </span>

            <div className="relative grid">
              {testimonials.items.map((t, i) => (
                <figure
                  key={t.name}
                  data-item
                  aria-hidden={i !== index}
                  className={cn("col-start-1 row-start-1", i !== index && "pointer-events-none")}
                >
                  <blockquote className="max-w-[24ch] font-display text-[clamp(1.75rem,3.6vw,3.25rem)] leading-[1.12] tracking-[-0.01em]">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-8 caption text-ink-muted">
                    {t.name} · {t.city}
                  </figcaption>
                </figure>
              ))}
            </div>
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
