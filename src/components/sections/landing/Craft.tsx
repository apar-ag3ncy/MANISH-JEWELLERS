import { craft } from "@/data/content";
import { Reveal } from "@/components/ui/Reveal";
import { Rule } from "@/components/ui/Rule";

export function Craft() {
  return (
    <section id={craft.id} className="scroll-mt-24 bg-cream-soft section-y text-ink">
      <div className="container-x grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-5">
          <div className="md:sticky md:top-32">
            <Reveal>
              <p className="eyebrow text-wine-soft">{craft.eyebrow}</p>
              <h2 className="mt-6 max-w-[14ch] display-l">{craft.heading}</h2>
            </Reveal>
          </div>
        </div>

        <div className="col-span-12 mt-12 md:col-span-6 md:col-start-7 md:mt-0">
          {craft.notes.map((note, i) => (
            <div key={note.label} className="pb-10 md:pb-14">
              <Rule draw />
              <Reveal delay={0.15} className="grid gap-x-10 gap-y-3 pt-8 md:grid-cols-[7rem_1fr]">
                <span className="pt-2 eyebrow text-wine-soft tabular">
                  {String(i + 1).padStart(2, "0")} · {note.label}
                </span>
                <div>
                  <h3 className="display-m">{note.title}</h3>
                  <p className="mt-4 body-copy text-ink-muted">{note.body}</p>
                </div>
              </Reveal>
            </div>
          ))}
          <Rule draw />
        </div>
      </div>
    </section>
  );
}
