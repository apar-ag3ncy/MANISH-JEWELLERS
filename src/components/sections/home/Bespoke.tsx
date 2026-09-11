import { bespoke } from "@/data/content";
import { pad2 } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Monogram } from "@/components/ui/Monogram";

export function Bespoke() {
  return (
    <section id={bespoke.id} className="on-wine relative scroll-mt-20 overflow-hidden bg-wine section-y text-cream">
      <Monogram className="pointer-events-none absolute top-1/2 -right-[6%] h-[110%] w-auto -translate-y-1/2 text-cream/[0.035]" />
      <div className="relative container-x grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-7">
          <Reveal>
            <p className="eyebrow text-cream/70">{bespoke.eyebrow}</p>
            <h2 className="mt-6 max-w-[16ch] display-l">{bespoke.heading}</h2>
            <p className="mt-6 max-w-[46ch] body-l text-cream/75">{bespoke.lede}</p>
          </Reveal>

          <ol className="mt-14">
            {bespoke.steps.map((step, i) => (
              <li key={step.title}>
                <Rule tone="wine" draw />
                <Reveal delay={0.1} className="grid grid-cols-[3.5rem_1fr] gap-6 py-8">
                  <span className="font-display text-[clamp(1.5rem,2.6vw,2.25rem)] leading-none text-cream/55 tabular">
                    {pad2(i + 1)}
                  </span>
                  <div>
                    <h3 className="display-m">{step.title}</h3>
                    <p className="mt-3 body-copy text-cream/75">{step.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
            <Rule tone="wine" draw />
          </ol>
        </div>

        <div className="col-span-12 flex flex-col justify-end lg:col-span-4 lg:col-start-9">
          <Reveal>
            <MagneticButton>
              <Button href={bespoke.cta.href} variant="outline-cream">
                {bespoke.cta.label}
              </Button>
            </MagneticButton>
            <p className="mt-6 caption text-cream/60">{bespoke.aside}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
