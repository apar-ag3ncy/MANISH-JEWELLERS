"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, HOVER_OK } from "@/lib/gsap";
import { CARAT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cutStudio, homeBottomCutStudio } from "@/data/content";
import type { CutId } from "@/types";
import { SectionHead } from "@/components/ui/SectionHead";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { GemGroup } from "@/components/ui/Gem";

/**
 * The Cut Studio — the second pinned sequence on /home.
 *
 * The stage is held for 140% of a viewport while the five cuts step through it. The
 * step is deliberately NOT scrubbed: the existing 0.9s expo.out crossfade IS the
 * shutter, and scrubbing it would turn the change to mush. The five hairline dashes
 * under the stage are the visible progress, and they are also the control.
 *
 * The moment the reader touches a cut name, a dash or the slider, `locked` is set and
 * scroll stops driving the state — the pin remains, but the reader has taken over.
 *
 * The pin is gated to lg and up: below that the section is one tall column and pinning
 * it would trap the viewer. Under reduced motion nothing is pinned and nothing steps;
 * every cut stays reachable by button and the slider is unaffected.
 */

/**
 * Pin/step guard. Deliberately lg, not md — below lg the section is one tall column —
 * and deliberately height-aware: the studio is only pinned where the whole
 * composition fits one screen, so the pin can never clip the controls.
 */
const STEP_OK = "(prefers-reduced-motion: no-preference) and (min-width: 1024px) and (min-height: 860px)";

/** Visual radius (in stage units) for a carat weight. 1 ct ≈ 0.62 of the stage. */
function scaleFor(carat: number) {
  return 0.62 * Math.cbrt(carat);
}

