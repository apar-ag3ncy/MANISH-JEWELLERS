"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Animate on arrival without hiding content or depending on scroll-trigger order. */
export function LandingReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!element || motion.matches) return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (!motion.matches) {
          animation = element.animate(
            [
              { opacity: 0, transform: "translateY(20px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 700, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
          );
        }
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const reduceMotion = () => {
      if (motion.matches) animation?.cancel();
    };
    motion.addEventListener("change", reduceMotion);
    observer.observe(element);
    return () => {
      observer.disconnect();
      animation?.cancel();
      motion.removeEventListener("change", reduceMotion);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
