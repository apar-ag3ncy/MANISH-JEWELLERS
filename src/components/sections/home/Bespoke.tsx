"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { bespoke, homeBottomBespoke } from "@/data/content";
import { pad2 } from "@/lib/utils";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Monogram } from "@/components/ui/Monogram";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { ImageFrame } from "@/components/ui/ImageFrame";

/**
 * Bespoke — the wine chapter.
 *
 * The list assembles rather than fading: each numeral and title rises together out of
 * its own mask on that step's own trigger. The arch — use three of three site-wide —
 * holds the photograph that the copy is about, and travels with the reader.
 *
 * The section must NOT carry overflow-hidden: an overflow ancestor would defeat the
 * sticky arch. The drifting watermark is clipped by its own layer instead.
 */
export function Bespoke() {
  const ref = useRef<HTMLElement>(null);

  /* Each step assembles on its own trigger: numeral and title rise together. */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const steps = Array.from(el.querySelectorAll<HTMLElement>("[data-step]"));
      if (!steps.length) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        steps.forEach((step) => {
          const rises = step.querySelectorAll<HTMLElement>("[data-rise]");
          const body = step.querySelector<HTMLElement>("[data-body]");
          gsap.set(rises, { yPercent: 110 });
          if (body) gsap.set(body, { y: 12, opacity: 0 });

          const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 85%", once: true } });
          tl.to(rises, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0);
          if (body) tl.to(body, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, 0.18);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id={bespoke.id} className="on-wine relative scroll-mt-20 bg-wine section-y text-cream">
      {/* watermark: the mark itself, at a legible size, drifting behind the steps */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <ParallaxLayer y={8} rotate={4} className="absolute top-[54%] left-[6%] -translate-y-1/2 lg:left-[38%]">
          <Monogram className="h-[clamp(190px,26vw,380px)] w-auto text-cream/[0.05]" />
        </ParallaxLayer>
      </div>

      <div className="relative container-x grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <SectionHead
            tone="wine"
            eyebrow={bespoke.eyebrow}
            heading={bespoke.heading}
            lede={homeBottomBespoke.lede}
            headingClassName="max-w-[16ch]"
          />

          <ol className="mt-14">
            {bespoke.steps.map((step, i) => (
              <li key={step.title} data-step>
                <Rule tone="wine" draw />
                <div className="grid grid-cols-[3.5rem_1fr] gap-6 py-8">
                  <span className="mask-line">
                    <span
                      data-rise
                      className="block font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none text-cream/55 tabular will-change-transform"
                    >
                      {pad2(i + 1)}
                    </span>
                  </span>
                  <div>
                    <h3 className="mask-line display-m">
                      <span data-rise className="block will-change-transform">
                        {step.title}
                      </span>
                    </h3>
                    <p data-body className="mt-3 body-copy text-cream/75">
                      {homeBottomBespoke.steps[i]}
                    </p>
                  </div>
                </div>
              </li>
            ))}
            <Rule tone="wine" draw />
          </ol>
        </div>

        <div className="col-span-12 flex flex-col lg:col-span-4 lg:col-start-9">
          {/* the arch travels beside the steps; its own box ends where the CTA begins,
              so the two can never overlap */}
          <div className="lg:flex-1">
            <div className="lg:sticky lg:top-28">
              <ArchFrame ratio={0.75} className="aspect-[3/4] w-full">
                <ImageFrame
                  src={homeBottomBespoke.photo.src}
                  alt={homeBottomBespoke.photo.alt}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  focus="object-[52%_26%]"
                  curtain="wine"
                  depth={4}
                  className="h-full w-full"
                />
              </ArchFrame>

              <Rule tone="cream" className="mt-10" />
            </div>
          </div>

          <Reveal delay={0.05} className="mt-10 lg:pt-16">
            <MagneticButton>
              <Button href={bespoke.cta.href} variant="outline-cream">
                {bespoke.cta.label}
              </Button>
            </MagneticButton>
            <p className="mt-6 caption text-cream/60">{bespoke.aside}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
