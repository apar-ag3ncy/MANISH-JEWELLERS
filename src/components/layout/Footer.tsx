"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { newsletterSchema, type NewsletterInput } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { footer } from "@/data/content";
import { BrandWordmark } from "@/components/ui/brand/BrandLockup";

export function Footer() {
  const ref = useRef<HTMLElement>(null);

  /**
   * The closing chord. The masthead — the largest occurrence of the brand anywhere on
   * the site — rises out of its mask first; the rules and columns follow 0.4s
   * behind it; then a single sheen crosses the metal, the same gesture the lockup
   * performs at the top of the page, borrowed once at the bottom.
   *
   * REDUCED MOTION: nothing is set and nothing runs. The wordmark sits in place, the rules
   * are at full width, the columns are visible, and the sheen stays parked off-frame.
   */
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const words = el.querySelectorAll("[data-word]");
        const sheen = el.querySelector("[data-sheen]");
        const rules = el.querySelectorAll("[data-rule]");
        const cols = el.querySelectorAll("[data-col]");

        gsap.set(words, { yPercent: 110 });
        gsap.set(rules, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(cols, { y: 16, opacity: 0 });
        if (sheen) gsap.set(sheen, { xPercent: -60, opacity: 0 });

        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        tl.to(words, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.1 }, 0)
          .to(rules, { scaleX: 1, duration: 0.9, ease: "power3.out", stagger: 0.15 }, 0.4)
          .to(cols, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 0.7);

        if (sheen) {
          tl.to(sheen, { opacity: 1, duration: 0.3, ease: "none" }, 1.15)
            .to(sheen, { xPercent: 260, duration: 1.6, ease: "power2.inOut" }, 1.15)
            .to(sheen, { opacity: 0, duration: 0.4, ease: "none" }, 2.4);
        }
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="on-wine overflow-hidden bg-wine-deep text-cream">
      <div className="container-x pb-[clamp(80px,10vw,140px)]">
        {/* Masthead — the real wordmark in full, one line at every width. */}
        <div aria-hidden="true" className="relative overflow-hidden pt-[clamp(56px,7vw,112px)] text-cream/92">
          <span className="mask-line">
            <span data-word className="block will-change-transform">
              <BrandWordmark className="h-auto w-full" />
            </span>
          </span>
          <span
            data-sheen
            className="pointer-events-none absolute inset-y-0 left-0 w-[38%] [transform:translateX(-60%)] bg-linear-to-r from-transparent via-rose-light/22 to-transparent opacity-0"
          />
        </div>

        <div data-rule className="my-10 h-px w-full bg-cream/18 md:my-14" />

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {footer.columns.map((col) => (
            <div key={col.heading} data-col>
              <h2 className="eyebrow font-body text-cream/55">{col.heading}</h2>
              <ul className="mt-5 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="link-underline-draw text-[15px] font-light text-cream/80 transition-colors duration-300 hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div data-col>
            <h2 className="eyebrow font-body text-cream/55">{footer.newsletter.heading}</h2>
            <NewsletterForm />
          </div>
        </div>

        <div data-rule className="mt-14 mb-8 h-px w-full bg-cream/18" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 caption text-cream/70 sm:flex-row sm:gap-6">
            <span>{footer.legal.copyright}</span>
            <span>{footer.legal.marks}</span>
          </div>
          <ul className="flex items-center gap-2 caption text-cream/80">
            {footer.legal.links.map((l, i) => (
              <li key={l.label} className="flex items-center gap-2">
                {i > 0 ? <span aria-hidden="true">·</span> : null}
                <Link href={l.href} className="link-underline-draw transition-colors duration-300 hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

function NewsletterForm() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({ resolver: zodResolver(newsletterSchema) });

  // Phase 2: POST to a Route Handler that inserts into newsletter_subscribers.
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 300));
    setDone(true);
  };

  if (done) {
    return (
      <p className="mt-5 text-[15px] text-cream/80" role="status">
        {footer.newsletter.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-5">
      <label htmlFor="newsletter-email" className="sr-only">
        {footer.newsletter.placeholder}
      </label>
      <div className="group relative flex items-center">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder={footer.newsletter.placeholder}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "newsletter-error" : undefined}
          className="peer w-full bg-transparent py-2 pr-10 text-[15px] font-light text-cream placeholder:text-cream/50 focus:outline-none"
          {...register("email")}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label={footer.newsletter.submit}
          className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-full text-cream/80 transition-[color,transform] duration-500 ease-[var(--ease-lux)] hover:translate-x-1 hover:text-cream"
        >
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
        </button>
        {/* hairline: 18% at rest → full cream on focus */}
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-cream/18" />
        <span
          aria-hidden="true"
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-cream transition-transform duration-700 ease-[var(--ease-lux)] peer-focus:scale-x-100",
          )}
        />
      </div>
      {errors.email ? (
        <p id="newsletter-error" className="mt-2 caption text-cream/70" role="alert">
          {footer.newsletter.error}
        </p>
      ) : null}
    </form>
  );
}
