"use client";

import { useState } from "react";
import { Link } from "@/components/router/Link";
import { Button } from "@/components/ui/button";
import { InstitutionalBackground } from "@/components/ui/institutional-background";
import { TrustBadge } from "@/components/domain";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Database,
  TrendingUp,
  Zap,
  Leaf,
  BarChart3,
  Star,
  Clock,
  BadgeCheck,
  Users,
  FileText,
  Filter,
  ChevronRight,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const datasets = [
  {
    name: "Global Market Indicators",
    category: "Finance & Markets",
    supplier: "FinData Corp",
    records: "2.5M+",
    price: "$890/mo",
    verified: true,
    rating: 4.8,
    reviews: 124,
    updated: "2h ago",
    icon: TrendingUp,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
  },
  {
    name: "Energy Consumption Patterns",
    category: "Energy & Utilities",
    supplier: "EnergyMetrics Ltd",
    records: "1.8M+",
    price: "$720/mo",
    verified: true,
    rating: 4.9,
    reviews: 87,
    updated: "5h ago",
    icon: Zap,
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    name: "Climate & Environment Data",
    category: "Environment",
    supplier: "ClimateWatch",
    records: "3.2M+",
    price: "$650/mo",
    verified: true,
    rating: 4.7,
    reviews: 156,
    updated: "1d ago",
    icon: Leaf,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    name: "Trade & Economics Metrics",
    category: "Economics",
    supplier: "TradeData Inc",
    records: "4.1M+",
    price: "$980/mo",
    verified: true,
    rating: 4.9,
    reviews: 203,
    updated: "3h ago",
    icon: BarChart3,
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
];

const categories = [
  { name: "All Datasets", count: 1247 },
  { name: "Finance", count: 342 },
  { name: "Energy", count: 189 },
  { name: "Environment", count: 256 },
  { name: "Economics", count: 167 },
];

const filters = [
  { label: "Verified Only", active: true },
  { label: "Updated 7d", active: false },
  { label: "High Rating", active: true },
];

export function LandingHero() {
  const [activeTab] = useState("browse");

  return (
    <section className="relative pt-16 pb-16">
      {/* Gradient background with dot pattern */}
      <InstitutionalBackground />
      
      {/* Bottom gradient blend for seamless transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

      <div className="relative mx-auto max-w-7xl px-6 py-12 md:py-20 lg:py-28">
        {/* Hero content - single column, centered */}
        <div className="mx-auto max-w-5xl">
          {/* Registry badge */}
          <div className="mb-4 md:mb-6 flex justify-center">
            <div className="inline-flex items-center gap-1.5 md:gap-2 rounded-lg border border-primary/30 dark:border-white/30 bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10 px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-xl shadow-lg">
              <ShieldCheck className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              <span className="text-xs md:text-sm font-medium text-white">
                Verified Registry
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs md:text-sm text-white/80">
                Active
              </span>
            </div>
          </div>

          {/* Hero title */}
          <h1 className="text-center text-4xl font-semibold leading-tight tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Governed Marketplace
            <br />
            <span className="text-primary/70 dark:text-white/80">for Verified Datasets</span>
          </h1>

          {/* Description */}
          <p className="mt-4 md:mt-6 text-center mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0">
            Discover, evaluate, and purchase verified datasets through a governed marketplace. All datasets are reviewed before publication, with clear metadata, pricing, and access rules visible upfront.
          </p>

          {/* Search section with inline button */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 md:px-0">
            <div className="relative w-full max-w-2xl flex">
              <input
                type="text"
                placeholder="Search verified datasets..."
                className="h-12 md:h-14 w-full rounded-lg border border-primary/20 dark:border-white/20 bg-card/80 dark:bg-white/5 backdrop-blur-sm px-4 md:px-5 pl-11 md:pl-12 text-sm md:text-base text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/30 shadow-lg"
              />
              <Search className="absolute left-3 md:left-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-muted-foreground dark:text-white/60" />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="h-12 md:h-14 w-full sm:w-auto border-primary/20 dark:border-white/20 bg-transparent px-6 md:px-8 text-sm md:text-base font-medium text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 whitespace-nowrap"
              asChild
            >
              <Link href="/datasets">Browse All</Link>
            </Button>
          </div>

          {/* Trust badges section */}
          <div className="mt-12 md:mt-16">
            <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-12 gap-y-6">
              <TrustBadge icon={ShieldCheck} label="Verified Suppliers" iconColor="text-emerald-400" />
              <TrustBadge icon={CheckCircle2} label="Enforced Governance" iconColor="text-blue-400" />
              <TrustBadge icon={Eye} label="Transparent Pricing" iconColor="text-amber-400" />
              <TrustBadge icon={Database} label="Full Auditability" iconColor="text-purple-400" />
            </div>
          </div>
        </div>

        {/* Mockup browser interface - Full width container - NON-INTERACTIVE */}
        <div className="mt-20 relative w-full max-w-[1600px] mx-auto px-4 hidden md:block">
          {/* Main browser mockup */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 dark:border-white/20 bg-card dark:bg-white/5 shadow-[0_20px_80px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_80px_-12px_rgba(0,0,0,0.6)]">
            {/* Browser chrome */}
            <div className="flex items-center justify-between border-b border-primary/20 dark:border-white/20 bg-gradient-to-b from-[#f7f8fa] to-[#eef1f7] dark:bg-gradient-to-b dark:from-[#1a2240]/40 dark:to-[#0f1729]/40 px-4 py-3.5">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400/60 dark:bg-red-400/40 border border-red-500/30" />
                <div className="h-3 w-3 rounded-full bg-amber-400/60 dark:bg-amber-400/40 border border-amber-500/30" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/60 dark:bg-emerald-400/40 border border-emerald-500/30" />
              </div>
              <div className="flex flex-1 justify-center px-4">
                <div className="flex items-center gap-2 rounded-lg bg-white dark:bg-white/10 px-4 py-1.5 text-xs font-medium text-foreground/70 dark:text-white/70 border border-primary/20 dark:border-white/10 shadow-sm max-w-xs w-full">
                  <Lock className="h-3 w-3 text-emerald-500 dark:text-emerald-400" />
                  <span className="truncate">kuinbee.com/datasets</span>
                </div>
              </div>
              <div className="w-20" />
            </div>

            {/* App navigation tabs */}
            <div className="flex items-center gap-1 border-b-2 border-primary/15 dark:border-white/20 bg-gradient-to-r from-[#1a2240]/[0.06] via-[#2d3a5f]/[0.04] to-[#1a2240]/[0.06] dark:bg-gradient-to-r dark:from-[#0f1729]/60 dark:via-[#1a2240]/40 dark:to-[#0f1729]/60 px-6">
              {[
                { id: "browse", label: "Browse Datasets" },
                { id: "suppliers", label: "Suppliers" },
                { id: "activity", label: "Recent Activity" },
              ].map((tab) => (
                <div
                  key={tab.id}
                  className={cn(
                    "relative px-4 py-3 text-sm font-medium",
                    activeTab === tab.id
                      ? "text-primary dark:text-white"
                      : "text-muted-foreground/70 dark:text-white/60"
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#1a2240] via-[#2d3a5f] to-[#1a2240] dark:bg-white shadow-sm" />
                  )}
                </div>
              ))}
            </div>

            {/* App content */}
            <div className="bg-gradient-to-b from-[#fafbfc] via-[#f7f8fa] to-[#fafbfc] dark:bg-gradient-to-b dark:from-[#0a0f1e]/95 dark:via-[#0f1729]/90 dark:to-[#0a0f1e]/95">
              <div className="grid lg:grid-cols-[280px_1fr] min-h-[600px]">
                {/* Sidebar */}
                <div className="hidden lg:block border-r-2 border-primary/15 dark:border-white/20 bg-gradient-to-b from-[#1a2240]/[0.04] via-[#2d3a5f]/[0.02] to-transparent dark:bg-gradient-to-b dark:from-[#0f1729]/40 dark:via-[#1a2240]/20 dark:to-transparent p-6">
                  <div className="space-y-6">
                    {/* Categories */}
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">
                        Categories
                      </h3>
                      <div className="space-y-1">
                        {categories.map((cat, idx) => (
                          <div
                            key={cat.name}
                            className={cn(
                              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm",
                              idx === 0
                                ? "bg-gradient-to-r from-[#1a2240] via-[#242f52] to-[#2d3a5f] dark:bg-gradient-to-r dark:from-white/15 dark:via-white/12 dark:to-white/10 text-white dark:text-white font-medium shadow-md"
                                : "text-muted-foreground dark:text-white/70 bg-white/50 dark:bg-white/5 border border-primary/10 dark:border-white/10"
                            )}
                          >
                            <span>{cat.name}</span>
                            <span className={cn("text-xs", idx === 0 ? "text-white/80 dark:text-white/80" : "text-muted-foreground dark:text-white/60")}>{cat.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Filters */}
                    <div>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">
                        Filters
                      </h3>
                      <div className="space-y-2">
                        {filters.map((filter) => (
                          <label
                            key={filter.label}
                            className="flex items-center gap-2 text-sm text-foreground dark:text-white/80"
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded border shadow-sm",
                                filter.active
                                  ? "border-primary dark:border-white bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:bg-white"
                                  : "border-primary/30 dark:border-white/30 bg-white dark:bg-transparent"
                              )}
                            >
                              {filter.active && (
                                <CheckCircle2 className="h-3 w-3 text-white dark:text-[#1a2240]" />
                              )}
                            </div>
                            {filter.label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="rounded-lg border border-primary/20 dark:border-white/20 bg-gradient-to-br from-[#1a2240]/[0.08] via-[#2d3a5f]/[0.05] to-[#1a2240]/[0.03] dark:bg-gradient-to-br dark:from-white/10 dark:via-white/8 dark:to-white/5 p-4 shadow-md">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:bg-white/20">
                          <Users className="h-3.5 w-3.5 text-white dark:text-white" />
                        </div>
                        <span className="text-xs font-semibold text-foreground dark:text-white">
                          Active Today
                        </span>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#1a2240] via-[#2d3a5f] to-[#1a2240] dark:from-white dark:to-white bg-clip-text text-transparent">
                        2,847
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        +12% from yesterday
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main content */}
                <div className="p-6 space-y-6">
                  {/* Search and actions */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60 dark:text-white/40" />
                      <input
                        type="text"
                        placeholder="Search datasets..."
                        className="w-full rounded-lg border-2 border-primary/20 dark:border-white/20 bg-white dark:bg-white/5 pl-11 pr-4 py-3 text-sm text-foreground dark:text-white placeholder:text-muted-foreground/50 dark:placeholder:text-white/40 outline-none shadow-sm"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary/20 dark:border-white/20 bg-gradient-to-r from-[#1a2240]/[0.08] via-[#2d3a5f]/[0.05] to-[#1a2240]/[0.08] dark:bg-gradient-to-r dark:from-white/10 dark:via-white/8 dark:to-white/10 px-5 py-3 text-sm font-semibold text-primary dark:text-white shadow-sm">
                      <Filter className="h-4 w-4" />
                      <span>Filters</span>
                    </div>
                  </div>

                  {/* Dataset grid - NON-INTERACTIVE */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {datasets.map((dataset, idx) => {
                      const Icon = dataset.icon;
                      const isFirst = idx === 0;
                      return (
                        <div
                          key={dataset.name}
                          className={cn(
                            "relative rounded-xl border-2 p-5 shadow-md",
                            isFirst
                              ? "border-primary/40 dark:border-white/40 bg-gradient-to-br from-[#1a2240]/[0.12] via-[#2d3a5f]/[0.08] to-[#1a2240]/[0.05] dark:bg-gradient-to-br dark:from-white/15 dark:via-white/10 dark:to-white/8"
                              : "border-primary/20 dark:border-white/20 bg-white/60 dark:bg-white/5"
                          )}
                        >
                          {/* Header */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shadow-sm", dataset.bgColor)}>
                              <Icon className={cn("h-6 w-6", dataset.color)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-sm text-foreground dark:text-white line-clamp-2 mb-1">
                                {dataset.name}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground dark:text-white/60">
                                <span>{dataset.category}</span>
                              </div>
                            </div>
                            {dataset.verified && (
                              <div className="flex-shrink-0 flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400/15 to-emerald-500/15 dark:bg-emerald-400/10 px-2 py-1 border border-emerald-400/40 dark:border-emerald-400/30 shadow-sm">
                                <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">Verified</span>
                              </div>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground dark:text-white/60">
                            <div className="flex items-center gap-1">
                              <FileText className="h-3.5 w-3.5" />
                              <span>{dataset.records}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-foreground dark:text-white font-medium">{dataset.rating}</span>
                              <span>({dataset.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{dataset.updated}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>by {dataset.supplier}</span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between border-t-2 border-primary/15 dark:border-white/20 pt-4">
                            <div>
                              <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">Starting at</div>
                              <div className="text-lg font-bold bg-gradient-to-r from-[#1a2240] via-[#2d3a5f] to-[#1a2240] dark:from-white dark:to-white bg-clip-text text-transparent">{dataset.price}</div>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-primary dark:text-white">
                              View Details
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom fade gradient */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
