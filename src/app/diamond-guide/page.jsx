import { DiamondCutStudio } from "@/components/sections/diamonds/DiamondCutStudio";
import { DiamondLightStory } from "@/components/sections/diamonds/DiamondLightStory";
import { PageInvitation } from "@/components/sections/shared/PageInvitation";
import { diamondCuts, diamondSources } from "@/data/diamond-guide";

export const metadata = {
  title: "The diamond guide",
  description: "Explore diamond shapes, facets and the anatomy of light with the Manish Jewellers visual guide.",
  alternates: { canonical: "/diamond-guide" },
};

export default function DiamondGuidePage() {
  return (
    <>
      <div className="diamond-guide-page">
        <DiamondCutStudio />
        <DiamondLightStory />
        <section className="diamond-shape-index house-section container-x" aria-labelledby="shape-index-heading">
          <p className="eyebrow text-wine-soft">Five expressions of the craft</p>
          <h2 id="shape-index-heading">A shape for your own story.</h2>
          <dl>
            {diamondCuts.map((cut) => (
              <div key={cut.id}>
                <dt>{cut.name}</dt>
                <dd>{cut.body}</dd>
              </div>
            ))}
          </dl>
          <div className="diamond-guide-sources">
            <span>Continue learning</span>
            {diamondSources.map((source) => (
              <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer">
                {source.label}
              </a>
            ))}
          </div>
        </section>
      </div>
      <PageInvitation
        eyebrow="See the difference in person"
        heading="Find your own light."
        body="Compare stones and explore their individual character with the house in Beawar."
      />
    </>
  );
}
