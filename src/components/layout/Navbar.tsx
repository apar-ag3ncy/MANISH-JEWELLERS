"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { onReveal } from "@/lib/reveal";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { getWineGround, getWineGroundServer, subscribeGround } from "./ground";
import { NAV_SCROLL_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { brand, nav, navCta, mobileMenu } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";
import { BrandTagline, BrandWordmark } from "@/components/ui/brand/BrandLockup";

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const pathname = usePathname();
  /* The landing page is wine; so is any route that declares itself wine (the 404). */
  const wineRoute = useSyncExternalStore(subscribeGround, getWineGround, getWineGroundServer);
  const onWine = pathname === "/" || wineRoute;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /* scrollNav + navReveal */
  useGSAP(
    () => {
      setScrolled(window.scrollY > NAV_SCROLL_THRESHOLD);
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: `${NAV_SCROLL_THRESHOLD}px top`,
        end: "max",
        onToggle: (self) => setScrolled(self.isActive),
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const pill = ref.current?.querySelector("[data-pill]");
        if (!pill) return;
        gsap.set(pill, { y: -24, opacity: 0 });
        return onReveal(() => {
          gsap.to(pill, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.7 });
        });
      });

      return () => st.kill();
    },
    { scope: ref },
  );

  /* mobile panel open / close */
  useGSAP(
    () => {
      const panel = panelRef.current;
      if (!panel) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = panel.querySelectorAll("[data-menu-item]");

      if (open) {
        lockScroll();
        if (reduced) {
          gsap.set(panel, { display: "flex", yPercent: 0 });
          gsap.set(items, { yPercent: 0 });
        } else {
          gsap.set(panel, { display: "flex" });
          gsap
            .timeline()
            .fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
            .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.07, ease: "expo.out" }, "-=0.25");
        }
        window.setTimeout(() => panel.querySelector<HTMLElement>(FOCUSABLE)?.focus(), 50);
      } else {
        unlockScroll();
        if (reduced || getComputedStyle(panel).display === "none") {
          gsap.set(panel, { display: "none" });
        } else {
          gsap.to(panel, {
            yPercent: -100,
            duration: 0.6,
            ease: "expo.inOut",
            onComplete: () => gsap.set(panel, { display: "none" }),
          });
        }
      }
    },
    { dependencies: [open] },
  );

  useEffect(() => setOpen(false), [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  /* focus trap + Esc */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const pillActive = scrolled;
  const ctaVariant = pillActive ? "secondary" : onWine ? "outline-cream" : "outline";
  /* On the landing hero the lockup itself is the logo; the nav mark joins once you scroll.
     Only the landing page has that lockup — a wine 404 keeps its nav mark. */
  const logoHidden = pathname === "/" && !pillActive;

  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-5 z-50">
      <div className="container-x">
        <div
          data-pill
          className={cn(
            "pointer-events-auto mx-auto flex items-center justify-between rounded-full px-5 transition-[background-color,box-shadow,height,color,max-width] duration-500 ease-[var(--ease-lux)] lg:px-7",
            /* Scrolled, it narrows to 880px so it stops reading as a toolbar laid over the photography. */
            pillActive
              ? "h-14 max-w-[min(100%,880px)] bg-cream text-wine shadow-nav"
              : "h-[88px] max-w-full bg-transparent",
            !pillActive && (onWine ? "on-wine text-cream" : "text-wine"),
          )}
        >
          <Link
            href="/"
            aria-label={brand.name}
            aria-hidden={logoHidden || undefined}
            tabIndex={logoHidden ? -1 : undefined}
            className={cn(
              "flex items-center gap-2.5 transition-opacity duration-700 ease-[var(--ease-lux)]",
              logoHidden && "pointer-events-none opacity-0",
            )}
          >
            <Monogram className="h-6 w-auto" />
            <BrandWordmark className="h-[10px] w-auto sm:h-[11px]" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex xl:gap-10">
            {nav.map((l) => (
              <Link key={l.label} href={l.href} className="link-underline-draw py-1 ui-label">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href={navCta.href} variant={ctaVariant} className="h-10 px-5 text-[12px]">
              {navCta.label}
            </Button>
          </div>

          <button
            ref={triggerRef}
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
            aria-label={mobileMenu.open}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Full-screen wine panel */}
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="on-wine pointer-events-auto fixed inset-0 z-[60] hidden flex-col bg-wine text-cream will-change-transform"
      >
        <div className="container-x flex h-[88px] items-center justify-between">
          <span className="flex items-center gap-2.5" role="img" aria-label={brand.name}>
            <Monogram className="h-6 w-auto" />
            <BrandWordmark className="h-[11px] w-auto" />
          </span>
          <button
            type="button"
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full"
            aria-label={mobileMenu.close}
            onClick={close}
          >
            <X className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center gap-2 pb-24">
          {[mobileMenu.landingLink, mobileMenu.homeLink, ...nav].map((l) => (
            <span key={l.label} className="mask-line">
              <Link
                data-menu-item
                href={l.href}
                onClick={close}
                className="block font-display text-[clamp(2.5rem,10vw,4.5rem)] leading-[1.05] tracking-[-0.02em]"
              >
                {l.label}
              </Link>
            </span>
          ))}
          <span className="mask-line mt-10">
            <span data-menu-item className="block">
              <Button href={navCta.href} variant="solid" onClick={close}>
                {navCta.label}
              </Button>
            </span>
          </span>
        </nav>

        <div className="container-x pb-8 text-cream/60">
          <BrandTagline className="h-[9px] w-auto" title={brand.motto} />
        </div>
      </div>
    </header>
  );
}
