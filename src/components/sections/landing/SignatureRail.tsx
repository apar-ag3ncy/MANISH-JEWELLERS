"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION_OK_DESKTOP } from "@/lib/gsap";
import { formatINR, pad2 } from "@/lib/utils";
import { signature, signatureRail } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

/** signatureRail — pinned horizontal scroll through 4 pieces. Vertical stack below md / reduced motion. */
export function SignatureRail() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK_DESKTOP, () => {
        const wrap = el.querySelector<HTMLElement>("[data-pin]");
        const track = el.querySelector<HTMLElement>("[data-track]");
        const progress = el.querySelector("[data-progress]");
        if (!wrap || !track) return;
        const panels = track.children.length;

        gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(track, {
          xPercent: -(100 * (panels - 1)) / panels,
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => "+=" + track.offsetWidth,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress, { scaleX: self.progress }),
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-white text-ink">
      <div className="container-x pt-[clamp(96px,12vw,200px)] md:pb-4">
        <Reveal>
          <p className="eyebrow text-wine-soft">{signatureRail.eyebrow}</p>
          <h2 className="mt-6 display-l">{signatureRail.heading}</h2>
        </Reveal>
      </div>

      <div data-pin className="relative">
        <div data-track className="flex flex-col md:h-[100svh] md:flex-row md:items-center">
          {signature.map((piece, i) => (
            <article
              key={piece.id}
              className="container-x w-full shrink-0 py-16 md:grid md:h-full md:grid-cols-12 md:items-center md:gap-6 md:py-0"
            >
              <div className="md:col-span-6">
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden bg-wine-deep md:max-h-[70svh]">
                  <Image
                    src={piece.image}
                    alt={`${piece.name}, ${piece.metal}`}
                    fill
                    sizes="(min-width: 768px) 42vw, 100vw"
                    className="object-cover object-[50%_30%]"
                  />
                </div>
              </div>
              <div className="mt-10 md:col-span-5 md:col-start-8 md:mt-0">
                <span className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] text-wine-soft tabular">
                  {pad2(i + 1)}
                </span>
                <h3 className="mt-4 display-m">{piece.name}</h3>
                <p className="mt-5 max-w-[34ch] body-l text-ink-muted">{piece.blurb}</p>
                <p className="mt-6 caption text-ink-muted">
                  {piece.metal}
                  {piece.stone ? ` · ${piece.stone}` : ""}
                </p>
                <p className="mt-3 text-[15px] tabular">
                  {signatureRail.fromLabel} {formatINR(piece.priceFrom)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-10 container-x hidden md:block">
          <div className="h-px w-full bg-cream-deep">
            <div data-progress className="h-px w-full bg-wine" />
          </div>
          <div className="mt-3 flex justify-between caption text-ink-muted">
            <span>{signatureRail.scrollHint}</span>
            <span className="tabular">
              {pad2(1)} — {pad2(signature.length)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
