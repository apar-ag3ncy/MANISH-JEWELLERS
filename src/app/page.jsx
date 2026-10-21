import { brand, landingCampaign, store } from "@/data/content";
import { Hero } from "@/components/sections/landing/Hero";
import { CampaignSlides } from "@/components/sections/landing/CampaignSlides";
import { Marquee } from "@/components/sections/landing/Marquee";
import { SignatureRail } from "@/components/sections/landing/SignatureRail";
import { Invitation } from "@/components/sections/landing/Invitation";
import { Heritage } from "@/components/sections/landing/Heritage";
import { ProductGallery } from "@/components/sections/collections/ProductGallery";
import { featuredProducts } from "@/data/product-catalog";
import { DiamondCutStudio } from "@/components/sections/diamonds/DiamondCutStudio";

export const metadata = {
  title: { absolute: `${brand.name} — ${brand.motto}` },
  description: brand.description,
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "JewelryStore",
            name: brand.name,
            url: brand.url,
            description: brand.description,
            foundingDate: String(brand.since),
            address: {
              "@type": "PostalAddress",
              streetAddress: store.addressLines[0],
              addressLocality: "Beawar",
              addressRegion: "Rajasthan",
              postalCode: "305901",
              addressCountry: "IN",
            },
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Marquee />
      <ProductGallery
        id="house-favourites"
        products={featuredProducts}
        heading="Selected pieces."
        eyebrow="A first look at the collection"
        filters={false}
        showAllLink
      />
      <SignatureRail />
      <CampaignSlides slides={landingCampaign.slides} />
      <Heritage />
      <DiamondCutStudio embedded />
      <Invitation />
    </>
  );
}
