import type { Metadata } from "next";
import { brand } from "@/data/content";
import { Hero } from "@/components/sections/landing/Hero";
import { CampaignSlides } from "@/components/sections/landing/CampaignSlides";
import { Marquee } from "@/components/sections/landing/Marquee";
import { SignatureRail } from "@/components/sections/landing/SignatureRail";
import { Invitation } from "@/components/sections/landing/Invitation";

export const metadata: Metadata = {
  title: { absolute: `${brand.name} — ${brand.tagline}` },
  description: brand.description,
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <CampaignSlides />
      <Marquee />
      <SignatureRail />
      <Invitation />
    </>
  );
}
