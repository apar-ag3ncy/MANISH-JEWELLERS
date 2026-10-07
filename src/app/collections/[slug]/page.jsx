import { notFound } from "next/navigation";
import { collections, findCollection } from "@/data/collections";
import { CollectionDetail } from "@/components/sections/collections/CollectionDetail";

export const dynamicParams = false;
export function generateStaticParams() {
  return collections.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }) {
  const collection = findCollection((await params).slug);
  if (!collection) return {};
  return {
    title: collection.name,
    description: collection.description,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}
export default async function CollectionPage({ params }) {
  const collection = findCollection((await params).slug);
  if (!collection) notFound();
  return <CollectionDetail collection={collection} />;
}
