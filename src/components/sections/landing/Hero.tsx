"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { isRevealPending, onReveal } from "@/lib/reveal";
import { cn } from "@/lib/utils";
import { hero, landingHero, landingHeroBand } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BrandLockup, SHINE_TRAVEL } from "@/components/ui/brand/BrandLockup";
import { WineGround } from "@/components/ui/brand/WineGround";

/** Lifts the lockup above the preloader curtain while the intro plays. */
const RAISED = "z-[120]";

const STAT_ALIGN = ["sm:justify-start", "sm:justify-center", "sm:justify-end"];

function countUp(node: HTMLElement) {
  const target = Number(node.dataset.counter);
  const obj = { v: Math.max(0, target - 60) };
  gsap.to(obj, {
    v: target,
    duration: 1.4,
    ease: "power2.out",
    snap: { v: 1 },
    onUpdate: () => {
      node.textContent = String(obj.v);
    },
  });
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(el);
        const flip = q("[data-lockup-flip]")[0] as HTMLElement | undefined;
        if (!flip) return;

        const drawPaths = Array.from(el.querySelectorAll<SVGPathElement>("[data-mono-draw] path"));
        const monoDraw = q("[data-mono-draw]");
        const monoFill = q("[data-mono-fill]");
        const glyphs = q("[data-glyph]");
        const tags = q("[data-tag]");
        const shine = q("[data-shine]");
        const lines = q("[data-line]");
        const fades = q("[data-fade]");
        const counters = q("[data-counter]") as HTMLElement[];
        const strip = q("[data-strip]")[0] as HTMLElement | undefined;
        const seg = q("[data-cue-seg]");
        const dx = (target: Element) => Number((target as SVGElement).dataset.dx ?? 0);
        const loader = isRevealPending();

        /* start state — set from JS only, so a JS failure leaves the lockup whole */
        drawPaths.forEach((p) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(monoDraw, { opacity: 1 });
        gsap.set(monoFill, { opacity: 0 });
        gsap.set(glyphs, { opacity: 0, y: 28, x: (_: number, t: Element) => dx(t) * 0.2 });
        gsap.set(tags, { opacity: 0, x: (_: number, t: Element) => dx(t) * 0.26 });
        gsap.set(lines, { yPercent: 110 });
        gsap.set(fades, { y: 20, opacity: 0 });

        /* loader: perform the intro centred on screen, above the curtain */
        if (loader) {
          flip.classList.add(RAISED);
          const r = flip.getBoundingClientRect();
          gsap.set(flip, { y: window.innerHeight / 2 - (r.top + r.height / 2) });
        }

        /* the rest of the hero: masked tagline, buttons, stats, campaign band */
        const revealRest = () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          if (loader) {
            tl.to(
              flip,
              { y: 0, duration: 1.05, ease: "expo.inOut", onComplete: () => flip.classList.remove(RAISED) },
              0,
            );
          }
          const t0 = loader ? 0.5 : 0;
          tl.to(lines, { yPercent: 0, duration: 1.2, stagger: 0.09 }, t0)
            .to(fades, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, t0 + 0.12)
            .add(() => counters.forEach(countUp), t0 + 0.5);
          if (strip) tl.fromTo(strip, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: "expo.out" }, t0 + 0.35);
        };

        /* the lockup intro: trace → fill → track in → tagline → sheen */
        const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
        intro
          .to(drawPaths, { strokeDashoffset: 0, duration: 0.95, ease: "power2.inOut" }, 0)
          .to(monoFill, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.6)
          .to(monoDraw, { opacity: 0, duration: 0.6, ease: "power2.out" }, 1.0)
          .to(glyphs, { opacity: 1, y: 0, x: 0, duration: 1.2, stagger: { each: 0.035, from: "center" } }, 0.45)
          .to(tags, { opacity: 1, x: 0, duration: 1.1, stagger: { each: 0.015, from: "center" } }, 0.9)
          .fromTo(shine, { x: 0 }, { x: SHINE_TRAVEL, duration: 1.1, ease: "power2.inOut" }, 1.2);

        if (!loader) intro.call(revealRest, [], 0.85);

        /* ambient: a slow sheen every few seconds, and a gentle drift on scroll */
        gsap
          .timeline({ repeat: -1, repeatDelay: 5.5, delay: 3.2 })
          .fromTo(shine, { x: 0 }, { x: SHINE_TRAVEL, duration: 1.6, ease: "power2.inOut" });
        gsap.to(q("[data-lockup-drift]"), {
          yPercent: -12,
          scale: 0.94,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
        });
        if (strip) {
          gsap.to(strip, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
          });
        }
        if (seg.length)
          gsap.fromTo(seg, { y: 0 }, { y: 22, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

        const unsubscribe = loader ? onReveal(revealRest) : () => {};
        return () => {
          unsubscribe();
          flip.classList.remove(RAISED);
        };
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="on-wine relative overflow-hidden bg-wine text-cream">
      <WineGround />

      {/* the campaign, dissolving up out of the ground at the foot of the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[18svh] min-h-[132px] overflow-hidden sm:h-[24svh] sm:min-h-[150px]"
      >
        <div data-strip className="absolute inset-x-0 -inset-y-[10%] will-change-transform">
          <Image src={landingHeroBand.src} alt="" fill sizes="100vw" className="object-cover object-[50%_40%]" />
        </div>
        {/* strong at the foot, where the stats sit; open through the middle, where the
            photograph should read; solid wine at the top, so the band has no seam */}
        <span className="absolute inset-0 bg-linear-to-t from-wine/80 via-wine/45 to-wine" />
      </div>

      <div className="relative container-x flex min-h-[88svh] flex-col items-center pt-[clamp(104px,15vh,168px)] pb-7 md:pb-8">
        <h1 data-lockup-flip className="relative w-[min(84vw,720px,calc((88svh_-_360px)*2.2))] will-change-transform">
          <span data-lockup-drift className="block will-change-transform">
            <BrandLockup label={hero.lockupLabel} />
          </span>
        </h1>

        <div className="mt-[clamp(28px,5vh,64px)] mb-10 flex flex-col items-center text-center">
          <p className="display-m text-cream/90">
            <span className="mask-line">
              <span data-line className="block will-change-transform">
                {hero.tagline.text} <em className="italic">{hero.tagline.italic}</em>
              </span>
            </span>
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <span data-fade className="inline-block">
              <MagneticButton>
                <Button href={hero.primary.href} variant="solid">
                  {hero.primary.label}
                </Button>
              </MagneticButton>
            </span>
            <span data-fade className="inline-block">
              <MagneticButton>
                <Button href={hero.secondary.href} variant="outline-cream">
                  {hero.secondary.label}
                </Button>
              </MagneticButton>
            </span>
          </div>
        </div>

        <div data-fade className="my-auto hidden flex-col items-center gap-2.5 pb-6 sm:flex">
          <span className="eyebrow text-cream/55">{landingHero.scrollCue}</span>
          <span aria-hidden="true" className="relative block h-8 w-px overflow-hidden bg-cream/25">
            <span data-cue-seg className="absolute inset-x-0 top-0 block h-2.5 bg-cream/75 will-change-transform" />
          </span>
        </div>

        <div data-fade className="relative z-10 mt-auto w-full border-t border-cream/25 pt-5">
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-6">
            {hero.stats.map((s, i) => (
              <li
                key={s.label}
                className={cn(
                  "relative flex items-baseline justify-center gap-2",
                  STAT_ALIGN[i],
                  i > 0 &&
                    "sm:before:absolute sm:before:top-1/2 sm:before:left-[-12px] sm:before:h-3.5 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-cream/25 sm:before:content-['']",
                )}
              >
                <span className="eyebrow text-cream/70">{s.label}</span>
                {s.value !== null ? (
                  <span data-counter={s.value} className="caption text-cream/95 tabular">
                    {s.value}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
