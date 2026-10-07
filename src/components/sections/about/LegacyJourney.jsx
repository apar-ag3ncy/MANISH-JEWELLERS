"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight, MoveDown } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { legacy } from "@/data/legacy";
import { LegacySymbol } from "./LegacySymbol";
import { Button } from "@/components/ui/Button";

/** Every era owns its scene in normal document flow; the story never pins or locks scroll. */
export function LegacyJourney({ id = "heritage" }) {
  const root = useRef(null);
  useGSAP(
    () => {
      const element = root.current;
      const scenes = [...element.querySelectorAll("[data-legacy-scene]")];
      const links = [...element.querySelectorAll("[data-legacy-link]")];
      const mark = (index) => {
        element.dataset.activeYear = legacy.chapters[index].year;
        links.forEach((link, i) =>
          i === index ? link.setAttribute("aria-current", "step") : link.removeAttribute("aria-current"),
        );
      };
      mark(0);
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        element.dataset.enhanced = "true";
        scenes.forEach((scene, index) => {
          const core = scene.querySelector("[data-object-core]");
          const paths = [...core.querySelectorAll("path, ellipse")];
          const lengths = paths.map((path) => path.getTotalLength());
          paths.forEach((path, i) => gsap.set(path, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] }));
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: scene,
              start: "top 88%",
              end: "bottom 12%",
              scrub: 0.9,
            },
          });
          timeline
            .fromTo(
              scene.querySelector("[data-legacy-year]"),
              { y: 65, opacity: 0.2 },
              { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
              0,
            )
            .fromTo(
              scene.querySelector("[data-legacy-text]"),
              { y: 36, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.24, ease: "power2.out" },
              0.1,
            )
            .fromTo(
              scene.querySelector("[data-legacy-image]"),
              { yPercent: legacy.chapters[index].contain ? 0 : 9, scale: legacy.chapters[index].contain ? 1 : 1.09 },
              { yPercent: legacy.chapters[index].contain ? 0 : -4, scale: 1, duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              core,
              { y: 20, rotation: -9, transformOrigin: "50% 50%" },
              { y: -12, rotation: 4, duration: 1, ease: "none" },
              0,
            )
            .to(paths, { strokeDashoffset: 0, duration: 0.36, stagger: 0.014, ease: "sine.inOut" }, 0.08)
            .fromTo(
              scene.querySelector("[data-object-orbit]"),
              { rotation: -45, transformOrigin: "50% 50%" },
              { rotation: 45, duration: 1, ease: "none" },
              0,
            )
            .fromTo(
              scene.querySelector("[data-object-spark]"),
              { opacity: 0.1, scale: 0.8, transformOrigin: "50% 50%" },
              { opacity: 1, scale: 1, duration: 0.24 },
              0.28,
            )
            .to(
              scene.querySelector("[data-legacy-text]"),
              { y: -18, opacity: 0.18, duration: 0.15, ease: "sine.in" },
              0.85,
            );
        });
        gsap.fromTo(
          element.querySelector("[data-story-thread]"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: element.querySelector(".heritage-chapters"),
              start: "top center",
              end: "bottom center",
              scrub: 0.5,
            },
          },
        );
        return () => {
          delete element.dataset.enhanced;
        };
      });
      const navigation = scenes.map((scene, index) =>
        ScrollTrigger.create({
          trigger: scene,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (trigger) => {
            if (trigger.isActive) mark(index);
          },
        }),
      );
      return () => {
        media.revert();
        navigation.forEach((trigger) => trigger.kill());
        delete element.dataset.activeYear;
        links.forEach((link) => link.removeAttribute("aria-current"));
      };
    },
    { scope: root, dependencies: [id], revertOnUpdate: true },
  );

  return (
    <section ref={root} id={id} className="heritage-story on-wine" aria-labelledby={`${id}-heading`}>
      <header className="heritage-prologue container-x">
        <div>
          <p className="eyebrow">A journey through generations</p>
          <h2 id={`${id}-heading`}>
            One thread.
            <br />
            <em>One hundred and ten years.</em>
          </h2>
        </div>
        <div>
          <p>Hands change. A promise endures. Follow the craft, the family and the care carried from 1916 into 2026.</p>
          <a className="heritage-scroll-hint" href={`#${id}-1916`}>
            <MoveDown size={18} aria-hidden="true" />
            Scroll to follow the story
          </a>
        </div>
      </header>
      <nav className="heritage-year-nav" aria-label={legacy.navigationLabel}>
        <span className="heritage-nav-title eyebrow">The living legacy</span>
        <ol>
          {legacy.chapters.map((chapter) => (
            <li key={chapter.year}>
              <a data-legacy-link href={`#${id}-${chapter.year}`} aria-label={`${chapter.year}: ${chapter.theme}`}>
                <span aria-hidden="true" />
                {chapter.year}
              </a>
            </li>
          ))}
        </ol>
        <a className="heritage-skip" href={`#${id}-end`}>
          Continue below <ArrowDown size={14} aria-hidden="true" />
        </a>
      </nav>
      <div className="heritage-chapters">
        <div className="heritage-thread" aria-hidden="true">
          <span data-story-thread />
        </div>
        {legacy.chapters.map((chapter, index) => (
          <article
            key={chapter.year}
            id={`${id}-${chapter.year}`}
            data-legacy-scene
            className={`heritage-scene heritage-scene--${index % 2 ? "reverse" : "forward"} ${chapter.contain ? "heritage-scene--family" : ""}`}
          >
            <span className="heritage-thread-node" aria-hidden="true" />
            <div className="heritage-scene-inner container-x">
              <div className="heritage-era">
                <span className="eyebrow">Chapter 0{index + 1} / 06</span>
                <p data-legacy-year className="heritage-year">
                  {chapter.year}
                </p>
                <div className="heritage-symbol">
                  <LegacySymbol chapter={index} />
                  <span>{chapter.value}</span>
                </div>
              </div>
              <div className="heritage-portrait">
                <div className="heritage-image-window">
                  <div data-legacy-image className="heritage-photo">
                    <Image
                      src={chapter.image}
                      alt={chapter.alt}
                      fill
                      sizes="(min-width: 1024px) 46vw, 90vw"
                      style={{ objectPosition: chapter.position, objectFit: chapter.contain ? "contain" : "cover" }}
                    />
                  </div>
                </div>
                <p className="heritage-image-caption">{chapter.caption}</p>
              </div>
              <div data-legacy-text className="heritage-narrative">
                <p className="eyebrow">{chapter.theme}</p>
                <h3>{chapter.title}</h3>
                <p className="legacy-body">{chapter.body}</p>
                <a
                  href={`#${id}-${index === legacy.chapters.length - 1 ? "end" : legacy.chapters[index + 1].year}`}
                  className="heritage-next"
                >
                  {index === legacy.chapters.length - 1
                    ? "Carry the story forward"
                    : `Next chapter · ${legacy.chapters[index + 1].year}`}
                  <ArrowDown size={16} aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div id={`${id}-end`} className="heritage-epilogue container-x" tabIndex={-1}>
        <p className="eyebrow">1916 — 2026 · The next generation</p>
        <h2>
          New hands.
          <br />
          <em>The same royal spirit.</em>
        </h2>
        <p>
          The artistry evolves. The care stays personal. A new generation carries the excellence of Manish Jewellers
          into the stories still to come.
        </p>
        <Button href="/visit" variant="glass">
          Visit the house <ArrowUpRight size={17} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
