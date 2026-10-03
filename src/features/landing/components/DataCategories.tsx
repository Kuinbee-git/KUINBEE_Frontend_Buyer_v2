import { ArrowRight } from "lucide-react";

import { Link } from "@/components/router/Link";
import { CategoryCard } from "./category-card";

const categories = [
  {
    index: "01",
    name: "Egocentric",
    eyebrow: "Perspective systems",
    description:
      "First-person video and multimodal sensor data that captures how people see, move, and interact in real-world environments.",
    imageLight: "/images/categories/egocentric-sketch-navy-v2.webp",
    imageDark: "/images/categories/egocentric-sketch-navy-v2.webp",
    imageAlt:
      "Editorial sketch of a first-person view moving through an urban walkway",
    exploreHref: "/industries/egocentric",
    exploreLabel: "Explore Egocentric",
    buyHref: "/marketplace",
    sellHref: "/data-request",
  },
  {
    index: "02",
    name: "Healthcare",
    eyebrow: "Clinical systems",
    description:
      "Clinical, imaging, and outcomes data prepared for responsible research, model development, and real-world validation.",
    imageLight: "/images/categories/healthcare-sketch-navy-v2.webp",
    imageDark: "/images/categories/healthcare-sketch-navy-v2.webp",
    imageAlt:
      "Editorial sketch of a clinician reviewing anonymized medical scans",
    exploreHref: "/industries/healthcare",
    exploreLabel: "Explore Healthcare",
    buyHref: "/marketplace",
    sellHref: "/data-request",
  },
  {
    index: "03",
    name: "Voice",
    eyebrow: "Language systems",
    description:
      "Speech, language, and acoustic datasets spanning accents, environments, and natural conversational contexts.",
    imageLight: "/images/categories/voice-sketch-navy-v2.webp",
    imageDark: "/images/categories/voice-sketch-navy-v2.webp",
    imageAlt:
      "Editorial sketch of a speaker recording voice data with acoustic traces",
    exploreHref: "/industries/voice",
    exploreLabel: "Explore Voice",
    buyHref: "/marketplace",
    sellHref: "/data-request",
  },
] as const;

export function DataCategories() {
  return (
    <section
      id="categories"
      aria-labelledby="category-section-title"
      className="relative isolate overflow-hidden bg-background py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mb-12 sm:mb-14 lg:mb-16">
          <div className="mb-7 flex items-center justify-between gap-6 border-b border-black/10 pb-4 dark:border-white/[0.12]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.23em] text-foreground/[0.55]">
              Category index
            </p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              03 focused verticals
            </p>
          </div>

          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)] lg:gap-16">
            <h2
              id="category-section-title"
              className="max-w-3xl text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-[3.65rem] lg:leading-[1.03]"
            >
              Choose the world your data belongs to.
            </h2>

            <div className="lg:pb-1">
              <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-[17px] sm:leading-8">
                Enter through first-person perception, clinical evidence, or
                spoken language. Source what you need—or bring valuable data to
                market.
              </p>
              <Link
                href="/datasets"
                className="group/all mt-6 inline-flex items-center gap-2 border-b border-foreground/30 pb-1.5 text-sm font-semibold text-foreground transition-colors hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                Browse the full marketplace
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover/all:translate-x-1 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-4 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
