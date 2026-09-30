import Link from "next/link";
import { generateMetadata as genMeta } from "@/core/config";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import {
  categorySlug,
  listPublicCategories,
} from "@/services/public-catalogue.service";

export const revalidate = 3600;
export const metadata = genMeta({
  title: "Dataset Categories for AI, Research and Analytics | Kuinbee",
  description:
    "Explore datasets by subject: agriculture, economics, finance, energy, environment, healthcare, speech, and manufacturing. Compare available data and access details.",
  path: "/datasets/categories",
});

export default async function DatasetCategoriesPage() {
  const { items } = await listPublicCategories();
  const categories = items.filter(
    (category) => (category.datasetCount ?? 0) > 0
  );
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        <Link
          href="/datasets"
          className="text-sm text-muted-foreground underline"
        >
          All datasets
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          Find datasets by category
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          Start with the subject you need, then compare available datasets by
          coverage, format, source, and licensing. These categories contain
          published listings; each dataset page explains its sample and
          full-data access conditions.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li
              key={category.id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-xl font-semibold">
                <Link
                  href={`/datasets/categories/${categorySlug(category.name)}`}
                  className="hover:underline"
                >
                  {category.name} datasets
                </Link>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {category.datasetCount} published listings
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-muted-foreground">
          Need data that is not already listed?{" "}
          <Link
            href="/data-request/services"
            className="font-medium text-foreground underline"
          >
            Explore custom data collection services
          </Link>
          .
        </p>
      </main>
      <LandingFooter />
    </div>
  );
}
