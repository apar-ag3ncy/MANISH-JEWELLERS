"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowUpRight } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { onReveal } from "@/lib/reveal";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { getWineGround, getWineGroundServer, subscribeGround } from "./ground";
import { NAV_SCROLL_THRESHOLD } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { brand, nav, navCta, mobileMenu } from "@/data/content";
import { collections } from "@/data/collections";
import { Button } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";
import { BrandTagline, BrandWordmark } from "@/components/ui/brand/BrandLockup";

const FOCUSABLE = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export function Navbar() {
  const pathname = usePathname();
  const links = nav;
  const viewingHref = navCta.href;
  /* The landing page is wine; so is any route that declares itself wine (the 404). */
  const wineRoute = useSyncExternalStore(subscribeGround, getWineGround, getWineGroundServer);
  const onWine = pathname === "/" || wineRoute;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const ref = useRef(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownTrigger = useRef(null);

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

      return () => {
        st.kill();
        mm.revert();
      };
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
      let animation;
      let focusTimer;

      if (open) {
        lockScroll("menu");
        if (reduced) {
          gsap.set(panel, { display: "flex", yPercent: 0 });
          gsap.set(items, { yPercent: 0 });
        } else {
          gsap.set(panel, { display: "flex" });
          animation = gsap
            .timeline()
            .fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
            .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.07, ease: "expo.out" }, "-=0.25");
        }
        focusTimer = window.setTimeout(() => panel.querySelector(FOCUSABLE)?.focus({ preventScroll: true }), 50);
      } else {
        unlockScroll("menu");
        if (reduced || getComputedStyle(panel).display === "none") {
          gsap.set(panel, { display: "none" });
        } else {
          animation = gsap.to(panel, {
            yPercent: -100,
            duration: 0.6,
            ease: "expo.inOut",
            onComplete: () => gsap.set(panel, { display: "none" }),
          });
        }
      }
      return () => {
        animation?.kill();
        window.clearTimeout(focusTimer);
      };
    },
    { dependencies: [open] },
  );

  useEffect(() => {
    setOpen(false);
    setCollectionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!collectionsOpen) return;
    const outside = (event) => {
      if (!event.target.closest("[data-collection-menu]")) setCollectionsOpen(false);
    };
    const escape = (event) => {
      if (event.key !== "Escape") return;
      setCollectionsOpen(false);
      dropdownTrigger.current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [collectionsOpen]);

  useGSAP(
    () => {
      if (!collectionsOpen || !dropdownRef.current) return;
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        gsap.fromTo(
          dropdownRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
        );
        gsap.fromTo(
          dropdownRef.current.querySelectorAll("a"),
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, stagger: 0.06, duration: 0.7, ease: "power3.out" },
        );
      });
      return () => media.revert();
    },
    { dependencies: [collectionsOpen], scope: ref },
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const resize = () => {
      if (query.matches) setOpen(false);
      else setCollectionsOpen(false);
    };
    query.addEventListener("change", resize);
    return () => query.removeEventListener("change", resize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const background = document.querySelectorAll("main, [data-house-finale], [data-pill]");
    background.forEach((el) => {
      el.inert = true;
    });
    return () => {
      background.forEach((el) => {
        el.inert = false;
      });
      unlockScroll("menu");
      trigger?.focus({ preventScroll: true });
    };
  }, [open]);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  /* focus trap + Esc */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll(FOCUSABLE));
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
  const activeRoute = (href) => pathname === href || pathname.startsWith(`${href}/`);
  const ctaVariant = pillActive ? "secondary" : onWine ? "outline-cream" : "outline";

  return (
    <header ref={ref} className="pointer-events-none fixed inset-x-0 top-3 z-50 sm:top-5">
      <div className="container-x">
        <div
          data-pill
          className={cn(
            "house-nav-pill pointer-events-auto mx-auto flex items-center justify-between gap-6 rounded-full px-5 transition-[background-color,box-shadow,height,color,max-width] duration-700 ease-[var(--ease-lux)] lg:gap-6 lg:px-6",
            !onWine && "house-nav-pill--light",
            /* Keep the navigation compact once the reader leaves the hero. */
            pillActive
              ? "h-14 max-w-[min(100%,1040px)] bg-cream text-wine shadow-nav"
              : "h-[72px] max-w-full bg-transparent",
            !pillActive && (onWine ? "on-wine text-cream" : "text-wine"),
          )}
        >
          <Link href="/" aria-label={brand.name} className="flex shrink-0 items-center gap-2.5">
            <Monogram className="h-6 w-auto" />
            <BrandWordmark className="h-[10px] w-auto sm:h-[11px]" />
          </Link>

          <nav aria-label="Primary" className="hidden shrink-0 items-center gap-5 lg:flex xl:gap-7">
            {links.map((l) => (
              <div
                key={l.label}
                className="house-nav-item"
                data-collection-menu={l.label === "Collections" ? "" : undefined}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setCollectionsOpen(false);
                }}
              >
                <Link
                  href={l.href}
                  aria-current={activeRoute(l.href) ? "page" : undefined}
                  className="house-nav-link link-underline-draw py-2 ui-label"
                >
                  {l.label}
                  {l.mark ? " " : null}
                  {l.mark ? (
                    <span className="ml-1.5 font-body tracking-normal text-current/70 normal-case">({l.mark})</span>
                  ) : null}
                </Link>
                {l.label === "Collections" && (
                  <>
                    <button
                      ref={dropdownTrigger}
                      type="button"
                      className="house-nav-category-toggle"
                      aria-label="Show collection categories"
                      aria-expanded={collectionsOpen}
                      aria-controls="collection-menu"
                      onClick={() => setCollectionsOpen((value) => !value)}
                    >
                      <ChevronDown size={13} aria-hidden="true" />
                    </button>
                    <div
                      ref={dropdownRef}
                      id="collection-menu"
                      className="house-nav-collection-menu"
                      hidden={!collectionsOpen}
                    >
                      <p className="eyebrow">The house collection</p>
                      <ul>
                        {collections.map((collection, index) => (
                          <li key={collection.slug}>
                            <Link
                              href={`/collections/${collection.slug}`}
                              aria-current={pathname === `/collections/${collection.slug}` ? "page" : undefined}
                              onClick={() => setCollectionsOpen(false)}
                            >
                              <span className="house-nav-category-number">0{index + 1}</span>
                              <span>
                                {collection.name}
                                <small>{collection.phrase}</small>
                              </span>
                              <ArrowUpRight size={17} aria-hidden="true" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href="/collections" className="house-nav-all" onClick={() => setCollectionsOpen(false)}>
                        Discover all collections <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                      <Link href="/diamond-guide" className="house-nav-all" onClick={() => setCollectionsOpen(false)}>
                        The diamond guide <ArrowUpRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden shrink-0 lg:block">
            <Button href={viewingHref} variant={ctaVariant} className="h-10 px-5 text-[12px]">
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
        aria-hidden={!open}
        inert={!open}
        data-lenis-prevent
        className="on-wine pointer-events-auto fixed inset-0 z-[60] hidden flex-col overflow-y-auto bg-wine text-cream will-change-transform"
      >
        <div className="container-x flex h-[88px] shrink-0 items-center justify-between">
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

        <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center gap-3 py-6">
          {[mobileMenu.homeLink, ...links].map((l) => (
            <span key={l.label} className="mask-line">
              <Link
                data-menu-item
                href={l.href}
                onClick={close}
                aria-current={activeRoute(l.href) ? "page" : undefined}
                className="block font-display text-[clamp(1.8rem,6svh,4rem)] leading-[1.1] tracking-[-0.02em]"
              >
                {l.label}
                {"mark" in l && l.mark ? " " : null}
                {"mark" in l && l.mark ? (
                  <span className="ml-3 inline-block align-middle font-body text-[0.34em] tracking-normal text-cream/70">
                    ({l.mark})
                  </span>
                ) : null}
              </Link>
            </span>
          ))}
          <div className="house-mobile-categories" aria-label="Collection categories">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                onClick={close}
                aria-current={pathname === `/collections/${collection.slug}` ? "page" : undefined}
              >
                {collection.name}
              </Link>
            ))}
          </div>
          <Link href="/diamond-guide" onClick={close} className="py-2 text-sm text-cream/80">
            The diamond guide <ArrowUpRight size={14} className="ml-2 inline" aria-hidden="true" />
          </Link>
          <span className="mask-line mt-5">
            <span data-menu-item className="block">
              <Button href={viewingHref} variant="solid" onClick={close}>
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
