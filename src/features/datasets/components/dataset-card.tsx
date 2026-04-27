"use client";

import { memo } from "react";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import {
  Star,
  Heart,
  Loader2,
  ShieldCheck,
  Award,
} from "lucide-react";
import { Dataset } from "./types";
import { useAddToWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { useAuth } from "@/core/providers/AuthProvider";
import { toast } from "sonner";
import { cn } from "@/shared/utils/cn";

// ── Pure utility functions (module scope to avoid re-allocation inside memo) ──

const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "₹";
    default: return "₹";
  }
};

const formatRecords = (count: number) => {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toLocaleString();
};

const formatFileSize = (sizeStr?: string) => {
  if (!sizeStr) return null;
  const bytes = parseInt(sizeStr);
  if (isNaN(bytes)) return sizeStr;
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
};

const toSafeNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

// ── Component ──

interface DatasetCardProps {
  dataset: Dataset;
  isInWishlist?: boolean;
  onViewDetails?: (dataset: Dataset) => void;
}

export const DatasetCard = memo(function DatasetCard({
  dataset,
  isInWishlist = false,
  onViewDetails,
}: DatasetCardProps) {
  const { isAuthenticated } = useAuth();

  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

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

  const kdtsValue = dataset.kdtsScore ? parseFloat(dataset.kdtsScore) : null;
  const ratingVal = toSafeNumber(dataset.rating) ?? 0;
  const fullStars = Math.floor(ratingVal);
  const hasHalfStar = ratingVal - fullStars >= 0.25;
  const totalStars = 5;
  const isSampleDataset = dataset.isSample === true;
  const sampleActualPrice = toSafeNumber(dataset.actualPrice);
  const hasActualSamplePrice = sampleActualPrice !== null;
  const sampleCurrency = dataset.actualPriceCurrency || dataset.pricing.currency;
  const normalizedProvider = dataset.provider?.trim().toLowerCase();
  const isPlatformDatasetProvider =
    normalizedProvider === "kuinbee information services pvt. ltd." ||
    normalizedProvider === "kuinbee information services private limited";

  // ── Price display (single source, not a badge) ──
  const priceDisplay = isSampleDataset
    ? hasActualSamplePrice
      ? `${getCurrencySymbol(sampleCurrency)}${sampleActualPrice?.toLocaleString()}`
      : null
    : dataset.pricing.type === "free"
      ? "Free"
      : `${getCurrencySymbol(dataset.pricing.currency)}${dataset.pricing.amount?.toLocaleString()}`;

  // ── Status badge: max 1 (Verified OR Sample) ──
  const statusBadge = dataset.verification.supplierVerified
    ? { variant: "info" as const, label: "Verified", icon: true }
    : isSampleDataset
      ? { variant: "success" as const, label: "Sample", icon: false }
      : null;

  // ── Additional badges: Buy in Parts + Sample Available ──
  const hasBuyInPartsAvailable = dataset.buyInPartsAvailable === true;
  const showSampleAvailable = isSampleDataset || dataset.sampleFileAvailable === true;

  // ── Tags: show as many as fit a ~60-char budget, collapse the rest ──
  const allTags = dataset.tags ?? [];
  let tagCharBudget = 60;
  const visibleTags: string[] = [];
  for (const tag of allTags) {
    if (tagCharBudget - tag.length >= 0) {
      visibleTags.push(tag);
      tagCharBudget -= tag.length + 2;
    } else break;
  }
  const hiddenTagCount = allTags.length - visibleTags.length;

  // ── Metadata line (plain text, dot-separated, no icons) ──
  const metadataParts: string[] = [];
  if (dataset.coverage && dataset.coverage !== "N/A") metadataParts.push(dataset.coverage);
  metadataParts.push(`${formatRecords(dataset.records)} rows`);
  if (isSampleDataset) {
    if (dataset.sampleNotes?.actualDataSize) metadataParts.push(dataset.sampleNotes.actualDataSize);
  } else if (dataset.dataFormat?.fileFormat) {
    const fmt = dataset.dataFormat.fileSize
      ? `${dataset.dataFormat.fileFormat} · ${formatFileSize(dataset.dataFormat.fileSize)}`
      : dataset.dataFormat.fileFormat;
    metadataParts.push(fmt);
  }

  // ── KDTS color tier (single token, no gradient) ──
  const kdtsTierClass = kdtsValue == null
    ? ""
    : kdtsValue >= 85
      ? "text-emerald-700 dark:text-emerald-400"
      : kdtsValue >= 70
        ? "text-blue-700 dark:text-blue-400"
        : kdtsValue >= 50
          ? "text-amber-700 dark:text-amber-400"
          : "text-red-700 dark:text-red-400";

  const isWishlistPending = addToWishlistMutation.isPending || removeFromWishlistMutation.isPending;

  return (
    <Link
      href={`/datasets/${dataset.id}`}
      className="group block bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-5 hover:bg-[#1a2240]/4 dark:hover:bg-white/5 transition-colors duration-200 no-underline"
      prefetch={false}
      onClick={onViewDetails ? (e) => { e.preventDefault(); onViewDetails(dataset); } : undefined}
    >
      {/* ── Row 1: Status Badges + Save ── */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          {statusBadge && (
            <Badge variant={statusBadge.variant}>
              {statusBadge.icon && <ShieldCheck className="w-3 h-3" />}
              {statusBadge.label}
            </Badge>
          )}
          {hasBuyInPartsAvailable && (
            <Badge variant="info">Buy in Parts</Badge>
          )}
          {showSampleAvailable && (
            <Badge variant="success">Sample Available</Badge>
          )}
        </div>

        <button
          onClick={handleWishlistToggle}
          disabled={isWishlistPending}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 h-7 px-2 rounded-sm border text-xs font-medium transition-colors",
            isInWishlist
              ? "bg-[#1a2240]/10 dark:bg-white/10 border-[#1a2240]/25 dark:border-white/25 text-[#1a2240] dark:text-white"
              : "bg-transparent border-[#1a2240]/15 dark:border-white/15 text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white hover:border-[#1a2240]/30 dark:hover:border-white/30"
          )}
          aria-label={isInWishlist ? "Remove from wishlist" : "Save to wishlist"}
        >
          {isWishlistPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Heart
              className={cn(
                "w-3.5 h-3.5",
                isInWishlist ? "fill-[#1a2240] dark:fill-white" : "fill-none"
              )}
            />
          )}
          <span className="hidden sm:inline">{isInWishlist ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* ── Row 2: Title ── */}
      <h3 className="text-base font-semibold text-[#1a2240] dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-[#1a2240] dark:group-hover:text-white transition-colors">
        {dataset.title}
      </h3>

      {/* ── Row 3: Provider ── */}
      <p className="text-sm text-[#4e5a7e] dark:text-white/70 mb-3">
        {isPlatformDatasetProvider ? "Curated by " : "by "}
        <span className="text-[#1a2240] dark:text-white font-medium">{dataset.provider}</span>
      </p>

      {/* ── Row 4: Metadata line (plain text, dot-separated) ── */}
      {metadataParts.length > 0 && (
        <p className="text-sm text-[#4e5a7e] dark:text-white/70 mb-3">
          {metadataParts.join(" · ")}
        </p>
      )}

      {/* ── Row 5: Tags ── */}
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleTags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs bg-[#1a2240]/5 dark:bg-white/5 text-[#4e5a7e] dark:text-white/70 border border-[#1a2240]/10 dark:border-white/10"
            >
              {tag}
            </span>
          ))}
          {hiddenTagCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs text-[#4e5a7e] dark:text-white/60">
              +{hiddenTagCount} more
            </span>
          )}
        </div>
      )}

      {/* ── Divider ── */}
      <div className="h-px bg-[#1a2240]/10 dark:bg-white/10 mb-4" />

      {/* ── Row 6: Rating + KDTS + Stats + Price ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 text-sm">
          {/* Rating - only show if reviews exist */}
          {dataset.reviewCount > 0 && (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: totalStars }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-3.5 h-3.5",
                      i < fullStars
                        ? "fill-amber-500 text-amber-500"
                        : i === fullStars && hasHalfStar
                          ? "fill-amber-500/50 text-amber-500"
                          : "fill-none text-[#1a2240]/10 dark:text-white/10"
                    )}
                  />
                ))}
              </div>
              <span className="text-[#1a2240] dark:text-white font-medium">
                {ratingVal.toFixed(1)}
              </span>
              <span className="text-[#4e5a7e] dark:text-white/70">
                ({dataset.reviewCount})
              </span>
            </div>
          )}

          {/* KDTS Score */}
          {kdtsValue != null && (
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#4e5a7e] dark:text-white/60" />
              <span className="text-[#4e5a7e] dark:text-white/70">KDTS Score</span>
              <span className={cn("font-semibold", kdtsTierClass)}>
                {kdtsValue.toFixed(1)}
              </span>
            </div>
          )}

          {/* Views / Downloads */}
          <div className="flex items-center gap-3 text-[#4e5a7e] dark:text-white/70">
            <span>{dataset.viewCount.toLocaleString()} views</span>
            <span>{dataset.downloadCount.toLocaleString()} downloads</span>
          </div>
        </div>

        {/* Price — right-aligned, strong, final */}
        {priceDisplay && (
          <div className="text-base font-semibold text-[#1a2240] dark:text-white tabular-nums">
            {priceDisplay}
          </div>
        )}
      </div>
    </Link>
  );
});

