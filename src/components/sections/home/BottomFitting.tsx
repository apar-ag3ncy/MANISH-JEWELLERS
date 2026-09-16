"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { fittingRoom } from "@/data/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";

/**
 * The fitting room — motion that carries information.
 *
 * Every movement here is a consequence of a number, not decoration:
 *  • the photograph's scale IS the measurement — width = value / stageMm of the stage,
 *    so a 68 mm kada is drawn visibly wider than a 50 mm one against the same rule;
 *  • the rule's ticks are generated from the piece's own range, and the active span
 *    grows to the chosen value;
 *  • the readouts roll to their new figure, and the circumference is computed (pi x d),
 *    never typed by hand.
 *
 * Deliberately NOT scroll-driven: /home already holds three pinned sequences and the
 * research is plain that a fourth would cost more than it earns. This is an in-place
 * control the reader drives.
 *
 * REDUCED MOTION: every tween collapses to a set() — the scale, the rule and the
 * readouts are correct at all times, they simply arrive without travel. With no
 * JavaScript the first piece renders at its default measurement, fully legible.
 */

/** Candidate label steps, in mm. The rule picks the smallest that yields six labels or fewer. */
const NICE_STEPS = [1, 2, 5, 10, 20, 25, 50, 100];
const MAX_LABELS = 6;

function tickStep(min: number, max: number) {
  return NICE_STEPS.find((step) => (max - min) / step <= MAX_LABELS) ?? NICE_STEPS[NICE_STEPS.length - 1];
}

/** The ids are literal because the data is `as const`; keep the state honest to them. */
type PieceId = (typeof fittingRoom.pieces)[number]["id"];

