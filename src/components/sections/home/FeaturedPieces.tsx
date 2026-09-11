import Image from "next/image";
import Link from "next/link";
import { featured, featuredSection } from "@/data/content";
import { formatINR } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedPieces() {
  return (
    <section id={featuredSection.id} className="scroll-mt-20 bg-cream-soft section-y text-ink">
      <div className="container-x">
        <Reveal className="mb-12 flex items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="eyebrow text-wine-soft">{featuredSection.eyebrow}</p>
            <h2 className="mt-6 display-l">{featuredSection.heading}</h2>
          </div>
          <Link href={featuredSection.viewAll.href} className="link-underline shrink-0 ui-label text-wine">
            {featuredSection.viewAll.label}
          </Link>
        </Reveal>

        <Reveal stagger={0.12} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((piece) => (
            <article key={piece.id} className="group flex flex-col bg-white p-4 md:p-5">
              <div className="relative aspect-[4/5] overflow-hidden bg-wine-deep">
                <Image
                  src={piece.image}
                  alt={`${piece.name}, ${piece.metal}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover object-[50%_30%] transition-transform duration-[1100ms] ease-[var(--ease-lux)] group-hover:scale-[1.04]"
                />
              </div>
              <div className="px-2 pb-2">
                <h3 className="mt-6 display-m">{piece.name}</h3>
                <p className="mt-2 caption text-ink-muted">
                  {piece.metal}
                  {piece.stone ? ` · ${piece.stone}` : ""}
                </p>
                <p className="mt-4 text-[15px] tabular">
                  {featuredSection.fromLabel} {formatINR(piece.priceFrom)}
                </p>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
