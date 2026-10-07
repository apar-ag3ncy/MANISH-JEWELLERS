import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Plus } from "lucide-react";
import { store } from "@/data/content";
import { visitPage } from "@/data/internal-pages";
import { ScrollMotion } from "@/components/motion/ScrollMotion";

export function ShowroomVisit() {
  return (
    <ScrollMotion className="house-page">
      <section className="visit-introduction container-x">
        <div data-scroll-fade>
          <p className="eyebrow text-wine-soft">{visitPage.eyebrow}</p>
          <h1>{visitPage.heading}</h1>
          <p>{visitPage.introduction}</p>
          <a href={store.directions.href} target="_blank" rel="noopener noreferrer" className="house-text-link">
            Find our showroom <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <figure className="visit-welcome-photo">
          <div data-image-swipe>
            <Image
              src="/brochure/br-team.jpg"
              alt="The Karnawat family greeting guests with folded hands"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 90vw"
              className="object-contain"
            />
          </div>
          <figcaption>A welcome from the house · From the house brochure</figcaption>
        </figure>
      </section>
      <section id="showroom" className="visit-details house-section container-x" aria-labelledby="showroom-heading">
        <div className="visit-address" data-scroll-fade>
          <MapPin size={25} strokeWidth={1} aria-hidden="true" />
          <p className="eyebrow text-wine-soft">Visit Manish Jewellers</p>
          <h2 id="showroom-heading">
            Panch Batti,
            <br />
            Beawar.
          </h2>
          <address>{store.addressLines.join(", ")}, Rajasthan, India</address>
          <a className="house-text-link" href={store.directions.href} target="_blank" rel="noopener noreferrer">
            Open in Google Maps <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="visit-information">
          <div>
            <h3>Opening hours</h3>
            <dl>
              {store.hours.map((hours) => (
                <div key={hours.days}>
                  <dt>{hours.days}</dt>
                  <dd>{hours.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3>{visitPage.welcomeHeading}</h3>
            <p>{visitPage.welcomeBody}</p>
            <Link href="/bespoke" className="house-text-link">
              Explore bespoke jewellery <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
      <section className="visit-questions house-section container-x" aria-labelledby="questions-heading">
        <div className="house-section-head" data-scroll-fade>
          <div>
            <p className="eyebrow text-wine-soft">Before your visit</p>
            <h2 id="questions-heading">A few helpful details.</h2>
          </div>
        </div>
        {visitPage.questions.map((item) => (
          <details key={item.question}>
            <summary>
              {item.question}
              <Plus size={20} strokeWidth={1.2} aria-hidden="true" />
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </section>
    </ScrollMotion>
  );
}
