"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/shared/components/ui/badge";
import {
  Star,
  MapPin,
  Database,
  ArrowRight,
  Heart,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  FileType,
  Calendar,
  Gauge,
  Tag,
  Eye,
  Download,
} from "lucide-react";
import { Dataset } from "./types";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { useAuth } from "@/core/providers/AuthProvider";
import { toast } from "sonner";
import { cn } from "@/shared/utils/cn";

interface DatasetCardProps {
  dataset: Dataset;
  onViewDetails?: (dataset: Dataset) => void;
}

export function DatasetCard({ dataset, onViewDetails }: DatasetCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Wishlist hooks
  const { data: wishlistData } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Check if dataset is in wishlist
  const wishlistItems = wishlistData?.items || [];
  const isInWishlist = wishlistItems.some((item) => item.datasetId === dataset.id);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(dataset);
    } else {
      router.push(`/datasets/${dataset.id}`);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Sign in to add to wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlistMutation.mutateAsync(dataset.id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlistMutation.mutateAsync(dataset.id);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update wishlist");
    }
  };

  // Get currency symbol
  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "INR": return "₹";
      default: return "₹";
    }
  };

  // Format records count
  const formatRecords = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
    return count.toLocaleString();
  };

  // Format file size
  const formatFileSize = (sizeStr?: string) => {
    if (!sizeStr) return null;
    const bytes = parseInt(sizeStr);
    if (isNaN(bytes)) return sizeStr;
    if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
    if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
    if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${bytes} B`;
  };

  const kdtsValue = dataset.kdtsScore ? parseFloat(dataset.kdtsScore) : null;
  const ratingVal = dataset.rating ?? 0;
  const fullStars = Math.floor(ratingVal);
  const hasHalfStar = ratingVal - fullStars >= 0.25;
  const totalStars = 5;

  return (
    <div
      className="group bg-white dark:bg-[#1e2847] border border-border/50 dark:border-white/10 rounded-xl p-5 hover:border-[#1a2240]/50 dark:hover:border-white/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col will-change-transform"
      onClick={handleViewDetails}
    >
      {/* ── Row 1: Verification Badges + Price Badge ── */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {dataset.verification.supplierVerified && (
            <Badge className="bg-blue-50 dark:bg-blue-900/25 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[13px] font-medium gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </Badge>
          )}
          {dataset.verification.datasetReviewed && (
            <Badge className="bg-emerald-50 dark:bg-emerald-900/25 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[13px] font-medium gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Reviewed
            </Badge>
          )}
        </div>

        {/* Price badge */}
        {dataset.pricing.type === "free" ? (
          <Badge className="bg-emerald-50 dark:bg-emerald-900/25 border border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-[15px] font-semibold shrink-0 rounded-md">
            Free
          </Badge>
        ) : (
          <div className="shrink-0 flex flex-col items-center bg-white/60 dark:bg-white/5 border border-border/50 dark:border-white/15 rounded-md px-3 py-1.5 min-w-[56px]">
            <span className="text-[17px] font-bold text-[#1a2240] dark:text-white leading-tight">
              {getCurrencySymbol(dataset.pricing.currency)}{dataset.pricing.amount?.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* ── Row 2: Title + Save Button ── */}
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <h3 className="font-bold text-[#1a2240] dark:text-white text-[17px] leading-tight line-clamp-2 group-hover:text-[#2d3a5f] dark:group-hover:text-white/90 transition-colors">
          {dataset.title}
          <ArrowRight className="w-3.5 h-3.5 inline-block ml-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-[#4e5a7e] dark:text-white/50" />
        </h3>

        {/* Save / Wishlist */}
        <button
          onClick={handleWishlistToggle}
          disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
          className={cn(
            "shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-md border text-[13px] font-medium transition-all",
            isInWishlist
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900 text-red-600 dark:text-red-400"
              : "bg-white/60 dark:bg-white/5 border-border/50 dark:border-white/15 text-[#4e5a7e] dark:text-white/60 hover:border-red-300 dark:hover:border-red-800 hover:text-red-500"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Save to wishlist"}
        >
          {addToWishlistMutation.isPending || removeFromWishlistMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart
              className={cn(
                "w-3.5 h-3.5",
                isInWishlist ? "fill-red-500 text-red-500" : "fill-none"
              )}
            />
          )}
          <span className="hidden sm:inline">{isInWishlist ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* ── Row 3: Provider ── */}
      <p className="text-[14px] text-[#4e5a7e] dark:text-white/60 mb-2">
        by <span className="font-medium text-[#1a2240]/80 dark:text-white/80">{dataset.provider}</span>
      </p>

      {/* ── Row 4: Star Rating ── */}
      <div className="flex items-center gap-1.5 mb-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: totalStars }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < fullStars
                  ? "fill-amber-400 text-amber-400"
                  : i === fullStars && hasHalfStar
                    ? "fill-amber-400/50 text-amber-400"
                    : "fill-none text-gray-300 dark:text-white/20"
              )}
            />
          ))}
        </div>
        <span className="text-[14px] font-medium text-[#1a2240] dark:text-white/70">
          {ratingVal > 0 ? ratingVal.toFixed(1) : "0"}
        </span>
        <span className="text-[14px] text-[#4e5a7e] dark:text-white/50">
          ({dataset.reviewCount} {dataset.reviewCount === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* ── Row 5: Description ── */}
      <p className="text-[14px] text-[#4e5a7e] dark:text-white/60 leading-relaxed line-clamp-2 mb-3">
        {dataset.description}
      </p>

      {/* ── Row 6: KDTS Score (if available) ── */}
      {kdtsValue != null && (
        <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#1a2240]/5 to-[#2d3a5f]/5 dark:from-white/5 dark:to-white/[0.02] border border-[#1a2240]/10 dark:border-white/10">
          <Gauge className={cn(
            "w-4 h-4 shrink-0",
            kdtsValue >= 85 ? "text-emerald-500" :
            kdtsValue >= 70 ? "text-blue-500" :
            kdtsValue >= 50 ? "text-amber-500" :
            "text-red-500"
          )} />
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px] font-semibold text-[#1a2240] dark:text-white/80">KDTS Score</span>
            <span className={cn(
              "text-[15px] font-bold",
              kdtsValue >= 85 ? "text-emerald-600 dark:text-emerald-400" :
              kdtsValue >= 70 ? "text-blue-600 dark:text-blue-400" :
              kdtsValue >= 50 ? "text-amber-600 dark:text-amber-400" :
              "text-red-600 dark:text-red-400"
            )}>
              {kdtsValue.toFixed(1)}
            </span>
            <span className="text-[11px] text-[#4e5a7e] dark:text-white/40">/ 100</span>
          </div>
        </div>
      )}

      {/* ── Row 7: Metadata Chips ── */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {/* Location */}
        <div className="inline-flex items-center gap-1 text-[14px] bg-[#1a2240]/5 dark:bg-white/5 text-[#1a2240] dark:text-white/70 px-2.5 py-1 rounded-md border border-[#1a2240]/10 dark:border-white/10">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{dataset.coverage && dataset.coverage !== "N/A" ? dataset.coverage : "N/A"}</span>
        </div>

        {/* Records */}
        <div className="inline-flex items-center gap-1 text-[14px] bg-[#4e5a7e]/5 dark:bg-white/5 text-[#4e5a7e] dark:text-white/70 px-2.5 py-1 rounded-md border border-[#4e5a7e]/10 dark:border-white/10">
          <Database className="w-3.5 h-3.5 shrink-0" />
          <span>{formatRecords(dataset.records)} records</span>
        </div>

        {/* File Format */}
        {dataset.dataFormat?.fileFormat ? (
          <div className="inline-flex items-center gap-1 text-[14px] bg-purple-50 dark:bg-purple-900/15 text-purple-700 dark:text-purple-400 px-2.5 py-1 rounded-md border border-purple-100 dark:border-purple-900">
            <FileType className="w-3.5 h-3.5 shrink-0" />
            <span>
              {dataset.dataFormat.fileFormat}
              {dataset.dataFormat.fileSize ? ` · ${formatFileSize(dataset.dataFormat.fileSize)}` : ""}
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 text-[14px] bg-[#4e5a7e]/5 dark:bg-white/5 text-[#4e5a7e] dark:text-white/70 px-2.5 py-1 rounded-md border border-[#4e5a7e]/10 dark:border-white/10">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>N/A</span>
          </div>
        )}
      </div>

      {/* ── Row 8: Stats + Tags ── */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-3 text-[14px] text-[#4e5a7e] dark:text-white/50">
          <div className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{dataset.viewCount.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5" />
            <span>{dataset.downloadCount.toLocaleString()} downloads</span>
          </div>
        </div>

        {/* Tags on the right */}
        {dataset.tags.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <Tag className="w-3 h-3 text-[#4e5a7e] dark:text-white/40" />
            {dataset.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className="text-[12px] bg-muted/60 dark:bg-white/5 text-[#4e5a7e] dark:text-white/60 px-1.5 py-0.5 rounded border border-border/30 dark:border-white/10"
              >
                {tag}
              </span>
            ))}
            {dataset.tags.length > 2 && (
              <span className="text-[12px] text-[#4e5a7e] dark:text-white/40">
                +{dataset.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
