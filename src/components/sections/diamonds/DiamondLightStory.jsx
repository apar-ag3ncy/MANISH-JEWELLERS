"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { diamondLessons } from "@/data/diamond-guide";
import { DiamondAnatomy } from "./DiamondAnatomy";

export function DiamondLightStory() {
  const root = useRef(null);
  useGSAP(
    () => {
      const element = root.current;
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference) and (min-width: 900px) and (min-height: 600px)", () => {
        element.dataset.animated = "true";
        const stage = element.querySelector(".diamond-model-stage");
        const steps = [...element.querySelectorAll("[data-diamond-lesson]")];
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: element,
            start: "top 25%",
            end: "bottom 75%",
            scrub: 0.8,
            onUpdate: (trigger) => {
              element.dataset.lesson = diamondLessons[Math.min(2, Math.floor(trigger.progress * 3))].id;
            },
          },
        });
        timeline
          .fromTo(
            stage.querySelector("[data-diamond-assembly]"),
            { rotation: -5, transformOrigin: "50% 50%" },
            { rotation: 0, duration: 0.6 },
            0,
          )
          .to(stage.querySelector("[data-diamond-table]"), { y: -60, duration: 0.6, ease: "power2.inOut" }, 0.7)
          .to(stage.querySelector("[data-diamond-crown]"), { y: -28, duration: 0.6, ease: "power2.inOut" }, 0.7)
          .to(stage.querySelector("[data-diamond-pavilion]"), { y: 42, duration: 0.6, ease: "power2.inOut" }, 0.7)
          .to(stage.querySelector("[data-anatomy-labels]"), { opacity: 1, duration: 0.3 }, 1)
          .to(stage.querySelector("[data-anatomy-labels]"), { opacity: 0, duration: 0.25 }, 1.7)
          .to(
            stage.querySelectorAll("[data-diamond-table], [data-diamond-crown], [data-diamond-pavilion]"),
            { y: 0, duration: 0.5, ease: "power2.inOut" },
            1.7,
          )
          .to(stage.querySelector("[data-light-path]"), { opacity: 1, duration: 0.2 }, 2.15)
          .fromTo(
            stage.querySelectorAll("[data-light-ray]"),
            { strokeDasharray: 100, strokeDashoffset: 100 },
            { strokeDashoffset: 0, duration: 0.6, stagger: 0.08, ease: "none" },
            2.2,
          );
        steps.forEach((step) =>
          gsap.fromTo(
            step.querySelector(".diamond-lesson-copy"),
            { opacity: 0.2, y: 30 },
            { opacity: 1, y: 0, scrollTrigger: { trigger: step, start: "top 80%", end: "top 45%", scrub: 0.6 } },
          ),
        );
        return () => {
          delete element.dataset.animated;
          delete element.dataset.lesson;
        };
      });
      media.add(MOTION_OK, () => {
        element
          .querySelectorAll(".diamond-inline-model")
          .forEach((diagram) =>
            gsap.fromTo(
              diagram,
              { y: 24, opacity: 0.4 },
              { y: 0, opacity: 1, scrollTrigger: { trigger: diagram, start: "top 90%", end: "top 45%", scrub: 0.8 } },
            ),
          );
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="light-story" className="diamond-light-story on-wine" aria-label="How a diamond works">
      <div className="diamond-lessons">
        {diamondLessons.map((lesson) => (
          <article key={lesson.id} data-diamond-lesson id={`diamond-${lesson.id}`} className="diamond-lesson">
            <div className="diamond-lesson-copy">
              <p className="eyebrow">{lesson.eyebrow}</p>
              <h2>{lesson.title}</h2>
              <p>{lesson.body}</p>
              <p className="diamond-lesson-detail">{lesson.detail}</p>
            </div>
            <div className="diamond-inline-model">
              <DiamondAnatomy stage={lesson.id} />
            </div>
          </article>
        ))}
      </div>
      <div className="diamond-model-stage">
        <div>
          <p className="eyebrow">The anatomy of light</p>
          <DiamondAnatomy />
          <p className="diamond-model-caption">Scroll to reveal the layers, then follow the light.</p>
        </div>
      </div>
    </section>
  );
}