export function BottomFitting() {
  const ref = useRef<HTMLElement>(null);
  const [pieceId, setPieceId] = useState<PieceId>(fittingRoom.pieces[0].id);
  const piece = useMemo(() => fittingRoom.pieces.find((p) => p.id === pieceId) ?? fittingRoom.pieces[0], [pieceId]);
  const [mm, setMm] = useState<number>(piece.value);

  /** Geometry, computed — never authored. */
  const across = mm;
  const circumference = Math.PI * mm;
  const scale = mm / piece.stageMm;

  /** Labels across the piece's own range, at a step that keeps them legible. */
  const ticks = useMemo(() => {
    const step = tickStep(piece.min, piece.max);
    const first = Math.ceil(piece.min / step) * step;
    const out: number[] = [];
    for (let v = first; v <= piece.max; v += step) out.push(v);
    return out;
  }, [piece]);

  function choose(id: PieceId) {
    const next = fittingRoom.pieces.find((p) => p.id === id);
    if (!next) return;
    setPieceId(id);
    setMm(next.value);
  }

  /* the plate is drawn to the measurement; the rule's fill follows it */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const plate = el.querySelector<HTMLElement>("[data-plate]");
      const fill = el.querySelector<HTMLElement>("[data-rule-fill]");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const span = (mm - piece.min) / (piece.max - piece.min);

      const stage = el.querySelector<HTMLElement>("[data-stage]");
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]", el);
      /* one 10 mm square of the graticule, as a share of the stage */
      const grid = `${(10 / piece.stageMm) * 100}%`;

      if (reduced) {
        gsap.set(stage, { "--mj-grid": grid });
        gsap.set(plate, { scale, transformOrigin: "50% 50%" });
        gsap.set(fill, { scaleX: span, transformOrigin: "left center" });
        gsap.set(dots, { scale: 1 / scale, transformOrigin: "50% 50%" });
        return;
      }
      gsap.set(stage, { "--mj-grid": grid });
      gsap.to(plate, { scale, duration: 0.7, ease: "power3.out", transformOrigin: "50% 50%", overwrite: true });
      gsap.to(fill, {
        scaleX: span,
        duration: 0.7,
        ease: "power3.out",
        transformOrigin: "left center",
        overwrite: true,
      });
      /* the markers ride the plate but must not shrink with it */
      gsap.to(dots, {
        scale: 1 / scale,
        duration: 0.7,
        ease: "power3.out",
        transformOrigin: "50% 50%",
        overwrite: true,
      });
    },
    { scope: ref, dependencies: [mm, piece, scale] },
  );

  /* the figures roll to their new value */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.querySelectorAll<HTMLElement>("[data-figure]").forEach((node) => {
        const to = Number(node.dataset.figure);
        const from = Number(node.textContent?.replace(/[^\d.]/g, "")) || to;
        if (reduced || from === to) {
          node.textContent = to.toFixed(1);
          return;
        }
        const obj = { v: from };
        gsap.to(obj, {
          v: to,
          duration: 0.5,
          ease: "power2.out",
          overwrite: true,
          onUpdate: () => {
            node.textContent = obj.v.toFixed(1);
          },
        });
      });
    },
    { scope: ref, dependencies: [mm, piece] },
  );

  /* switching piece: the plate settles, the hotspots arrive in sequence */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        const plate = el.querySelector("[data-plate]");
        const spots = gsap.utils.toArray<HTMLElement>("[data-spot]", el);
        gsap.fromTo(plate, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out", overwrite: "auto" });
        if (spots.length) {
          gsap.fromTo(
            spots,
            { opacity: 0, scale: 0.6 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "expo.out",
              stagger: 0.09,
              delay: 0.25,
              transformOrigin: "50% 50%",
              overwrite: "auto",
            },
          );
        }
      });
    },
    { scope: ref, dependencies: [pieceId] },
  );

  return (
    <section id={fittingRoom.id} ref={ref} className="scroll-mt-20 bg-white section-y text-ink">
      <div className="container-x grid grid-cols-12 gap-x-6 gap-y-12">
        {/* the controls */}
        <div className="col-span-12 lg:col-span-5">
          <SectionHead
            eyebrow={fittingRoom.eyebrow}
            heading={fittingRoom.heading}
            lede={fittingRoom.intro}
            headingClassName="max-w-[14ch]"
          />

          <ul role="list" className="mt-12 border-t border-cream-deep">
            {fittingRoom.pieces.map((p) => {
              const active = p.id === piece.id;
              return (
                <li key={p.id} className="border-b border-cream-deep">
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => choose(p.id)}
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
                        {p.name}
                      </span>
                    </span>
                    <span className="shrink-0 caption whitespace-nowrap text-ink-muted">{p.measure}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-10">
            <div className="flex items-baseline justify-between">
              <label htmlFor="fitting-mm" className="eyebrow text-wine-soft">
                {fittingRoom.sizeLabel}
              </label>
              <output htmlFor="fitting-mm" className="font-display text-[1.5rem] leading-none text-wine tabular">
                <span data-figure={across}>{across.toFixed(1)}</span>{" "}
                <span className="font-body caption text-ink-muted">mm</span>
              </output>
            </div>
            <input
              id="fitting-mm"
              type="range"
              className="mj-range mt-4"
              min={piece.min}
              max={piece.max}
              step={piece.step}
              value={mm}
              onChange={(e) => setMm(Number(e.target.value))}
              aria-valuetext={`${across.toFixed(1)} millimetres`}
            />

            <dl className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <dt className="eyebrow text-wine-soft">{fittingRoom.acrossLabel}</dt>
                <dd className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none text-ink tabular">
                  <span data-figure={across}>{across.toFixed(1)}</span> mm
                </dd>
              </div>
              <div>
                <dt className="eyebrow text-wine-soft">{fittingRoom.circumferenceLabel}</dt>
                <dd className="mt-2 font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none text-ink tabular">
                  <span data-figure={circumference}>{circumference.toFixed(1)}</span> mm
                </dd>
              </div>
            </dl>

            <p className="mt-8 max-w-[46ch] caption text-ink-muted">{fittingRoom.note}</p>
            <div className="mt-8">
              <Button href={fittingRoom.cta.href} variant="outline">
                {fittingRoom.cta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* the stage: the photograph drawn to its measurement, over the rule */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <div data-stage className="mj-graticule relative aspect-square w-full overflow-hidden bg-cream-soft">
            <div className="absolute inset-0 grid place-items-center">
              <div data-plate className="relative aspect-square w-full will-change-transform">
                <Image
                  key={piece.src}
                  src={piece.src}
                  alt={piece.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className={cn("object-contain", piece.focus)}
                />
                {piece.hotspots.map((spot, i) => (
                  <span
                    key={spot.label}
                    data-spot
                    aria-hidden="true"
                    className="pointer-events-none absolute"
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                  >
                    <span
                      data-dot
                      className="flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-wine text-[10px] leading-none text-cream tabular"
                    >
                      {i + 1}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* what the markers point at — outside the scaled plate, so it stays readable */}
          <ol className="mt-6 grid gap-2 sm:grid-cols-3">
            {piece.hotspots.map((spot, i) => (
              <li key={spot.label} className="flex items-start gap-2 caption text-ink-muted">
                <span
                  aria-hidden="true"
                  className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-wine text-[9px] leading-none text-cream tabular"
                >
                  {i + 1}
                </span>
                {spot.label}
              </li>
            ))}
          </ol>

          {/* the rule: ticks from the piece's own range, the span follows the value */}
          <div className="mt-6" aria-hidden="true">
            <div className="relative h-px w-full bg-cream-deep">
              <span data-rule-fill className="absolute inset-0 origin-left [transform:scaleX(0)] bg-wine" />
            </div>
            <div className="relative mt-2 h-4">
              {ticks.map((t) => (
                <span
                  key={t}
                  className="absolute top-0 -translate-x-1/2 caption whitespace-nowrap text-ink-muted tabular"
                  style={{ left: `${((t - piece.min) / (piece.max - piece.min)) * 100}%` }}
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 caption text-ink-muted">{fittingRoom.rulerLabel} · mm</p>
          </div>
        </div>
      </div>
    </section>
  );
}
