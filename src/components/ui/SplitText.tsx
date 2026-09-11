import { Fragment } from "react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  /** "words" wraps each word in a mask; "chars" each character. */
  type?: "words" | "chars";
  className?: string;
  /** Class applied to the inner animated span. Target with `[data-split]` in GSAP. */
  innerClassName?: string;
};

/**
 * Splits text into masked spans so GSAP can slide them up (`yPercent: 110 → 0`).
 * Renders statically; animation is applied by the parent inside a matchMedia.
 */
export function SplitText({ text, type = "words", className, innerClassName }: Props) {
  const parts = type === "words" ? text.split(" ") : Array.from(text);
  return (
    <span className={cn("inline", className)} aria-label={text} role="text">
      {parts.map((part, i) => (
        <Fragment key={`${part}-${i}`}>
          <span aria-hidden="true" className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] align-bottom">
            <span data-split className={cn("inline-block will-change-transform", innerClassName)}>
              {part === " " ? " " : part}
            </span>
          </span>
          {type === "words" && i < parts.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
