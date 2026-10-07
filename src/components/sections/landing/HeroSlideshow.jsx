"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { heroSlides, HERO_INTERVAL } from "@/data/hero-slides";

export function HeroSlideshow() {
  const root = useRef(null);
  const previous = useRef(0);
  const touchStart = useRef(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const hero = root.current.closest(".landing-hero");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motion = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    const opening = () => setReady(hero.dataset.openingStage === "photograph");
    const mutation = new MutationObserver(opening);
    const intersection = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    mutation.observe(hero, { attributes: true, attributeFilter: ["data-opening-stage"] });
    intersection.observe(hero);
    // Parent GSAP setup runs in the same commit; read the settled opening state afterwards.
    const frame = requestAnimationFrame(opening);
    motion();
    visibility();
    media.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      mutation.disconnect();
      intersection.disconnect();
      media.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    if (!ready || paused || reduced || !inView || !visible) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % heroSlides.length), HERO_INTERVAL);
    return () => window.clearInterval(timer);
  }, [ready, paused, reduced, inView, visible]);

  useGSAP(
    () => {
      const slides = root.current.querySelectorAll("[data-hero-slide]");
      const media = gsap.matchMedia();
      const prior = previous.current;
      media.add(MOTION_OK, () => {
        gsap.set(slides, { opacity: 0 });
        gsap.set(slides[prior], { opacity: 1 });
        gsap.to(slides, { opacity: (i) => (i === index ? 1 : 0), duration: 0.7, ease: "sine.inOut", overwrite: true });
        const image = slides[index].querySelector("img");
        gsap.fromTo(image, { scale: 1.035 }, { scale: 1, duration: 2.5, ease: "sine.out", overwrite: true });
      });
      previous.current = index;
      return () => media.revert();
    },
    { scope: root, dependencies: [index], revertOnUpdate: true },
  );

  function select(next) {
    setPaused(true);
    setIndex((next + heroSlides.length) % heroSlides.length);
  }

  return (
    <div
      ref={root}
      className="hero-slideshow"
      data-active-slide={index + 1}
      data-interval={HERO_INTERVAL}
      data-autoplay={!paused && !reduced && ready && inView && visible}
      role="region"
      aria-roledescription="carousel"
      aria-label="House photographs"
      aria-describedby="hero-photograph-help"
      tabIndex={ready ? 0 : -1}
      onFocus={() => setPaused(true)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          select(index + (event.key === "ArrowRight" ? 1 : -1));
        } else if (event.key === " ") {
          event.preventDefault();
          setPaused((value) => !value);
        }
      }}
      onPointerDown={(event) => {
        if (event.pointerType === "touch") touchStart.current = { x: event.clientX, y: event.clientY };
      }}
      onPointerCancel={() => {
        touchStart.current = null;
      }}
      onPointerUp={(event) => {
        if (!touchStart.current) return;
        const dx = event.clientX - touchStart.current.x;
        const dy = event.clientY - touchStart.current.y;
        touchStart.current = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) select(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="hero-slideshow-images">
        {heroSlides.map((slide, i) => (
          <div
            key={slide.src}
            data-hero-slide
            aria-hidden={i !== index}
            className={`hero-slideshow-photo ${i === index ? "is-current" : ""}`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "eager"}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: slide.position }}
            />
          </div>
        ))}
      </div>
      <p id="hero-photograph-help" className="sr-only">
        Swipe or use the left and right arrow keys to browse photographs. Space pauses or resumes the slideshow.
      </p>
      <div className="hero-slideshow-indicator">
        <span className="hero-slide-count" aria-live={paused ? "polite" : "off"}>
          0{index + 1}
          <span>/ 04</span>
        </span>
      </div>
    </div>
  );
}
