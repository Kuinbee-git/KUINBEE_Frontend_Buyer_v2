"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OwnedDatasetCard, type OwnedDataset } from "./owned-dataset-card";
import { Button } from "@/shared/components/ui/button";
import { Database, RefreshCw } from "lucide-react";
import { useLibrary } from "@/hooks/api/useLibrary";
import { Card, CardContent } from "@/shared/components/ui/card";

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
    category: "Unknown",
    license: "Unknown",
    grantedAt: item.grantedAt.split('T')[0],
    accessType: item.accessType === "FREE_CLAIM" ? "free" : "purchased",
    verification: {
      supplierVerified: true,
      datasetReviewed: true,
    },
    status: "active" as const,
  })) || [];

  const viewState: ViewState = isLoading ? "loading" : error ? "error" : datasets.length === 0 ? "empty" : "data";

  const handleRetry = () => {
    refetch();
  };

  const handleAccessDataset = (dataset: OwnedDataset) => {
    router.push(`/library/access/${dataset.id}`);
  };

  const handleViewDetails = (dataset: OwnedDataset) => {
    router.push(`/datasets/${dataset.id}`);
  };

  // Loading State
  if (viewState === "loading") {
    return (
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
    );
  }

  // Empty State
  if (viewState === "empty") {
    return (
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
      </div>
    );
  }

  // Error State
  if (viewState === "error") {
    return (
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
    );
  }

  // Data State
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#1a2240] dark:text-white mb-2">
          My Datasets
        </h2>
        <p className="text-sm text-[#4e5a7e] dark:text-white/60">
          Datasets you currently have access to through Kuinbee
        </p>
      </div>
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
    </div>
  );
}
