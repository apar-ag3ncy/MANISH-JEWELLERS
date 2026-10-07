import { collectionPage } from "@/data/legacy";
import { landingCampaign } from "@/data/content";
import { CollectionHero, CollectionOverview } from "@/components/sections/home/CollectionOverview";
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
      <CollectionHero />
      <CollectionOverview />
      <CampaignSlides slides={landingCampaign.slides} />
      <div id="house-edit" className="house-page scroll-mt-24">
        <CollectionEditorial />
      </div>
      <LegacyJourney />
      <Invitation />
    </>
  );
}
