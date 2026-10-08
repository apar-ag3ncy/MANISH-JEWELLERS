import { LOCKUP } from "@/components/ui/brand/lockup-data";

/** Light catches on three edges of the original logo, rather than floating particles. */
export function IntroJewelleryLight() {
  const edges = [
    [LOCKUP.monogram.box.x + 8, LOCKUP.monogram.box.y + 14],
    [LOCKUP.monogram.box.x + LOCKUP.monogram.box.w - 9, LOCKUP.monogram.box.y + 35],
    [LOCKUP.wordmark.glyphs[9].box.x + 8, LOCKUP.wordmark.glyphs[9].box.y + 5],
  ];
  return (
    <svg className="intro-glints" viewBox={`0 0 ${LOCKUP.viewBox.w} ${LOCKUP.viewBox.h}`} aria-hidden="true">
      {edges.map(([x, y], index) => (
        <g key={index} transform={`translate(${x} ${y})`}>
          <g data-intro-glint>
            <path d="M0-18 2-2 18 0 2 2 0 18-2 2-18 0-2-2Z" fill="#fffaf0" />
            <circle r="2.6" fill="#ffffff" />
          </g>
        </g>
      ))}
    </svg>
  );
}
