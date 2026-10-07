import Image from "next/image";
import Link from "next/link";
import { ArrowDown, Gem } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { bespokePage } from "@/data/internal-pages";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { Personalisation } from "@/components/sections/landing/Personalisation";
import { PageInvitation } from "@/components/sections/shared/PageInvitation";

export function BespokeExperience() {
  return (
    <>
      <ScrollMotion className="house-page">
        <section className="bespoke-introduction container-x">
          <div data-scroll-fade>
            <p className="eyebrow text-wine-soft">{bespokePage.eyebrow}</p>
            <h1>{bespokePage.heading}</h1>
            <p>{bespokePage.introduction}</p>
            <a className="house-text-link" href="#the-process">
              Discover the process <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
          <figure className="bespoke-introduction-photo">
            <div data-image-swipe>
              <Image
                src="/brochure/br-bench.jpg"
                alt="A goldsmith shaping a gold necklace by hand at the workbench"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 90vw"
                className="object-cover object-[60%_50%]"
              />
            </div>
            <figcaption>The art of making · From the house brochure</figcaption>
          </figure>
        </section>
        <section
          id="the-process"
          className="bespoke-process house-section container-x"
          aria-labelledby="process-heading"
        >
          <div className="house-section-head" data-scroll-fade>
            <div>
              <p className="eyebrow text-wine-soft">From the first thought to the final detail</p>
              <h2 id="process-heading">Made with you.</h2>
            </div>
            <p>A thoughtful process, shaped around your piece.</p>
          </div>
          <ol>
            {bespokePage.steps.map((step, index) => (
              <li key={step.title}>
                <div className="bespoke-process-copy" data-scroll-fade>
                  <span className="bespoke-step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
                <div className="bespoke-step-image" data-image-swipe>
                  <Image
                    src={step.image}
                    alt={step.alt}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section className="bespoke-explorers house-section container-x" aria-labelledby="explorer-heading">
          <div className="house-section-head" data-scroll-fade>
            <div>
              <p className="eyebrow text-wine-soft">Begin exploring</p>
              <h2 id="explorer-heading">Shape. Scale. Fit.</h2>
            </div>
            <p>
              Use our visual guides to start a conversation. Confirm the final dimensions and fit with the house in
              person.
            </p>
          </div>
          <Personalisation />
          <div className="mt-8">
            <Button href="/diamond-guide" variant="outline">
              <Gem size={18} strokeWidth={1.2} aria-hidden="true" /> Explore the diamond guide
            </Button>
          </div>
          <Link href="/about#brochure" className="house-text-link">
            Look through the house brochure
          </Link>
        </section>
      </ScrollMotion>
      <PageInvitation
        eyebrow="Begin a conversation"
        heading="Your idea belongs here."
        body="Bring a reference, a remembered detail or simply a thought. Explore what it could become with the house in Beawar."
      />
    </>
  );
}
