import Link from "next/link";
import { featured, featuredSection, homeTopFeaturedShots } from "@/data/content";
import { cn, formatINR, pad2 } from "@/lib/utils";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { MetaRow } from "@/components/ui/MetaRow";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * FeaturedPieces — the last e-commerce shape on the site, removed.
 *
 * No white card, no inner padding: three photographs sit directly on the paper, the
 * middle column dropped so the row is not a straight line, and the catalogue line is
 * the same MetaRow the signature rail uses. The three pieces are now shown as product,
 * from the house brochure, on the paler `bg-cream` ground the packshots were lit for.
 *
 * depth={0} on all three: the page's scrub budget is spent on the hero stack, the four
 * category tiles and the pinned reel. The curtain and the hover sheen carry these.
 */

export function FeaturedPieces() {
  return (
    <section id={featuredSection.id} className="scroll-mt-20 bg-cream section-y text-ink">
      <div className="container-x">
        <div className="mb-12 flex flex-col items-start gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <SectionHead
            eyebrow={featuredSection.eyebrow}
            heading={featuredSection.heading}
            headingClassName="max-w-[16ch]"
          />
          <Link href={featuredSection.viewAll.href} className="link-underline shrink-0 ui-label text-wine md:mb-2">
            {featuredSection.viewAll.label}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3 lg:items-start">
          {featured.map((piece, i) => {
            const shot = homeTopFeaturedShots[piece.id];

            return (
              <article
                key={piece.id}
                className={cn("mj-piece group flex flex-col", i === 1 && "lg:mt-[clamp(48px,6vw,96px)]")}
              >
                <ImageFrame
                  src={shot?.src ?? piece.image}
                  alt={shot?.alt ?? `${piece.name} — ${piece.metal}`}
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  focus={shot?.focus ?? "object-[50%_30%]"}
                  curtain="cream"
                  depth={0}
                  delay={i * 0.1}
                  className="aspect-[4/5] w-full"
                />
                <span
                  aria-hidden="true"
                  className="mt-6 block font-display text-[15px] text-wine-soft tabular transition-colors duration-500 ease-[var(--ease-lux)] group-hover:text-wine"
                >
                  {pad2(i + 1)}
                </span>
                <h3 className="mt-2 display-m">
                  <span className="mj-piece-name link-underline-draw">{piece.name}</span>
                </h3>
                <MetaRow
                  meta={`${piece.metal}${piece.stone ? ` · ${piece.stone}` : ""}`}
                  price={`${featuredSection.fromLabel} ${formatINR(piece.priceFrom)}`}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
