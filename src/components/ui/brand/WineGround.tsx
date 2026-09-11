import { cn } from "@/lib/utils";

/**
 * The lit wine ground behind the brand lockup: soft light from the top left,
 * depth pooling bottom right, and a fine paper grain. Decorative only.
 */
export function WineGround({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 wine-ground", className)}>
      <div className="mj-grain absolute inset-0" />
    </div>
  );
}
