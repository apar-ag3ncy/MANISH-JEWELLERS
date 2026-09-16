"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { onReveal } from "@/lib/reveal";
import { homeHero, homeTopStack } from "@/data/content";
import { SplitText } from "@/components/ui/SplitText";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { ImageFrame } from "@/components/ui/ImageFrame";

/**
 * HomeHero — the offset two-photo stack, now cut by the brand arch and stood on a
 * arch-clipped portrait so the page shows its colour in the first screen.
 *
 * Both photographs are ImageFrames with depth={0} and reveal="none": this section
 * already owns their entrance (the loader hand-off) and their parallax (the -5 / -12
 * wrapper scrubs), and two parallaxes on one plate would fight.
 */

export function HomeHero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = el.querySelectorAll("[data-split]");
        const fades = el.querySelectorAll("[data-fade]");
        const rear = el.querySelector("[data-rear]");
        const front = el.querySelector("[data-front]");

        gsap.set(words, { yPercent: 110 });
        gsap.set(fades, { y: 20, opacity: 0 });
        gsap.set([rear, front], { opacity: 0, y: 40 });

        gsap.to(rear, {
          yPercent: -5,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(front, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });

        return onReveal(() => {
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .to(words, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.1)
            .to(fades, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 }, 0.4)
            .to([rear, front], { opacity: 1, y: 0, duration: 1.4, stagger: 0.15 }, 0.3);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="relative overflow-hidden bg-cream-soft text-ink">
      <div className="container-x grid grid-cols-12 items-center gap-6 pt-[140px] pb-[clamp(64px,8vw,120px)] md:pt-[168px]">
        <div className="col-span-12 lg:col-span-5">
          <span data-fade aria-hidden="true" className="mb-6 block h-px w-6 bg-rose-deep/70" />
          <p data-fade className="eyebrow text-wine-soft">
            {homeHero.eyebrow}
          </p>
          <h1 className="mt-6 display-xl">
            <SplitText text={homeHero.heading} />
          </h1>
          <p data-fade className="mt-8 max-w-[38ch] body-l text-ink-muted">
            {homeHero.lede}
          </p>
          <div data-fade className="mt-10">
            <Link
              href={homeHero.link.href}
              className="link-underline inline-flex items-center gap-2 ui-label text-wine"
            >
              {homeHero.link.label}
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="col-span-12 mt-16 lg:col-span-6 lg:col-start-7 lg:mt-0">
          <div className="relative aspect-[10/9] w-full">
            <div data-rear className="absolute top-0 left-0 w-[62%] will-change-transform">
              <ImageFrame
                src={homeHero.stack.rearSrc}
                alt={homeHero.stack.rearAlt}
                sizes="(min-width: 1024px) 30vw, 62vw"
                focus={homeTopStack.rearFocus}
                curtain="cream-soft"
                depth={0}
                reveal="none"
                priority
                className="aspect-[4/5] w-full"
              />
            </div>

            <div data-front className="absolute right-0 bottom-0 w-[54%] will-change-transform">
              <ArchFrame ratio={0.8} className="w-full">
                <ImageFrame
                  src={homeHero.stack.frontSrc}
                  alt={homeHero.stack.frontAlt}
                  sizes="(min-width: 1024px) 26vw, 54vw"
                  focus={homeTopStack.frontFocus}
                  curtain="cream-soft"
                  depth={0}
                  reveal="none"
                  priority
                  className="aspect-[4/5] h-full w-full"
                />
              </ArchFrame>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
