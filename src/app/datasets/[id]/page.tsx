"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { DatasetDetailPage } from "@/features/datasets/components";
import { Dataset as UIDataset } from "@/features/datasets/components/types";
import { useDatasetDetails } from "@/hooks/api/useMarketplace";
import { useClaimDataset, useCheckEntitlement, useDownloadUrl } from "@/hooks/api/useLibrary";
import { useAuth } from "@/core/providers/AuthProvider";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Map API DatasetDetails to UI Dataset format
const mapToUIDataset = (apiDataset: any): UIDataset => ({
  id: apiDataset.id, // Internal ID (backup for compatibility)
  datasetUniqueId: apiDataset.datasetUniqueId, // Unique ID for API calls
  title: apiDataset.title,
  provider: "Unknown", // API doesn't provide supplier name
  category: "Unknown", // Would need category lookup by primaryCategoryId
  description: apiDataset.description || "No description available",
  coverage: "N/A", // Not provided by API
  updateFrequency: "N/A", // Not provided by API
  records: 0, // Not provided by API
  lastUpdated: new Date(apiDataset.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }),
  status: "published",
  license: apiDataset.license || "Unknown",
  rating: 0, // Not provided by API
  reviewCount: 0, // Not provided by API
  pricing: {
    type: apiDataset.isPaid ? "paid" : "free",
    amount: apiDataset.price ? parseFloat(apiDataset.price) : undefined,
    currency: apiDataset.currency || "USD",
  },
  quality: {
    quality: 0,
    legal: 0,
    provenance: 0,
    usability: 0,
    freshness: 0,
  },
  verification: {
    supplierVerified: true,
    datasetReviewed: true,
    published: true,
  },
});

export default function DatasetDetailPageRoute() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Fetch dataset details from API
  const { data: response, isLoading, error } = useDatasetDetails(id, !!id);

  // Check authentication status
  const { user, isAuthenticated } = useAuth();

  // Check if user has access (only when authenticated)
  const { data: entitlementCheck } = useCheckEntitlement(id, isAuthenticated && !!id);

  // Claim dataset mutation
  const claimMutation = useClaimDataset();

  // Download URL
  const [shouldFetchDownload, setShouldFetchDownload] = useState(false);
  const {
    data: downloadUrlResponse,
    isLoading: isGeneratingDownload,
    error: downloadError,
  } = useDownloadUrl(id, isAuthenticated && shouldFetchDownload && !!id);

  // Trigger download as soon as URL arrives
  useEffect(() => {
    if (downloadUrlResponse?.url) {
      const a = document.createElement("a");
      a.href = downloadUrlResponse.url;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setShouldFetchDownload(false);
    }
  }, [downloadUrlResponse]);

  // Surface download errors
  useEffect(() => {
    if (downloadError && shouldFetchDownload) {
      toast.error("Failed to generate download link. Please try again.");
      setShouldFetchDownload(false);
    }
  }, [downloadError, shouldFetchDownload]);

  // Determine access state
  const getAccessState = (): "not-logged-in" | "not-entitled-free" | "not-entitled-paid" | "owned" => {
    if (!isAuthenticated) return "not-logged-in";
    if (entitlementCheck?.entitled) return "owned";

    // Check if dataset is free or paid
    const isPaid = response?.dataset.isPaid;
    return isPaid ? "not-entitled-paid" : "not-entitled-free";
  };

  // Handle claim dataset
  const handleClaimDataset = async () => {
    try {
      await claimMutation.mutateAsync(id);
      toast.success("Dataset claimed successfully!");
      router.push("/library");
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to claim dataset";
      if (errorMessage.includes("NOT_FREE")) {
        toast.error("This dataset is not free");
      } else if (errorMessage.includes("ALREADY_OWNED")) {
        toast.info("You already own this dataset");
        router.push("/library");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Handle login
  const handleLogin = () => {
    router.push(`/login?redirectTo=/datasets/${id}`);
  };

  // Handle download
  const handleDownload = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=/datasets/${id}`);
      return;
    }
    if (isGeneratingDownload) return;
    setShouldFetchDownload(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading dataset details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !response?.dataset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground dark:text-white mb-2">
            Dataset Not Found
          </h1>
          <p className="text-muted-foreground dark:text-white/70 mb-6">
            {error instanceof Error ? error.message : "This dataset doesn't exist or is not published."}
          </p>
          <button
            onClick={() => router.push("/datasets")}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Browse Datasets
          </button>
        </div>
      </div>
    );
  }

  const dataset = mapToUIDataset(response.dataset);
  const accessState = getAccessState();

  return (
    <DatasetDetailPage
      dataset={dataset}
      accessState={accessState}
      onLogin={handleLogin}
      onClaimDataset={handleClaimDataset}
      onPurchaseDataset={() => toast.info("Purchase flow coming soon")}
      onDownloadDataset={handleDownload}
      isInWishlist={false}
      currentUserId={user?.id}
    />
  );
}