/** Skeleton placeholder matching DatasetCard dimensions to prevent layout shift. */
export function DatasetCardSkeleton() {
  return (
    <article className="bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-5 animate-pulse">
      {/* Row 1: Badges + Save */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
          <div className="h-5 w-20 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
        </div>
        <div className="h-7 w-16 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
      </div>

      {/* Row 2: Title */}
      <div className="space-y-1.5 mb-2">
        <div className="h-5 w-3/4 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
        <div className="h-5 w-1/2 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
      </div>

      {/* Row 3: Provider */}
      <div className="h-4 w-40 rounded-sm bg-[#1a2240]/10 dark:bg-white/10 mb-3" />

      {/* Row 4: Metadata line */}
      <div className="h-4 w-2/3 rounded-sm bg-[#1a2240]/10 dark:bg-white/10 mb-3" />

      {/* Row 5: Tags */}
      <div className="flex gap-1.5 mb-4">
        <div className="h-5 w-16 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
        <div className="h-5 w-20 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
        <div className="h-5 w-14 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1a2240]/10 dark:bg-white/10 mb-4" />

      {/* Row 6: Rating + Stats + Price */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-4 w-24 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
          <div className="h-4 w-28 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
          <div className="h-4 w-32 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
        </div>
        <div className="h-5 w-16 rounded-sm bg-[#1a2240]/10 dark:bg-white/10" />
      </div>
    </article>
  );
}
