import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function PageInvitation({
  eyebrow,
  heading = "Visit us in Beawar.",
  body,
}) {
  return (
    <section className="house-page-invitation house-section on-wine">
      <div className="container-x">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{heading}</h2>
          {body && <p>{body}</p>}
        </div>
        <Link className="house-text-link" href="/visit">
          Plan your visit <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
