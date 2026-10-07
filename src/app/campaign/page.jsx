import { BridalEditorial } from "@/components/sections/campaign/BridalEditorial";
import { campaignPage } from "@/data/internal-pages";

export const metadata = {
  title: "The bridal edit · 2026",
  description: campaignPage.introduction,
  alternates: { canonical: "/campaign" },
};
export default function CampaignPage() {
  return <BridalEditorial />;
}
