import {
  MarketplaceOptions,
  type MarketplaceOption,
} from "@/features/marketplace/MarketplaceOptions";
import { DataOpportunityShell } from "./DataOpportunityShell";

const options: MarketplaceOption[] = [
  {
    index: "01",
    eyebrow: "Buyer Demand",
    title: "Active Requirements",
    summary: "Discover current data needs from qualified buyers.",
    description:
      "Review open data requirements and identify opportunities that match your coverage, capabilities, and delivery model.",
    features: [
      "Current opportunities",
      "Clear requirement briefs",
      "Supplier-ready demand",
    ],
    href: "/data-request/active-requirements",
    cta: "View requirements",
  },
  {
    index: "02",
    eyebrow: "Supplier Guidance",
    title: "Supplier Resources",
    summary: "Learn how to become a trusted data supplier.",
    description:
      "Explore practical guidance for listing, monetizing, and managing your datasets on the Kuinbee marketplace.",
    features: [
      "Step-by-step guidance",
      "Supplier best practices",
      "Dataset monetization",
    ],
    href: "/supplier-resources",
    cta: "Explore resources",
  },
];

export function DataRequestHubPage() {
  return (
    <DataOpportunityShell>
      <section className="relative pb-24 pt-24 md:pt-32">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70">
              Sell Data
            </p>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Put your data to work
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
              Review active buyer requirements or explore resources for
              becoming a trusted data supplier.
            </p>
          </div>

          <MarketplaceOptions options={options} />
        </div>
      </section>
    </DataOpportunityShell>
  );
}
