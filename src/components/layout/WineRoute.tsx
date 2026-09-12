"use client";

import { useLayoutEffect } from "react";
import { setWineGround } from "./ground";

/** Renders nothing. Tells the Navbar that this route's ground is wine, so the nav goes cream. */
export function WineRoute() {
  useLayoutEffect(() => {
    setWineGround(true);
    return () => setWineGround(false);
  }, []);

  return null;
}
