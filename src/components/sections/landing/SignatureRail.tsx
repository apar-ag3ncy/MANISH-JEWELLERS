"use client";

import { Fragment, useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn, formatINR, pad2 } from "@/lib/utils";
import { signature, signatureRail } from "@/data/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { SplitText } from "@/components/ui/SplitText";
import { MetaRow } from "@/components/ui/MetaRow";
import { Rule } from "@/components/ui/Rule";

/* The rail pins from lg up, not md: at 768 a quarter-viewport panel leaves a 333px
   sliver of photograph beside a 274px column, which is neither a spread nor a card.
   Tablet portrait gets the same stacked full-width spreads as the phone. */
const RAIL_PIN = "(prefers-reduced-motion: no-preference) and (min-width: 1024px)";
const RAIL_STACK = "(prefers-reduced-motion: no-preference) and (max-width: 1023px)";

/**
 * signatureRail — four full-bleed spreads travelling sideways under a pin.
 *
 * The master tween is captured and handed to every panel as `containerAnimation`, so
 * the plate counter-parallaxes against its own travel and the type assembles as each
 * spread reaches 62% of the viewport. Vertical stack below lg and under reduced motion.
 */
export function SignatureRail() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(RAIL_PIN, () => {
        const wrap = el.querySelector<HTMLElement>("[data-pin]");
        const track = el.querySelector<HTMLElement>("[data-track]");
        const bar = el.querySelector<HTMLElement>("[data-progress]");
        const live = el.querySelector<HTMLElement>("[data-counter-live]");
        if (!wrap || !track) return;
        const panelEls = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
        const panels = panelEls.length;
        if (!panels) return;

        if (bar) gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

        const horiz = gsap.to(track, {
          xPercent: -(100 * (panels - 1)) / panels,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + track.offsetWidth * 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress });
              /* the track travels (panels - 1) widths, so the spread sitting in the
                 viewport is round(progress × (panels - 1)) — not floor(progress × panels),
                 which reads 04 while the third spread still fills two thirds of the screen */
              if (live) {
                const shown = gsap.utils.clamp(0, panels - 1, Math.round(self.progress * (panels - 1)));
                live.textContent = pad2(shown + 1);
              }
            },
          },
        });

        panelEls.forEach((panel) => {
          const plate = panel.querySelector<HTMLElement>("[data-plate]");
          const num = panel.querySelector<HTMLElement>("[data-num]");
          const words = gsap.utils.toArray<HTMLElement>("[data-split]", panel);
          const stages = gsap.utils.toArray<HTMLElement>("[data-stage]", panel);

          /* counter-parallax: the plate travels against the rail, which is what gives
             sideways movement any depth at all */
          if (plate) {
            gsap.fromTo(
              plate,
              { xPercent: 6, scale: 1.06 },
              {
                xPercent: -6,
                scale: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horiz,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }

          if (num) gsap.set(num, { yPercent: 45, opacity: 0 });
          if (words.length) gsap.set(words, { yPercent: 110 });
          if (stages.length) gsap.set(stages, { yPercent: 110 });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: panel, containerAnimation: horiz, start: "left 62%", once: true },
          });
          if (num) tl.to(num, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out" }, 0);
          if (words.length) tl.to(words, { yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.05 }, 0.08);
          if (stages.length) tl.to(stages, { yPercent: 0, duration: 1.0, ease: "expo.out", stagger: 0.07 }, 0.22);
        });
      });

      /* below lg there is no pin: each plate simply settles as it arrives */
      mm.add(RAIL_STACK, () => {
        gsap.utils.toArray<HTMLElement>("[data-plate]", el).forEach((plate) => {
          gsap.fromTo(
            plate,
            { scale: 1.08 },
            {
              scale: 1,
              duration: 1.2,
              ease: "expo.out",
              scrollTrigger: { trigger: plate, start: "top 85%", once: true },
            },
          );
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-white text-ink">
      <div className="container-x pt-[clamp(96px,12vw,200px)] pb-4 lg:pb-10">
        <SectionHead eyebrow={signatureRail.eyebrow} heading={signatureRail.heading} />
      </div>

      <div data-pin className="relative">
        <div data-track data-rail="track" className="flex flex-col lg:h-[100svh] lg:w-max lg:flex-row lg:items-stretch">
          {signature.map((piece, i) => {
            const even = i % 2 === 0;
            return (
              <Fragment key={piece.id}>
                {i > 0 ? (
                  <div className="container-x lg:hidden">
                    <Rule tone="light" />
                  </div>
                ) : null}
                <article data-panel className="relative w-full shrink-0 lg:flex lg:h-full lg:w-screen lg:items-center">
                  <div
                    aria-hidden="true"
                    className={cn("absolute inset-0 hidden lg:block", even ? "bg-white" : "bg-cream-soft")}
                  />
                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute top-0 bottom-[11svh] hidden w-[49vw] bg-wine-deep lg:block",
                      even ? "left-0" : "right-0",
                    )}
                  />

                  <div className="relative container-x py-16 lg:grid lg:w-full lg:grid-cols-12 lg:items-center lg:gap-6 lg:py-0">
                    <div className={cn("relative", even ? "lg:col-span-6" : "lg:col-span-6 lg:col-start-7")}>
                      <div className="relative z-10 aspect-[3/4] w-full overflow-hidden bg-wine-deep lg:aspect-auto lg:h-[78svh]">
                        <div data-plate className="absolute -inset-[8%] will-change-transform">
                          <Image
                            src={piece.image}
                            alt={`${piece.name}, ${piece.metal}`}
                            fill
                            sizes="(min-width: 1024px) 46vw, 100vw"
                            className="object-cover object-[50%_30%]"
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "relative z-10 mt-10 lg:mt-0",
                        /* at lg the column is only ~370px and the catalogue line wraps;
                           it takes the extra column back and returns the air at xl */
                        even
                          ? "lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8"
                          : "lg:col-span-6 lg:col-start-1 lg:row-start-1 xl:col-span-5",
                      )}
                    >
                      <span
                        data-num
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-[0.68em] -left-[0.06em] -z-10 display-xl text-cream-deep/70 tabular will-change-transform"
                      >
                        {pad2(i + 1)}
                      </span>
                      <h3 className="display-m">
                        <SplitText text={piece.name} />
                      </h3>
                      <span className="mask-line mt-5 max-w-[34ch] lg:max-w-none">
                        <span data-stage className="block body-l text-ink-muted will-change-transform">
                          {piece.blurb}
                        </span>
                      </span>
                      <span className="mask-line">
                        <span data-stage className="block will-change-transform">
                          <MetaRow
                            meta={`${piece.metal}${piece.stone ? ` · ${piece.stone}` : ""}`}
                            price={`${signatureRail.fromLabel} ${formatINR(piece.priceFrom)}`}
                            /* the material line may wrap on a narrow column; the price never does */
                            className="[&>span:last-child]:shrink-0 [&>span:last-child]:whitespace-nowrap"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              </Fragment>
            );
          })}
        </div>

        <div
          data-rail="progress-row"
          className="pointer-events-none absolute inset-x-0 bottom-10 container-x hidden lg:block"
        >
          <div className="h-px w-full bg-cream-deep">
            <div data-progress className="h-px w-full origin-left [transform:scaleX(0)] bg-wine" />
          </div>
          <div className="mt-3 flex justify-between caption text-ink-muted">
            <span>{signatureRail.scrollHint}</span>
            <span className="tabular">
              <span data-counter-live>{pad2(1)}</span> / {pad2(signature.length)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
