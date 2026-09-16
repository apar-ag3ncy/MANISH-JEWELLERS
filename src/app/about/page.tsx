import type { Metadata } from "next";
import { about } from "@/data/content";
import { AboutStory } from "@/components/sections/about/AboutStory";

export const metadata: Metadata = {
  title: about.title,
  description: about.description,
  alternates: { canonical: about.path },
};

export default function AboutPage() {
  return <AboutStory />;
}
