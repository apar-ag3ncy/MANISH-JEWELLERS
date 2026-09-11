import { notFound } from "@/data/content";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="bg-cream-soft section-y text-ink">
      <div className="container-x grid grid-cols-12 gap-6 pt-24">
        <div className="col-span-12 md:col-span-8 md:col-start-2">
          <p className="eyebrow text-wine-soft">{notFound.eyebrow}</p>
          <h1 className="mt-6 display-l">{notFound.heading}</h1>
          <p className="mt-6 max-w-[48ch] body-l text-ink-muted">{notFound.body}</p>
          <div className="mt-10">
            <Button href={notFound.cta.href} variant="secondary">
              {notFound.cta.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
