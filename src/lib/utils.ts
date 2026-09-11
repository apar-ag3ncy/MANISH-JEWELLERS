import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 240000 → "₹2,40,000" */
export function formatINR(value: number) {
  return inr.format(value);
}

/** Two-digit editorial numbering: 1 → "01" */
export function pad2(n: number) {
  return String(n).padStart(2, "0");
}
