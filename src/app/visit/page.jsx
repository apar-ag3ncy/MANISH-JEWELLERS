import { ShowroomVisit } from "@/components/sections/visit/ShowroomVisit";
import { visitPage } from "@/data/internal-pages";

export const metadata = {
  title: "Visit the house",
  description: visitPage.introduction,
  alternates: { canonical: "/visit" },
};
export default function VisitPage() {
  return <ShowroomVisit />;
}
