"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Layers3, RotateCw } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { diamondCuts } from "@/data/diamond-guide";
import { Gem } from "@/components/ui/Gem";
import { FacetStone } from "./FacetStone";

const smooth = (a, b, value) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function DiamondCutStudio({ embedded = false }) {
  const root = useRef(null);
  const host = useRef(null);
  const fallbackStone = useRef(null);
  const scene = useRef(null);
  const motion = useRef({ cut: "round", scatter: 1, yaw: 0, pitch: 0, facets: 0, light: 0 });
  const manual = useRef(false);
  const reduced = useRef(false);
  const sequence = useRef(null);
  const gesture = useRef(null);
  const turning = useRef({});
  const selected = useRef(0);
  const phaseRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const [ready, setReady] = useState(false);
  const [facets, setFacets] = useState(false);
  const [fallback, setFallback] = useState(false);
  const cut = diamondCuts[index];
  const Heading = embedded ? "h2" : "h1";
  const CutHeading = embedded ? "h3" : "h2";

  const stopDrag = () => {
    gesture.current = null;
    turning.current.yaw?.tween.pause();
    turning.current.pitch?.tween.pause();
  };

  const render = () => {
    scene.current?.render();
    if (fallbackStone.current) fallbackStone.current.style.transform = `rotate(${motion.current.yaw}rad)`;
    const value =
      motion.current.scatter > 0.96 ? 0 : motion.current.scatter > 0.012 ? 1 : motion.current.light > 0.2 ? 2 : 1;
    if (phaseRef.current !== value) {
      phaseRef.current = value;
      setPhase(value);
    }
  };

  const { contextSafe } = useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add({ motion: MOTION_OK, reduced: "(prefers-reduced-motion: reduce)" }, (context) => {
        reduced.current = context.conditions.reduced;
        motion.current.scatter = manual.current || reduced.current ? 0 : 1;
        if (reduced.current) {
          motion.current.light = 0;
          render();
        } else {
          turning.current = {
            yaw: gsap.quickTo(motion.current, "yaw", { duration: 0.18, ease: "power3.out", onUpdate: render }),
            pitch: gsap.quickTo(motion.current, "pitch", { duration: 0.18, ease: "power3.out", onUpdate: render }),
          };
          const story = { progress: 0 };
          gsap.to(story, {
            progress: 1,
            ease: "none",
            duration: 1,
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
            onUpdate: () => {
              if (!manual.current) {
                motion.current.scatter = 1 - smooth(0.06, 0.53, story.progress);
                motion.current.facets = smooth(0.5, 0.65, story.progress) * (1 - smooth(0.7, 0.8, story.progress));
                motion.current.light = smooth(0.72, 0.94, story.progress);
              }
              root.current.style.setProperty("--cut-progress", story.progress);
              render();
            },
          });
        }
        return () => {
          sequence.current?.kill();
          turning.current = {};
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );

  useEffect(() => {
    let disposed = false;
    let started = false;
    let observer;
    setEnhanced(true);
    const load = () => {
      if (disposed || started) return;
      started = true;
      observer?.disconnect();
      import("@/lib/diamond-guide/create-cut-scene")
        .then(({ createCutScene }) => {
          if (disposed) return;
          try {
            scene.current = createCutScene(
              host.current,
              motion.current,
              () => {
                if (!disposed) {
                  setReady(true);
                  setFallback(false);
                }
              },
              () => {
                if (!disposed) {
                  setReady(false);
                  setFallback(true);
                }
              },
            );
          } catch {
            if (!disposed) setFallback(true);
          }
        })
        .catch(() => {
          if (!disposed) setFallback(true);
        });
    };
    // The home studio is far below the opening. Prepare WebGL only as it approaches view.
    if (embedded) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) load();
        },
        { rootMargin: "900px 0px" },
      );
      observer.observe(root.current);
    } else load();
    return () => {
      disposed = true;
      observer?.disconnect();
      scene.current?.dispose();
      scene.current = null;
    };
  }, [embedded]);

  const choose = contextSafe((next) => {
    const safe = (next + diamondCuts.length) % diamondCuts.length;
    selected.current = safe;
    setIndex(safe);
    manual.current = true;
    sequence.current?.kill();
    turning.current.yaw?.tween.pause();
    turning.current.pitch?.tween.pause();
    const state = motion.current;
    if (reduced.current) {
      Object.assign(state, { cut: diamondCuts[safe].id, scatter: 0, yaw: 0, pitch: 0, light: 0 });
      render();
      return;
    }
    sequence.current = gsap.timeline({ onUpdate: render });
    sequence.current
      .to(state, {
        scatter: 1,
        light: 0,
        yaw: 0,
        pitch: 0,
        duration: state.scatter > 0.95 ? 0.05 : 0.65,
        ease: "power2.inOut",
      })
      .call(() => {
        state.cut = diamondCuts[safe].id;
      })
      .to(state, { scatter: 0, duration: 1.7, ease: "power2.inOut" });
  });

  const study = contextSafe((next) => {
    manual.current = true;
    sequence.current?.kill();
    turning.current.yaw?.tween.pause();
    turning.current.pitch?.tween.pause();
    const state = motion.current;
    const target = { scatter: next === 0 ? 1 : 0, light: next === 2 ? 1 : 0, yaw: 0, pitch: 0 };
    if (reduced.current) {
      Object.assign(state, target);
      render();
    } else sequence.current = gsap.to(state, { ...target, duration: 1.5, ease: "power2.inOut", onUpdate: render });
  });

  const turn = contextSafe(() => {
    stopDrag();
    manual.current = true;
    sequence.current?.kill();
    if (reduced.current) {
      motion.current.yaw += Math.PI / 2;
      motion.current.scatter = 0;
      render();
    } else
      sequence.current = gsap.to(motion.current, {
        scatter: 0,
        yaw: motion.current.yaw + Math.PI / 2,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: render,
      });
  });
  const toggleFacets = contextSafe(() => {
    manual.current = true;
    setFacets(!facets);
    sequence.current?.kill();
    if (reduced.current) {
      motion.current.scatter = 0;
      motion.current.facets = facets ? 0 : 1;
      render();
    } else {
      sequence.current = gsap
        .timeline({ onUpdate: render })
        .to(motion.current, { scatter: 0, duration: motion.current.scatter > 0.012 ? 1.4 : 0, ease: "power2.inOut" })
        .to(motion.current, { facets: facets ? 0 : 1, duration: 0.6, overwrite: "auto" });
    }
  });

  return (
    <section
      ref={root}
      id="cut-studio"
      className="cut-scroll"
      aria-labelledby="diamond-guide-heading"
      data-phase={phase}
      data-ready={ready}
      data-enhanced={enhanced}
    >
      <div className="cut-sticky on-wine">
        <div ref={host} className="cut-webgl" aria-hidden="true" />
        <div className="cut-fallback" data-visible={!ready}>
          <div
            ref={fallbackStone}
            className="cut-fallback-stone"
            style={{ transform: `rotate(${motion.current.yaw}rad)` }}
          >
            <FacetStone cut={cut.id} name={cut.name} facets={facets} />
          </div>
        </div>
        <div className="cut-vignette" aria-hidden="true" />
        <header className="cut-heading">
          <p className="eyebrow">Manish Jewellers · The diamond guide</p>
          <Heading id="diamond-guide-heading">
            From fragments,
            <br />
            <em>to fascination.</em>
          </Heading>
          <p className="cut-heading-note">Five shapes. A different expression of light.</p>
          {embedded && (
            <a href="/diamond-guide" className="cut-full-guide link-underline">
              Explore the full diamond guide <span aria-hidden="true">↗</span>
            </a>
          )}
        </header>
        <div
          className="cut-touch-surface"
          role="group"
          tabIndex={0}
          aria-label="Interactive diamond cutting scene"
          aria-describedby="cut-gesture-help"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              choose(selected.current + (event.key === "ArrowRight" ? 1 : -1));
            }
          }}
          onPointerDown={(event) => {
            if (event.button !== 0 || !event.isPrimary) return;
            stopDrag();
            gesture.current = {
              pointerId: event.pointerId,
              x: event.clientX,
              y: event.clientY,
              yaw: motion.current.yaw,
              pitch: motion.current.pitch,
              type: event.pointerType,
            };
            if (event.pointerType === "mouse") event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            const start = gesture.current;
            if (!start || start.pointerId !== event.pointerId || start.type !== "mouse") return;
            if (!(event.buttons & 1)) {
              stopDrag();
              return;
            }
            if (motion.current.scatter > 0.012) return;
            const dx = event.clientX - start.x,
              dy = event.clientY - start.y;
            if (Math.abs(dx) + Math.abs(dy) < 5) return;
            manual.current = true;
            sequence.current?.kill();
            const yaw = start.yaw + dx * 0.009;
            const pitch = Math.max(-0.32, Math.min(0.48, start.pitch + dy * 0.005));
            if (reduced.current) {
              Object.assign(motion.current, { yaw, pitch });
              render();
            } else {
              turning.current.yaw?.(yaw);
              turning.current.pitch?.(pitch);
            }
          }}
          onPointerUp={(event) => {
            const start = gesture.current;
            if (start?.pointerId !== event.pointerId) return;
            stopDrag();
            if (!start || start.type === "mouse") return;
            const dx = event.clientX - start.x,
              dy = event.clientY - start.y;
            if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(selected.current + (dx < 0 ? 1 : -1));
          }}
          onPointerCancel={stopDrag}
          onLostPointerCapture={stopDrag}
        >
          <span className="sr-only">
            Choose a shape below to assemble the fragments. Use left and right arrow keys to change shapes.
          </span>
        </div>
        <div className="cut-selected" aria-live="polite" aria-atomic="true">
          <span className="eyebrow">
            0{index + 1} / 05 · {cut.shape}
          </span>
          <CutHeading>{cut.name}</CutHeading>
          <p>{cut.style}</p>
        </div>
        <div className="cut-toolbar">
          <button type="button" className="glass-control" aria-label="Turn the diamond" onClick={turn}>
            <RotateCw size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="glass-control"
            aria-label="Show facet detail"
            aria-pressed={facets}
            onClick={toggleFacets}
          >
            <Layers3 size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="cut-shapes" role="group" aria-label="Choose a diamond shape">
          {diamondCuts.map((item, i) => (
            <button
              type="button"
              className="cut-shape"
              key={item.id}
              aria-pressed={i === index}
              onClick={() => choose(i)}
            >
              <Gem cut={item.id} strokeWidth={0.016} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="cut-studies" role="group" aria-label="Explore diamond formation">
          {["Fragments", "The cut", "Light path"].map((label, i) => (
            <button key={label} type="button" onClick={() => study(i)} aria-pressed={phase === i}>
              <span>0{i + 1}</span>
              {label}
              <i aria-hidden="true" />
            </button>
          ))}
        </div>
        <p id="cut-gesture-help" className="cut-gesture-help">
          <span className="cut-desktop-help">Click and drag to turn · ← → change shape</span>
          <span className="cut-mobile-help">Swipe to change shape</span>
          <span>Scroll to form & follow the light</span>
        </p>
        <a
          className="cut-next"
          href={embedded ? "#diamond-experience" : "#light-story"}
          aria-label={embedded ? "Continue to the diamond burst" : "Continue to the anatomy of light"}
        >
          <ArrowDown size={21} aria-hidden="true" />
        </a>
        <div className="cut-progress" aria-hidden="true">
          <i />
        </div>
        <p className="cut-model-note">
          {fallback ? "Illustrated view · " : ""}A visual study of shape & light. Not a cutting simulation.
        </p>
        <noscript>
          <p className="cut-nojs">
            {embedded
              ? "Explore all five shapes in the full diamond guide."
              : "Explore all five illustrated shapes below."}
          </p>
        </noscript>
      </div>
    </section>
  );
}
