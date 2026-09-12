"use client";

import type { ReactNode } from "react";
import { RouteCurtain } from "@/components/layout/RouteCurtain";

/** A template remounts on every navigation — which is exactly the hook the route curtain needs. */
export default function Template({ children }: { children: ReactNode }) {
  return <RouteCurtain>{children}</RouteCurtain>;
}
