"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Heart, Trash2, ShoppingCart, Eye, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { useDatasetDetails } from "@/hooks/api/useMarketplace";
import { toast } from "sonner";

// Component to render individual wishlist item with dataset details
function WishlistItemCard({ datasetId, createdAt, onRemove }: { datasetId: string; createdAt: string; onRemove: (id: string) => void }) {
  const { data: datasetResponse, isLoading } = useDatasetDetails(datasetId);
  const dataset = datasetResponse?.dataset;

  if (isLoading) {
    return (
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#1a2240] dark:text-white animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dataset) {
    return null;
  }

  const price = dataset.isPaid ? `${dataset.currency} ${dataset.price}` : "Free";
  const addedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10 hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-all">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg text-[#1a2240] dark:text-white mb-2">
              {dataset.title}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(datasetId)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        {dataset.description && (
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            {dataset.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#4e5a7e] dark:text-white/60">License</span>
            <span className="text-[#1a2240] dark:text-white font-medium">
              {dataset.license}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#4e5a7e] dark:text-white/60">Added</span>
            <span className="text-[#1a2240] dark:text-white">{addedDate}</span>
          </div>
          <div className="pt-4 border-t border-border/50 dark:border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl font-bold text-[#1a2240] dark:text-white">
                {price}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link href={`/datasets/${datasetId}`} className="flex-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
              </Link>
              {dataset.isPaid ? (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              ) : (
                <Link href={`/datasets/${datasetId}`}>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 font-semibold"
                  >
                    Claim Free
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WishlistPage() {
  const { data: wishlistData, isLoading, error } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const handleRemove = async (datasetId: string) => {
    try {
      await removeFromWishlistMutation.mutateAsync(datasetId);
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error("Failed to remove from wishlist");
    }
  };

  const wishlistItems = wishlistData?.items || [];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#1a2240] dark:text-white animate-spin" />
              <p className="text-[#4e5a7e] dark:text-white/60">Loading your wishlist...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Failed to Load Wishlist
                </h3>
                <p className="text-[#4e5a7e] dark:text-white/60 mb-6">
                  {error instanceof Error ? error.message : "An error occurred while loading your wishlist."}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-[#1a2240] dark:text-white" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2240] dark:text-white">
              My Wishlist
            </h1>
          </div>
          <p className="text-sm sm:text-base text-[#4e5a7e] dark:text-white/60">
            Datasets you're interested in purchasing ({wishlistItems.length} items)
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wishlistItems.map((item) => (
              <WishlistItemCard
                key={item.datasetId}
                datasetId={item.datasetId}
                createdAt={item.createdAt}
                onRemove={handleRemove}
              />
            ))}
          </div>
        ) : (
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardContent className="py-16">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-[#4e5a7e] dark:text-white/40" />
                <h3 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Your Wishlist is Empty
                </h3>
                <p className="text-[#4e5a7e] dark:text-white/60 mb-6">
                  Start exploring datasets and add them to your wishlist.
                </p>
                <Link href="/datasets">
                  <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
                    Browse Datasets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
