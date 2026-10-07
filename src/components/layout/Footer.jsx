import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { footer } from "@/data/content";
import { landingFooter } from "@/data/enhance-landing";
import { BrandWordmark } from "@/components/ui/brand/BrandLockup";

export function Footer({ wordmarkRef, wordmarkSlotRef }) {
  return (
    <footer id="house-footer" className="on-wine overflow-hidden bg-wine-deep text-cream">
      <div className="container-x pb-[clamp(80px,10vw,140px)]">
        <div aria-hidden="true" className="pt-[clamp(88px,7vw,112px)]">
          <div ref={wordmarkSlotRef} className="house-footer-wordmark-slot">
            <div ref={wordmarkRef} className="house-footer-wordmark" data-footer-wordmark>
              <BrandWordmark className="h-auto w-full" />
            </div>
          </div>
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

          <div data-col className="col-span-2 md:col-span-1">
            <h2 className="eyebrow font-body text-cream/75">{footer.contact.heading}</h2>
            <p className="mt-5 text-[17px] text-cream">{footer.contact.name}</p>
            <a
              href={footer.contact.phoneHref}
              className="footer-contact-phone house-text-link mt-3 inline-flex items-center gap-2"
              aria-label={`Call ${footer.contact.name} on ${footer.contact.phone}`}
            >
              <Phone size={14} aria-hidden="true" />
              {footer.contact.phone}
            </a>
            <h3 className="mt-9 eyebrow font-body text-cream/75">{landingFooter.heading}</h3>
            <p className="mt-3 text-[15px] text-cream/80">{landingFooter.body}</p>
            <Link href="/about#brochure" className="link-underline mt-5 inline-flex items-center gap-2 py-2 text-sm">
              {landingFooter.cta}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div data-rule className="mt-14 mb-8 h-px w-full bg-cream/18" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 caption text-cream/70 sm:flex-row sm:gap-6">
            <span>{footer.legal.copyright}</span>
            <span>{footer.legal.marks}</span>
          </div>
          <ul className="flex items-center gap-2 caption text-cream/80">
            {[
              { label: "Our story", href: "/about" },
              { label: "Visit us", href: "/visit" },
            ].map((l, i) => (
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
