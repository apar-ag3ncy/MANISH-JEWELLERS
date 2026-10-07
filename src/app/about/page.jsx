import { legacy } from "@/data/legacy";
import { AboutStory, LegacyContinuation } from "@/components/sections/about/AboutStory";
import { LegacyJourney } from "@/components/sections/about/LegacyJourney";
import { BrochureReader } from "@/components/sections/about/BrochureReader";

export const metadata = {
  title: "Our story · 1916–2026",
  description: legacy.introduction,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <AboutStory />
      <LegacyJourney />
      <LegacyContinuation />
      <section className="bg-cream-soft pt-1 pb-20 text-ink" aria-label="The house brochure">
        <BrochureReader />
      </section>
    </>
  );
}
