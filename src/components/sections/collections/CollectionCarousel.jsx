"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { collections } from "@/data/collections";

/** Native touch scrolling and keyboard links, with GSAP easing for arrow navigation. */
export function CollectionCarousel() {
  const track = useRef(null);
  const tween = useRef(null);
  const drag = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = track.current;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      tween.current?.kill();
      delete element.dataset.sliding;
    };
    query.addEventListener("change", stop);
    return () => {
      stop();
      query.removeEventListener("change", stop);
    };
  }, []);

  function go(index) {
    const element = track.current;
    const next = Math.min(collections.length - 1, Math.max(0, index));
    const card = element.children[next];
    const target = Math.min(
      element.scrollWidth - element.clientWidth,
      card.getBoundingClientRect().left - element.getBoundingClientRect().left + element.scrollLeft,
    );
    tween.current?.kill();
    setActive(next);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.scrollLeft = target;
      return;
    }
    element.dataset.sliding = "true";
    tween.current = gsap.to(element, {
      scrollLeft: target,
      duration: 1.35,
      ease: "power3.inOut",
      onComplete: () => {
        delete element.dataset.sliding;
      },
    });
  }

  function measure() {
    const element = track.current;
    if (element.dataset.sliding) return;
    const step = element.children[1].offsetLeft - element.children[0].offsetLeft;
    setActive(Math.min(collections.length - 1, Math.round(element.scrollLeft / step)));
  }

  return (
    <section id="collections" className="collection-slider house-section" aria-labelledby="collection-slider-heading">
      <div className="house-section-head container-x">
        <div>
          <p className="eyebrow text-wine-soft">Four expressions. One house.</p>
          <h2 id="collection-slider-heading">Find your expression.</h2>
        </div>
        <div className="collection-slider-controls">
          <span className="collection-slider-count" aria-live="polite">
            0{active + 1} <span>/ 04</span>
          </span>
          <button
            className="glass-control"
            type="button"
            aria-label="Previous collection"
            disabled={active === 0}
            onClick={() => go(active - 1)}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next collection"
            className="glass-control"
            disabled={active === collections.length - 1}
            onClick={() => go(active + 1)}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="collection-slider-hint container-x">Swipe to explore, or use the arrows.</p>
      <div
        ref={track}
        className="collection-slider-track"
        onScroll={measure}
        data-lenis-prevent-touch
        role="region"
        aria-roledescription="carousel"
        aria-label="The house collection"
        onKeyDown={(event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
          event.preventDefault();
          go(active + (event.key === "ArrowRight" ? 1 : -1));
        }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0) return;
          tween.current?.kill();
          delete track.current.dataset.sliding;
          drag.current = { x: event.clientX, left: track.current.scrollLeft, moved: false };
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          if (!event.buttons) {
            drag.current = null;
            delete track.current.dataset.sliding;
            return;
          }
          const delta = event.clientX - drag.current.x;
          if (Math.abs(delta) > 8) {
            event.preventDefault();
            tween.current?.kill();
            drag.current.moved = true;
            track.current.setPointerCapture(event.pointerId);
            track.current.dataset.sliding = "true";
            track.current.scrollLeft = drag.current.left - delta;
          }
        }}
        onPointerUp={() => {
          delete track.current.dataset.sliding;
          measure();
        }}
        onPointerCancel={() => {
          drag.current = null;
          delete track.current.dataset.sliding;
          measure();
        }}
        onClickCapture={(event) => {
          if (drag.current?.moved) {
            event.preventDefault();
            event.stopPropagation();
          }
          drag.current = null;
        }}
        onLostPointerCapture={() => {
          delete track.current.dataset.sliding;
        }}
      >
        {collections.map((collection, index) => (
          <article
            key={collection.slug}
            className="collection-slider-card"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of 4`}
          >
            <Link
              href={`/collections/${collection.slug}`}
              draggable={false}
              onFocus={() => {
                if (!drag.current) go(index);
              }}
              aria-label={`Explore ${collection.name.toLowerCase()}`}
            >
              <div className="collection-slider-photo">
                <Image
                  src={collection.image}
                  alt={collection.alt}
                  fill
                  sizes="(min-width: 1024px) 38vw, 82vw"
                  draggable={false}
                  className="object-cover"
                />
                <span aria-hidden="true">0{index + 1}</span>
              </div>
              <div className="collection-slider-caption">
                <h3>{collection.name}</h3>
                <ArrowUpRight size={24} strokeWidth={1.2} aria-hidden="true" />
              </div>
              <p>{collection.note}</p>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
