import { CollectionHero } from "@/components/sections/home/CollectionOverview";
import { CollectionCarousel } from "@/components/sections/collections/CollectionCarousel";
import { CollectionEditorial } from "@/components/sections/collections/CollectionEditorial";
import { PageInvitation } from "@/components/sections/shared/PageInvitation";
import { ProductGallery } from "@/components/sections/collections/ProductGallery";

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
      <PageInvitation />
    </>
  );
}
