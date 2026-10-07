"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cutStudio, fittingRoom } from "@/data/content";
import { CARAT } from "@/lib/constants";
import { ScrollTrigger } from "@/lib/gsap";
import { GemGroup } from "@/components/ui/Gem";
import Image from "next/image";

/** Keep the useful home-page tools within the same page, ready when a visitor wants them. */
export function Personalisation() {
  const [cutIndex, setCutIndex] = useState(0);
  const [carat, setCarat] = useState<number>(CARAT.initial);
  const [pieceIndex, setPieceIndex] = useState(0);
  const [measurement, setMeasurement] = useState<number>(fittingRoom.pieces[0].value);
  const cut = cutStudio.cuts[cutIndex];
  const piece = fittingRoom.pieces[pieceIndex];
  const across = measurement;
  return (
    <div className="mt-14 border-t border-cream-deep">
      <details
        id="cut-studio"
        className="group scroll-mt-28 border-b border-cream-deep"
        onToggle={() => ScrollTrigger.refresh()}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-2xl sm:text-3xl">
          Explore diamond cuts
          <ChevronDown size={22} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="grid items-center gap-8 pb-10 md:grid-cols-2 md:gap-14">
          <div>
            <p className="mb-6 body-copy text-ink-muted">{cutStudio.intro}</p>
            <div role="group" aria-label="Diamond cut" className="flex flex-wrap gap-2">
              {cutStudio.cuts.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={cutIndex === i}
                  onClick={() => setCutIndex(i)}
                  className={`rounded-full border px-4 py-3 text-sm ${cutIndex === i ? "border-wine bg-wine text-cream" : "border-cream-deep text-wine"}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <label htmlFor="carat" className="eyebrow text-wine-soft">
                {cutStudio.caratLabel}
              </label>
              <output htmlFor="carat" className="font-display text-2xl text-wine">
                {carat.toFixed(2)} ct
              </output>
            </div>
            <input
              id="carat"
              type="range"
              className="mj-range mt-3"
              min={CARAT.min}
              max={CARAT.max}
              step={CARAT.step}
              value={carat}
              onChange={(event) => setCarat(Number(event.target.value))}
              aria-valuetext={`${carat.toFixed(2)} carats`}
            />
            <p className="mt-5 text-sm text-ink-muted">{cut.bestFor}</p>
            <p className="mt-3 text-sm text-ink-muted">Illustrative proportions. Final dimensions vary by stone.</p>
          </div>
          <div className="on-wine relative aspect-square max-h-[400px] bg-wine text-cream">
            <svg
              viewBox="-1.2 -1.2 2.4 2.4"
              className="h-full w-full"
              role="img"
              aria-label={`${cut.name}, ${carat.toFixed(2)} carats`}
            >
              <g transform={`scale(${0.62 * Math.cbrt(carat)})`}>
                <GemGroup cut={cut.id} strokeWidth={0.009} />
              </g>
            </svg>
            <p className="absolute inset-x-6 bottom-5 flex justify-between gap-3 text-sm">
              <span>{cut.name}</span>
              <span>{carat.toFixed(2)} ct</span>
            </p>
          </div>
        </div>
      </details>
      <details
        id="fitting"
        className="group scroll-mt-28 border-b border-cream-deep"
        onToggle={() => ScrollTrigger.refresh()}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-2xl sm:text-3xl">
          Find your fit
          <ChevronDown size={22} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="grid items-center gap-8 pb-10 md:grid-cols-2 md:gap-14">
          <div>
            <div role="group" aria-label="Jewellery to size" className="flex flex-wrap gap-2">
              {fittingRoom.pieces.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={pieceIndex === i}
                  onClick={() => {
                    setPieceIndex(i);
                    setMeasurement(item.value);
                  }}
                  className={`rounded-full border px-4 py-3 text-sm ${pieceIndex === i ? "border-wine bg-wine text-cream" : "border-cream-deep text-wine"}`}
                >
                  {item.name}
                </button>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-between gap-4">
              <label htmlFor="fitting-mm" className="eyebrow text-wine-soft">
                {piece.measure}
              </label>
              <output htmlFor="fitting-mm" className="font-display text-2xl text-wine">
                {measurement.toFixed(1)} mm
              </output>
            </div>
            <input
              id="fitting-mm"
              type="range"
              className="mj-range mt-3"
              min={piece.min}
              max={piece.max}
              step={piece.step}
              value={measurement}
              onChange={(event) => setMeasurement(Number(event.target.value))}
              aria-valuetext={`${measurement.toFixed(1)} millimetres`}
            />
            <p className="mt-5 body-copy text-ink-muted">{fittingRoom.note}</p>
            <p className="mt-4 text-sm text-ink-muted">Visit the showroom for a personal fitting.</p>
          </div>
          <div className="relative aspect-square max-h-[400px] overflow-hidden bg-cream">
            <div
              className="absolute inset-0 transition-transform motion-reduce:transition-none"
              style={{ transform: `scale(${Math.min(1, across / piece.stageMm)})` }}
            >
              <Image
                src={piece.src}
                alt={piece.alt}
                fill
                sizes="(min-width: 768px) 40vw, 90vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
