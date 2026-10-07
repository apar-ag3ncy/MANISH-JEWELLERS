import { BespokeExperience } from "@/components/sections/bespoke/BespokeExperience";
import { bespokePage } from "@/data/internal-pages";

export const metadata = {
  title: "Bespoke jewellery",
  description: bespokePage.introduction,
  alternates: { canonical: "/bespoke" },
};
export default function BespokePage() {
  return <BespokeExperience />;
}
