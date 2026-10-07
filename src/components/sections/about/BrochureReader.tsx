"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollTrigger } from "@/lib/gsap";
import { pad2 } from "@/lib/utils";
import { brochureBook } from "@/data/content";

/** The original house brochure, kept in-page with native keyboard-accessible scrolling. */
export function BrochureReader() {
  const strip = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const count = brochureBook.pages.length;
  const step = () => {
    const el = strip.current;
    return el?.querySelector("li")?.getBoundingClientRect().width ?? 0;
  };
  const go = useCallback((direction: number) => {
    strip.current?.scrollBy({
      left: direction * (step() + 24),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, []);
  return (
    <div className="container-x mt-16">
      <details
        id="brochure"
        className="group scroll-mt-28 border-y border-wine/20"
        onToggle={() => ScrollTrigger.refresh()}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 font-display text-2xl sm:text-3xl">
          Explore the house brochure
          <ChevronDown size={22} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mb-5 flex items-center justify-between gap-5">
          <span className="eyebrow text-wine-soft">
            {pad2(index + 1)} / {pad2(count)}
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              aria-label={brochureBook.prev}
              disabled={index === 0}
              onClick={() => go(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-wine/30 text-wine disabled:opacity-30"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={brochureBook.next}
              disabled={index === count - 1}
              onClick={() => go(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-wine/30 text-wine disabled:opacity-30"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
        <ul
          ref={strip}
          tabIndex={0}
          aria-label={brochureBook.scroller}
          data-lenis-prevent
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain pb-6"
          onScroll={() => {
            if (strip.current)
              setIndex(Math.min(count - 1, Math.max(0, Math.round(strip.current.scrollLeft / (step() + 24)))));
          }}
        >
          {brochureBook.pages.map((page) => (
            <li key={page.src} className="w-full shrink-0 snap-start">
              <div className="relative aspect-[1322/585] overflow-hidden bg-white">
                <Image src={page.src} alt={page.alt} fill sizes="90vw" className="object-contain" />
              </div>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
