import { about, heritage } from "@/data/content";
import { SectionHead } from "@/components/ui/SectionHead";
import { ImageFrame } from "@/components/ui/ImageFrame";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";
import { Button } from "@/components/ui/Button";

/**
 * About us — the brochure's हम spread, set for the screen.
 *
 * Left, the goldsmith with the brochure's own caption; right, the house's four
 * paragraphs, verbatim. Below, the five milestones as a still strip — the scrubbed
 * version lives on /home, and a story page wants to be read, not driven.
 * The Devanagari mark is set in the body face on purpose: the display serif has
 * no Devanagari, and a fallback glyph in Bodoni would be a lie.
 */
export function AboutStory() {
  return (
    <>
      <section className="bg-cream-soft text-ink">
        <div className="container-x pt-[clamp(120px,16vh,180px)] pb-[clamp(64px,8vw,120px)]">
          <Reveal>
            <p className="font-body text-[clamp(3.5rem,9vw,7.5rem)] leading-none text-rose-deep">{about.mark}</p>
          </Reveal>
          <SectionHead
            as="h1"
            eyebrow={about.eyebrow}
            heading={about.heading}
            headingClassName="[font-size:clamp(2.25rem,6.2vw,6.5rem)]! md:whitespace-nowrap"
            className="mt-8"
          />
        </div>
      </section>

      <section className="bg-white text-ink">
        <div className="container-x grid grid-cols-12 gap-x-6 gap-y-12 py-[clamp(64px,8vw,120px)]">
          <figure className="col-span-12 lg:col-span-6">
            <ImageFrame
              src={about.photo.src}
              alt={about.photo.alt}
              sizes="(min-width: 1024px) 48vw, 100vw"
              focus="object-[50%_45%]"
              curtain="white"
              depth={4}
              className="aspect-[4/3] w-full"
            />
            <figcaption className="mt-5 font-display text-[clamp(1.25rem,2vw,1.6rem)] leading-[1.3] text-ink">
              {about.photo.caption.text} <em className="text-wine-soft italic">{about.photo.caption.italic}</em>
            </figcaption>
          </figure>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-6">
            <Reveal stagger={0.12} className="space-y-6">
              {about.paragraphs.map((p) => (
                <p key={p} className="body-copy text-ink-muted">
                  {p}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-cream text-ink">
        <div className="container-x py-[clamp(64px,8vw,120px)]">
          <Reveal>
            <p className="eyebrow text-wine-soft">{about.timelineEyebrow}</p>
          </Reveal>
          <Rule draw className="mt-6" />
          <Reveal stagger={0.08} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5">
            {heritage.milestones.map((m) => (
              <div key={m.year}>
                <p className="font-display text-[clamp(2rem,3.4vw,3rem)] leading-none text-wine tabular">{m.year}</p>
                <p className="mt-3 caption text-ink-muted">{m.label}</p>
              </div>
            ))}
          </Reveal>
          <Rule draw delay={0.2} className="mt-10" />
          <Reveal className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href={about.cta.href} variant="secondary">
              {about.cta.label}
            </Button>
            <Button href={about.secondary.href} variant="outline">
              {about.secondary.label}
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
