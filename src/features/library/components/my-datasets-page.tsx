"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OwnedDatasetCard, type OwnedDataset } from "./owned-dataset-card";
import { Button } from "@/shared/components/ui/button";
import { Database, RefreshCw, ArrowRight, Loader2 } from "lucide-react";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LIBRARY_SIDEBAR_SECTIONS } from "@/constants/library-sidebar.constants";
import { useLibrary } from "@/hooks/api/useLibrary";

type ViewState = "loading" | "empty" | "error" | "data";

export function MyDatasetsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Use real API hook
  const { data: libraryResponse, isLoading, error, refetch } = useLibrary({ 
    q: searchQuery || undefined,
    page: 1,
    pageSize: 20 
  });

  // Map API response to OwnedDataset format
  const datasets: OwnedDataset[] = libraryResponse?.items?.map(item => ({
    id: item.datasetId,
    datasetUniqueId: item.datasetUniqueId,
    title: item.title,
    category: "Unknown", // Category not in API response - would need separate call
    license: "Unknown", // License not in API response
    grantedAt: item.grantedAt.split('T')[0], // Convert ISO to date
    accessType: item.accessType === "FREE_CLAIM" ? "free" : "purchased",
    verification: {
      supplierVerified: true, // Not in API response
      datasetReviewed: true, // Not in API response
    },
    status: "active" as const,
  })) || [];

  // Determine view state
  const viewState: ViewState = isLoading ? "loading" : error ? "error" : datasets.length === 0 ? "empty" : "data";

  const handleRetry = () => {
    refetch();
  };

  const handleAccessDataset = (dataset: OwnedDataset) => {
    // Navigate to dataset access page
    router.push(`/library/access/${dataset.id}`);
  };

  const handleViewDetails = (dataset: OwnedDataset) => {
    // Navigate to dataset detail page
    router.push(`/datasets/${dataset.id}`);
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <div className="relative z-50">
        <NotchNavigation />
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>
      
      {/* Main Content */}
      <div className="relative pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Page Header - Just tabs */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <MainSectionTabs />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
            {/* Left Sidebar - Navigation */}
            <aside className="space-y-6 relative">
              {/* Fade separator line */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 dark:via-white/10 to-transparent hidden lg:block" />

              {LIBRARY_SIDEBAR_SECTIONS.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded-xl overflow-hidden">
                  {section.title && (
                    <div className="px-3 pt-4 pb-2 lg:px-4 lg:pt-5 lg:pb-2">
                      <h3 className="text-xs font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1 px-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main Content Column */}
            <div>
              {/* Section Title & Description - Above content */}
              <div className="mb-6">
                <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  My Datasets
                </h1>
                <p className="text-sm text-[#4e5a7e] dark:text-white/70 mb-1">
                  Datasets you currently have access to through Kuinbee
                </p>
                <p className="text-sm text-[#4e5a7e] dark:text-white/60">
                  Access is governed and logged. View details or download datasets you own.
                </p>
              </div>

              {/* Loading State */}
              {viewState === "loading" && (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-lg p-6 animate-pulse"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="h-6 w-3/4 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                            <div className="h-4 w-1/2 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                          </div>
                          <div className="h-6 w-24 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {viewState === "empty" && (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-[#1a2240]/5 dark:bg-white/5 border border-[#1a2240]/10 dark:border-white/10 flex items-center justify-center mb-6">
                    <Database className="w-10 h-10 text-[#4e5a7e] dark:text-white/40" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    You don't have access to any datasets yet.
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    Purchased or claimed datasets will appear here once access is granted.
                  </p>
                  <Link href="/datasets">
                    <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold shadow-md hover:shadow-lg transition-all">
                      Browse Marketplace
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Error State */}
              {viewState === "error" && (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center mb-6">
                    <Database className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    We couldn't load your datasets right now.
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    There was an issue retrieving your dataset library. Please try again.
                  </p>
                  <Button
                    onClick={handleRetry}
                    variant="outline"
                    className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white hover:border-[#1a2240]/50 dark:hover:border-white/30 font-medium"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              )}

              {/* Data State - Dataset List with Grid */}
              {viewState === "data" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {datasets.map((dataset) => (
                    <OwnedDatasetCard
                      key={dataset.id}
                      dataset={dataset}
                      onAccess={handleAccessDataset}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
