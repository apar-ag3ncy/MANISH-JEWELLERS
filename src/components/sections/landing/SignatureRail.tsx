import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { landingCollections } from "@/data/enhance-landing";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { LandingReveal as Reveal } from "./LandingReveal";

/** A normal grid keeps every collection reachable with a keyboard or without JS. */
export function SignatureRail() {
  return (
    <section
      id="collections"
      className="landing-section scroll-mt-28 bg-cream-soft text-ink"
      aria-labelledby="collections-heading"
    >
      <div className="container-x">
        <Reveal className="landing-section-heading">
          <div>
            <p className="eyebrow text-wine-soft">{landingCollections.eyebrow}</p>
            <h2 id="collections-heading" className="mt-5 max-w-[15ch] display-l">
              {landingCollections.heading}
            </h2>
          </div>
          <p className="body-copy max-w-[36ch] text-ink-muted">{landingCollections.lede}</p>
        </Reveal>
        <div className="landing-collections-grid">
          {landingCollections.items.map((item, i) => (
            <Link
              key={item.name}
              href={`/collections/${item.name.toLowerCase()}`}
              className="group block"
              aria-label={`Explore ${item.name.toLowerCase()}`}
            >
              <ImageFrame
                reveal="none"
                src={item.src}
                alt={item.alt}
                sizes="(min-width: 768px) 30vw, 90vw"
                curtain="cream-soft"
                className="aspect-[4/5]"
                depth={0}
                delay={i * 0.08}
              />
              <div className="flex items-center justify-between gap-4 border-b border-cream-deep py-5">
                <div>
                  <h3 className="font-display text-3xl">{item.name}</h3>
                  <p className="mt-1 text-sm text-ink-muted">{item.note}</p>
                </div>
                <ArrowUpRight
                  size={22}
                  strokeWidth={1.25}
                  className="text-wine transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={landingCollections.href}
            className="link-underline inline-flex items-center gap-3 py-2 ui-label text-wine"
          >
            {landingCollections.cta}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
