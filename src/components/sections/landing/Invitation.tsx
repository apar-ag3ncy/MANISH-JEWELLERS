import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { store, landingInvitationImage } from "@/data/content";
import { landingVisit } from "@/data/enhance-landing";
import { Button } from "@/components/ui/Button";
import { ArchPattern } from "@/components/ui/ArchPattern";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { LandingReveal as Reveal } from "./LandingReveal";

export function Invitation() {
  return (
    <section
      id={landingVisit.id}
      className="landing-section on-wine relative scroll-mt-24 overflow-hidden bg-wine text-cream"
      aria-labelledby="visit-heading"
    >
      <div className="pointer-events-none absolute inset-0 text-cream/[0.04]" aria-hidden="true">
        <ArchPattern size={90} />
      </div>
      <div className="landing-invitation-grid relative container-x">
        <ArchFrame ratio={0.8} className="mx-auto w-full max-w-[440px]">
          <ImageFrame
            reveal="none"
            src={landingInvitationImage.src}
            alt={landingInvitationImage.alt}
            sizes="(min-width: 1024px) 35vw, 90vw"
            focus={landingInvitationImage.focus}
            curtain="wine"
            depth={0}
            className="aspect-[4/5] h-full w-full"
          />
        </ArchFrame>
        <Reveal>
          <p className="eyebrow text-cream/70">{landingVisit.eyebrow}</p>
          <h2 id="visit-heading" className="mt-6 max-w-[15ch] display-l">
            {landingVisit.heading}
          </h2>
          <p className="mt-6 body-copy max-w-[41ch] text-cream/80">{landingVisit.body}</p>
          <div className="my-8 border-y border-cream/25 py-5">
            <p className="flex items-center gap-3 text-base">
              <MapPin size={17} strokeWidth={1.5} aria-hidden="true" />
              {store.addressLines.join(", ")}
            </p>
            <p className="mt-2 pl-[29px] text-sm text-cream/70">
              {store.hours[0].days} · {store.hours[0].time}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-5">
            <Button href={store.directions.href} target="_blank" rel="noopener noreferrer">
              {landingVisit.directions}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Button>
            <Link href="/about#brochure" className="link-underline py-2 text-sm">
              View our brochure
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
