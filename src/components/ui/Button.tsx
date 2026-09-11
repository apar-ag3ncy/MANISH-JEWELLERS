import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "solid" // cream bg + wine text; hover → white bg   (on wine grounds)
  | "secondary" // wine bg + cream text                    (on light grounds)
  | "outline" // 1px wine border; hover fills wine       (on light grounds)
  | "outline-cream" // 1px cream border; hover fills cream (on wine grounds)
  | "ghost"; // text only

const base =
  "group/btn relative inline-flex h-12 shrink-0 items-center justify-center gap-3 rounded-full px-7 " +
  "ui-label whitespace-nowrap transition-[background-color,color,border-color] duration-500 ease-[var(--ease-lux)] " +
  "select-none";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-cream text-wine hover:bg-white on-wine",
  secondary: "bg-wine text-cream hover:bg-wine-deep",
  outline: "border border-wine text-wine hover:bg-wine hover:text-cream",
  "outline-cream": "border border-cream/80 text-cream hover:bg-cream hover:text-wine on-wine",
  ghost: "h-auto rounded-none px-0 text-current",
};

type Common = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type AsLink = Common & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export type ButtonProps = AsLink | AsButton;

export function Button(props: ButtonProps) {
  const { variant = "solid", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], className);

  if ("href" in rest && typeof rest.href === "string") {
    const { href, ...linkRest } = rest as AsLink;
    return (
      <Link href={href} className={classes} {...linkRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as AsButton;
  return (
    <button type="button" className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
