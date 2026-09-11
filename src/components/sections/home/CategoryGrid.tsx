import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";

export function CategoryGrid() {
  return (
    <section id={categories.id} className="scroll-mt-20 bg-white section-y text-ink">
      <div className="container-x">
        <Reveal className="mb-12 md:mb-16">
          <p className="eyebrow text-wine-soft">{categories.eyebrow}</p>
          <h2 className="mt-6 display-l">{categories.heading}</h2>
        </Reveal>

        <Reveal stagger={0.1} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.tiles.map((tile) => (
            <Link
              key={tile.slug}
              href={tile.href}
              className="group relative block aspect-[4/5] overflow-hidden bg-wine-deep"
            >
              <div className="absolute inset-0 transition-transform duration-[1100ms] ease-[var(--ease-lux)] group-hover:scale-[1.04]">
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-[50%_35%]"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-cream px-6 py-5 text-wine transition-transform duration-700 ease-[var(--ease-lux)] group-hover:-translate-y-2">
                <span className="block ui-label transition-[letter-spacing] duration-700 ease-[var(--ease-lux)] group-hover:tracking-[0.12em]">
                  {tile.label}
                </span>
                <span className="mt-1 block caption text-ink-muted">{tile.blurb}</span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
