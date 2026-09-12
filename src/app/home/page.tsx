import type { Metadata } from "next";
import { brand, homeHero, store } from "@/data/content";
import { SITE_URL } from "@/lib/constants";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { CategoryGrid } from "@/components/sections/home/CategoryGrid";
import { FeaturedPieces } from "@/components/sections/home/FeaturedPieces";
import { TopReel } from "@/components/sections/home/TopReel";
import { CutStudio } from "@/components/sections/home/CutStudio";
import { Bespoke } from "@/components/sections/home/Bespoke";
import { BottomHeritage } from "@/components/sections/home/BottomHeritage";
import { Testimonials } from "@/components/sections/home/Testimonials";
import { VisitStore } from "@/components/sections/home/VisitStore";

export const metadata: Metadata = {
  title: homeHero.heading,
  description: `${homeHero.lede} ${brand.lede}`,
  alternates: { canonical: "/home" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["JewelryStore", "LocalBusiness"],
  name: brand.name,
  description: brand.description,
  url: `${SITE_URL}/home`,
  telephone: store.phone,
  foundingDate: String(brand.since),
  address: {
    "@type": "PostalAddress",
    streetAddress: store.addressLines[0],
    addressLocality: "Beawar",
    addressRegion: "Rajasthan",
    postalCode: "305901",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: store.geo.lat, longitude: store.geo.lng },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "11:00",
      closes: "20:00",
    },
  ],
  sameAs: [store.instagram],
  priceRange: "₹₹₹₹",
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeHero />
      <CategoryGrid />
      <TopReel />
      <FeaturedPieces />
      <CutStudio />
      <Bespoke />
      <BottomHeritage />
      <Testimonials />
      <VisitStore />
    </>
  );
}
