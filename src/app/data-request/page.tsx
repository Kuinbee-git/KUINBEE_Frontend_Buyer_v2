import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { DataRequestHubPage } from "@/features/data-request/DataRequestHubPage";

export const metadata: Metadata = genMeta({
  title: "Sell Data",
  description:
    "Explore active buyer requirements or learn how to become a trusted data supplier on Kuinbee.",
  keywords: [
    "sell data",
    "active data requirements",
    "data supplier",
    "data opportunities",
    "monetize data",
  ],
  path: "/data-request",
});

export default function DataRequestPage() {
  return <DataRequestHubPage />;
}
