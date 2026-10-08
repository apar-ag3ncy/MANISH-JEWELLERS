"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { isRevealPending, onReveal } from "@/lib/reveal";
import { hero } from "@/data/content";
import { HeroSlideshow } from "./HeroSlideshow";
import { landingHero } from "@/data/enhance-landing";
import { Button } from "@/components/ui/Button";
import { BrandLockup, SHINE_TRAVEL } from "@/components/ui/brand/BrandLockup";
import { WineGround } from "@/components/ui/brand/WineGround";
import { IntroJewelleryLight } from "./IntroJewelleryLight";

const RAISED = "z-[120]";

export function Hero() {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(el);
        const flip = el.querySelector("[data-lockup-flip]");
        const copy = el.querySelector(".landing-hero-copy");
        // Deep links and repeat visits open directly on the photograph. The static
        // markup is also the complete fallback for reduced motion and no JavaScript.
        if (!flip || !copy || !isRevealPending()) return;
        const paths = Array.from(el.querySelectorAll("[data-mono-draw] path"));
        const glyphs = q("[data-glyph]");
        const tags = q("[data-tag]");
        const shine = q("[data-shine]");
        const glints = q("[data-intro-glint]");
        const illumination = q(".intro-illumination");
        const photo = q(".landing-hero-photo");
        const dx = (target) => Number(target.dataset.dx ?? 0);

        el.dataset.openingStage = "brand";
        // The central content belongs only to the opening, never the settled
        // photograph. Keep the static fallback hidden and out of the tab order.
        copy.inert = false;
        gsap.set(copy, { autoAlpha: 1 });
        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });
        gsap.set(q("[data-mono-draw]"), { opacity: 1 });
        gsap.set(q("[data-mono-fill]"), { opacity: 0 });
        gsap.set(glints, { opacity: 0, scale: 0.3, svgOrigin: "0 0" });
        gsap.set(glyphs, { opacity: 0, y: 28, x: (_, target) => dx(target) * 0.2 });
        gsap.set(tags, { opacity: 0, x: (_, target) => dx(target) * 0.26 });
        gsap.set(q("[data-hero-reveal]"), { opacity: 0, y: 18 });
        gsap.set(photo, { opacity: 0 });
        gsap.set(q(".landing-hero-photo img"), { scale: 1.04 });
        flip.classList.add(RAISED);
        const r = flip.getBoundingClientRect();
        gsap.set(flip, {
          x: window.innerWidth / 2 - (r.left + r.width / 2),
          y: window.innerHeight / 2 - (r.top + r.height / 2),
        });

        // Trace the maker's mark, assemble its name, then catch light on the finished metal.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .addLabel("engrave", 0)
          .addLabel("polish", 1.2)
          .to(illumination, { opacity: 1, duration: 1.4, ease: "sine.inOut" }, "engrave")
          .to(paths, { strokeDashoffset: 0, duration: 0.95, ease: "power2.inOut" }, 0)
          .to(q("[data-mono-fill]"), { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.6)
          .to(q("[data-mono-draw]"), { opacity: 0, duration: 0.6, ease: "power2.out" }, 1)
          .to(glyphs, { opacity: 1, y: 0, x: 0, duration: 1.05, stagger: { each: 0.028, from: "center" } }, 0.45)
          .to(tags, { opacity: 1, x: 0, duration: 1.1, stagger: { each: 0.015, from: "center" } }, 0.9)
          .fromTo(shine, { x: 0 }, { x: SHINE_TRAVEL, duration: 1.1, ease: "sine.inOut" }, "polish")
          .to(glints, { opacity: 0.9, scale: 1, duration: 0.18, stagger: 0.22 }, "polish+=0.18")
          .to(glints, { opacity: 0, scale: 0.6, duration: 0.45, stagger: 0.22, ease: "sine.out" }, "polish+=0.38");

        // Build this inside the media context so its styles are reverted if the
        // motion preference changes, even though the preloader starts it later.
        const opening = gsap.timeline({ paused: true });
        opening
          .to(
            flip,
            {
              x: 0,
              y: 0,
              duration: 0.9,
              ease: "expo.inOut",
              onComplete: () => flip.classList.remove(RAISED),
            },
            0,
          )
          .to(q("[data-hero-reveal]"), { opacity: 1, y: 0, duration: 0.65, stagger: 0.14 }, 0.45)
          .call(
            () => {
              el.dataset.openingStage = "wine";
            },
            [],
            1,
          )
          .call(
            () => {
              el.dataset.openingStage = "photograph-reveal";
              if (copy.contains(document.activeElement)) {
                el.querySelector(".landing-discover")?.focus({ preventScroll: true });
              }
              copy.inert = true;
            },
            [],
            1.8,
          )
          .to(copy, { autoAlpha: 0, duration: 0.8, ease: "power2.inOut" }, 1.8)
          .to(illumination, { opacity: 0, duration: 0.8, ease: "sine.inOut" }, 1.8)
          .to(photo, { opacity: 1, duration: 1.35, ease: "power2.inOut" }, 1.8)
          .to(q(".landing-hero-photo img"), { scale: 1, duration: 1.65, ease: "power2.out" }, 1.8)
          .call(
            () => {
              el.dataset.openingStage = "photograph";
            },
            [],
            3.45,
          );
        const unsubscribe = onReveal(() => opening.play(0));
        return () => {
          unsubscribe();
          flip.classList.remove(RAISED);
          copy.inert = true;
          el.dataset.openingStage = "photograph";
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} data-opening-stage="photograph" className="landing-hero on-wine relative bg-wine text-cream">
      <h1 className="sr-only">{hero.lockupLabel}</h1>
      <div className="landing-hero-stage">
        <WineGround />
        <div className="intro-illumination" aria-hidden="true" />
        <div className="landing-hero-photo">
          <HeroSlideshow />
          <div className="landing-hero-shade" aria-hidden="true" />
        </div>
        <div className="landing-hero-copy" inert>
          <p data-hero-reveal className="eyebrow text-cream/90">
            {landingHero.eyebrow}
          </p>
          <div data-lockup-flip className="landing-lockup relative" aria-hidden="true">
            <BrandLockup className="intro-metal" label={hero.lockupLabel} />
            <IntroJewelleryLight />
          </div>
          <p data-hero-reveal className="landing-hero-lede">
            {landingHero.lede}
          </p>
          <div className="landing-hero-actions">
            <Button data-hero-reveal href="#collections" variant="solid">
              {hero.primary.label}
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </Button>
            <Link data-hero-reveal href="#visit" className="link-underline py-2 text-sm tracking-wide">
              {hero.secondary.label}
            </Link>
          </div>
        </div>
        <div data-hero-reveal className="landing-hero-footer">
          <Link href="#collections" className="landing-discover eyebrow">
            <ArrowDown size={16} strokeWidth={1.25} aria-hidden="true" />
            {landingHero.scrollCue}
          </Link>
          <Link href="#campaign" className="landing-photo-caption">
            <span>{landingHero.collection}</span>
            <ArrowUpRight size={18} strokeWidth={1.25} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="relative border-t border-cream/20 bg-wine-deep">
        <ul className="landing-trust container-x">
          {hero.stats.map((stat) => (
            <li key={stat.label} className="eyebrow text-cream/80">
              {stat.label}
              {stat.value ? ` ${stat.value}` : ""}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
