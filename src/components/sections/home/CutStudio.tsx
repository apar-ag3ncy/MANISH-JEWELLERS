"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK, HOVER_OK } from "@/lib/gsap";
import { CARAT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { cutStudio } from "@/data/content";
import type { CutId } from "@/types";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { GemGroup } from "@/components/ui/Gem";

/** Visual radius (in stage units) for a carat weight. 1 ct ≈ 0.62 of the stage. */
function scaleFor(carat: number) {
  return 0.62 * Math.cbrt(carat);
}

/**
 * The Cut Studio — interactive. Pick a cut, slide the carat, tilt the stone
 * with the cursor. All state lives here; copy lives in content.ts.
 */
export function CutStudio() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [cutId, setCutId] = useState<CutId>(cutStudio.cuts[0].id);
  const [carat, setCarat] = useState<number>(CARAT.initial);

  const cut = useMemo(() => cutStudio.cuts.find((c) => c.id === cutId) ?? cutStudio.cuts[0], [cutId]);
  const mm = (cut.mmFactor * Math.cbrt(carat)).toFixed(1);

  /* switch cut: crossfade + settle */
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
      const mq = gsap.matchMedia();

      mq.add(MOTION_OK, () => {
        const rotor = el.querySelector("[data-rotor]");
        const grad = el.querySelector("[data-grad]");
        gsap.to(rotor, { rotation: 360, duration: 70, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
        gsap.fromTo(
          grad,
          { attr: { x1: -1, x2: 0 } },
          { attr: { x1: 1, x2: 2 }, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 },
        );
      });

      mq.add(HOVER_OK, () => {
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
    <section ref={ref} id={cutStudio.id} className="scroll-mt-20 bg-white section-y text-ink">
      <div className="container-x grid grid-cols-12 gap-x-6 gap-y-12">
        {/* Controls */}
        <div className="col-span-12 lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-wine-soft">{cutStudio.eyebrow}</p>
            <h2 className="mt-6 max-w-[14ch] display-l">{cutStudio.heading}</h2>
            <p className="mt-6 body-copy text-ink-muted">{cutStudio.intro}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <ul role="list" className="border-t border-cream-deep">
              {cutStudio.cuts.map((c) => {
                const active = c.id === cutId;
                return (
                  <li key={c.id} className="border-b border-cream-deep">
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCutId(c.id)}
                      className="group flex w-full items-center justify-between gap-6 py-4 text-left transition-colors duration-300 hover:text-wine"
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
                          className={cn("display-m transition-colors duration-300", active ? "text-wine" : "text-ink")}
                        >
                          {c.name}
                        </span>
                      </span>
                      <span className="caption text-ink-muted tabular">
                        {c.facets} {cutStudio.facetsLabel.toLowerCase()}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10">
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
                onChange={(e) => setCarat(Number(e.target.value))}
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
              className="on-wine relative aspect-square w-full overflow-hidden bg-wine text-cream [perspective:1400px]"
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
                <span className="hidden [@media(hover:hover)]:inline">{cutStudio.hint}</span>
              </div>
              <div className="pointer-events-none absolute top-5 left-6 eyebrow text-cream/60">{cutStudio.eyebrow}</div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="mt-8 grid grid-cols-3 gap-6 border-t border-cream-deep pt-6">
            <Stat label={cutStudio.facetsLabel} value={String(cut.facets)} />
            <Stat label={cutStudio.ratioLabel} value={cut.ratio} />
            <Stat label={cutStudio.sizeLabel} value={`${mm} mm`} />
          </Reveal>

          <Reveal delay={0.15} className="mt-8 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="eyebrow font-body text-wine-soft">{cutStudio.bestForLabel}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink">{cut.bestFor}</p>
            </div>
            <div>
              <h3 className="eyebrow font-body text-wine-soft">{cutStudio.noteLabel}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-ink">{cut.note}</p>
            </div>
          </Reveal>

          <Reveal delay={0.2} className="mt-10">
            <Button href={cutStudio.cta.href} variant="outline">
              {cutStudio.cta.label}
            </Button>
          </Reveal>
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
