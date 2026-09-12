import { invitation, landingInvitation, landingInvitationImage } from "@/data/content";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArchPattern } from "@/components/ui/ArchPattern";
import { ArchFrame } from "@/components/ui/ArchFrame";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { ParallaxLayer } from "@/components/ui/ParallaxLayer";
import { SectionHead } from "@/components/ui/SectionHead";

/**
 * The invitation. One of the three permitted ArchFrames on the site: the photograph's
 * own carved arch sits inside the brand arch, so picture and mark rhyme.
 */
export function Invitation() {
  return (
    <section className="on-wine relative overflow-hidden bg-wine section-y text-cream">
      <ParallaxLayer y={6} scale={[1.06, 1]} className="pointer-events-none absolute inset-0">
        <div className="relative h-[130svh] w-full">
          <ArchPattern
            size={72}
            className="[mask-image:radial-gradient(ellipse_at_50%_38%,black_18%,transparent_72%)] text-cream/[0.07]"
          />
        </div>
      </ParallaxLayer>

      <div className="relative container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <ArchFrame ratio={0.8} className="w-full max-w-[520px] lg:col-span-5 lg:max-w-none">
          <ImageFrame
            src={landingInvitationImage.src}
            alt={landingInvitationImage.alt}
            sizes="(min-width: 1024px) 38vw, 100vw"
            focus={landingInvitationImage.focus}
            curtain="wine"
            depth={4}
            className="aspect-[4/5] h-full w-full"
          />
        </ArchFrame>

        <SectionHead
          tone="wine"
          eyebrow={landingInvitation.eyebrow}
          heading={invitation.heading}
          lede={invitation.body}
          headingClassName="max-w-[14ch]"
          className="lg:col-span-6 lg:col-start-7"
        >
          <div className="mt-10">
            <MagneticButton>
              <Button href={invitation.cta.href} variant="solid">
                {invitation.cta.label}
              </Button>
            </MagneticButton>
          </div>
        </SectionHead>
      </div>
    </section>
  );
}
