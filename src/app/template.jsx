"use client";

import { RouteCurtain } from "@/components/layout/RouteCurtain";

/** A template remounts on every navigation — which is exactly the hook the route curtain needs. */
export default function Template({ children }) {
  return <RouteCurtain>{children}</RouteCurtain>;
}
