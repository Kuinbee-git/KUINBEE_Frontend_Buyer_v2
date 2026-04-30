"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "@/components/router/Link";
import {
  LayoutDashboard,
  Leaf,
  Brain,
  Car,
  Plane,
  Headphones,
  BarChart3,
  Zap,
  Globe,
  DollarSign,
  Map,
  HeartPulse,
  ShieldCheck,
  Factory,
  Cross,
  Scan,
  Sun,
  Mic,
  Signal,
  Database,
  ArrowRight
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

export const categoryIcons: Record<string, React.ElementType> = {
  "All Categories": LayoutDashboard,
  "Agriculture and Food Security": Leaf,
  "AI & ML": Brain,
  "Automobile": Car,
  "Aviation": Plane,
  "Call Center": Headphones,
  "Economics": BarChart3,
  "Energy": Zap,
  "Environment": Globe,
  "Finance": DollarSign,
  "Geospatial": Map,
  "Healthcare": HeartPulse,
  "Insurance": ShieldCheck,
  "Manufacturing": Factory,
  "Medical": Cross,
  "Medical Imagery": Scan,
  "Solar": Sun,
  "Speech": Mic,
  "Telecom": Signal
};

export type CategoryItem = {
  id: string;
  name: string;
};

interface DataCategoriesProps {
  categories?: CategoryItem[];
}

function getIconForCategory(name: string) {
  return categoryIcons[name] || Database;
}

export function DataCategories({ categories = [] }: DataCategoriesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="categories"
      className={cn(
        "relative bg-gradient-to-b from-background/50 via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e] pt-6 pb-16 md:pt-10 md:pb-24 transition-opacity duration-1000",
        isVisible ? "opacity-100" : "opacity-0"
      )}
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
        <div className="mb-12 text-center">
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
            Access verified datasets across regulated industries. Each domain
            maintains compliance standards and quality verification.
          </p>
        </div>

        {/* Categories Dense Grid Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {categories.map((category) => {
            const Icon = getIconForCategory(category.name);
            return (
              <Link
                key={category.id}
                href={`/datasets?category=${category.id}`}
                className="group relative flex flex-col items-center justify-center gap-3 rounded-xl border border-primary/10 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] p-5 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 dark:hover:border-white/20 hover:bg-white/80 dark:hover:bg-white/[0.06] hover:shadow-[0_8px_24px_-12px_rgba(26,34,64,0.15)] dark:hover:shadow-[0_8px_24px_-12px_rgba(255,255,255,0.1)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/5 dark:bg-white/5 text-primary dark:text-white transition-all group-hover:bg-primary/10 dark:group-hover:bg-white/10 group-hover:scale-110 duration-500 ease-out">
                  <Icon className="h-5 w-5 transition-transform group-hover:-rotate-3" />
                </div>
                <h3 className="line-clamp-2 text-sm font-medium text-primary dark:text-white px-1 leading-tight">
                  {category.name}
                </h3>
              </Link>
            );
          })}
          
          {categories.length === 0 && (
            <div className="col-span-full py-16 text-center text-sm text-muted-foreground bg-primary/5 dark:bg-white/5 rounded-xl border border-primary/10 dark:border-white/10">
               Marketplace categories are actively synchronizing.
            </div>
          )}
        </div>

        {/* View all CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/datasets"
            className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-foreground group"
          >
            <span>Browse Global Marketplace</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
