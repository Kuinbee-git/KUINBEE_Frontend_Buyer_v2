"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/router/Link";
import {
  TrendingUp,
  Zap,
  Leaf,
  Wheat,
  BarChart3,
  Building2,
  ArrowRight,
  Database,
} from "lucide-react";
import { CategoryCard } from "./category-card";

const categories = [
  {
    icon: TrendingUp,
    name: "Finance & Markets",
    description:
      "Verified market data, trading patterns, economic indicators, and regulated financial analytics",
    datasets: "2,500+",
    href: "/datasets?category=finance",
  },
  {
    icon: Zap,
    name: "Energy & Utilities",
    description:
      "Power generation metrics, consumption patterns, renewable sources, and grid analytics",
    datasets: "1,800+",
    href: "/datasets?category=energy",
  },
  {
    icon: Leaf,
    name: "Environment & Climate",
    description:
      "Climate data, emissions tracking, biodiversity metrics, and sustainability indicators",
    datasets: "3,200+",
    href: "/datasets?category=environment",
  },
  {
    icon: Wheat,
    name: "Agriculture & Food",
    description:
      "Crop yields, supply chain data, nutrition metrics, and agricultural trends",
    datasets: "1,400+",
    href: "/datasets?category=agriculture",
  },
  {
    icon: BarChart3,
    name: "Economics & Trade",
    description:
      "GDP metrics, trade data, employment statistics, and economic forecasts",
    datasets: "2,100+",
    href: "/datasets?category=economics",
  },
  {
    icon: Building2,
    name: "Real Estate",
    description:
      "Property valuations, market trends, transaction data, and development metrics",
    datasets: "Coming Soon",
    href: "/datasets?category=realestate",
    comingSoon: true,
  },
];

export function DataCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className={`relative bg-gradient-to-b from-background/50 via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e] pt-12 pb-16 md:pt-16 md:pb-24 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
    >
      {/* Subtle pattern for light mode depth */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(26, 34, 64, 0.04) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 relative z-20">
        {/* Section header */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/30 dark:border-white/20 bg-primary/5 dark:bg-white/5 px-4 py-2 mb-6 backdrop-blur-sm shadow-sm">
            <Database className="h-4 w-4 text-primary dark:text-white" />
            <span className="text-sm font-medium text-primary dark:text-white">
              Registry Organization
            </span>
          </div>
          <h2 className="mt-4 text-3xl font-medium tracking-tight text-primary sm:text-4xl md:text-5xl">
            Datasets Classified by
            <br />
            <span className="text-muted-foreground">Industry Vertical</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Access verified datasets across regulated industries. Each category
            maintains compliance standards and quality verification.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              description={category.description}
              icon={category.icon}
              datasets={category.datasets}
              href={category.href}
              comingSoon={category.comingSoon}
            />
          ))}
        </div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/datasets"
            className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-foreground"
          >
            <span>Browse Marketplace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
