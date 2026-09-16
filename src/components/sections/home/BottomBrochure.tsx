"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn, pad2 } from "@/lib/utils";
import { brochureBook } from "@/data/content";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * The brochure — the house's printed book, laid out as a horizontal reader.
 *
 * Deliberately NOT a fourth pinned sequence: /home already holds three, and a
 * printed book wants to be leafed at the reader's pace. This is a native
 * scroll-snap strip, so it works with a trackpad, a drag, the arrow buttons and
 * the keyboard, and it needs no JavaScript to be usable at all. `data-lenis-prevent`
 * keeps the smooth-scroll wrapper off the horizontal axis.
 *
 * Motion is one entrance stagger under MOTION_OK; the pages themselves never move.
 */
export function BottomBrochure() {
  const ref = useRef<HTMLElement>(null);
  const strip = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const count = brochureBook.pages.length;

  const go = useCallback((dir: -1 | 1) => {
    const el = strip.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("li");
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  /** Keep the counter honest whichever way the reader moves the strip. */
  const onScroll = useCallback(() => {
    const el = strip.current;
    if (!el) return;
    const first = el.querySelector<HTMLElement>("li");
    const step = first ? first.getBoundingClientRect().width + 24 : el.clientWidth;
    setIndex(Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / step))));
  }, [count]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        const pages = gsap.utils.toArray<HTMLElement>("[data-page]", el);
        if (!pages.length) return;
        gsap.set(pages, { y: 28, opacity: 0 });
        gsap.to(pages, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section id={brochureBook.id} ref={ref} className="scroll-mt-20 bg-cream-soft section-y text-ink">
      <div className="container-x">
        <div className="flex items-end justify-between gap-6">
          <SectionHead eyebrow={brochureBook.eyebrow} heading={brochureBook.heading} headingClassName="max-w-[16ch]" />
          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <span className="caption text-ink-muted tabular">
              {pad2(index + 1)} / {pad2(count)}
            </span>
            <button
              type="button"
              aria-label={brochureBook.prev}
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-deep text-wine transition-colors duration-500 hover:bg-wine hover:text-cream"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={brochureBook.next}
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream-deep text-wine transition-colors duration-500 hover:bg-wine hover:text-cream"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={strip}
        onScroll={onScroll}
        tabIndex={0}
        aria-label={brochureBook.scroller}
        data-lenis-prevent
        className="mj-book mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain px-[clamp(20px,5vw,80px)] pb-4 md:mt-16"
      >
        {brochureBook.pages.map((page, i) => (
          <li key={page.src} data-page className={cn("shrink-0 snap-center", "w-[min(88vw,1000px)]")}>
            <div className="relative aspect-[1322/585] w-full overflow-hidden border border-cream-deep bg-white">
              <Image
                src={page.src}
                alt={page.alt}
                fill
                sizes="(min-width: 1024px) 1000px, 88vw"
                className="object-contain"
              />
            </div>
            <p className="mt-3 caption text-ink-muted tabular">{pad2(i + 1)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
