"use client";

import { usePathname } from "next/navigation";
import { HouseFinale } from "./HouseFinale";

/** The diamond-to-footer finale belongs to the home and collection experiences. */
export function HouseFinaleGate() {
  const pathname = usePathname();
  const show =
    pathname === "/" || pathname === "/home" || pathname === "/collections" || pathname.startsWith("/collections/");
  return show ? <HouseFinale key={pathname} /> : null;
}
