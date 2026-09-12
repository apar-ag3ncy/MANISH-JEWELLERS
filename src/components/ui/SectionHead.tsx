"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { SplitText } from "@/components/ui/SplitText";
import type { HeadTone } from "@/types";

/**
 * SectionHead — one heading gesture for every section on the site.
 *
 * A 24px rose-gold tick draws, the eyebrow lifts, the heading rises word by word out
 * of its mask, the lede follows. The tick is the only new mark in this pass and the
 * one place the lockup's metal recurs per section — one per section, never more.
 *
 * REDUCED MOTION: nothing is set and nothing animates. The eyebrow, every word and
 * the lede are in place and fully visible; only the tick stays collapsed, and it is
 * a decorative hairline carrying no information.
 *
 * TAILWIND v4 NOTE: the tick's resting state is `[transform:scaleX(0)]`, not
 * `scale-x-0` — v4's scale utilities write the standalone `scale` property, which
 * composes with (and would therefore defeat) GSAP's inline `transform`.
 */

type Props = {
  eyebrow: string;
  heading: string;
  lede?: string;
  /** Ground the head sits on. Default "light". */
  tone?: HeadTone;
  align?: "left" | "center";
  className?: string;
  /** Extra classes on the heading itself, e.g. "display-xl" or "max-w-[14ch]". */
  headingClassName?: string;
  as?: "h1" | "h2";
  id?: string;
  /** Trailing slot — a "View all" link, a counter, a button. */
  children?: ReactNode;
};

export function SectionHead({
  eyebrow,
  heading,
  lede,
  tone = "light",
  align = "left",
  className,
  headingClassName,
  as: H = "h2",
  id,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const tick = el.querySelector<HTMLElement>("[data-tick]");
      const eyebrowEl = el.querySelector<HTMLElement>("[data-eyebrow]");
      const ledeEl = el.querySelector<HTMLElement>("[data-lede]");
      const words = Array.from(el.querySelectorAll<HTMLElement>("[data-split]"));
      const lines = [eyebrowEl, ledeEl].filter((n): n is HTMLElement => Boolean(n));

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (words.length) gsap.set(words, { yPercent: 110 });
        if (lines.length) gsap.set(lines, { y: 14, opacity: 0 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 84%", once: true } });

        if (tick) {
          gsap.set(tick, { scaleX: 0, transformOrigin: align === "center" ? "center center" : "left center" });
          tl.to(tick, { scaleX: 1, duration: 0.7, ease: "power3.out" }, 0);
        }
        if (eyebrowEl) tl.to(eyebrowEl, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.08);
        if (words.length) {
          tl.to(words, { yPercent: 0, duration: 1.15, ease: "expo.out", stagger: 0.055 }, 0.16);
        }
        if (ledeEl) tl.to(ledeEl, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.42);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn(align === "center" && "text-center", className)}>
      <span
        data-tick
        aria-hidden="true"
        className={cn(
          "mb-6 block h-px w-6 origin-left [transform:scaleX(0)]",
          tone === "wine" ? "bg-rose/60" : "bg-rose-deep/70",
          align === "center" && "mx-auto origin-center",
        )}
      />
      <p data-eyebrow className={cn("eyebrow", tone === "wine" ? "text-cream/70" : "text-wine-soft")}>
        {eyebrow}
      </p>
      <H id={id} className={cn("mt-6 display-l", headingClassName)}>
        <SplitText text={heading} />
      </H>
      {lede ? (
        <p data-lede className={cn("mt-6 body-l", tone === "wine" ? "text-cream/75" : "text-ink-muted")}>
          {lede}
        </p>
      ) : null}
      {children}
    </div>
  );
}
