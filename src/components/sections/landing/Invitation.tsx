import { invitation } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ArchPattern } from "@/components/ui/ArchPattern";

/** The only centered block on the landing page. */
export function Invitation() {
  return (
    <section className="on-wine relative overflow-hidden bg-wine section-y text-cream">
      <ArchPattern
        size={72}
        className="[mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)] text-cream/[0.07]"
      />
      <div className="relative container-x text-center">
        <Reveal>
          <h2 className="mx-auto max-w-[16ch] display-l">{invitation.heading}</h2>
          <p className="mx-auto mt-6 max-w-[40ch] body-l text-cream/75">{invitation.body}</p>
          <div className="mt-10">
            <MagneticButton>
              <Button href={invitation.cta.href} variant="solid">
                {invitation.cta.label}
              </Button>
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
