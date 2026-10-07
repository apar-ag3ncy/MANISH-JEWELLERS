"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ArrowDown, MoveHorizontal, RotateCcw, Sparkles } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { diamondExperience as copy } from "@/data/diamond-experience";
import { DiamondFallback } from "./DiamondFallback";

/** A reversible, scroll-controlled finale. Content stays in native document flow. */
export function DiamondExperience({ finaleRef, brandAnchorRef }) {
  const root = useRef(null);
  const visual = useRef(null);
  const canvasHost = useRef(null);
  const runtime = useRef(null);
  const trigger = useRef(null);
  const interaction = useRef({});
  const drag = useRef(null);
  const bounds = useRef(null);
  const motion = useRef({ burst: 0, progress: 0.5, baseYaw: -0.12, yaw: 0, pitch: 0, hoverYaw: 0, hoverPitch: 0 });
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    const element = root.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("@/lib/diamond-experience/create-scene")
          .then(({ createDiamondScene }) => {
            if (!alive) return;
            try {
              runtime.current = createDiamondScene(
                canvasHost.current,
                motion.current,
                (count) => {
                  if (!alive) return;
                  element.dataset.renderer = "webgl";
                  element.dataset.fragments = count;
                },
                () => {
                  if (alive) {
                    element.dataset.renderer = "fallback";
                    interaction.current.paint?.();
                  }
                },
              );
            } catch {
              // The SVG scene has the same controls and scroll sequence when WebGL is unavailable.
              element.dataset.renderer = "fallback";
            }
          })
          .catch(() => {
            if (alive) element.dataset.renderer = "fallback";
          });
      },
      { rootMargin: "140% 0px" },
    );
    observer.observe(element);
    return () => {
      alive = false;
      observer.disconnect();
      runtime.current?.dispose();
      runtime.current = null;
    };
  }, []);

  useGSAP(
    () => {
      const element = root.current;
      const state = motion.current;
      const fallback = element.querySelector(".diamond-experience-fallback");
      const status = element.querySelector("[data-experience-status]");
      const progress = element.querySelector("[data-experience-progress]");
      const paint = () => {
        const phase = state.progress < 0.37 ? 0 : state.progress > 0.7 ? 2 : 1;
        element.dataset.phase = copy.phases[phase].toLowerCase();
        element.dataset.burst = state.burst.toFixed(3);
        element.dataset.progress = state.progress.toFixed(3);
        if (element.dataset.renderer !== "webgl") {
          element.style.setProperty("--diamond-burst", state.burst);
          fallback.style.transform = `rotateX(${(state.pitch + state.hoverPitch) * 57.3}deg) rotateY(${(state.yaw + state.hoverYaw) * 57.3}deg)`;
        }
        progress.style.transform = `scaleX(${state.progress})`;
        const label = `0${phase + 1} / ${copy.phases[phase]}`;
        if (status.textContent !== label) status.textContent = label;
        runtime.current?.render();
      };
      const media = gsap.matchMedia();
      media.add({ all: "all", motion: MOTION_OK, tall: "(min-height: 500px)" }, (context) => {
        const animated = context.conditions.motion;
        const scroll = animated && context.conditions.tall;
        let refreshFrame = 0;
        Object.assign(state, {
          burst: scroll ? 1 : 0,
          progress: scroll ? 0 : 0.5,
          baseYaw: -0.12,
          hoverPitch: 0,
          hoverYaw: 0,
        });
        paint();
        if (scroll) {
          element.dataset.scroll = "true";
          const timeline = gsap.timeline({
            defaults: { ease: "power2.inOut" },
            onUpdate: paint,
            scrollTrigger: {
              id: "diamond-experience",
              trigger: element,
              start: "top top",
              end: "bottom bottom",
              scrub: 1.1,
              invalidateOnRefresh: true,
              // A refresh can restore timeline values with onUpdate suppressed.
              // Repaint after that restore so chapter labels and the canvas agree.
              onRefresh: () => {
                cancelAnimationFrame(refreshFrame);
                refreshFrame = requestAnimationFrame(paint);
              },
            },
          });
          timeline
            .addLabel("scatter", 0)
            .to(state, { progress: 1, duration: 3.1, ease: "none" }, 0)
            .to(state, { burst: 0, duration: 1.25 }, 0.08)
            .to(state, { baseYaw: 0.08, duration: 1.95, ease: "none" }, 0)
            .addLabel("gather", 1.6)
            .addLabel("radiate", 2.1)
            .to(state, { burst: 1, baseYaw: 0.2, duration: 1 }, "radiate");
          trigger.current = timeline.scrollTrigger;
        }
        const quick = (property) =>
          animated
            ? gsap.quickTo(state, property, {
                duration: property.startsWith("hover") ? 0.8 : 0.65,
                ease: "power3.out",
                onUpdate: paint,
              })
            : (value) => {
                state[property] = value;
                paint();
              };
        interaction.current = {
          yaw: quick("yaw"),
          pitch: quick("pitch"),
          hoverYaw: quick("hoverYaw"),
          hoverPitch: quick("hoverPitch"),
          paint,
        };
        return () => {
          cancelAnimationFrame(refreshFrame);
          delete element.dataset.scroll;
          trigger.current = null;
          interaction.current = {};
        };
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [pathname], revertOnUpdate: true },
  );

  function seek(phase) {
    const target = [0.025, 0.52, 0.965][phase];
    if (trigger.current) {
      const top = trigger.current.start + (trigger.current.end - trigger.current.start) * target;
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(top, { duration: 1.35, easing: (value) => 1 - Math.pow(1 - value, 3) });
      else window.scrollTo({ top, behavior: "smooth" });
    } else {
      motion.current.burst = phase === 1 ? 0 : 1;
      motion.current.progress = target;
      interaction.current.paint?.();
    }
  }
  function resetView() {
    interaction.current.yaw?.(0);
    interaction.current.pitch?.(0);
    interaction.current.hoverYaw?.(0);
    interaction.current.hoverPitch?.(0);
  }
  function release(event) {
    if (drag.current?.id !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    drag.current = null;
    delete root.current.dataset.dragging;
  }

  return (
    <section
      ref={(element) => {
        root.current = element;
        if (finaleRef) finaleRef.current = element;
      }}
      id="diamond-experience"
      className="diamond-experience on-wine"
      aria-labelledby="diamond-experience-heading"
      data-renderer="fallback"
    >
      <div className="diamond-experience-stage">
        <header className="diamond-experience-top">
          <p>
            <Sparkles size={14} aria-hidden="true" /> {copy.eyebrow}
          </p>
          <button type="button" className="diamond-view-reset" onClick={resetView}>
            <RotateCcw size={15} aria-hidden="true" /> Reset view
          </button>
        </header>
        <div className="diamond-experience-masthead" data-experience-brand>
          <h2
            ref={brandAnchorRef}
            id="diamond-experience-heading"
            aria-label={`${copy.brand} — the diamond experience`}
          />
        </div>
        <div
          ref={visual}
          className="diamond-experience-visual"
          role="group"
          tabIndex={0}
          aria-label="Rotate the diamond and stones"
          aria-describedby="diamond-interaction-help"
          onKeyDown={(event) => {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
              event.preventDefault();
              const state = motion.current;
              if (event.key === "ArrowLeft" || event.key === "ArrowRight")
                interaction.current.yaw?.(state.yaw + (event.key === "ArrowRight" ? 0.26 : -0.26));
              else
                interaction.current.pitch?.(
                  gsap.utils.clamp(-0.65, 0.65, state.pitch + (event.key === "ArrowDown" ? 0.14 : -0.14)),
                );
            } else if (["Home", "End", " "].includes(event.key)) {
              event.preventDefault();
              seek(event.key === "Home" ? 0 : event.key === "End" ? 2 : motion.current.burst > 0.5 ? 1 : 0);
            } else if (event.key.toLowerCase() === "r") resetView();
          }}
          onPointerEnter={(event) => {
            bounds.current = event.currentTarget.getBoundingClientRect();
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            bounds.current = event.currentTarget.getBoundingClientRect();
            drag.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              yaw: motion.current.yaw,
              pitch: motion.current.pitch,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
            root.current.dataset.dragging = "true";
            interaction.current.hoverYaw?.(0);
            interaction.current.hoverPitch?.(0);
          }}
          onPointerMove={(event) => {
            const current = drag.current,
              box = bounds.current;
            if (current?.id === event.pointerId) {
              interaction.current.yaw?.(current.yaw + (event.clientX - current.x) * 0.007);
              if (event.pointerType !== "touch")
                interaction.current.pitch?.(
                  gsap.utils.clamp(-0.65, 0.65, current.pitch + (event.clientY - current.y) * 0.003),
                );
            } else if (box && event.pointerType !== "touch") {
              interaction.current.hoverYaw?.(((event.clientX - box.left) / box.width - 0.5) * 0.3);
              interaction.current.hoverPitch?.(((event.clientY - box.top) / box.height - 0.5) * 0.16);
            }
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onLostPointerCapture={() => {
            drag.current = null;
            delete root.current.dataset.dragging;
          }}
          onPointerLeave={() => {
            if (!drag.current) {
              interaction.current.hoverYaw?.(0);
              interaction.current.hoverPitch?.(0);
              bounds.current = null;
            }
          }}
        >
          <DiamondFallback />
          <div ref={canvasHost} className="diamond-experience-canvas" />
        </div>
        <div className="diamond-experience-bottom">
          <div className="diamond-experience-note">
            <p>1916 — 2026</p>
            <p>{copy.description}</p>
            <span id="diamond-interaction-help">
              <MoveHorizontal size={14} aria-hidden="true" />
              <span>
                Drag or use arrow keys to turn. <span className="diamond-scroll-hint">Scroll to gather.</span>
                <span className="sr-only">
                  Space gathers or scatters. Home and End explore the journey. R resets the view.
                </span>
              </span>
            </span>
          </div>
          <p className="diamond-experience-status" data-experience-status aria-live="polite">
            02 / Gather
          </p>
          <a className="diamond-experience-continue" href="#house-footer" aria-label="Continue to footer">
            <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="diamond-experience-progress" aria-hidden="true">
          <span data-experience-progress />
        </div>
      </div>
    </section>
  );
}
