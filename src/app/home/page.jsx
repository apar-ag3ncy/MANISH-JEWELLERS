import { collectionPage } from "@/data/legacy";
import { landingCampaign } from "@/data/content";
import { HouseHomeHero } from "@/components/sections/home/HouseHomeHero";
import { ProductGallery } from "@/components/sections/collections/ProductGallery";
import { featuredProducts } from "@/data/product-catalog";
import { CampaignSlides } from "@/components/sections/landing/CampaignSlides";
import { CollectionEditorial } from "@/components/sections/collections/CollectionEditorial";
import { LegacyJourney } from "@/components/sections/about/LegacyJourney";
import { Invitation } from "@/components/sections/landing/Invitation";

export const metadata = {
  title: "The house collection",
  description: collectionPage.introduction,
  alternates: { canonical: "/home" },
};

export default function HomePage() {
  return (
    <>
      <HouseHomeHero />
      <ProductGallery
        id="collections"
        products={featuredProducts}
        heading="A little beauty. A lasting feeling."
        eyebrow="Selected from the house"
        filters={false}
        showAllLink
      />
      <CampaignSlides slides={landingCampaign.slides} />
      <div id="house-edit" className="house-page scroll-mt-24">
        <CollectionEditorial />
      </div>
      <LegacyJourney />
      <Invitation />
    </>
  );
}
