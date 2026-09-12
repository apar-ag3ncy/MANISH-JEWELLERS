import Link from "next/link";
import { categories, homeTopCategoryLayout, homeTopCategoryOrder } from "@/data/content";
import { cn } from "@/lib/utils";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Rule } from "@/components/ui/Rule";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * CategoryGrid — a mosaic, not a rack of four equal cards.
 *
 * Two changes carry it. The cream label bar is gone: it ate a fifth of every
 * photograph, and the names now sit on the section ground beneath their tile, under a
 * hairline. And the tiles show the PIECE, from the house brochure, rather than a model
 * wearing something adjacent to the label — the page alternates model, product, model
 * from here down.
 *
 * Frames follow their source: the packshots are landscape, so widths and vertical
 * offsets carry the asymmetry (7/5 over 5/7) while every crop keeps the piece whole.
 * Four curtains retract left to right as the row arrives; ImageFrame owns the hover.
 */

export function CategoryGrid() {
  return (
    <section id={categories.id} className="scroll-mt-20 bg-cream-soft section-y text-ink">
      <div className="container-x">
        <SectionHead eyebrow={categories.eyebrow} heading={categories.heading} className="mb-12 md:mb-16" />

        <div className="grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20 lg:grid-cols-12 lg:items-start lg:gap-y-20">
          {homeTopCategoryOrder.map((slug, i) => {
            const tile = categories.tiles.find((t) => t.slug === slug);
            if (!tile) return null;
            const layout = homeTopCategoryLayout[slug];

            return (
              <Link key={tile.slug} href={tile.href} className={cn("mj-cat-tile group", layout.frame)}>
                <ImageFrame
                  src={layout.src}
                  alt={layout.alt}
                  sizes={layout.sizes}
                  focus={layout.focus}
                  curtain="cream-soft"
                  depth={3}
                  delay={i * 0.12}
                  className={cn("w-full", layout.aspect)}
                />
                <Rule tone="light" className="mt-6" />
                <div className="mt-5">
                  <span className="mj-cat-name link-underline-draw ui-label text-wine">{tile.label}</span>
                </div>
                <p className="mt-2 caption text-ink-muted">{tile.blurb}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
