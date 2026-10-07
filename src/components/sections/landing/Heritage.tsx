import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { heritage } from "@/data/content";
import { landingHeritage } from "@/data/enhance-landing";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { LandingReveal as Reveal } from "./LandingReveal";
import { BrochureReader } from "@/components/sections/about/BrochureReader";

export function Heritage() {
  return (
    <section
      id="our-story"
      className="landing-section scroll-mt-24 bg-cream text-ink"
      aria-labelledby="heritage-heading"
    >
      <div className="landing-heritage-grid container-x">
        <div className="relative">
          <ImageFrame
            reveal="none"
            src={heritage.bench.src}
            alt={heritage.bench.alt}
            sizes="(min-width: 1024px) 42vw, 90vw"
            curtain="cream"
            className="aspect-[4/5]"
            depth={0}
          />
          <span className="landing-heritage-date font-display" aria-hidden="true">
            1916
          </span>
        </div>
        <Reveal>
          <p className="eyebrow text-wine-soft">{landingHeritage.eyebrow}</p>
          <h2 id="heritage-heading" className="mt-6 max-w-[15ch] display-l">
            {landingHeritage.heading}
          </h2>
          <p className="mt-7 body-copy max-w-[42ch] text-ink-muted">{landingHeritage.body}</p>
          <Link
            href={landingHeritage.href}
            className="link-underline mt-9 inline-flex items-center gap-4 py-2 ui-label text-wine"
          >
            {landingHeritage.cta}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
      <BrochureReader />
    </section>
  );
}
