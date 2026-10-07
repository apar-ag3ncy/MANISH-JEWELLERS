import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { legacy } from "@/data/legacy";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { Monogram } from "@/components/ui/Monogram";

export function AboutStory() {
  return (
    <ScrollMotion as="section" className="house-introduction bg-cream-soft text-wine">
      <div className="house-introduction-grid container-x">
        <div data-scroll-fade>
          <p className="eyebrow text-wine-soft">{legacy.eyebrow}</p>
          <h1>{legacy.heading}</h1>
          <p className="house-introduction-body">{legacy.introduction}</p>
          <a href="#heritage" className="house-story-link ui-label">
            Travel through our story
            <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="house-anniversary" role="img" aria-label="110 years, from 1916 to 2026">
          <div className="house-anniversary-arch" aria-hidden="true" />
          <Monogram className="house-anniversary-mark" />
          <p className="house-anniversary-number" aria-hidden="true">
            110
          </p>
          <p className="eyebrow" aria-hidden="true">
            Years of belonging
          </p>
          <p className="house-anniversary-dates" aria-hidden="true">
            1916 <span /> 2026
          </p>
        </div>
      </div>
      <div className="house-introduction-foot container-x">
        <span>Crafted through generations</span>
        <span>
          आपके अपने <span aria-hidden="true">·</span> Beawar, Rajasthan
        </span>
      </div>
    </ScrollMotion>
  );
}

export function LegacyContinuation() {
  return (
    <section className="house-continuation bg-cream-soft text-ink" aria-labelledby="next-generation-heading">
      <ScrollMotion className="container-x">
        <div data-scroll-fade className="house-continuation-heading">
          <div>
            <p className="eyebrow text-wine-soft">{legacy.continuation.eyebrow}</p>
            <h2 id="next-generation-heading" className="mt-6 display-l">
              {legacy.continuation.heading}
            </h2>
          </div>
          <div>
            <p className="body-copy text-ink-muted">{legacy.continuation.body}</p>
            <p className="mt-5 body-copy text-ink-muted">{legacy.continuation.promise}</p>
          </div>
        </div>
        <figure className="house-family">
          <div data-image-swipe>
            <Image
              src="/brochure/br-family.jpg"
              alt="The Manish Jewellers family celebrating together, across generations"
              width={2000}
              height={953}
              sizes="90vw"
            />
          </div>
          <figcaption>
            <span>One family. A shared legacy.</span>
            <span>From the house brochure</span>
          </figcaption>
        </figure>
        <div className="house-continuation-links">
          <Link href="/collections" className="link-underline">
            {legacy.continuation.cta}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/visit" className="link-underline">
            {legacy.continuation.visit}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </ScrollMotion>
    </section>
  );
}
