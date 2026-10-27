"use client";

import Link from "next/link";
import { Award, Heart, Loader2, Star } from "lucide-react";
import { useAuth } from "@/core/providers/AuthProvider";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/api/useWishlist";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";
import { EntityLogo } from "../components/entity-logo";
import { EnterpriseDatasetBadge } from "../components/enterprise-dataset-badge";
import {
  contentModalityLabels,
  contentPriceLabel,
  declaredMeasurement,
  physicalBytes,
  type ContentCatalogueCard,
} from "./content-description";

export function ContentDatasetCard({
  item,
  isInWishlist = false,
}: {
  item: ContentCatalogueCard;
  isInWishlist?: boolean;
}) {
  const { isAuthenticated } = useAuth();
  const add = useAddToWishlist(),
    remove = useRemoveFromWishlist();
  const busy = add.isPending || remove.isPending;
  const hasSample = item.uploadChoice !== "FULL_ONLY";
  const score = Number(item.assessment.score);
  const rating = Number(item.stats.rating);
  const measurements =
    item.measurements
      .find((group) => group.scope === "REPRESENTED_COLLECTION")
      ?.values.filter((value) => value.state !== "UNKNOWN") ?? [];
  const metadata = [
    item.category.name,
    contentModalityLabels(item.modalities).join(", "),
    ...measurements.slice(0, 1).map(declaredMeasurement),
  ];
  const sample = item.materials.find(
    (material) => material.component === "SAMPLE"
  );
  if (sample) metadata.push(`${physicalBytes(sample.sizeBytes)} sample`);
  const visibleTags: string[] = [];
  let budget = 60;
  for (const tag of item.tags) {
    if (budget < tag.length) break;
    visibleTags.push(tag);
    budget -= tag.length + 2;
  }
  async function toggle(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!isAuthenticated) {
      toast.info("Sign in to add to wishlist");
      return;
    }
    try {
      await (isInWishlist ? remove : add).mutateAsync(item.id);
    } catch {
      toast.error("The wishlist could not be updated. Please try again.");
    }
  }
  return (
    <Link
      href={`/datasets/${item.id}`}
      prefetch={false}
      data-content-card={item.id}
      className="group relative block overflow-hidden bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl shadow-sm p-5 hover:bg-[#1a2240]/4 dark:hover:bg-white/5 transition-colors duration-200 no-underline"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <EnterpriseDatasetBadge
            categories={[
              item.category.name,
              ...(item.secondaryCategories ?? []).map(
                (category) => category.name
              ),
            ]}
          />
          {hasSample && <Badge variant="success">Sample Available</Badge>}
        </div>
        <button
          type="button"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isInWishlist}
          disabled={busy}
          onClick={toggle}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 h-7 px-2 rounded-sm border text-xs font-medium transition-colors",
            isInWishlist
              ? "bg-[#1a2240]/10 dark:bg-white/10 border-[#1a2240]/25 dark:border-white/25 text-[#1a2240] dark:text-white"
              : "bg-transparent border-[#1a2240]/15 dark:border-white/15 text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white hover:border-[#1a2240]/30 dark:hover:border-white/30"
          )}
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Heart
              className="size-3.5"
              fill={isInWishlist ? "currentColor" : "none"}
            />
          )}
          <span className="hidden sm:inline">
            {isInWishlist ? "Saved" : "Save"}
          </span>
        </button>
      </div>
      <div className="mb-4 grid min-w-0 grid-cols-[72px_1fr] items-start gap-4">
        <EntityLogo
          name={item.owner.name}
          logoUrl={item.owner.logoUrl}
          ownerType={item.owner.type}
          className="h-[72px] w-[72px]"
          imageClassName="p-2"
          fallbackClassName="text-xl"
        />
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[#1a2240] dark:text-white leading-snug line-clamp-2 group-hover:text-[#1a2240] dark:group-hover:text-white transition-colors">
            {item.title}
          </h3>
          <p className="mt-1 text-sm text-[#4e5a7e] dark:text-white/70">
            by{" "}
            <span className="text-[#1a2240] dark:text-white font-medium">
              {item.owner.name}
            </span>
          </p>
        </div>
      </div>
      <p className="text-sm text-[#4e5a7e] dark:text-white/70 mb-3">
        {metadata.join(" · ")}
      </p>
      {visibleTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs bg-[#1a2240]/5 dark:bg-white/5 text-[#4e5a7e] dark:text-white/70 border border-[#1a2240]/10 dark:border-white/10"
            >
              {tag}
            </span>
          ))}
          {visibleTags.length < item.tags.length && (
            <span className="inline-flex items-center px-2 py-0.5 text-xs text-[#4e5a7e] dark:text-white/60">
              +{item.tags.length - visibleTags.length} more
            </span>
          )}
        </div>
      )}
      <div className="h-px bg-[#1a2240]/10 dark:bg-white/10 mb-4" />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-x-4 gap-y-2 flex-wrap text-sm">
          {item.stats.reviewCount > 0 && Number.isFinite(rating) && (
            <div className="flex items-center gap-1.5 text-[#4e5a7e] dark:text-white/70">
              <Star className="size-3.5 fill-amber-500 text-amber-500" />
              <span>
                {rating.toFixed(1)} ({item.stats.reviewCount})
              </span>
            </div>
          )}
          <div
            className="flex items-center gap-1.5"
            title={`Assessment covers the uploaded ${item.assessment.components.map((value) => (value === "FULL" ? "full material" : "sample")).join(" and ")}`}
          >
            <Award className="size-3.5 text-[#4e5a7e] dark:text-white/60" />
            <span className="text-[#4e5a7e] dark:text-white/70">
              KDTS Score
            </span>
            <span
              className={cn(
                "font-semibold",
                score >= 85
                  ? "text-emerald-700 dark:text-emerald-400"
                  : score >= 70
                    ? "text-blue-700 dark:text-blue-400"
                    : score >= 50
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-red-700 dark:text-red-400"
              )}
            >
              {score.toFixed(1)}
            </span>
          </div>
          <div className="flex gap-3 text-[#4e5a7e] dark:text-white/70">
            <span>{item.stats.viewCount.toLocaleString()} views</span>
            <span>{item.stats.downloadCount.toLocaleString()} downloads</span>
          </div>
        </div>
        <div className="text-base font-semibold text-[#1a2240] dark:text-white tabular-nums">
          {contentPriceLabel(item)}
        </div>
      </div>
    </Link>
  );
}
