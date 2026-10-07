import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ScrollMotion } from "@/components/motion/ScrollMotion";
import { campaignPage } from "@/data/internal-pages";
import { PageInvitation } from "@/components/sections/shared/PageInvitation";

export function BridalEditorial() {
  return (
    <>
      <ScrollMotion className="house-page">
        <section className="bridal-introduction container-x">
          <div data-scroll-fade>
            <p className="eyebrow text-wine-soft">{campaignPage.eyebrow}</p>
            <h1>{campaignPage.heading}</h1>
            <p>{campaignPage.introduction}</p>
            <a href="#bridal-story" className="house-text-link">
              Explore the story <ArrowDown size={18} aria-hidden="true" />
            </a>
          </div>
          <div className="bridal-introduction-image" data-image-swipe>
            <Image
              src="/campaign/mj-396.jpg"
              alt="A bride seated in a crimson room, wearing a complete bridal jewellery set"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[50%_45%]"
            />
          </div>
          <div className="bridal-caption">
            <span>Manish Jewellers</span>
            <span>The bridal edit, 2026</span>
          </div>
        </section>
        <section id="bridal-story" className="bridal-chapters container-x" aria-label="The bridal story">
          {campaignPage.chapters.map((chapter) => (
            <article key={chapter.number} className="bridal-chapter house-section">
              <div className="bridal-chapter-image" data-image-swipe>
                <Image
                  src={chapter.image}
                  alt={chapter.alt}
                  fill
                  sizes="(min-width: 1024px) 45vw, 90vw"
                  className="object-cover"
                  style={{ objectPosition: chapter.position }}
                />
              </div>
              <div className="bridal-chapter-copy" data-scroll-fade>
                <span className="bridal-chapter-number">{chapter.number}</span>
                <p className="eyebrow text-wine-soft">{chapter.eyebrow}</p>
                <h2>{chapter.heading}</h2>
                <p>{chapter.body}</p>
                <Link href="/collections" className="house-text-link">
                  Discover the collection <ArrowUpRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </section>
        <section className="bridal-pair house-section container-x" aria-label="Shared moments in the bridal campaign">
          <div data-image-swipe>
            <Image
              src="/campaign/mj-1832.jpg"
              alt="Two brides together, wearing expressive gold and polki jewellery"
              fill
              sizes="(min-width: 768px) 53vw, 90vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
          <div data-scroll-fade>
            <p className="eyebrow text-wine-soft">Celebrated together</p>
            <h2>
              Some stories
              <br />
              are shared.
            </h2>
            <p>
              For the people beside you, and the generations behind you. Discover the house’s own story of belonging.
            </p>
            <Link href="/about#heritage" className="house-text-link">
              Journey through 110 years <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </ScrollMotion>
      <PageInvitation heading="Begin your bridal story." />
    </>
  );
}
