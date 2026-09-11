"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: "power3.out", duration: 0.6 });

/** The only media query allowed to run animation (spec §8, rule 3). */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const MOTION_OK_DESKTOP = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";
export const HOVER_OK = "(prefers-reduced-motion: no-preference) and (hover: hover)";

export { gsap, ScrollTrigger, useGSAP };
