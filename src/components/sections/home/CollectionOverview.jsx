import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { collectionPage } from "@/data/legacy";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { products } from "@/data/product-catalog";

export function CollectionHero() {
  return (
    <ScrollMotion as="section" className="collection-introduction bg-cream-soft text-ink">
      <div className="collection-introduction-grid container-x">
        <div data-scroll-fade className="collection-introduction-copy">
          <p className="eyebrow text-wine-soft">The complete jewellery edit</p>
          <h1>
            Little details.
            <br />
            <em>Extraordinary presence.</em>
          </h1>
          <p className="body-l text-ink-muted">
            Sixteen expressions of the craft. Necklaces, bangles, rings and the pieces that bring it all together. Find
            a little beauty to call your own.
          </p>
          <a href="#all-pieces" className="house-story-link ui-label">
            Discover all {products.length} pieces
            <ArrowDown size={17} aria-hidden="true" />
          </a>
          <Link href="/about#heritage" className="collection-history-link">
            {collectionPage.story}
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="collection-introduction-images">
          <div className="collection-introduction-main" data-image-swipe="intro">
            <Image
              src="/campaign/mj-265.jpg"
              alt="A bride wearing layered ceremonial jewellery with a green accented necklace"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 85vw"
              className="object-cover object-[50%_30%]"
            />
          </div>
          <div className="collection-introduction-detail" data-image-swipe="intro">
            <Image
              src="/collection-products/coin-choker.webp"
              alt="A coin motif choker with pale bead details on ivory fabric"
              fill
              priority
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="object-contain"
            />
          </div>
          <span className="collection-image-note">From the house. For your story.</span>
        </div>
      </div>
    </ScrollMotion>
  );
}

export function CollectionOverview() {
  return (
    <section
      id="collections"
      className="collection-overview bg-cream-soft text-ink"
      aria-labelledby="collection-heading"
    >
      <ScrollMotion className="container-x">
        <div data-scroll-fade className="landing-section-heading">
          <div>
            <p className="eyebrow text-wine-soft">{collectionPage.selectionEyebrow}</p>
            <h2 id="collection-heading" className="mt-5 max-w-[13ch] display-l">
              {collectionPage.selectionHeading}
            </h2>
          </div>
          <p className="body-copy max-w-[38ch] text-ink-muted">{collectionPage.selectionBody}</p>
        </div>
        <div className="collection-editorial-grid">
          {collectionPage.categories.map((category, index) => (
            <div
              data-scroll-fade
              key={category.name}
              className={`collection-category collection-category--${category.aspect}`}
            >
              <Link
                href={`/collections/${category.name.toLowerCase()}`}
                aria-label={`Explore ${category.name.toLowerCase()}`}
              >
                <div className="collection-category-photo" data-image-swipe>
                  <Image
                    src={category.image}
                    alt={category.alt}
                    fill
                    sizes="(min-width: 1024px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <span className="collection-category-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <div className="collection-category-caption">
                  <h3>{category.name}</h3>
                  <ArrowUpRight size={22} strokeWidth={1.2} aria-hidden="true" />
                </div>
                <p>{category.note}</p>
              </Link>
            </div>
          ))}
        </div>
      </ScrollMotion>
    </section>
  );
}
