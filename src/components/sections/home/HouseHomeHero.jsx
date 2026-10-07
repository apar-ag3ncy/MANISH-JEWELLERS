import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ScrollMotion } from "@/components/motion/ScrollMotion";

/** The house collection opens with the campaign and the jewels behind it. */
export function HouseHomeHero() {
  return (
    <ScrollMotion as="section" className="house-home-opening on-wine" aria-labelledby="house-home-title">
      <div className="house-home-spread">
        <div className="house-home-copy">
          <p className="house-home-eyebrow eyebrow">The house collection · Since 1916</p>
          <div className="house-home-story">
            <h1 id="house-home-title">
              For every
              <br />
              beautiful
              <br />
              <em>beginning.</em>
            </h1>
            <p className="house-home-introduction">
              A jewel for the day. A memory for the years. Discover the pieces that make a moment your own.
            </p>
            <Link href="/collections#all-pieces" className="house-home-discover house-text-link">
              Discover the collection
              <ArrowUpRight size={18} strokeWidth={1.3} aria-hidden="true" />
            </Link>
          </div>
          <Link href="/about#heritage" className="house-home-history">
            1916—2026 <span>A legacy, still unfolding</span>
            <ArrowUpRight size={15} strokeWidth={1.3} aria-hidden="true" />
          </Link>
        </div>

        <Link
          href="/campaign"
          className="house-home-portrait"
          aria-label="Explore the Manish Jewellers bridal campaign"
        >
          <div className="house-home-portrait-image" data-image-swipe="intro">
            <Image
              src="/campaign/mj-1832.jpg"
              alt="Two brides in embroidered wine lehengas wearing layered gold and green-stone jewellery"
              fill
              priority
              sizes="(min-width: 1100px) 43vw, (min-width: 700px) 60vw, 100vw"
              className="house-home-model"
            />
          </div>
          <span className="house-home-campaign-label">
            <span>The bridal campaign</span>
            <ArrowUpRight size={21} strokeWidth={1.3} aria-hidden="true" />
          </span>
        </Link>

        <div className="house-home-jewels">
          <Link
            href="/collections#all-pieces"
            className="house-home-jewel"
            aria-label="Discover the medallion necklace collection"
          >
            <div className="house-home-jewel-photo" data-image-swipe="intro">
              <Image
                src="/collection-products/long-medallion-necklace.webp"
                alt="A long medallion necklace with pale bead clusters on ivory satin"
                fill
                priority
                sizes="(min-width: 1100px) 27vw, (min-width: 700px) 50vw, 50vw"
              />
            </div>
            <span className="house-home-jewel-caption">
              <span>A lasting impression</span>
              <ArrowUpRight size={17} strokeWidth={1.3} aria-hidden="true" />
            </span>
          </Link>
          <Link
            href="/collections#all-pieces"
            className="house-home-jewel"
            aria-label="Discover the gold bangles collection"
          >
            <div className="house-home-jewel-photo" data-image-swipe="intro">
              <Image
                src="/collection-products/floral-bangle-trio.webp"
                alt="Three floral bangles with colourful details on a pale stone display"
                fill
                sizes="(min-width: 1100px) 27vw, (min-width: 700px) 50vw, 50vw"
              />
            </div>
            <span className="house-home-jewel-caption">
              <span>A touch of colour</span>
              <ArrowUpRight size={17} strokeWidth={1.3} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </ScrollMotion>
  );
}
