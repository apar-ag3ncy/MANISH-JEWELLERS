"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from "lucide-react";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { collectionEditorial } from "@/data/collection-editorial";
import { lockScroll, unlockScroll } from "@/lib/lenis";

export function CollectionEditorial() {
  const [active, setActive] = useState(null);
  const dialog = useRef(null);
  const opener = useRef(null);
  const titleId = useId();
  const isOpen = active !== null;
  const selected = isOpen ? collectionEditorial[active] : null;

  useEffect(() => {
    if (!isOpen) return;
    const element = dialog.current;
    lockScroll("collection-gallery");
    element.showModal();
    return () => {
      if (element.open) element.close();
      unlockScroll("collection-gallery");
      opener.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const step = (direction) =>
    setActive((index) => (index + direction + collectionEditorial.length) % collectionEditorial.length);

  return (
    <>
      <ScrollMotion as="section" className="collection-house-edit house-section container-x">
        <div className="collection-house-heading" data-scroll-fade>
          <div>
            <p className="eyebrow text-wine-soft">The house edit</p>
            <h2>
              Made to be
              <br />
              <em>looked at closely.</em>
            </h2>
          </div>
          <p>From a statement in gold to the box that holds it. Explore the collection and the world around it.</p>
        </div>
        <div className="collection-house-grid">
          {collectionEditorial.map((entry, index) => (
            <figure key={entry.id} className={`collection-house-item collection-house-item--${index + 1}`}>
              <div className="collection-house-photo on-wine" data-image-swipe>
                <Image
                  src={entry.image}
                  alt={entry.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  style={{ objectFit: "cover", objectPosition: entry.position }}
                />
                <button
                  type="button"
                  className="glass-control collection-gallery-open"
                  aria-label={`Take a closer look: ${entry.title}`}
                  aria-haspopup="dialog"
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setActive(index);
                  }}
                >
                  <Expand size={17} strokeWidth={1.3} aria-hidden="true" />
                </button>
              </div>
              <figcaption data-scroll-fade>
                <p className="eyebrow text-wine-soft">{entry.eyebrow}</p>
                <h3>{entry.title}</h3>
                <p>{entry.description}</p>
                <Link href={entry.href} className="house-text-link">
                  {entry.link}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </figcaption>
            </figure>
          ))}
        </div>
      </ScrollMotion>

      <ScrollMotion as="section" className="collection-atelier on-wine">
        <div className="collection-atelier-grid container-x">
          <div className="collection-atelier-photo" data-image-swipe>
            <Image
              src="/house/atelier-detail.webp"
              alt="An artisan working on a gold ring with fine tools at a jewellery bench"
              fill
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-cover"
            />
          </div>
          <div className="collection-atelier-copy" data-scroll-fade>
            <p className="eyebrow">The art behind the ornament</p>
            <h2>
              A careful hand.
              <br />A lasting <em>impression.</em>
            </h2>
            <p>
              A curve refined. A setting considered. A surface finished. The beauty of a jewel begins with attention to
              the smallest detail.
            </p>
            <Link href="/bespoke" className="house-text-link">
              Begin a personal creation
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </ScrollMotion>

      <ScrollMotion as="section" className="collection-gifting house-section container-x">
        <div data-scroll-fade>
          <p className="eyebrow text-wine-soft">The joy of giving</p>
          <h2>
            A beautiful beginning.
            <br />
            <em>Before the box opens.</em>
          </h2>
          <p>For a milestone, a celebration, or simply someone special. Let us help you find a jewel with meaning.</p>
          <Link href="/visit" className="house-text-link">
            Visit the house
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="collection-gifting-photo" data-image-swipe>
          <Image
            src="/house/gift-presentation.webp"
            alt="A cream-wrapped gift with a wine-colored Manish Jewellers ribbon and monogram"
            fill
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>
      </ScrollMotion>

      <dialog
        ref={dialog}
        className="collection-lightbox on-wine"
        aria-labelledby={titleId}
        data-lenis-prevent
        onClose={() => setActive(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          }
        }}
      >
        {selected && (
          <div className="collection-lightbox-inner">
            <div className="collection-lightbox-top">
              <p className="eyebrow">The house edit · {String(active + 1).padStart(2, "0")} / 04</p>
              <button
                type="button"
                className="glass-control"
                aria-label="Close closer look"
                onClick={() => dialog.current.close()}
              >
                <X size={19} aria-hidden="true" />
              </button>
            </div>
            <div className="collection-lightbox-photo">
              <Image src={selected.image} alt={selected.alt} fill sizes="90vw" className="object-contain" />
            </div>
            <div className="collection-lightbox-bottom">
              <h2 id={titleId} aria-live="polite">
                {selected.title}
              </h2>
              <div>
                <button
                  type="button"
                  className="glass-control"
                  aria-label="Previous house image"
                  onClick={() => step(-1)}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <button type="button" className="glass-control" aria-label="Next house image" onClick={() => step(1)}>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
