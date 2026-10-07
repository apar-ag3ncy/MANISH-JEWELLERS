"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { createFooterHandoff } from "@/lib/diamond-experience/footer-handoff";
import { DiamondExperience } from "@/components/sections/diamond-experience/DiamondExperience";
import { Footer } from "./Footer";

/** One original wordmark belongs to both the sculptural finale and the footer. */
export function HouseFinale() {
  const root = useRef(null);
  const diamond = useRef(null);
  const brandAnchor = useRef(null);
  const footerSlot = useRef(null);
  const wordmark = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    let frame = 0;
    document.fonts.ready.then(() => {
      if (!alive) return;
      frame = requestAnimationFrame(() => {
        if (window.location.hash !== "#house-footer") return;
        // The scroll scene expands after hydration; keep direct footer links on their intended target.
        const footer = footerSlot.current.closest("footer");
        const lenis = getLenis();
        lenis?.resize();
        ScrollTrigger.refresh();
        if (lenis) lenis.scrollTo(footer, { immediate: true });
        else footer.scrollIntoView({ block: "start" });
      });
    });
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(`${MOTION_OK} and (min-height: 500px)`, () =>
        createFooterHandoff({
          root: root.current,
          diamond: diamond.current,
          brandAnchor: brandAnchor.current,
          footerSlot: footerSlot.current,
          wordmark: wordmark.current,
        }),
      );
      return () => media.revert();
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="house-finale" data-house-finale>
      <DiamondExperience finaleRef={diamond} brandAnchorRef={brandAnchor} />
      <Footer wordmarkRef={wordmark} wordmarkSlotRef={footerSlot} />
    </div>
  );
}
