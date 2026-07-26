"use client";

import { lazy, Suspense } from "react";
import Link from "next/link";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MarketplaceOptions } from "./MarketplaceOptions";

const LandingFooter = lazy(() =>
  import("@/features/landing/components/LandingFooter").then((mod) => ({
    default: mod.LandingFooter,
  })),
);

export function MarketplaceHubPage() {
  return (
    <main className="min-h-screen relative">
      <div className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/40">
        <NotchNavigation lite />
      </div>

      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      <section className="relative pt-20 md:pt-32 pb-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-12 md:mb-16 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/70 mb-4">
              Kuinbee Marketplace
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              What are you looking for?
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose between ready-to-use datasets or a custom data collection
              service tailored to your exact requirements.
            </p>
          </div>

          <MarketplaceOptions />

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">
              Not sure what you need?{" "}
              <Link
                href="/data-request"
                className="font-medium text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
              >
                Send us a brief
              </Link>{" "}
              and we&apos;ll guide you.
            </p>
          </div>
        </div>
      </section>

      <Suspense fallback={<div className="bg-[#0f1729] h-32" />}>
        <LandingFooter />
      </Suspense>
    </main>
  );
}
