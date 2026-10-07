import { notFound } from "@/data/content";
import { chromeNotFound } from "@/data/enhance-chrome";
import { Button } from "@/components/ui/Button";
import { Monogram } from "@/components/ui/Monogram";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { WineRoute } from "@/components/layout/WineRoute";

/**
 * 404 — the house treatment in miniature. A wine-deep room, the monogram in rose gold,
 * one masked heading, one line, one way out. Nothing here traps a reader: with JavaScript
 * off, or under reduced motion, every element is already in place.
 */
export default function NotFound() {
  return (
    <>
      <WineRoute />
      <section className="on-wine relative flex min-h-[88svh] items-center overflow-hidden bg-wine-deep text-cream">
        <span aria-hidden="true" className="mj-grain pointer-events-none absolute inset-0" />
        <div className="relative container-x w-full pt-[140px] pb-[clamp(72px,10vw,140px)]">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-9 lg:col-span-7">
              <Reveal>
                <Monogram className="h-10 w-auto text-rose/70" />
              </Reveal>
              <SectionHead
                as="h1"
                tone="wine"
                eyebrow={notFound.eyebrow}
                heading={notFound.heading}
                lede={chromeNotFound.body}
                headingClassName="max-w-[16ch]"
                className="mt-10"
              >
                <div className="mt-10">
                  <Button href={notFound.cta.href} variant="outline-cream">
                    {notFound.cta.label}
                  </Button>
                </div>
              </SectionHead>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
