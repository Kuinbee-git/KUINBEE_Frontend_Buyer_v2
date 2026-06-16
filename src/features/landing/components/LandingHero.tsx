"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Link } from "@/components/router/Link";
import { Button } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { TrustBadge } from "./trust-badge";
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Eye,
  Database,
  ArrowRight,
} from "lucide-react";

const searchPlaceholders = [
  "Search verified datasets...",
  "Energy consumption data...",
  "Climate & weather datasets...",
  "Financial market indicators...",
  "Agricultural yield data...",
  "Healthcare statistics...",
  "Real estate analytics...",
  "Transportation metrics...",
];

export function LandingHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Typewriter effect for placeholder
  useEffect(() => {
    const currentPhrase = searchPlaceholders[placeholderIndex];
    const typingSpeed = isDeleting ? 20 : 40;
    const pauseAfterComplete = 2000;
    const pauseAfterDelete = 500;

    if (!isDeleting && charIndex < currentPhrase.length) {
      // Typing forward
      const timeout = setTimeout(() => {
        setPlaceholderText(currentPhrase.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing, pause then start deleting
      const timeout = setTimeout(() => {
        setIsDeleting(true);
      }, pauseAfterComplete);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex > 0) {
      // Deleting backward
      const timeout = setTimeout(() => {
        setPlaceholderText(currentPhrase.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next phrase
      const timeout = setTimeout(() => {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
      }, pauseAfterDelete);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, isDeleting, placeholderIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length > 200) {
      toast.error("Search query cannot exceed 200 characters.");
      return;
    }
    if (searchQuery.trim()) {
      router.push(`/datasets?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/datasets');
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
            Governed Marketplace
            <br />
            <span className="text-primary/70 dark:text-white/80">for All Datasets</span>
          </h1>


          {/* Description */}
          <p className="mt-4 md:mt-6 text-center mx-auto max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground dark:text-white/70 px-4 md:px-0">
Find and buy datasets you can actually rely on. Every listing is reviewed, priced upfront, and ready to use — across finance, energy, environment,medicare, and more.

          </p>

          {/* Search section with inline button */}
          <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center px-4 md:px-0">
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl flex">
              <button
                type="submit"
                className="absolute left-0 top-0 bottom-0 w-12 md:w-14 flex items-center justify-center rounded-l-lg border-r border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 backdrop-blur-md hover:bg-primary/10 dark:hover:bg-white/10 transition-colors z-10 group"
                aria-label="Search"
              >
                <Search className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground dark:text-white/60 group-hover:text-primary dark:group-hover:text-white transition-colors" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  if (e.target.value.length > 200) {
                    toast.error("Search query cannot exceed 200 characters.");
                    return;
                  }
                  setSearchQuery(e.target.value);
                }}
                placeholder={placeholderText}
                className="h-12 md:h-14 w-full rounded-lg border border-primary/20 dark:border-white/20 bg-card/80 dark:bg-white/5 backdrop-blur-sm px-4 md:px-5 pl-14 md:pl-16 text-sm md:text-base text-foreground dark:text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-white/30 shadow-lg transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
              />
            </form>
            <Button
              variant="outline"
              size="lg"
              className="h-12 md:h-14 w-full sm:w-auto border-primary/20 dark:border-white/20 bg-transparent px-6 md:px-8 text-sm md:text-base font-medium text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 whitespace-nowrap"
              asChild
            >
              <Link href="/datasets">Browse All</Link>
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
              <TrustBadge icon={ShieldCheck} label="Verified Suppliers" iconColor="text-emerald-400" />
              <TrustBadge icon={CheckCircle2} label="Enforced Governance" iconColor="text-blue-400" />
              <TrustBadge icon={Eye} label="Transparent Pricing" iconColor="text-amber-400" />
              <TrustBadge icon={Database} label="Full Auditability" iconColor="text-purple-400" />
            </div>
          </div>
        </div>

        {/* Supplier logo ticker band */}
        <div className="mt-12 md:mt-16 w-full">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 dark:text-white/35 mb-8">
            Trusted Data Sources 
          </p>

          {/* Mask edges */}
          <div
            className="relative overflow-hidden py-2"
            style={{
              maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
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
            `}</style>

            <div className="animate-marquee items-center">
              {/* Two identical sets for seamless loop */}
              {[...Array(2)].map((_, setIdx) => (
                <div key={setIdx} className="flex items-center gap-10 pr-10">
                  {[
                    { src: "/dcp-light.png", alt: "DCP trusted data source logo | Kuinbee", w: 55, h: 50, className: "dark:invert" },
                    { src: "/fao-logo.svg", alt: "FAO trusted data source logo | Kuinbee", w: 90, h: 24 },
                    { src: "/world-bank-logo.png", alt: "World Bank trusted data source logo | Kuinbee", w: 30, h: 30 },
                    { src: "/our-world-in-data-logo.png", alt: "Our World in Data trusted data source logo | Kuinbee", w: 28, h: 28 },
                    { src: "/data-gov_logo.webp", alt: "Data.gov trusted data source logo | Kuinbee", w: 90, h: 23 },
                    { src: "/Eia-logomark.svg.png", alt: "EIA trusted data source logo | Kuinbee", w: 40, h: 28 },
                    { src: "/icrisat-logo.jpeg", alt: "ICRISAT trusted data source logo | Kuinbee", w: 56, h: 30 },
                    { src: "/opencity-logo.png", alt: "OpenCity trusted data source logo | Kuinbee", w: 82, h: 23 },
                    { src: "/dot-logo.svg", alt: "Department of Transportation trusted data source logo | Kuinbee", w: 82, h: 33 },
                    { src: "/mendeley-logo.svg", alt: "Mendeley trusted data source logo | Kuinbee", w: 74, h: 33 },
                    { src: "/uci-logo.svg", alt: "UCI Machine Learning Repository trusted data source logo | Kuinbee", w: 90, h: 29 },
                    { src: "/nhtsa-logo.svg", alt: "NHTSA trusted data source logo | Kuinbee", w: 82, h: 33 },
                    { src: "/logo.f9fcba1.svg", alt: "Kuinbee marketplace partner logo | Kuinbee", w: 90, h: 24 },
                    { src: "/Dira.png", alt: "Dira Reliability trusted data source logo | Kuinbee", w: 60, h: 40, className: "dark:brightness-110" },
                    { text: "Siom Technology" },
                  ].map((logo) =>
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
                        loading="lazy"
                        className={`flex-shrink-0 object-contain hover:opacity-100 transition-opacity duration-300 filter mix-blend-multiply dark:mix-blend-normal ${logo.className ?? ""}`}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer band */}
        <div className="mt-12 md:mt-16 w-full">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 dark:text-white/35 mb-8">
            Trusted by Data Teams
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-7 md:gap-x-16">
            <div className="flex items-center gap-10 h-12 md:h-14">
              <div className="flex items-center h-full">
                <span className="text-2xl md:text-3xl font-semibold tracking-tight text-black dark:text-white leading-none">
                  OneClarity
                </span>
              </div>

              <div className="flex items-center h-full">
                <Image
                  src="/vaani-light.png"
                  alt="Vaani customer logo (light) | Kuinbee"
                  width={220}
                  height={72}
                  loading="lazy"
                  className="block dark:hidden flex-shrink-0 h-full w-auto object-contain opacity-95 transition-opacity duration-300 hover:opacity-100"
                  style={{ width: 'auto' }}
                />
                <Image
                  src="/vaani.png"
                  alt="Vaani customer logo (dark) | Kuinbee"
                  width={220}
                  height={72}
                  loading="lazy"
                  className="hidden dark:block flex-shrink-0 h-full w-auto object-contain opacity-95 transition-opacity duration-300 hover:opacity-100"
                  style={{ width: 'auto' }}
                />
              </div>

              <div className="flex items-center h-full">
                <Image
                  src="/policysalah.avif"
                  alt="PolicySalah customer logo | Kuinbee"
                  width={196}
                  height={91}
                  loading="lazy"
                  className="flex-shrink-0 h-12 md:h-16 w-auto object-contain opacity-95 transition-opacity duration-300 hover:opacity-100 dark:hidden"
                  style={{ width: 'auto' }}
                />
                <Image
                  src="/policysalah-dark-tight.png"
                  alt="PolicySalah customer logo | Kuinbee"
                  width={219}
                  height={50}
                  loading="lazy"
                  className="hidden dark:block flex-shrink-0 h-8 md:h-10 w-auto object-contain opacity-95 transition-opacity duration-300 hover:opacity-100"
                  style={{ width: 'auto' }}
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
