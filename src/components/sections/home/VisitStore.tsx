import Link from "next/link";
import { store } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { MapIllustration } from "@/components/ui/MapIllustration";

export function VisitStore() {
  return (
    <section id={store.id} className="scroll-mt-20 bg-cream section-y text-ink">
      <div className="container-x grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-wine-soft">{store.eyebrow}</p>
            <h2 className="mt-6 display-l">{store.heading}</h2>
            <p className="mt-6 body-copy text-ink-muted">{store.body}</p>
          </Reveal>

          <Reveal delay={0.1} className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
            <div>
              <h3 className="eyebrow font-body text-wine-soft">{store.addressLabel}</h3>
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
              <table className="mt-4 w-full text-[15px] tabular">
                <tbody>
                  {store.hours.map((h) => (
                    <tr key={h.days} className="border-b border-cream-deep last:border-0">
                      <th scope="row" className="py-2 pr-6 text-left font-light text-ink-muted">
                        {h.days}
                      </th>
                      <td className="py-2 text-right sm:text-left">{h.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h3 className="eyebrow font-body text-wine-soft">{store.contactLabel}</h3>
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
            <div className="border border-cream-deep bg-cream-soft p-3 md:p-5">
              <MapIllustration label={store.mapLabel} />
            </div>
            <p className="mt-3 caption text-ink-muted">{store.mapNote}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
