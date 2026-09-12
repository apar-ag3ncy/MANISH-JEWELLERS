import Link from "next/link";
import { store } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHead } from "@/components/ui/SectionHead";
import { Rule } from "@/components/ui/Rule";
import { MapIllustration } from "@/components/ui/MapIllustration";

/**
 * Visit — address, hours and contact as one typeset band of three, then the map,
 * which draws itself on approach. store.mapNote is deliberately not rendered: it
 * announced an unfinished build to the visitor.
 */
export function VisitStore() {
  return (
    <section id={store.id} className="scroll-mt-20 bg-cream section-y text-ink">
      <div className="container-x grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <SectionHead eyebrow={store.eyebrow} heading={store.heading} lede={store.body} />

          <Reveal delay={0.1} className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-3">
            <div>
              <h3 className="eyebrow font-body text-wine-soft">{store.addressLabel}</h3>
              <Rule draw className="mt-3" />
              <address className="mt-4 text-[15px] leading-[1.7] not-italic">
                {store.addressLines.map((l) => (
                  <div key={l}>{l}</div>
                ))}
              </address>
              <Link
                href={store.directions.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline mt-4 inline-block ui-label text-wine"
              >
                {store.directions.label}
              </Link>
            </div>

            <div>
              <h3 className="eyebrow font-body text-wine-soft">{store.hoursLabel}</h3>
              <Rule draw delay={0.06} className="mt-3" />
              <ul className="mt-4 space-y-3 text-[15px] tabular">
                {store.hours.map((h) => (
                  <li key={h.days}>
                    <span className="block font-light text-ink-muted">{h.days}</span>
                    <span className="block">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="eyebrow font-body text-wine-soft">{store.contactLabel}</h3>
              <Rule draw delay={0.12} className="mt-3" />
              <ul className="mt-4 space-y-2 text-[15px]">
                <li>
                  <a href={store.phoneHref} className="link-underline tabular">
                    {store.phone}
                  </a>
                </li>
                <li>
                  <a href={store.whatsappHref} target="_blank" rel="noreferrer" className="link-underline">
                    {store.whatsappLabel}
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.15}>
            <div className="border border-cream-deep p-3 md:p-5">
              <MapIllustration label={store.mapLabel} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
