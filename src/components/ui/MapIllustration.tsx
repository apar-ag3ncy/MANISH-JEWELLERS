"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { LOCKUP } from "./brand/lockup-data";

type Props = { className?: string; label: string };

const mono = LOCKUP.monogram.box;
const PIN_MARK = 24;
const pinScale = PIN_MARK / mono.w;

/**
 * Wine-line map of the Panch Batti stretch — no external tiles.
 *
 * This is the ONE place on the site where stroke-dashoffset is animated: the whole
 * illustration is nothing but stroked paths, so the draw-on is the accepted exception
 * to the transform-and-opacity rule. Every dash value is computed and written from JS,
 * so with reduced motion — or with no JS at all — the map renders fully drawn, the
 * labels are legible and the pin sits at its natural size.
 */
export function MapIllustration({ className, label }: Props) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = ref.current;
      if (!svg) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const streets = Array.from(svg.querySelectorAll<SVGPathElement>("[data-street]"));
        const roads = Array.from(svg.querySelectorAll<SVGPathElement>("[data-road]"));
        const fades = Array.from(svg.querySelectorAll<SVGElement>("[data-fade]"));
        const pin = svg.querySelector<SVGGElement>("[data-pin]");
        const ring = svg.querySelector<SVGGElement>("[data-ring]");

        const prep = (p: SVGPathElement) => {
          const len = p.getTotalLength();
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        };
        streets.forEach(prep);
        roads.forEach(prep);
        if (fades.length) gsap.set(fades, { opacity: 0 });
        if (pin) gsap.set(pin, { scale: 0, transformOrigin: "50% 50%" });
        if (ring) gsap.set(ring, { opacity: 0 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: "top 78%", once: true } });
        if (streets.length) {
          tl.to(streets, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.06 }, 0);
        }
        if (roads.length) tl.to(roads, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.35);
        if (fades.length) tl.to(fades, { opacity: 1, duration: 0.7, ease: "power2.out" }, 0.75);
        if (pin) tl.to(pin, { scale: 1, duration: 0.7, ease: "expo.out" }, 1.0);
        if (ring) {
          tl.fromTo(
            ring,
            { scale: 0.9, opacity: 0.18, transformOrigin: "50% 50%" },
            { scale: 1, opacity: 0, duration: 1.2, ease: "power2.out" },
            1.1,
          );
        }
      });
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 460"
      className={cn("block h-auto w-full text-wine", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      {/* secondary streets */}
      <g strokeWidth="1" opacity="0.35">
        <path data-street d="M0 90h600M0 340h600M120 0v460M470 0v460M290 0v130M290 300v160" />
        <path data-street d="M40 200c60-30 120-10 180 0M380 200c50 30 110 20 220-10" />
        {/* dashed: kept as a dash pattern, so it fades rather than draws */}
        <path data-fade d="M0 400c120-30 240 10 360-10s160-20 240 0" strokeDasharray="4 6" />
      </g>
      {/* MI Road */}
      <path data-road d="M0 230c110 6 220-12 330-4s170 20 270 8" strokeWidth="3" opacity="0.9" />
      <path data-road d="M0 246c110 6 220-12 330-4s170 20 270 8" strokeWidth="1" opacity="0.5" />
      {/* park */}
      <g data-fade>
        <circle cx="520" cy="130" r="42" strokeDasharray="3 5" opacity="0.6" />
        <circle cx="520" cy="130" r="8" opacity="0.6" />
      </g>
      {/* labels */}
      <g
        data-fade
        fill="currentColor"
        stroke="none"
        fontFamily="var(--font-body)"
        fontSize="10"
        letterSpacing="0.22em"
        opacity="0.75"
      >
        <text x="24" y="218">
          BEAWAR
        </text>
        <text x="384" y="196">
          PANCH BATTI
        </text>
      </g>
      {/* pin: the real monogram in a wine disc, with a single ring pulse */}
      <g transform="translate(330 215)">
        <g data-ring opacity="0.18">
          <circle r="46" />
        </g>
        <g data-pin>
          <circle r="30" fill="currentColor" stroke="none" />
          <g
            transform={`translate(${-PIN_MARK / 2} ${(-mono.h * pinScale) / 2}) scale(${pinScale}) translate(${-mono.x} ${-mono.y})`}
            className="fill-cream"
            stroke="none"
          >
            <path d={LOCKUP.monogram.d} />
          </g>
        </g>
      </g>
    </svg>
  );
}