export function CutStudio() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const [cutId, setCutId] = useState<CutId>(cutStudio.cuts[0].id);
  const [carat, setCarat] = useState<number>(CARAT.initial);

  const cut = useMemo(() => cutStudio.cuts.find((c) => c.id === cutId) ?? cutStudio.cuts[0], [cutId]);
  const mm = (cut.mmFactor * Math.cbrt(carat)).toFixed(1);

  /** Any deliberate input hands control to the reader for the rest of the visit. */
  function take(id: CutId) {
    locked.current = true;
    setCutId(id);
  }

  /* PINNED STEP-THROUGH — the stage is held, the cuts advance with the scroll. */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const media = gsap.matchMedia();

      media.add(STEP_OK, () => {
        const cuts = cutStudio.cuts;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: "+=140%",
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (locked.current) return;
            const i = Math.min(cuts.length - 1, Math.max(0, Math.floor(self.progress * cuts.length)));
            const next = cuts[i].id;
            setCutId((prev) => (prev === next ? prev : next));
          },
        });
        return () => st.kill();
      });
    },
    { scope: ref },
  );

  /* the readouts below the stage arrive together, on the section's own trigger:
     a trigger nested inside a pinned element can be stranded mid-pin */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const details = Array.from(el.querySelectorAll<HTMLElement>("[data-detail]"));
      if (!details.length) return;

      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        gsap.set(details, { y: 20, opacity: 0 });
        gsap.to(details, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 70%", once: true },
        });
      });
    },
    { scope: ref },
  );

  /* switch cut: crossfade + settle — this is the shutter */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const groups = el.querySelectorAll<SVGGElement>("[data-cut]");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      groups.forEach((g) => {
        const active = g.dataset.cut === cutId;
        if (reduced) {
          gsap.set(g, { opacity: active ? 1 : 0, scale: 1, transformOrigin: "50% 50%" });
          return;
        }
        if (active) {
          gsap.fromTo(
            g,
            { opacity: 0, scale: 1.08 },
            { opacity: 1, scale: 1, duration: 0.9, ease: "expo.out", transformOrigin: "50% 50%", overwrite: true },
          );
        } else {
          gsap.to(g, {
            opacity: 0,
            scale: 0.94,
            duration: 0.45,
            ease: "power3.out",
            transformOrigin: "50% 50%",
            overwrite: true,
          });
        }
      });
    },
    { scope: ref, dependencies: [cutId] },
  );

  /* carat: scale the whole stone */
  useGSAP(
    () => {
      const sizer = ref.current?.querySelector("[data-sizer]");
      if (!sizer) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const s = scaleFor(carat);
      if (reduced) gsap.set(sizer, { scale: s, transformOrigin: "50% 50%" });
      else gsap.to(sizer, { scale: s, duration: 0.7, ease: "power3.out", transformOrigin: "50% 50%", overwrite: true });
    },
    { scope: ref, dependencies: [carat] },
  );

  /* ambient: slow rotation, specular sweep, cursor tilt */
  useGSAP(
    () => {
      const el = ref.current;
      const stage = stageRef.current;
      if (!el || !stage) return;
      const media = gsap.matchMedia();

      media.add(MOTION_OK, () => {
        const rotor = el.querySelector("[data-rotor]");
        const grad = el.querySelector("[data-grad]");
        gsap.to(rotor, { rotation: 360, duration: 70, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
        gsap.fromTo(
          grad,
          { attr: { x1: -1, x2: 0 } },
          { attr: { x1: 1, x2: 2 }, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 },
        );
      });

      media.add(HOVER_OK, () => {
        const tilt = stage.querySelector("[data-tilt]");
        if (!tilt) return;
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3.out" });
        const move = (e: MouseEvent) => {
          const r = stage.getBoundingClientRect();
          const dx = (e.clientX - r.left) / r.width - 0.5;
          const dy = (e.clientY - r.top) / r.height - 0.5;
          rx(-dy * 22);
          ry(dx * 22);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        stage.addEventListener("mousemove", move);
        stage.addEventListener("mouseleave", leave);
        return () => {
          stage.removeEventListener("mousemove", move);
          stage.removeEventListener("mouseleave", leave);
        };
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id={cutStudio.id}
      className="scroll-mt-20 bg-white py-[clamp(96px,12vw,200px)] text-ink lg:flex lg:min-h-svh lg:items-center lg:pt-[clamp(80px,10svh,116px)] lg:pb-[clamp(32px,4.5svh,60px)]"
    >
      <div className="container-x grid w-full grid-cols-12 gap-x-6 gap-y-12">
        {/* Controls */}
        <div className="col-span-12 lg:col-span-5">
          <SectionHead
            eyebrow={cutStudio.eyebrow}
            heading={cutStudio.heading}
            lede={homeBottomCutStudio.intro}
            headingClassName="cut-studio-heading max-w-[18ch]"
          />

          <Reveal delay={0.1} className="mt-10 lg:mt-8">
            <ul role="list" className="border-t border-cream-deep">
              {cutStudio.cuts.map((c) => {
                const active = c.id === cutId;
                return (
                  <li key={c.id} className="border-b border-cream-deep">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => take(c.id)}
                      className="group flex w-full items-center justify-between gap-6 py-4 text-left transition-colors duration-300 hover:text-wine lg:py-3"
                    >
                      <span className="flex items-center gap-4">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-[background-color,transform] duration-500 ease-[var(--ease-lux)]",
                            active ? "scale-100 bg-wine" : "scale-75 bg-cream-deep group-hover:bg-wine-soft",
                          )}
                        />
                        <span
                          className={cn(
                            "display-m transition-colors duration-300",
                            active ? "text-wine" : "text-ink/55 group-hover:text-wine",
                          )}
                        >
                          {c.name}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "caption tabular transition-colors duration-300",
                          active ? "text-ink-muted" : "text-ink-muted/60",
                        )}
                      >
                        {c.facets} {cutStudio.facetsLabel.toLowerCase()}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 lg:mt-6">
              <div className="flex items-baseline justify-between">
                <label htmlFor="carat" className="eyebrow text-wine-soft">
                  {cutStudio.caratLabel}
                </label>
                <output htmlFor="carat" className="font-display text-[1.5rem] leading-none text-wine tabular">
                  {carat.toFixed(2)} <span className="font-body caption text-ink-muted">{cutStudio.caratUnit}</span>
                </output>
              </div>
              <input
                id="carat"
                type="range"
                className="mj-range mt-4"
                min={CARAT.min}
                max={CARAT.max}
                step={CARAT.step}
                value={carat}
                onChange={(e) => {
                  locked.current = true;
                  setCarat(Number(e.target.value));
                }}
                aria-valuetext={`${carat.toFixed(2)} ${cutStudio.caratUnit}`}
              />
            </div>
          </Reveal>
        </div>

        {/* Stage */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <Reveal>
            <div
              ref={stageRef}
              className="on-wine relative mx-auto aspect-square w-full overflow-hidden bg-wine text-cream [perspective:1400px] lg:h-[min(40svh,460px)] lg:w-[min(40svh,460px)]"
            >
              <div data-tilt className="absolute inset-0 will-change-transform [transform-style:preserve-3d]">
                <svg viewBox="-1.2 -1.2 2.4 2.4" className="block h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient data-grad id="studio-specular" x1="-1" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="var(--color-cream)" stopOpacity="0" />
                      <stop offset="0.5" stopColor="var(--color-cream)" stopOpacity="0.2" />
                      <stop offset="1" stopColor="var(--color-cream)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g data-rotor>
                    <g data-sizer transform={`scale(${scaleFor(CARAT.initial)})`}>
                      {cutStudio.cuts.map((c) => (
                        <GemGroup
                          key={c.id}
                          data-cut={c.id}
                          cut={c.id}
                          fill="url(#studio-specular)"
                          strokeWidth={0.009}
                          opacity={c.id === cutStudio.cuts[0].id ? 1 : 0}
                        />
                      ))}
                    </g>
                  </g>
                </svg>
              </div>

              {/* stage captions */}
              <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-end justify-between caption text-cream/70">
                <span className="tabular" aria-live="polite">
                  {cut.name} · {carat.toFixed(2)} {cutStudio.caratUnit}
                </span>
                <span className="hidden md:[@media(hover:hover)]:inline">{cutStudio.hint}</span>
              </div>
            </div>

            {/* progress: five hairline dashes, also the control */}
            <div
              className="mx-auto mt-5 flex items-center gap-3 lg:w-[min(40svh,460px)]"
              role="group"
              aria-label={homeBottomCutStudio.progressLabel}
            >
              {cutStudio.cuts.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-label={`${homeBottomCutStudio.goTo}: ${c.name}`}
                  aria-current={c.id === cutId ? "true" : undefined}
                  onClick={() => take(c.id)}
                  className="group flex h-8 items-center"
                >
                  <span
                    className={cn(
                      "block h-px transition-[width,background-color] duration-700 ease-[var(--ease-lux)]",
                      c.id === cutId ? "w-16 bg-wine" : "w-8 bg-cream-deep group-hover:bg-wine-soft",
                    )}
                  />
                </button>
              ))}
            </div>
          </Reveal>

          <div data-detail className="mt-4 grid grid-cols-3 gap-6 border-t border-cream-deep pt-5">
            <Stat label={cutStudio.facetsLabel} value={String(cut.facets)} />
            <Stat label={cutStudio.ratioLabel} value={cut.ratio} />
            <Stat label={cutStudio.sizeLabel} value={`${mm} mm`} />
          </div>

          <div data-detail className="mt-7 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="eyebrow font-body text-wine-soft">{cutStudio.bestForLabel}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink">{cut.bestFor}</p>
            </div>
            <div>
              <h3 className="eyebrow font-body text-wine-soft">{cutStudio.noteLabel}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink">{cut.note}</p>
            </div>
          </div>

          <div data-detail className="mt-8">
            <Button href={cutStudio.cta.href} variant="outline">
              {cutStudio.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow text-wine-soft">{label}</div>
      <div
        className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none text-ink tabular"
        aria-live="polite"
      >
        {value}
      </div>
    </div>
  );
}
