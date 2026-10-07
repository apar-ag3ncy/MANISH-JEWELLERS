import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { collections } from "@/data/collections";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/home`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    ...[
      "/collections",
      "/bespoke",
      "/campaign",
      "/visit",
      "/diamond-guide",
      ...collections.map(({ slug }) => `/collections/${slug}`),
    ].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
