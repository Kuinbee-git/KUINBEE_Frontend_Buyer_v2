"use client";

import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { DatasetDetailPage } from "@/features/datasets/components/dataset-detail-page";
import { Dataset as UIDataset } from "@/features/datasets/components/types";
import { DatasetDetailsResponse } from "@/types/dataset.types";
import { useDatasetDetails } from "@/hooks/api/useMarketplace";
import { useClaimDataset, useCheckEntitlement, useDownloadUrl } from "@/hooks/api/useLibrary";
import { useAuth } from "@/core/providers/AuthProvider";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

// Code-split: only loaded when user clicks Purchase (paid datasets)
const RazorpayCheckoutFlow = lazy(() =>
  import("@/features/datasets/components/razorpay-checkout-flow").then((m) => ({ default: m.RazorpayCheckoutFlow }))
);
// Code-split: only loaded after a successful claim
const WebsiteFeedbackModal = lazy(() =>
  import("@/app/datasets/[id]/_components/website-feedback-modal").then((m) => ({ default: m.WebsiteFeedbackModal }))
);

interface DatasetDetailPageContentProps {
  initialDatasetDetails?: DatasetDetailsResponse;
}

// Map the full API response to UI Dataset format
const mapToUIDataset = (response: DatasetDetailsResponse): UIDataset => {
  const { dataset, primaryCategory, secondaryCategories, aboutDatasetInfo, dataFormatInfo, features, source, locationInfo, tags } = response;

  return {
    id: dataset.id,
    datasetUniqueId: dataset.datasetUniqueId,
    title: dataset.title,
    provider: source?.name || "Unknown",
    category: primaryCategory?.name || "Uncategorized",
    secondaryCategories: secondaryCategories?.map((c) => c.name) || [],
    description: dataset.description || aboutDatasetInfo?.overview || "No description available",
    coverage: locationInfo?.coverage || locationInfo?.country || "N/A",
    records: dataFormatInfo?.rows || 0,
    lastUpdated: new Date(dataset.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    status: dataset.status?.toLowerCase() || "published",
    license: dataset.license || "Unknown",
    rating: dataset.rating,
    reviewCount: 0,
    downloadCount: dataset.downloadCount || 0,
    viewCount: dataset.viewCount || 0,
    pricing: {
      type: dataset.isPaid ? "paid" : "free",
      amount: dataset.price ? parseFloat(dataset.price) : undefined,
      currency: dataset.currency || "INR",
    },
    // Rich content
    aboutDataset: aboutDatasetInfo || null,
    dataFormat: dataFormatInfo || null,
    features: features || [],
    source: source || null,
    location: locationInfo || null,
    tags: tags || [],
    kdtsScore: dataset.kdtsScore || null,
    // Legacy
    quality: {
      quality: 0,
      legal: 0,
      provenance: 0,
      usability: 0,
      freshness: 0,
    },
    verification: {
      supplierVerified: source?.isVerified || false,
      datasetReviewed: true,
      published: dataset.status === "PUBLISHED",
    },
  };
};

export function DatasetDetailPageContent({ initialDatasetDetails }: DatasetDetailPageContentProps) {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Fetch dataset details from API
  const { data: response, isLoading, error } = useDatasetDetails(
    id,
    !!id,
    initialDatasetDetails
  );

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

  // KDTS score is now fetched only by the lazy-loaded DatasetKdtsCard component
  // to avoid a duplicate API call on mount.

  // ── Checkout flow state (declared before early returns to keep hook order stable) ──
  const [showCheckout, setShowCheckout] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Listen for "proceedToCheckout" events from the NotchNavigation staging panel
  useEffect(() => {
    const handleProceedEvent = (e: CustomEvent) => {
      // Only open if the staged dataset matches this page
      const staged = e.detail;
      if (staged && (staged.id === id || staged.datasetUniqueId === id)) {
        setShowCheckout(true);
      }
    };

    window.addEventListener("proceedToCheckout" as any, handleProceedEvent);
    return () => window.removeEventListener("proceedToCheckout" as any, handleProceedEvent);
  }, [id]);

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

  // Memoize access state so stable reference is passed to DatasetDetailPage
  const accessState = useMemo((): "not-logged-in" | "not-entitled-free" | "not-entitled-paid" | "owned" => {
    if (!isAuthenticated) return "not-logged-in";
    if (entitlementCheck?.entitled) return "owned";
    const isPaid = response?.dataset.isPaid;
    return isPaid ? "not-entitled-paid" : "not-entitled-free";
  }, [isAuthenticated, entitlementCheck, response]);

  // Handle claim dataset — useCallback so DatasetDetailPage's React.memo is not bypassed
  const handleClaimDataset = useCallback(async () => {
    try {
      await claimMutation.mutateAsync(id);
      toast.success("Dataset claimed successfully!", {
        description: "You can now access this dataset from your library.",
        action: {
          label: "Go to Library",
          onClick: () => router.push("/library"),
        },
        duration: 8000,
      });
      setShowFeedbackModal(true);
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to claim dataset";
      if (errorMessage.includes("NOT_FREE")) {
        toast.error("This dataset is not free");
      } else if (errorMessage.includes("ALREADY_OWNED")) {
        toast.info("You already own this dataset", {
          description: "This dataset is already in your library.",
          action: {
            label: "Go to Library",
            onClick: () => router.push("/library"),
          },
          duration: 8000,
        });
      } else {
        toast.error(errorMessage);
      }
    }
  }, [claimMutation, id, router]);

  const handleSubmitWebsiteFeedback = useCallback(
    async ({ rating, review }: { rating: number; review: string }) => {
      if (!user?.email) {
        toast.error("Unable to submit feedback. Missing user email.");
        return;
      }

      setIsSubmittingFeedback(true);
      try {
        const derivedName = user.email.split("@")[0] || "Kuinbee User";

        const waitlistResponse = await fetch(
          "https://api.freewaitlists.com/waitlists/cmn093nng017s01pn152jaukj",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              meta: {
                name: derivedName,
                source: "website-review",
                feedbackType: "website",
                rating,
                review,
                contextPage: "dataset-details",
                contextDatasetId: id,
              },
            }),
          }
        );

        if (!waitlistResponse.ok) {
          throw new Error("Failed to submit feedback");
        }

        toast.success("Thanks for your feedback!");
        setShowFeedbackModal(false);
      } catch {
        toast.error("Could not submit feedback right now. Please try again.");
      } finally {
        setIsSubmittingFeedback(false);
      }
    },
    [id, user?.email]
  );

  // Handle login — stable callback keeps DatasetDetailPage memo intact
  const handleLogin = useCallback(() => {
    router.push(`/login?redirectTo=/datasets/${id}`);
  }, [router, id]);

  // Handle download — stable callback keeps DatasetDetailPage memo intact
  const handleDownload = useCallback(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=/datasets/${id}`);
      return;
    }
    if (isGeneratingDownload) return;
    setShouldFetchDownload(true);
  }, [isAuthenticated, router, id, isGeneratingDownload]);

  // Memoize dataset mapping — must be called unconditionally, before early returns
  const dataset = useMemo(() => {
    if (!response?.dataset) return null;
    return mapToUIDataset(response);
  }, [response]);

  // Stable purchase / checkout handlers — declared before early returns because
  // useCallback is a hook and must not appear after conditional returns.
  // dataset may be null here; the functions are no-ops in that case (unreachable in practice).
  const handlePurchaseDataset = useCallback(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirectTo=/datasets/${id}`);
      return;
    }
    if (!dataset) return;
    window.dispatchEvent(
      new CustomEvent("stagedDatasetUpdate", {
        detail: {
          id: dataset.id,
          datasetUniqueId: dataset.datasetUniqueId || dataset.id,
          title: dataset.title,
          category: dataset.category,
          license: dataset.license,
          pricing: dataset.pricing,
          verification: dataset.verification,
        },
      })
    );
    setShowCheckout(true);
  }, [isAuthenticated, router, id, dataset]);

  const handleCheckoutComplete = useCallback((_orderId: string) => {
    // Checkout dialog handles its own success UI;
    // user can navigate to order from there or we can refresh entitlement
  }, []);

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
  if (error || !dataset) {
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

  return (
    <>
      <DatasetDetailPage
        dataset={dataset}
        accessState={accessState}
        onLogin={handleLogin}
        onClaimDataset={handleClaimDataset}
        onPurchaseDataset={handlePurchaseDataset}
        onDownloadDataset={handleDownload}
        currentUserId={user?.id}
      />

      {/* Razorpay Checkout Flow — code-split, only loaded for paid datasets when checkout opens */}
      {dataset.pricing.type === "paid" && showCheckout && (
        <Suspense fallback={null}>
          <RazorpayCheckoutFlow
            datasetId={id}
            datasetTitle={dataset.title}
            amount={dataset.pricing.amount}
            currency={dataset.pricing.currency}
            open={showCheckout}
            onOpenChange={setShowCheckout}
            onComplete={handleCheckoutComplete}
          />
        </Suspense>
      )}

      {/* Feedback modal — code-split, only loaded after a successful claim */}
      {showFeedbackModal && (
        <Suspense fallback={null}>
          <WebsiteFeedbackModal
            open={showFeedbackModal}
            onOpenChange={setShowFeedbackModal}
            loading={isSubmittingFeedback}
            onSubmit={handleSubmitWebsiteFeedback}
          />
        </Suspense>
      )}
    </>
  );
}
