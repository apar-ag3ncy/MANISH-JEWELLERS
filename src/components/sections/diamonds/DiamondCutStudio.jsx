"use client";

import { useRef, useState } from "react";
import { RotateCw, Layers3, ArrowDown, Sparkles } from "lucide-react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { diamondCuts } from "@/data/diamond-guide";
import { Gem } from "@/components/ui/Gem";
import { FacetStone } from "./FacetStone";

export function DiamondCutStudio() {
  const root = useRef(null);
  const stone = useRef(null);
  const tilt = useRef({});
  const pointerBounds = useRef(null);
  const [index, setIndex] = useState(0);
  const [facets, setFacets] = useState(true);
  const [turn, setTurn] = useState(0);
  const cut = diamondCuts[index];

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(MOTION_OK, () => {
        gsap.fromTo(
          stone.current.querySelector("svg"),
          { opacity: 0.45, scale: 0.86, rotation: turn - 25 },
          { opacity: 1, scale: 1, rotation: turn, duration: 1.1, ease: "power3.out" },
        );
        gsap.fromTo(
          root.current.querySelector(".diamond-selection-copy"),
          { y: 12, opacity: 0.4 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        );
      });
      media.add("(prefers-reduced-motion: reduce)", () => {
        // Manual controls retain their meaning without introducing animated movement.
        gsap.set(stone.current.querySelector("svg"), { rotation: turn });
      });
      return () => media.revert();
    },
    { scope: root, dependencies: [cut.id, turn], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference) and (hover: hover)", () => {
        tilt.current = {
          x: gsap.quickTo(stone.current, "rotationX", { duration: 1, ease: "power3.out" }),
          y: gsap.quickTo(stone.current, "rotationY", { duration: 1, ease: "power3.out" }),
        };
        return () => {
          tilt.current = {};
        };
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="diamond-cut-studio container-x" aria-labelledby="diamond-guide-heading">
      <div className="diamond-studio-copy">
        <p className="eyebrow text-wine-soft">The diamond guide · A closer look</p>
        <h1 id="diamond-guide-heading">
          Light,
          <br />
          <em>shaped by hand.</em>
        </h1>
        <p className="diamond-studio-intro">
          Discover the character of five shapes. Turn the stone, uncover its facets, then scroll to see how the craft
          gives light a path.
        </p>
        <div className="diamond-shape-controls" role="group" aria-label="Choose a diamond shape">
          {diamondCuts.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={index === i}
              onClick={() => {
                setIndex(i);
                setTurn(0);
              }}
              className="diamond-shape-button"
            >
              <Gem cut={item.id} strokeWidth={0.025} />
              <span>{item.name}</span>
            </button>
          ))}
        </div>
        <div className="diamond-selection-copy" aria-live="polite">
          <p className="eyebrow">
            {cut.style} <span>· {cut.shape}</span>
          </p>
          <h2>{cut.character}</h2>
          <p>{cut.body}</p>
          <p className="diamond-choice-note">{cut.note}</p>
        </div>
        <a className="house-text-link" href="#light-story">
          Follow the light <ArrowDown size={18} aria-hidden="true" />
        </a>
      </div>
      <div
        className="diamond-object-stage on-wine"
        onPointerEnter={(event) => {
          pointerBounds.current = event.currentTarget.getBoundingClientRect();
        }}
        onPointerMove={(event) => {
          const box = pointerBounds.current;
          if (!box) return;
          tilt.current.x?.((0.5 - (event.clientY - box.top) / box.height) * 14);
          tilt.current.y?.(((event.clientX - box.left) / box.width - 0.5) * 18);
        }}
        onPointerLeave={() => {
          tilt.current.x?.(0);
          tilt.current.y?.(0);
          pointerBounds.current = null;
        }}
      >
        <span className="diamond-stage-eyebrow eyebrow">
          <Sparkles size={14} aria-hidden="true" /> {cut.name} · Face-up view
        </span>
        <div className="diamond-orbit" aria-hidden="true" />
        <div ref={stone} className="diamond-object">
          <FacetStone cut={cut.id} name={cut.name} facets={facets} />
        </div>
        <div className="diamond-object-controls">
          <button
            className="glass-control"
            type="button"
            aria-label="Turn the diamond"
            onClick={() => setTurn((value) => value + 90)}
          >
            <RotateCw size={19} aria-hidden="true" />
          </button>
          <button
            className="glass-control"
            type="button"
            aria-label="Show facet detail"
            aria-pressed={facets}
            onClick={() => setFacets((value) => !value)}
          >
            <Layers3 size={19} aria-hidden="true" />
          </button>
          <span>Turn / Facets</span>
        </div>
        <p className="diamond-stage-note">Illustrative geometry. Each real diamond is unique.</p>
      </div>
    </section>
  );
}
