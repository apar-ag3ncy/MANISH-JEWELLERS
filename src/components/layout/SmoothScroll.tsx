"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis, setLenis } from "@/lib/lenis";
import { LENIS_LERP } from "@/lib/constants";

/** Lenis smooth scroll, driven by gsap.ticker and synced to ScrollTrigger. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Open in-page tools before an anchor is measured by native navigation or Lenis.
  useEffect(() => {
    const openTarget = (hash: string) => {
      if (!hash) return;
      let id: string;
      try {
        id = decodeURIComponent(hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      const details = target?.closest("details");
      if (details) details.open = true;
    };
    const openHash = () => openTarget(window.location.hash);
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
        openTarget(url.hash);
        // App Router can jump to a hash before Lenis receives the native scroll event.
        // Sync the real position and freshly mounted page dimensions before its anchor handler measures.
        getLenis()?.resize();
      }
    };
    openHash();
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", openHash);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", openHash);
    };
  }, [pathname]);

  useEffect(() => {
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({ lerp: LENIS_LERP, anchors: true });
    setLenis(lenis);
    if (document.documentElement.classList.contains("is-locked")) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // New route → new layout. Re-measure the scroll range and animation triggers.
  useEffect(() => {
    const id = window.setTimeout(() => {
      getLenis()?.resize();
      ScrollTrigger.refresh();
    }, 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return <>{children}</>;
}
