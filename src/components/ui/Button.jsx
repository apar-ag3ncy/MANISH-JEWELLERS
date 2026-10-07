import Link from "next/link";
import { Children, isValidElement } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  solid: "mj-button--cream",
  secondary: "mj-button--wine",
  outline: "mj-button--clear",
  "outline-cream": "mj-button--frost on-wine",
  glass: "mj-button--frost on-wine",
  ghost: "mj-button--ghost",
};

export function Button({ variant = "solid", className = "", children, icon = undefined, ...props }) {
  const hasSymbol = Children.toArray(children).some(isValidElement);
  const showSymbol = icon ?? (Boolean(props.href) && !hasSymbol && variant !== "ghost");
  const classes = cn(
    "mj-button group/btn relative inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full px-7 ui-label whitespace-nowrap select-none",
    tones[variant],
    className,
  );
  const content = (
    <>
      {children}
      {showSymbol && <ArrowUpRight className="mj-button-symbol" size={16} strokeWidth={1.3} aria-hidden="true" />}
    </>
  );
  if (props.href)
    return (
      <Link className={classes} {...props}>
        {content}
      </Link>
    );
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
