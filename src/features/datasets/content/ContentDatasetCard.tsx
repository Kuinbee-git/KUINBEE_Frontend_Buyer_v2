"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useAuth } from "@/core/providers/AuthProvider";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/api/useWishlist";
import { toast } from "sonner";
import {
  contentChoiceLabel,
  contentModalityLabels,
  contentPriceLabel,
  declaredMeasurement,
  measurementScopeLabels,
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
      className="group relative block overflow-hidden bg-white dark:bg-[#1e2847] border border-border/40 dark:border-white/10 rounded-xl p-5 hover:bg-[#1a2240]/4 dark:hover:bg-white/5 transition-colors no-underline"
      data-content-card={item.id}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs text-[#4e5a7e] dark:text-white/70">
          {contentChoiceLabel(item.uploadChoice)} ·{" "}
          {contentModalityLabels(item.modalities).join(", ")}
        </p>
        <button
          type="button"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={isInWishlist}
          disabled={add.isPending || remove.isPending}
          onClick={toggle}
          className="shrink-0 p-2 rounded-lg text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
        >
          <Heart
            className="size-4"
            fill={isInWishlist ? "currentColor" : "none"}
          />
        </button>
      </div>
      <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white break-words">
        {item.title}
      </h3>
      <p className="mt-1 text-sm text-[#4e5a7e] dark:text-white/70">
        {item.owner.name} · {item.category.name}
        {item.categoryNameOrigin === "CAPTURED_CATEGORY"
          ? " (at submission)"
          : ""}
      </p>
      <p className="mt-3 text-sm text-[#4e5a7e] dark:text-white/70 line-clamp-2">
        {item.overview}
      </p>
      <dl className="mt-4 grid gap-2 text-sm text-[#4e5a7e] dark:text-white/70">
        {item.measurements
          .filter((group) => group.values.length > 0)
          .map((group) => (
            <div key={group.scope}>
              <dt className="inline font-medium">
                {measurementScopeLabels[group.scope]} (supplier declared):{" "}
              </dt>
              <dd className="inline">
                {group.values.slice(0, 2).map(declaredMeasurement).join(" · ")}
              </dd>
            </div>
          ))}
        {item.materials.map((material) => (
          <div key={material.component}>
            <dt className="inline">
              {material.component === "FULL"
                ? "Uploaded full material"
                : "Uploaded sample"}
              :{" "}
            </dt>
            <dd className="inline">
              {material.fileCount} physical{" "}
              {material.fileCount === 1 ? "file" : "files"} ·{" "}
              {physicalBytes(material.sizeBytes)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-border/40 dark:border-white/10 pt-3">
        <span className="font-semibold text-[#1a2240] dark:text-white">
          {contentPriceLabel(item)}
        </span>
        <span className="text-xs text-[#4e5a7e] dark:text-white/70">
          KDTS {item.assessment.score} · uploaded{" "}
          {item.assessment.components
            .map((value) => (value === "FULL" ? "full material" : "sample"))
            .join(" + ")}
        </span>
      </div>
    </Link>
  );
}
