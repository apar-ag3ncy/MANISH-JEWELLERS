import { cn } from "@/lib/utils";
import type { HeadTone } from "@/types";

/**
 * MetaRow — the catalogue line, so the signature rail and the featured pieces read
 * as one system: a hairline, the material on the left, the price on the right.
 *
 * No hooks, no motion; server-safe. Callers that stage this text in place it inside
 * their own `mask-line` wrapper and animate that.
 */

type Props = {
  /** Material and stone, e.g. "22k gold · uncut polki". */
  meta: string;
  /** Already formatted, e.g. formatINR(piece.priceFrom). */
  price: string;
  tone?: HeadTone;
  className?: string;
};

export function MetaRow({ meta, price, tone = "light", className }: Props) {
  return (
    <div
      className={cn(
        "mt-6 flex items-baseline justify-between gap-4 border-t pt-4",
        tone === "wine" ? "border-cream/18" : "border-cream-deep",
        className,
      )}
    >
      <span className={cn("caption", tone === "wine" ? "text-cream/70" : "text-ink-muted")}>{meta}</span>
      <span className={cn("text-[15px] tabular", tone === "wine" ? "text-cream" : "text-ink")}>{price}</span>
    </div>
  );
}
