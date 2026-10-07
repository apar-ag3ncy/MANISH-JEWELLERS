import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { collectionPage } from "@/data/legacy";
import { ScrollMotion } from "@/components/motion/ScrollMotion";

export function CollectionHero() {
  return (
    <ScrollMotion as="section" className="collection-introduction bg-cream-soft text-ink">
      <div className="collection-introduction-grid container-x">
        <div data-scroll-fade className="collection-introduction-copy">
          <p className="eyebrow text-wine-soft">{collectionPage.eyebrow}</p>
          <h1>{collectionPage.heading}</h1>
          <p className="body-l text-ink-muted">{collectionPage.introduction}</p>
          <a href="#collections" className="house-story-link ui-label">
            {collectionPage.cta}
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
              src="/house/necklace-presentation.webp"
              alt="A gold necklace on a cream display, with the house's wine-colored presentation boxes"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 85vw"
              className="object-cover object-[50%_48%]"
            />
          </div>
          <div className="collection-introduction-detail" data-image-swipe="intro">
            <Image
              src="/house/ring-presentation.webp"
              alt="A gold ring in a cream-lined Manish Jewellers presentation box"
              fill
              priority
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="object-cover"
            />
          </div>
          <span className="collection-image-note">The art is in the details.</span>
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
