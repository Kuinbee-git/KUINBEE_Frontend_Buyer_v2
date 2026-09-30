import Link from "next/link";
import {
  categorySlug,
  listPublicCategories,
} from "@/services/public-catalogue.service";

export async function DatasetCategoryDirectory() {
  // A catalogue outage should not prevent the marketing homepage from rendering.
  const result = await listPublicCategories().catch((error) => {
    console.error("Homepage category directory unavailable", error);
    return null;
  });
  if (!result) return null;
  const categories = result.items.filter(
    (category) => (category.datasetCount ?? 0) > 0
  );
  return (
    <section
      className="bg-background px-6 py-16"
      aria-labelledby="dataset-subjects-title"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="dataset-subjects-title"
          className="text-3xl font-semibold tracking-tight"
        >
          Browse datasets by subject
        </h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">
          Explore published datasets for AI, research, and analytics. Review the
          coverage, source, licensing, and sample access on each listing.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/datasets/categories/${categorySlug(category.name)}`}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-5 py-4 font-medium transition-colors hover:bg-muted"
              >
                <span>{category.name} datasets</span>
                <span className="text-sm text-muted-foreground">
                  {category.datasetCount}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/datasets/categories"
          className="mt-6 inline-block font-medium underline underline-offset-4"
        >
          All dataset categories
        </Link>
      </div>
    </section>
  );
}
