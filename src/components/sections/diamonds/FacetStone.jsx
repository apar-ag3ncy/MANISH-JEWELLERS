import { useId } from "react";
import { gemGeometry } from "@/components/ui/Gem";

export function FacetStone({ cut = "round", name = "Round", facets = true }) {
  const unique = useId().replaceAll(":", "");
  const geometry = gemGeometry(cut);
  return (
    <svg
      className="facet-stone"
      viewBox="-1.25 -1.25 2.5 2.5"
      role="img"
      aria-label={`${name} diamond ${facets ? "facet illustration" : "outline"}`}
    >
      <defs>
        <linearGradient id={`${unique}-body`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff9ee" />
          <stop offset=".28" stopColor="#d7c4c7" />
          <stop offset=".52" stopColor="#f9fbf6" />
          <stop offset=".74" stopColor="#793f48" />
          <stop offset="1" stopColor="#f1dfc5" />
        </linearGradient>
        <radialGradient id={`${unique}-table`}>
          <stop stopColor="#fff" stopOpacity=".9" />
          <stop offset="1" stopColor="#ebdbde" stopOpacity=".4" />
        </radialGradient>
      </defs>
      <g data-stone-faces strokeLinejoin="round" strokeLinecap="round">
        <path d={geometry.outline} fill={`url(#${unique}-body)`} stroke="#fffdf5" strokeWidth=".01" />
        <g data-stone-facets opacity={facets ? 1 : 0}>
          <path d={geometry.facets} fill="none" stroke="#f9fff8" strokeWidth=".008" />
          <path
            d={geometry.facets}
            fill="none"
            stroke="#793f48"
            strokeWidth=".004"
            opacity=".6"
            transform="translate(.004 .004)"
          />
          <path d={geometry.table} fill={`url(#${unique}-table)`} stroke="#fff" strokeWidth=".009" />
        </g>
      </g>
    </svg>
  );
}
