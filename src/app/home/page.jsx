import { collectionPage } from "@/data/legacy";
import { landingCampaign } from "@/data/content";
import { HouseHomeHero } from "@/components/sections/home/HouseHomeHero";
import { ProductGallery } from "@/components/sections/collections/ProductGallery";
import { featuredProducts } from "@/data/product-catalog";
import { CampaignSlides } from "@/components/sections/landing/CampaignSlides";
import { LegacyJourney } from "@/components/sections/about/LegacyJourney";
import { Invitation } from "@/components/sections/landing/Invitation";
import { DiamondCutStudio } from "@/components/sections/diamonds/DiamondCutStudio";

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
        heading="Selected pieces."
        eyebrow="Selected from the house"
        filters={false}
        showAllLink
      />
      <CampaignSlides slides={landingCampaign.slides} />
      <LegacyJourney />
      <Invitation />
      <DiamondCutStudio embedded />
    </>
  );
}
