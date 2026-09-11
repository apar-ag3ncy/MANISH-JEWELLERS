import { cn } from "@/lib/utils";
import { LOCKUP } from "./brand/lockup-data";

type Props = { className?: string; label: string };

const mono = LOCKUP.monogram.box;
const PIN_MARK = 24;
const pinScale = PIN_MARK / mono.w;

/** Wine-line map of the MI Road stretch. No external tiles; swap for an embed in Phase 2. */
export function MapIllustration({ className, label }: Props) {
  return (
    <svg
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
        <path d="M0 90h600M0 340h600M120 0v460M470 0v460M290 0v130M290 300v160" />
        <path d="M40 200c60-30 120-10 180 0M380 200c50 30 110 20 220-10" />
        <path d="M0 400c120-30 240 10 360-10s160-20 240 0" strokeDasharray="4 6" />
      </g>
      {/* MI Road */}
      <path d="M0 230c110 6 220-12 330-4s170 20 270 8" strokeWidth="3" opacity="0.9" />
      <path d="M0 246c110 6 220-12 330-4s170 20 270 8" strokeWidth="1" opacity="0.5" />
      {/* park */}
      <circle cx="520" cy="130" r="42" strokeDasharray="3 5" opacity="0.6" />
      <circle cx="520" cy="130" r="8" opacity="0.6" />
      {/* labels */}
      <g
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
      {/* pin: the real monogram in a wine disc */}
      <g transform="translate(330 215)">
        <circle r="46" opacity="0.18" />
        <circle r="30" fill="currentColor" stroke="none" />
        <g
          transform={`translate(${-PIN_MARK / 2} ${(-mono.h * pinScale) / 2}) scale(${pinScale}) translate(${-mono.x} ${-mono.y})`}
          className="fill-cream"
          stroke="none"
        >
          <path d={LOCKUP.monogram.d} />
        </g>
      </g>
    </svg>
  );
}
