import { CollectionHero } from "@/components/sections/home/CollectionOverview";
import { CollectionCarousel } from "@/components/sections/collections/CollectionCarousel";
import { CollectionEditorial } from "@/components/sections/collections/CollectionEditorial";
import { PageInvitation } from "@/components/sections/shared/PageInvitation";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { ProductGallery } from "@/components/sections/collections/ProductGallery";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export const metadata = {
  title: "The collections",
  description: "Explore necklaces, rings, bangles and earrings from the Manish Jewellers house collection in Beawar.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <>
      <CollectionHero />
      <ProductGallery />
      <CollectionCarousel />
      <CollectionEditorial />
      <ScrollMotion className="house-page">
        <section className="collection-campaign-teaser house-section container-x">
          <div className="collection-campaign-photo" data-image-swipe>
            <Image
              src="/campaign/mj-490.jpg"
              alt="A bride showing her jewellery and hennaed hands"
              fill
              sizes="(min-width: 1024px) 43vw, 90vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
          <div data-scroll-fade>
            <p className="eyebrow text-wine-soft">The bridal edit · 2026</p>
            <h2>
              A moment.
              <br />
              An heirloom.
            </h2>
            <p>Celebrate the jewellery, the gestures and the little details that make a wedding entirely your own.</p>
            <Link href="/campaign" className="house-text-link">
              Enter the campaign <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </ScrollMotion>
      <PageInvitation />
    </>
  );
}
