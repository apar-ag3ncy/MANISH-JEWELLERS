"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** A scoped motion layer. Mark copy and image frames; keep content visible in HTML. */
export function ScrollMotion({ children, className = "", as: Tag = "div" }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        root.current.querySelectorAll("[data-scroll-fade]").forEach((element) => {
          gsap
            .timeline({
              scrollTrigger: { trigger: element, start: "top 96%", end: "bottom 6%", scrub: 0.85 },
            })
            .fromTo(element, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.22, ease: "sine.out" })
            .to(element, { opacity: 1, duration: 0.62 })
            .to(element, { opacity: 0, y: -18, duration: 0.16, ease: "sine.in" });
        });

        root.current.querySelectorAll("[data-image-swipe]").forEach((frame) => {
          const image = frame.querySelector("img");
          const introductory = frame.dataset.imageSwipe === "intro";
          const timeline = gsap.timeline({
            scrollTrigger: introductory
              ? { trigger: frame, start: "top 98%", toggleActions: "play none none reverse" }
              : { trigger: frame, start: "top 94%", end: "top 28%", scrub: 1.1 },
          });
          timeline.fromTo(
            frame,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.4,
              ease: "power2.inOut",
            },
          );
          if (image)
            timeline.fromTo(
              image,
              { scale: 1.06, xPercent: -3 },
              {
                scale: 1,
                xPercent: 0,
                duration: 1.4,
                ease: "power2.out",
              },
              0,
            );
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}
