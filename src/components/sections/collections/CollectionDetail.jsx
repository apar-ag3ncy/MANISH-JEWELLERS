import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { PageInvitation } from "@/components/sections/shared/PageInvitation";
import { collections } from "@/data/collections";
import { ProductGallery } from "./ProductGallery";

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
              className="object-contain"
              style={{ objectPosition: collection.position }}
            />
          </div>
        </section>
        <ProductGallery
          id="the-edit"
          products={collection.pieces}
          heading={`The ${collection.name.toLowerCase()} edit.`}
          eyebrow="A closer look"
          description="Explore the details in full. Take a closer look at each piece, then discover the collection with us in Beawar."
          filters={false}
        />
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
