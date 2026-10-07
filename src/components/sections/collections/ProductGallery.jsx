"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { categoryName, productCategories, products as allProducts } from "@/data/product-catalog";

/** Original brochure photography, with native links underneath the enhanced gallery. */
export function ProductGallery({
  products = allProducts,
  id = "all-pieces",
  heading = "Find the piece that feels like you.",
  eyebrow = "The jewellery edit",
  description = "Every curve, every setting, every little detail. Explore the complete jewellery edit and take a closer look at the pieces you love.",
  filters = true,
  showAllLink = false,
}) {
  const root = useRef(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const titleId = useId();
  const headingId = useId();
  const lockOwner = `product-gallery-${titleId}`;
  const [category, setCategory] = useState("all");
  const [active, setActive] = useState(null);
  const visible = category === "all" ? products : products.filter((piece) => piece.category === category);
  const selected = active === null ? null : visible[active];
  const isOpen = Boolean(selected);

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        root.current.querySelectorAll("[data-product-id]").forEach((card) => {
          gsap.from(card, {
            opacity: 0,
            y: 24,
            duration: 1.15,
            ease: "sine.out",
            scrollTrigger: { trigger: card, start: "top 97%", toggleActions: "play none none reverse" },
          });
        });
        ScrollTrigger.refresh();
      });
      // Filtering changes the page height, including the measured footer handoff.
      ScrollTrigger.refresh();
      return () => media.revert();
    },
    { scope: root, dependencies: [category], revertOnUpdate: true },
  );

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    lockScroll(lockOwner);
    element.showModal();
    return () => {
      if (element.open) element.close();
      unlockScroll(lockOwner);
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen, lockOwner]);

  const step = (direction) => setActive((index) => (index + direction + visible.length) % visible.length);

  return (
    <section ref={root} id={id} className="product-edit" aria-labelledby={headingId} data-product-gallery>
      <div className="container-x">
        <div className="product-edit-heading">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2 id={headingId}>{heading}</h2>
          </div>
          <div className="product-edit-introduction">
            <p>{description}</p>
            {showAllLink && (
              <Link href="/collections#all-pieces" className="house-text-link">
                Discover all {allProducts.length} pieces <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        {filters && (
          <div className="product-edit-toolbar">
            <nav aria-label="Filter jewellery" className="product-edit-filters">
              {[{ slug: "all", name: "All pieces" }, ...productCategories].map((item) => {
                const count =
                  item.slug === "all"
                    ? products.length
                    : products.filter((piece) => piece.category === item.slug).length;
                if (!count) return null;
                return (
                  <a
                    key={item.slug}
                    href={item.slug === "all" ? "/collections#all-pieces" : `/collections/${item.slug}#the-edit`}
                    className="mj-button product-edit-filter"
                    aria-current={category === item.slug ? "true" : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      setCategory(item.slug);
                    }}
                  >
                    {item.name} <span>{String(count).padStart(2, "0")}</span>
                  </a>
                );
              })}
            </nav>
            <p className="product-edit-count" aria-live="polite" aria-atomic="true">
              {String(visible.length).padStart(2, "0")} pieces to discover
            </p>
          </div>
        )}

        <div className="product-edit-grid" data-piece-count={visible.length}>
          {visible.map((piece, index) => (
            <figure className="product-edit-piece" key={piece.id} data-product-id={piece.id}>
              <a
                href={piece.image}
                className="product-edit-image"
                aria-label={`Take a closer look: ${piece.name}`}
                aria-haspopup="dialog"
                onClick={(event) => {
                  event.preventDefault();
                  opener.current = event.currentTarget;
                  setActive(index);
                }}
              >
                <Image
                  src={piece.image}
                  alt={piece.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 600px) 45vw, 90vw"
                  className="product-edit-photograph"
                />
                <span className="product-edit-expand" aria-hidden="true">
                  A closer look <Expand size={16} strokeWidth={1.25} />
                </span>
              </a>
              <figcaption>
                <div className="product-edit-piece-label">
                  <Link href={`/collections/${piece.category}#the-edit`}>{categoryName(piece.category)}</Link>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3>{piece.name}</h3>
                <p>{piece.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        {showAllLink && (
          <div className="product-edit-bottom">
            <p>There is more to fall in love with.</p>
            <Link href="/collections#all-pieces" className="house-text-link">
              Explore the complete collection <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>

      <dialog
        ref={dialog}
        className="product-viewer"
        aria-labelledby={titleId}
        data-lenis-prevent
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            step(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        {selected && (
          <div className="product-viewer-inner">
            <div className="product-viewer-top">
              <p className="eyebrow">
                The jewellery edit · {String(active + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
              </p>
              <button
                type="button"
                className="glass-control"
                aria-label="Close product view"
                onClick={() => dialog.current.close()}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>
            <div className="product-viewer-layout">
              <div className="product-viewer-image">
                <Image
                  src={selected.image}
                  alt={selected.alt}
                  fill
                  sizes="(min-width: 900px) 65vw, 90vw"
                  className="object-contain"
                />
              </div>
              <div className="product-viewer-copy">
                <p className="eyebrow">{categoryName(selected.category)}</p>
                <h2 id={titleId} aria-live="polite">
                  {selected.name}
                </h2>
                <p>{selected.detail}</p>
                <p className="product-viewer-note">
                  A piece to see, feel and make your own. Explore the collection with us at the house in Beawar.
                </p>
                <Link href="/visit" className="house-text-link">
                  Plan a viewing <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
                <div className="product-viewer-navigation">
                  <button
                    type="button"
                    className="glass-control"
                    aria-label="Previous piece"
                    disabled={visible.length < 2}
                    onClick={() => step(-1)}
                  >
                    <ArrowLeft size={19} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="glass-control"
                    aria-label="Next piece"
                    disabled={visible.length < 2}
                    onClick={() => step(1)}
                  >
                    <ArrowRight size={19} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
