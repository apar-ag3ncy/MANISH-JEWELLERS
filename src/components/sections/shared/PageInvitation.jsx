import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function PageInvitation({
  eyebrow = "A personal invitation",
  heading = "The next chapter is yours.",
  body = "Visit the house in Beawar. Take your time, discover the details and find the piece that feels like you.",
}) {
  return (
    <section className="house-page-invitation house-section on-wine">
      <div className="container-x">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{heading}</h2>
        <p>{body}</p>
        <Link className="house-text-link" href="/visit">
          Visit our showroom <ArrowUpRight size={19} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
