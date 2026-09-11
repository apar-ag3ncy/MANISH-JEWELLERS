"use client";

import { usePathname } from "next/navigation";
import { Preloader } from "@/components/sections/landing/Preloader";

/** Mounts the Preloader only on the landing page. Placed first in the tree so its effect runs before Navbar/Hero. */
export function PreloaderGate() {
  const pathname = usePathname();
  if (pathname !== "/") return null;
  return <Preloader key={pathname} />;
}
