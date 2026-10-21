import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { legacy } from "@/data/legacy";
import { ScrollMotion } from "@/components/motion/ScrollMotion";

export function AboutStory() {
  return (
    <ScrollMotion as="section" className="house-introduction bg-cream-soft text-wine">
      <div className="house-introduction-grid container-x">
        <div data-scroll-fade>
          <p className="eyebrow text-wine-soft">{legacy.eyebrow}</p>
          <h1>{legacy.heading}</h1>
          <p className="house-introduction-body">{legacy.introduction}</p>
          <a href="#heritage" className="house-story-link ui-label">
            Travel through our story
            <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="house-anniversary">
          <div className="house-heritage-visual" aria-hidden="true">
            <Image
              src={legacy.visual.src}
              alt=""
              width={legacy.visual.width}
              height={legacy.visual.height}
              sizes="(max-width: 767px) 220px, (max-width: 1100px) 240px, 280px"
              priority
            />
          </div>
          <p className="house-anniversary-founding">
            <span className="eyebrow house-anniversary-since">Since</span>{" "}
            <span className="house-anniversary-number">{legacy.firstYear}</span>
          </p>
          <p className="eyebrow">
            Generations of trust
          </p>
          <p className="house-anniversary-dates">
            <span aria-hidden="true" />
            {legacy.anniversaryYears} years in {legacy.currentYear}
            <span aria-hidden="true" />
          </p>
        </div>
      </div>
      <div className="house-introduction-foot container-x">
        <span>Crafted through generations</span>
        <span>
          आपके अपने <span aria-hidden="true">·</span> Beawar, Rajasthan
        </span>
      </div>
    </ScrollMotion>
  );
}
