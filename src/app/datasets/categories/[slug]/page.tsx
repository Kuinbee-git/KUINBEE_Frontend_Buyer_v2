import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import {
  generateMetadata as genMeta,
  generateBreadcrumbSchema,
} from "@/core/config";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import {
  categorySlug,
  listPublicCategories,
  listPublicDatasets,
} from "@/services/public-catalogue.service";

const introductions: Record<string, string> = {
  "agriculture-and-food-security":
    "Explore agricultural and food-security datasets for research and analytics. Compare crop, production, and food-system coverage in the available listings.",
  economics:
    "Explore economic datasets for market research, policy analysis, and forecasting. Review the geographic coverage, indicators, periods, and sources of each listing.",
  finance:
    "Find financial datasets for business research and analytics. Compare the entities, measures, time periods, and access conditions covered by each dataset.",
  energy:
    "Explore energy datasets for research, forecasting, and operational analysis. Check the available measures, geographic coverage, formats, and update dates.",
  environment:
    "Find environmental datasets for climate and sustainability research. Compare coverage, measurement periods, provenance, and permitted uses.",
  healthcare:
    "Explore healthcare datasets for research and model development. Review each listing's content, provenance, licensing, and governance before selecting data for your project.",
  "medical-imagery":
    "Explore medical imaging datasets for computer-vision research and model development. Check modality, sample availability, coverage, and licensing on each listing.",
  "call-center":
    "Find call-center datasets for speech recognition and conversation analysis. Compare the languages, recording formats, samples, and permitted uses described in each listing.",
  manufacturing:
    "Explore manufacturing datasets for industrial analytics and AI research. Compare the recorded processes, signals, formats, and access conditions.",
  telecom:
    "Explore telecommunications datasets for research and analytics. Review content, language or geographic coverage, source, and licensing for each listing.",
};

const getCategory = cache(async (slug: string) => {
  const { items } = await listPublicCategories();
  const category = items.find(
    (item) => categorySlug(item.name) === slug && (item.datasetCount ?? 0) > 0
  );
  if (!category) notFound();
  return category;
});

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  const page = Math.max(
    1,
    Number.parseInt((await searchParams).page || "1", 10) || 1
  );
  return genMeta({
    title: `${category.name} Datasets${page > 1 ? ` — Page ${page}` : ""} | Kuinbee`,
    description:
      introductions[slug] ||
      `Browse ${category.name.toLowerCase()} datasets on Kuinbee. Compare published listings, formats, coverage, licensing, and access conditions.`,
    path: `/datasets/categories/${slug}${page > 1 ? `?page=${page}` : ""}`,
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const page = Math.max(
    1,
    Number.parseInt((await searchParams).page || "1", 10) || 1
  );
  const result = await listPublicDatasets({
    categoryId: category.id,
    page,
    pageSize: 20,
  });
  if (page > 1 && !result.items.length) notFound();
  const totalPages = Math.ceil(result.total / result.pageSize);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Datasets", url: "/datasets" },
    { name: "Categories", url: "/datasets/categories" },
    { name: `${category.name} datasets`, url: `/datasets/categories/${slug}` },
  ]);
  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c"),
        }}
      />
      <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        <Link
          href="/datasets/categories"
          className="text-sm text-muted-foreground underline"
        >
          All dataset categories
        </Link>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">
          {category.name} datasets
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">
          {introductions[slug] ||
            `Compare published ${category.name.toLowerCase()} datasets for research, analytics, and AI projects. Review each listing's source, coverage, format, and licensing before selecting data.`}
        </p>
        <p className="mt-5 text-sm text-muted-foreground">
          {result.total} listings · Page {page} of {totalPages || 1}
        </p>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {result.items.map((dataset) => (
            <li
              key={dataset.id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <h2 className="text-xl font-semibold leading-7">
                <Link
                  href={`/datasets/${dataset.id}`}
                  className="hover:underline"
                >
                  {dataset.title}
                </Link>
              </h2>
              <dl className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div>
                  <dt className="inline font-medium text-foreground">
                    Supplier:{" "}
                  </dt>
                  <dd className="inline">{dataset.owner.name}</dd>
                </div>
                {dataset.dataFormatInfo && (
                  <div>
                    <dt className="inline font-medium text-foreground">
                      Format:{" "}
                    </dt>
                    <dd className="inline">
                      {dataset.dataFormatInfo.fileFormat}
                    </dd>
                  </div>
                )}
                {dataset.location?.country && (
                  <div>
                    <dt className="inline font-medium text-foreground">
                      Country:{" "}
                    </dt>
                    <dd className="inline">{dataset.location.country}</dd>
                  </div>
                )}
              </dl>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Open the listing for its description, available sample,
                licensing, and full-data access conditions.
              </p>
            </li>
          ))}
        </ul>
        <nav
          aria-label="Category pagination"
          className="mt-8 flex gap-6 text-sm font-medium"
        >
          {page > 1 && (
            <Link
              href={`/datasets/categories/${slug}${page > 2 ? `?page=${page - 1}` : ""}`}
              className="underline"
            >
              Previous page
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/datasets/categories/${slug}?page=${page + 1}`}
              className="underline"
            >
              Next page
            </Link>
          )}
        </nav>
        <section className="mt-12 rounded-xl border border-border p-6">
          <h2 className="text-xl font-semibold">
            Choosing a dataset for your project
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Check whether the dataset covers your required geography and period,
            whether its format fits your workflow, and what the licence permits.
            Where a listing offers a sample, evaluate it before deciding on
            full-data access.
          </p>
          <Link
            href={`/datasets?category=${category.id}`}
            className="mt-4 inline-block font-medium underline"
          >
            Filter and compare {category.name.toLowerCase()} listings
          </Link>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
