"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { onReveal } from "@/lib/reveal";
import { homeHero } from "@/data/content";
import { SplitText } from "@/components/ui/SplitText";

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
              <div className="relative aspect-[4/5] overflow-hidden bg-wine-deep">
                <Image
                  src={homeHero.stack.rearSrc}
                  alt={homeHero.stack.rearAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 30vw, 62vw"
                  className="object-cover object-[50%_60%]"
                />
              </div>
            </div>
            <div data-front className="absolute right-0 bottom-0 w-[54%] will-change-transform">
              <div className="relative aspect-[4/5] overflow-hidden border-8 border-cream-soft bg-wine-deep">
                <Image
                  src={homeHero.stack.frontSrc}
                  alt={homeHero.stack.frontAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 26vw, 54vw"
                  className="object-cover object-[50%_28%]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
