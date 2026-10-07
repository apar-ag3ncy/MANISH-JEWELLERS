import Link from "next/link";
import { marquee } from "@/data/content";
import { Monogram } from "@/components/ui/Monogram";

export function Marquee() {
  return (
    <nav aria-label="Discover jewellery" className="border-b border-cream-deep bg-cream text-wine">
      <div className="landing-marquee container-x">
        {marquee.map((item) => (
          <Link key={item} href="#collections" className="link-underline-draw">
            <Monogram className="h-3 w-auto text-wine-soft" />
            {item}
          </Link>
        ))}
      </div>
    </nav>
  );
}
