import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { PageInvitation } from "@/components/sections/shared/PageInvitation";
import { collections } from "@/data/collections";

export function CollectionDetail({ collection }) {
  return (
    <>
      <ScrollMotion className="house-page">
        <section className="collection-detail-hero container-x">
          <div className="collection-detail-copy" data-scroll-fade>
            <Link href="/collections" className="house-breadcrumb">
              The house collection / {collection.name}
            </Link>
            <p className="eyebrow text-wine-soft">{collection.name}</p>
            <h1>{collection.phrase}</h1>
            <p>{collection.description}</p>
            <a href="#the-edit" className="house-text-link">
              Explore the edit <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="collection-detail-image" data-image-swipe>
            <Image
              src={collection.image}
              alt={collection.alt}
              fill
              priority
              sizes="(min-width: 1024px) 52vw, 90vw"
              className="object-cover"
              style={{ objectPosition: collection.position }}
            />
          </div>
        </section>
        <section id="the-edit" className="house-section collection-piece-section container-x">
          <div className="house-section-head" data-scroll-fade>
            <div>
              <p className="eyebrow text-wine-soft">A closer look</p>
              <h2>The {collection.name.toLowerCase()} edit.</h2>
            </div>
            <p>A selection from our house brochure. Discover the full collection with us in Beawar.</p>
          </div>
          <div className="collection-piece-grid">
            {collection.pieces.map((piece, index) => (
              <figure key={piece.image}>
                <div className="collection-piece-image" data-image-swipe>
                  <Image
                    src={piece.image}
                    alt={piece.alt}
                    fill
                    sizes="(min-width: 768px) 43vw, 90vw"
                    className="object-cover"
                  />
                </div>
                <figcaption>
                  <span className="eyebrow">0{index + 1}</span>
                  <h3>{piece.name}</h3>
                  <p>{piece.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
        <section className="collection-editorial-note house-section container-x" data-scroll-fade>
          <p className="eyebrow text-wine-soft">Made for your own story</p>
          <h2>{collection.story}</h2>
          <Link className="house-text-link" href="/bespoke">
            Make it personal <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </section>
        <nav className="collection-siblings container-x" aria-label="Explore more collections">
          <p className="eyebrow text-wine-soft">Continue discovering</p>
          <div>
            {collections
              .filter((item) => item.slug !== collection.slug)
              .map((item) => (
                <Link key={item.slug} href={`/collections/${item.slug}`}>
                  {item.name}
                  <ArrowUpRight size={19} aria-hidden="true" />
                </Link>
              ))}
          </div>
        </nav>
      </ScrollMotion>
      <PageInvitation />
    </>
  );
}
