"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Link } from "@/components/router/Link";
import { Button, Input } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { SearchSuggestionDropdown } from "@/shared/components/ui/search-suggestion-dropdown";
import { useSearchSuggestions } from "@/hooks/api/useSearchSuggestions";
import { TrustBadge } from "./trust-badge";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Database,
  ArrowRight,
  Info,
  X,
} from "lucide-react";

export function LandingHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: suggestions, isLoading: suggestionsLoading } =
    useSearchSuggestions(debouncedQuery);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length > 200) {
        toast.error("Search query cannot exceed 200 characters.");
        return;
      }
      setSearchQuery(e.target.value);
      setShowSuggestions(true);
    },
    []
  );


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 200) {
      toast.error("Search query cannot exceed 200 characters.");
      return;
    }
    setShowSuggestions(false);
    if (searchQuery.trim()) {
      router.push(`/datasets?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/datasets");
    }
  };

  return (
    <section id="hero" className="relative pt-6 pb-16">
      {/* Gradient background with dot pattern */}
      <InstitutionalBackground />

      {/* Radial glow effects - visible brand-colored glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top center glow - light theme */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[900px] blur-3xl opacity-75 dark:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, rgba(71, 85, 105, 0.05) 35%, rgba(51, 65, 85, 0.02) 55%, transparent 75%)",
          }}
        />
        {/* Top center glow - dark theme */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 hidden h-[900px] w-[1100px] -translate-x-1/2 blur-3xl opacity-85 dark:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(26, 34, 64, 0.5) 0%, rgba(45, 58, 95, 0.35) 35%, rgba(26, 34, 64, 0.2) 55%, transparent 75%)",
          }}
        />

        {/* Left side glow - light theme */}
        <div
          className="absolute top-1/3 -left-32 h-[750px] w-[750px] blur-3xl opacity-65 dark:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, rgba(51, 65, 85, 0.04) 40%, rgba(30, 41, 59, 0.02) 60%, transparent 80%)",
          }}
        />
        {/* Left side glow - dark theme */}
        <div
          className="absolute top-1/3 -left-32 hidden h-[750px] w-[750px] blur-3xl opacity-75 dark:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(78, 90, 126, 0.45) 0%, rgba(45, 58, 95, 0.3) 40%, rgba(36, 47, 82, 0.18) 60%, transparent 80%)",
          }}
        />

        {/* Right side glow - light theme */}
        <div
          className="absolute top-1/3 -right-32 h-[750px] w-[750px] blur-3xl opacity-65 dark:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(100, 116, 139, 0.06) 0%, rgba(71, 85, 105, 0.04) 40%, rgba(51, 65, 85, 0.02) 60%, transparent 80%)",
          }}
        />
        {/* Right side glow - dark theme */}
        <div
          className="absolute top-1/3 -right-32 hidden h-[750px] w-[750px] blur-3xl opacity-75 dark:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(45, 58, 95, 0.45) 0%, rgba(78, 90, 126, 0.3) 40%, rgba(26, 34, 64, 0.18) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* Bottom gradient blend for seamless transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

      <div className="relative z-20 mx-auto max-w-7xl px-6 pt-12 pb-6 md:pt-20 md:pb-10 lg:pt-28 lg:pb-12">
        {/* Hero content - single column, centered */}
        <div className="mx-auto max-w-5xl">
          {/* Member of */}
          <div className="mb-6 md:mb-8 flex flex-row items-center justify-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70 dark:text-white/40">
              Member of
            </span>
            <div className="flex items-center justify-center transition-all duration-300">
              <Image
                src="/nvidia-inception-program-badge-rgb-for-screen.svg"
                alt="NVIDIA Inception Program"
                width={100}
                height={40}
                loading="lazy"
                className="object-contain"
              />
            </div>
          </div>

          {/* Hero title */}
          <h1 className="text-center text-4xl font-semibold leading-tight tracking-tight text-primary dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Dataset Marketplace
            <br />
            <span className="text-primary/70 dark:text-white/80">
              for AI and Research
            </span>
          </h1>

          {/* Description */}
          <p className="mt-4 md:mt-6 text-center mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0">
            Find and buy datasets for AI training, research, and analytics.
            Compare finance, healthcare, energy, and environmental data, with
            licensing, samples, and access details on each listing.
          </p>

          {/* Search section with inline button */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 md:px-0">
            <form
              ref={formRef}
              onSubmit={handleSearch}
              className="relative flex w-full max-w-2xl"
            >
              <button
                type="submit"
                className="absolute left-0 top-0 bottom-0 z-10 flex w-12 items-center justify-center rounded-l-xl text-[#4e5a7e] transition-colors hover:text-[#1a2240] dark:text-white/60 dark:hover:text-white md:w-14"
                aria-label="Search"
              >
                <Search className="size-5" aria-hidden="true" />
              </button>
              <Input
                type="text"
                value={searchQuery}
                onChange={handleQueryChange}
                onFocus={() =>
                  searchQuery.trim().length >= 2 && setShowSuggestions(true)
                }
                placeholder="Search datasets and services"
                className="h-12 rounded-xl border-[#1a2240]/20 bg-white/95 pr-11 pl-14 text-base text-[#1a2240] shadow-sm backdrop-blur-md placeholder:text-sm placeholder:text-[#4e5a7e]/60 focus-visible:ring-[#1a2240]/30 dark:border-white/20 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40 dark:focus-visible:ring-white/30 md:h-14 md:pl-16"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e);
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
                aria-label="Search datasets and services"
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setDebouncedQuery("");
                    setShowSuggestions(false);
                  }}
                  className="absolute right-2.5 top-1/2 z-10 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[#4e5a7e] transition-colors hover:bg-muted hover:text-foreground dark:text-white/60"
                  aria-label="Clear search"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              )}
              {showSuggestions && (
                <SearchSuggestionDropdown
                  datasets={suggestions?.datasets ?? []}
                  services={suggestions?.services ?? []}
                  isLoading={
                    suggestionsLoading ||
                    debouncedQuery.trim() !== searchQuery.trim()
                  }
                  query={debouncedQuery}
                  onClose={() => setShowSuggestions(false)}
                />
              )}
            </form>
            <Button
              variant="outline"
              size="lg"
              className="h-12 md:h-14 w-full sm:w-auto border-primary/20 dark:border-white/20 bg-transparent px-6 md:px-8 text-sm md:text-base font-medium text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 whitespace-nowrap"
              asChild
            >
              <Link href="/marketplace">Browse All</Link>
            </Button>
            <Button
              size="lg"
              className="h-12 md:h-14 w-full sm:w-auto bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90 px-6 md:px-8 text-sm md:text-base font-medium whitespace-nowrap"
              asChild
            >
              <Link href="/supplier-resources">Be a Supplier</Link>
            </Button>
          </div>

          {/* Trust badges section */}
          <div className="mt-12 md:mt-16">
            <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-12 gap-y-6">
              <TrustBadge
                icon={ShieldCheck}
                label="Verified Suppliers"
                iconColor="text-emerald-400"
              />
              <TrustBadge
                icon={CheckCircle2}
                label="Enforced Governance"
                iconColor="text-blue-400"
              />
              <TrustBadge
                icon={Eye}
                label="Transparent Pricing"
                iconColor="text-amber-400"
              />
              <TrustBadge
                icon={Database}
                label="Full Auditability"
                iconColor="text-purple-400"
              />
            </div>
          </div>
        </div>

        {/* Supplier logo ticker band */}
        <div className="mt-12 md:mt-16 w-full">
          <div className="flex items-center justify-center gap-1.5 mb-8 group/disclaimer relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 dark:text-white/35">
              Trusted Data Sources
            </p>
            <div className="relative">
              <Info className="h-3 w-3 text-muted-foreground/50 dark:text-white/25 cursor-pointer hover:text-muted-foreground dark:hover:text-white/50 transition-colors" />
              <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 rounded-md border border-border bg-popover px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground shadow-md opacity-0 group-hover/disclaimer:opacity-100 transition-opacity duration-200 z-50 normal-case tracking-normal font-normal">
                References to third-party organizations, government bodies,
                institutions, trademarks, trade names, service marks, and logos
                are made solely for identification and source attribution
                purposes. Such references do not imply any association,
                sponsorship, endorsement, approval, or partnership between
                Kuinbee and the respective entities unless expressly stated.
              </div>
            </div>
          </div>

          {/* Mask edges */}
          <div
            className="relative overflow-x-auto py-2 md:overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            }}
          >
            <style>{`
              @keyframes marquee-ltr {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: max-content;
                animation: marquee-ltr 35s linear infinite;
              }
              .animate-marquee:hover { animation-play-state: paused; }
              @media (max-width: 767px), (prefers-reduced-motion: reduce) {
                .animate-marquee { animation: none; }
              }
            `}</style>

            <div className="animate-marquee items-center">
              {/* Two identical sets for seamless loop */}
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} aria-hidden={setIdx === 1 ? true : undefined} className={`${setIdx === 1 ? "hidden md:flex" : "flex"} items-center gap-10 pr-10`}>
                  {[
                    {
                      src: "/dcp-light.png",
                      alt: "DCP trusted data source logo | Kuinbee",
                      w: 55,
                      h: 50,
                      className: "dark:invert",
                    },
                    {
                      src: "/fenon-logo.jpeg",
                      alt: "Fenon trusted data supplier logo | Kuinbee",
                      w: 86,
                      h: 40,
                      className: "rounded-sm dark:invert",
                    },
                    {
                      src: "/manudata-ai-logo.jpeg",
                      alt: "Manudata.ai trusted data supplier logo | Kuinbee",
                      w: 40,
                      h: 40,
                      className: "rounded-full",
                    },
                    {
                      src: "/fao-logo.svg",
                      alt: "FAO trusted data source logo | Kuinbee",
                      w: 90,
                      h: 24,
                    },
                    {
                      src: "/world-bank-logo.png",
                      alt: "World Bank trusted data source logo | Kuinbee",
                      w: 30,
                      h: 30,
                    },
                    {
                      src: "/our-world-in-data-logo.png",
                      alt: "Our World in Data trusted data source logo | Kuinbee",
                      w: 28,
                      h: 28,
                    },
                    {
                      src: "/data-gov_logo.webp",
                      alt: "Data.gov trusted data source logo | Kuinbee",
                      w: 90,
                      h: 23,
                    },
                    {
                      src: "/Eia-logomark.svg.png",
                      alt: "EIA trusted data source logo | Kuinbee",
                      w: 40,
                      h: 28,
                    },
                    {
                      src: "/icrisat-logo.jpeg",
                      alt: "ICRISAT trusted data source logo | Kuinbee",
                      w: 56,
                      h: 30,
                    },
                    {
                      src: "/opencity-logo.png",
                      alt: "OpenCity trusted data source logo | Kuinbee",
                      w: 82,
                      h: 23,
                    },
                    {
                      src: "/dot-logo.svg",
                      alt: "Department of Transportation trusted data source logo | Kuinbee",
                      w: 82,
                      h: 33,
                    },
                    {
                      src: "/mendeley-logo.svg",
                      alt: "Mendeley trusted data source logo | Kuinbee",
                      w: 74,
                      h: 33,
                    },
                    {
                      src: "/uci-logo.svg",
                      alt: "UCI Machine Learning Repository trusted data source logo | Kuinbee",
                      w: 90,
                      h: 29,
                    },
                    {
                      src: "/nhtsa-logo.svg",
                      alt: "NHTSA trusted data source logo | Kuinbee",
                      w: 82,
                      h: 33,
                    },
                    {
                      src: "/Dira.png",
                      alt: "Dira Reliability trusted data source logo | Kuinbee",
                      w: 60,
                      h: 40,
                      className: "dark:brightness-110",
                    },
                    { text: "Siom Technology" },
                  ].map((logo, logoIndex) =>
                    "text" in logo ? (
                      <span
                        key={`${setIdx}-${logo.text}`}
                        className="flex-shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight text-primary/90 transition-colors duration-300 hover:text-primary dark:text-white/85 dark:hover:text-white md:text-xl"
                      >
                        {logo.text}
                      </span>
                    ) : (
                      <Image
                        key={`${setIdx}-${logo.alt}`}
                        src={logo.src}
                        alt={logo.alt}
                        width={logo.w}
                        height={logo.h}
                        loading={setIdx === 0 && logoIndex < 3 ? "eager" : "lazy"}
                        className={`flex-shrink-0 object-contain hover:opacity-100 transition-opacity duration-300 filter mix-blend-multiply dark:mix-blend-normal ${logo.className ?? ""}`}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="#supplier-testimonials"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/75 dark:text-white dark:hover:text-white/75"
            >
              Read supplier testimonials
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Customer band */}
        <div className="mt-12 md:mt-16 w-full">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 dark:text-white/35 mb-8">
            Trusted by Data Teams
          </p>

          <div className="flex flex-wrap items-center justify-center gap-y-7 md:gap-x-16">
            <div className="grid w-full max-w-[22rem] grid-cols-3 items-center gap-2 md:flex md:h-14 md:w-auto md:max-w-none md:gap-10">
              <div className="flex h-10 min-w-0 items-center justify-center md:h-full">
                <span className="whitespace-nowrap text-[17px] font-semibold leading-none tracking-normal text-black dark:text-white md:text-3xl md:tracking-tight">
                  OneClarity
                </span>
              </div>

              <div className="flex h-10 min-w-0 items-center justify-center md:h-full">
                <Image
                  src="/vaani-light.png"
                  alt="Vaani customer logo (light) | Kuinbee"
                  width={220}
                  height={72}
                  sizes="(max-width: 767px) 110px, 180px"
                  loading="lazy"
                  className="block dark:hidden h-8 max-w-full flex-shrink-0 object-contain opacity-95 transition-opacity duration-300 hover:opacity-100 md:h-full md:max-w-none"
                  style={{ width: "auto" }}
                />
                <Image
                  src="/vaani.png"
                  alt="Vaani customer logo (dark) | Kuinbee"
                  width={220}
                  height={72}
                  sizes="(max-width: 767px) 110px, 180px"
                  loading="lazy"
                  className="hidden h-8 max-w-full flex-shrink-0 object-contain opacity-95 transition-opacity duration-300 hover:opacity-100 dark:block md:h-full md:max-w-none"
                  style={{ width: "auto" }}
                />
              </div>

              <div className="flex h-10 min-w-0 items-center justify-center md:h-full">
                <Image
                  src="/policysalah.avif"
                  alt="PolicySalah customer logo | Kuinbee"
                  width={196}
                  height={91}
                  sizes="(max-width: 767px) 110px, 140px"
                  loading="lazy"
                  className="h-10 max-w-full flex-shrink-0 object-contain opacity-95 transition-opacity duration-300 hover:opacity-100 dark:hidden md:h-16 md:max-w-none"
                  style={{ width: "auto" }}
                />
                <Image
                  src="/policysalah-dark-tight.png"
                  alt="PolicySalah customer logo | Kuinbee"
                  width={219}
                  height={50}
                  sizes="(max-width: 767px) 110px, 180px"
                  loading="lazy"
                  className="hidden h-7 max-w-full flex-shrink-0 object-contain opacity-95 transition-opacity duration-300 hover:opacity-100 dark:block md:h-10 md:max-w-none"
                  style={{ width: "auto" }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="#client-testimonials"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/75 dark:text-white dark:hover:text-white/75"
            >
              Read client testimonials
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
