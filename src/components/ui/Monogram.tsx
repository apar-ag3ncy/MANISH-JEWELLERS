import { cn } from "@/lib/utils";
import { LOCKUP } from "./brand/lockup-data";

const box = LOCKUP.monogram.box;

type Props = { className?: string; title?: string };

/** The real Manish Jewellers monogram, outlined from the master logo. Colour = currentColor. */
export function Monogram({ className, title }: Props) {
  return (
    <svg
      viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
      className={cn("block", className)}
      fill="currentColor"
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <path d={LOCKUP.monogram.d} />
    </svg>
  );
}
