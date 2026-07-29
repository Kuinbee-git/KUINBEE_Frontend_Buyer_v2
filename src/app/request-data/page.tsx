import type { Metadata } from "next";
import { Suspense } from "react";
import { generateMetadata as genMeta } from "@/core/config";
import { DataRequestPageContent } from "@/app/data-request/_components/DataRequestPageContent";

export const metadata: Metadata = genMeta({
  title: "Request Custom Data",
  description:
    "Can't find the dataset you need? Submit a custom data request and our sourcing team will find, verify, and deliver it.",
  keywords: [
    "custom data request",
    "data sourcing",
    "custom datasets",
    "data procurement",
    "bespoke data",
  ],
  path: "/request-data",
});

export default function RequestDataPage() {
  return (
    <Suspense>
      <DataRequestPageContent />
    </Suspense>
  );
}
