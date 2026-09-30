"use client";

import React, { lazy, Suspense } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { LazySection } from "@/shared/components/ui/lazy-section";
import {
  Shield,
  CheckCircle2,
  Database,
  FileText,
  Download,
  Lock,
  CheckCircle,
  Info,
  ArrowRight,
  Scale,
  Clock,
  HardDrive,
  Heart,
  Star,
  Loader2,
  Eye,
  Tag,
  Globe,
  Columns,
  Rows3,
  FileType,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Dataset } from "./types";
import {
  useWishlist,
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/api/useWishlist";
import { toast } from "sonner";
import { useModal } from "@/core/providers";
import { useAuth } from "@/core/providers/AuthProvider";
import { DatasetKdtsBadge } from "./DatasetKdtsBadge";
import { DatasetAboutSection } from "./DatasetAboutSection";
import { DatasetLocationSection } from "./DatasetLocationSection";
import { DatasetSourceSection } from "./DatasetSourceSection";
import { DatasetGovernanceSection } from "./DatasetGovernanceSection";
import { DatasetUsageSection } from "./DatasetUsageSection";
import {
  formatPriceAmount,
  getDatasetAccessPriceDisplay,
  getDatasetCommercialPriceDisplay,
} from "./price-display";

// Lazy-loaded heavy components that are never above-the-fold
const LandingFooter = lazy(() =>
  import("@/features/landing/components/LandingFooter").then((m) => ({
    default: m.LandingFooter,
  }))
);
const DatasetKdtsCard = lazy(() =>
  import("./DatasetKdtsCard").then((m) => ({ default: m.DatasetKdtsCard }))
);
const ReviewsSection = lazy(() =>
  import("./ReviewsSection").then((m) => ({ default: m.ReviewsSection }))
);
const QuestionsSection = lazy(() =>
  import("./QuestionsSection").then((m) => ({ default: m.QuestionsSection }))
);

/**
 * DATASET DETAIL PAGE — KUINBEE BUYER SIDE
 *
 * DESIGN PHILOSOPHY:
 * This is a registry record / procurement document, NOT a product page.
 * Replaces salesmanship with clarity. Earns trust through transparency.
 *
 * THREE-ZONE COMPOSITION:
 *
 * Zone 1 — Dataset Identity (Top)
 *   - Formal document header feel
 *   - Dataset ID, title, category, verification badges
 *   - Rating and review count
 *   - Short factual description
 *   - NO glassmorphism, strong typography only
 *
 * Zone 2 — Core Facts & Access (Middle, Decision Surface)
 *   LEFT: Dataset Substance
 *     - Metrics displayed as information cards (NOT tables)
 *     - Grouped fact clusters with icons
 *     - Quality metrics with progress bars
 *     - Scannable in under 10 seconds
 *
 *   RIGHT: Access & Pricing Panel (Sticky)
 *     - Glassmorphic panel (canonical pattern)
 *     - Access state indicator
 *     - Price (if paid, one-time only)
 *     - License summary
 *     - Primary action button (claim/purchase/download)
 *     - Add to Wishlist CTA
 *     - Explicit access explanation
 *     - Procurement confirmation feel, NOT sales box
 *
 * Zone 3 — Deep Detail & Assurance (Bottom)
 *   - Long-form sections for trust reinforcement
 *   - Dataset description, coverage, methodology
 *   - Reviews and ratings section
 *   - Supplier information (minimal, factual)
 *   - Governance & review notes
 *   - Usage & restrictions
 *
 * VISUAL RULES:
 * - Reuses existing Kuinbee design system exclusively
 * - Glassmorphic panels: bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm
 * - Brand gradient badges: from-[#1a2240] to-[#2d3a5f]
 * - Semantic color badges for verification states
 * - No new typography, colors, or effects
 *
 * ACCESS STATES:
 * - not-logged-in: Shows "Sign In to Access"
 * - not-entitled-free: Shows "Claim Dataset" (free)
 * - not-entitled-paid: Shows "Purchase Access" with price
 * - owned: Shows "Download Dataset" (green gradient)
 *
 * INTERACTION RULES:
 * - No hidden information
 * - No urgency language
 * - No fake scarcity
 * - Disabled states explain why
 * - Standard hover/focus transitions only
 */

// Access state types
type AccessState =
  | "not-logged-in"
  | "not-entitled-free"
  | "not-entitled-paid"
  | "owned";

interface DatasetDetailPageProps {
  dataset: Dataset;
  accessState?: AccessState;
  onClaimDataset?: () => void;
  onPurchaseDataset?: () => void;
  onDownloadDataset?: () => void;
  onDownloadSampleFile?: () => void;
  isDownloadingSampleFile?: boolean;
  onInquireSampleDataset?: () => void;
  onLogin?: () => void;
  onBack?: () => void;
  currentUserId?: string;
}

const DatasetIdentityHeader = React.memo(function DatasetIdentityHeader({
  dataset,
  isPaid,
}: {
  dataset: Dataset;
  isPaid: boolean;
}) {
  return (
    <div className="mb-10">
      <div className="mb-3">
        <span className="font-mono text-sm text-muted-foreground dark:text-white/60">
          {dataset.datasetUniqueId || dataset.id}
        </span>
      </div>

      <h1 className="text-4xl font-semibold tracking-tight text-primary dark:text-white mb-4">
        {dataset.title}
      </h1>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-3 py-1">
          {dataset.category}
        </Badge>

        {dataset.secondaryCategories.map((cat) => (
          <Badge
            key={cat}
            variant="outline"
            className="border-border/40 dark:border-white/20 text-muted-foreground dark:text-white/70 px-2.5 py-1"
          >
            {cat}
          </Badge>
        ))}

        {dataset.source?.isVerified && (
          <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-800">
            <Shield className="w-3.5 h-3.5" />
            Verified Source
          </div>
        )}

        {dataset.verification.published && (
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Published
          </div>
        )}

        <div
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
            isPaid
              ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
              : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
          )}
        >
          {isPaid ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5" />
          )}
          {isPaid ? "Paid" : dataset.isSample ? "Free Dataset Sample" : "Free"}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 text-yellow-500" />
          <span className="text-sm text-muted-foreground dark:text-white/60">
            {dataset.rating != null && Number(dataset.rating) > 0
              ? Number(dataset.rating).toFixed(1)
              : "No ratings"}{" "}
            ({dataset.reviewCount ?? 0}{" "}
            {dataset.reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Eye className="h-4 w-4 text-muted-foreground dark:text-white/50" />
          <span className="text-sm text-muted-foreground dark:text-white/60">
            {dataset.viewCount.toLocaleString()} views
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Download className="h-4 w-4 text-muted-foreground dark:text-white/50" />
          <span className="text-sm text-muted-foreground dark:text-white/60">
            {dataset.downloadCount.toLocaleString()} downloads
          </span>
        </div>
      </div>

      <p className="text-base text-muted-foreground dark:text-white/70 max-w-4xl leading-relaxed">
        {dataset.aboutDataset?.overview || dataset.description}
      </p>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        {dataset.tags.length > 0 && (
          <>
            <Tag className="h-3.5 w-3.5 text-muted-foreground dark:text-white/50" />
            {dataset.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs bg-muted/60 dark:bg-white/10 text-muted-foreground dark:text-white/70 px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </>
        )}
        <DatasetKdtsBadge datasetId={dataset.id} />
      </div>
    </div>
  );
});

const DatasetSubstanceSection = React.memo(function DatasetSubstanceSection({
  dataset,
}: {
  dataset: Dataset;
}) {
  const [visibleFeatureCount, setVisibleFeatureCount] = React.useState(40);
  const visibleFeatures = dataset.features.slice(0, visibleFeatureCount);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
          Dataset Metrics
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-white/10">
                <Globe className="h-4 w-4 text-primary dark:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                  Coverage
                </div>
                <div className="text-sm font-semibold text-foreground dark:text-white">
                  {dataset.location?.coverage ||
                    dataset.location?.country ||
                    dataset.coverage ||
                    "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 dark:bg-white/10">
                <Rows3 className="h-4 w-4 text-secondary dark:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                  Rows
                </div>
                <div className="text-sm font-semibold text-foreground dark:text-white font-mono">
                  {dataset.dataFormat?.rows != null
                    ? dataset.dataFormat.rows.toLocaleString()
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 dark:bg-purple-400/10">
                <Columns className="h-4 w-4 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                  Columns
                </div>
                <div className="text-sm font-semibold text-foreground dark:text-white font-mono">
                  {dataset.dataFormat?.cols != null
                    ? dataset.dataFormat.cols.toLocaleString()
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 dark:bg-amber-400/10">
                <Clock className="h-4 w-4 text-amber-700 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                  Last Updated
                </div>
                <div className="text-sm font-semibold text-foreground dark:text-white">
                  {dataset.lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {dataset.isSample ? (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
            Dataset Details
          </h2>

          <div className="space-y-4">
            <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dataset.sampleNotes?.actualDataSize && (
                  <div className="rounded-lg border border-border/40 dark:border-white/10 bg-muted/30 dark:bg-white/5 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-white/60 mb-1.5">
                      Actual Data Size
                    </div>
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.sampleNotes.actualDataSize}
                    </div>
                  </div>
                )}

                {dataset.sampleNotes?.deliveryMechanism && (
                  <div className="rounded-lg border border-border/40 dark:border-white/10 bg-muted/30 dark:bg-white/5 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-white/60 mb-1.5">
                      Delivery Mechanism
                    </div>
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.sampleNotes.deliveryMechanism}
                    </div>
                  </div>
                )}

                {typeof dataset.isNegotiable === "boolean" && (
                  <div className="rounded-lg border border-border/40 dark:border-white/10 bg-muted/30 dark:bg-white/5 p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-white/60 mb-1.5">
                      Negotiable
                    </div>
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.isNegotiable ? "Yes" : "No"}
                    </div>
                  </div>
                )}
              </div>

              {dataset.sampleNotes?.completeness && (
                <div className="rounded-lg border border-border/40 dark:border-white/10 bg-muted/30 dark:bg-white/5 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-white/60 mb-1.5">
                    Completeness
                  </div>
                  <div className="text-sm text-foreground dark:text-white/80 leading-relaxed">
                    {dataset.sampleNotes.completeness}
                  </div>
                </div>
              )}

              {dataset.sampleNotes?.deliveryMechanismNotes && (
                <div className="rounded-lg border border-border/40 dark:border-white/10 bg-muted/30 dark:bg-white/5 p-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground dark:text-white/60 mb-1.5">
                    Delivery Notes
                  </div>
                  <div className="text-sm text-foreground dark:text-white/80 leading-relaxed">
                    {dataset.sampleNotes.deliveryMechanismNotes}
                  </div>
                </div>
              )}
            </div>

            {dataset.dataFormat && (
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FileType className="h-4 w-4 text-primary dark:text-white/70" />
                    <div>
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        Format
                      </div>
                      <div className="text-sm font-semibold text-foreground dark:text-white">
                        {dataset.dataFormat.fileFormat}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-primary dark:text-white/70" />
                    <div>
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        File Size
                      </div>
                      <div className="text-sm font-semibold text-foreground dark:text-white">
                        {dataset.dataFormat.fileSize} KB
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary dark:text-white/70" />
                    <div>
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        Encoding
                      </div>
                      <div className="text-sm font-semibold text-foreground dark:text-white">
                        {dataset.dataFormat.encoding}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary dark:text-white/70" />
                    <div>
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        Compression
                      </div>
                      <div className="text-sm font-semibold text-foreground dark:text-white">
                        {dataset.dataFormat.compressionType}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        dataset.dataFormat && (
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
              Data Format
            </h2>
            <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FileType className="h-4 w-4 text-primary dark:text-white/70" />
                  <div>
                    <div className="text-xs text-muted-foreground dark:text-white/60">
                      Format
                    </div>
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.dataFormat.fileFormat}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary dark:text-white/70" />
                  <div>
                    <div className="text-xs text-muted-foreground dark:text-white/60">
                      File Size
                    </div>
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.dataFormat.fileSize} KB
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary dark:text-white/70" />
                  <div>
                    <div className="text-xs text-muted-foreground dark:text-white/60">
                      Encoding
                    </div>
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.dataFormat.encoding}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary dark:text-white/70" />
                  <div>
                    <div className="text-xs text-muted-foreground dark:text-white/60">
                      Compression
                    </div>
                    <div className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.dataFormat.compressionType}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {dataset.features.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
            Dataset Schema ({dataset.features.length} features)
          </h2>
          <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 dark:border-white/10">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">
                      Type
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">
                      Nullable
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFeatures.map((feature) => (
                    <tr
                      key={feature.id}
                      className="border-b border-border/20 dark:border-white/5 last:border-0"
                    >
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground dark:text-white">
                        {feature.name}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 dark:bg-white/10 text-primary dark:text-white">
                          {feature.dataType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground dark:text-white/60">
                        {feature.isNullable ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground dark:text-white/70 max-w-xs">
                        {feature.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {dataset.features.length > visibleFeatureCount && (
            <div className="mt-3 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                className="border-border/40 dark:border-white/20"
                onClick={() => setVisibleFeatureCount((count) => count + 40)}
              >
                Load More Columns (
                {Math.min(40, dataset.features.length - visibleFeatureCount)}{" "}
                more)
              </Button>
            </div>
          )}
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
          License & Compliance
        </h2>
        <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Scale className="h-5 w-5 text-primary dark:text-white mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                {dataset.license}
              </div>
              <div className="text-xs text-muted-foreground dark:text-white/60">
                {dataset.license === "CC"
                  ? "Creative Commons license. Usage subject to attribution requirements."
                  : dataset.license === "Open Data" ||
                      dataset.license === "ODbL"
                    ? "Publicly accessible under open data license. Usage subject to attribution requirements."
                    : "Commercial license required. Usage restricted to licensed entities."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

interface AccessPricingPanelProps {
  dataset: Dataset;
  isOwned: boolean;
  isPaid: boolean;
  accessState: AccessState;
  primaryAction: {
    label: string;
    onClick?: () => void;
    variant: "default";
    intent?: "default" | "download" | "contact";
  };
  onDownloadSampleFile?: () => void;
  isDownloadingSampleFile?: boolean;
  onInquireSampleDataset?: () => void;
  isInWishlist: boolean;
  isWishlistPending: boolean;
  isAuthenticated: boolean;
  onWishlistToggle: () => void;
  onSignIn: () => void;
}

const AccessPricingPanel = React.memo(function AccessPricingPanel({
  dataset,
  isOwned,
  isPaid,
  accessState,
  primaryAction,
  onDownloadSampleFile,
  isDownloadingSampleFile,
  onInquireSampleDataset,
  isInWishlist,
  isWishlistPending,
  isAuthenticated,
  onWishlistToggle,
  onSignIn,
}: AccessPricingPanelProps) {
  const accessPriceDisplay = getDatasetAccessPriceDisplay(dataset);
  const commercialPriceDisplay = getDatasetCommercialPriceDisplay(dataset);

  return (
    <div className="lg:sticky lg:top-24 lg:self-start">
      <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6 shadow-sm">
        <div className="mb-6">
          {isOwned ? (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-semibold">
                You own access to this dataset
              </span>
            </div>
          ) : isPaid ? (
            <div className="flex items-center gap-2 text-primary dark:text-white">
              <Lock className="h-5 w-5" />
              <span className="text-sm font-semibold">Paid Dataset</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-semibold">
                {dataset.isSample ? "Free Dataset Sample" : "Free Dataset"}
              </span>
            </div>
          )}
        </div>

        {isPaid && !isOwned && (
          <div className="mb-6 pb-6 border-b border-border/40 dark:border-white/10">
            <div className="mb-2 flex items-center justify-between gap-3">
              <div className="text-xs font-medium text-muted-foreground dark:text-white/60">
                One-Time Purchase
              </div>
              {accessPriceDisplay.isDiscounted && (
                <span className="inline-flex items-center rounded-sm border border-emerald-500/25 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                  Discounted
                </span>
              )}
            </div>
            {accessPriceDisplay.isDiscounted &&
              accessPriceDisplay.originalAmount !== null && (
                <div className="mb-1 text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/70 dark:text-white/50 dark:decoration-white/40">
                  {formatPriceAmount(
                    accessPriceDisplay.currency,
                    accessPriceDisplay.originalAmount
                  )}
                </div>
              )}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold text-foreground dark:text-white">
                {accessPriceDisplay.finalAmount !== null
                  ? formatPriceAmount(
                      accessPriceDisplay.currency,
                      accessPriceDisplay.finalAmount
                    )
                  : "—"}
              </span>
              <span className="text-sm text-muted-foreground dark:text-white/60">
                {accessPriceDisplay.currency}
              </span>
            </div>
          </div>
        )}

        {dataset.isSample &&
          commercialPriceDisplay.hasPrice &&
          commercialPriceDisplay.finalAmount !== null && (
            <div className="mb-6 pb-6 border-b border-border/40 dark:border-white/10">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="text-xs font-medium text-muted-foreground dark:text-white/60">
                  Actual Dataset Price
                </div>
                {commercialPriceDisplay.isDiscounted && (
                  <span className="inline-flex items-center rounded-sm border border-emerald-500/25 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300">
                    Discounted
                  </span>
                )}
              </div>
              {commercialPriceDisplay.isDiscounted &&
                commercialPriceDisplay.originalAmount !== null && (
                  <div className="mb-1 text-sm font-medium text-muted-foreground line-through decoration-muted-foreground/70 dark:text-white/50 dark:decoration-white/40">
                    {formatPriceAmount(
                      commercialPriceDisplay.currency,
                      commercialPriceDisplay.originalAmount
                    )}
                  </div>
                )}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-foreground dark:text-white">
                  {formatPriceAmount(
                    commercialPriceDisplay.currency,
                    commercialPriceDisplay.finalAmount
                  )}
                </span>
                <span className="text-sm text-muted-foreground dark:text-white/60">
                  {commercialPriceDisplay.currency}
                </span>
              </div>
              <div className="text-xs text-muted-foreground dark:text-white/60 mt-1">
                Full dataset commercial price
              </div>
            </div>
          )}

        <div className="mb-6 pb-6 border-b border-border/40 dark:border-white/10">
          <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2">
            License
          </div>
          <div className="text-sm text-foreground dark:text-white font-medium">
            {dataset.license}
          </div>
        </div>

        <div className="mb-4">
          <Button
            size="lg"
            className={cn(
              "w-full h-12 text-sm font-semibold",
              primaryAction.intent === "download"
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                : primaryAction.intent === "contact"
                  ? "bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                  : "bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
            )}
            onClick={primaryAction.onClick}
          >
            {primaryAction.intent === "download" ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                {primaryAction.label}
              </>
            ) : primaryAction.intent === "contact" ? (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                {primaryAction.label}
              </>
            ) : (
              <>
                {primaryAction.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        <div className="mb-4">
          <Button
            size="sm"
            className={cn(
              "w-full h-10 text-xs font-semibold",
              isInWishlist
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                : "bg-white dark:bg-[#1e2847] text-primary dark:text-white border border-primary/20 dark:border-white/20 hover:bg-primary/10 dark:hover:bg-white/10"
            )}
            onClick={() => {
              if (isAuthenticated) {
                onWishlistToggle();
              } else {
                toast.info("Sign in to add to wishlist");
                onSignIn();
              }
            }}
            disabled={isWishlistPending}
          >
            {isWishlistPending ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "w-3.5 h-3.5 mr-1.5",
                  isInWishlist && "fill-current"
                )}
              />
            )}
            {isInWishlist ? "Saved" : "Wishlist"}
          </Button>
        </div>

        {dataset.isSample && (
          <div className="mb-4">
            <Button
              size="sm"
              variant="outline"
              className="w-full h-10 text-xs font-semibold border-emerald-400/40 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10 dark:border-emerald-400/35 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
              onClick={onDownloadSampleFile}
              disabled={isDownloadingSampleFile}
            >
              {isDownloadingSampleFile ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 mr-1.5" />
              )}
              Download Sample File
            </Button>
          </div>
        )}

        {!dataset.isSample && dataset.pricing.type === "paid" && (
          <div className="mb-4">
            <Button
              size="sm"
              variant="outline"
              className="w-full h-10 text-xs font-semibold border-emerald-400/40 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10 dark:border-emerald-400/35 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
              onClick={onDownloadSampleFile}
              disabled={isDownloadingSampleFile}
            >
              {isDownloadingSampleFile ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5 mr-1.5" />
              )}
              Download Sample File
            </Button>
          </div>
        )}

        <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground dark:text-white/60 mt-0.5 shrink-0" />
            <div className="text-xs text-muted-foreground dark:text-white/60 leading-relaxed">
              {isOwned
                ? "Download links are time-limited and expire after 24 hours. You can regenerate links from your account."
                : accessState === "not-logged-in"
                  ? "Sign in to claim or purchase this dataset. Access is granted immediately after authentication."
                  : isPaid
                    ? "Access is granted immediately after purchase. Download links are time-limited for security."
                    : "Access is granted immediately after claiming. This dataset is free but requires authentication."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/**
 * Dataset Detail Page — Buyer Side
 *
 * Registry record / procurement document experience
 * Three-zone composition: Identity → Decision Surface → Deep Detail
 *
 * Reuses existing Kuinbee design system patterns exclusively
 */
export const DatasetDetailPage = React.memo(function DatasetDetailPage({
  dataset,
  accessState = "not-logged-in",
  onClaimDataset,
  onPurchaseDataset,
  onDownloadDataset,
  onDownloadSampleFile,
  isDownloadingSampleFile = false,
  onInquireSampleDataset,
  onLogin,
  onBack,
  currentUserId,
}: DatasetDetailPageProps) {
  const isPaid = dataset.pricing.type === "paid";
  const isOwned = accessState === "owned";
  const isLoggedIn = accessState !== "not-logged-in";
  const { openModal } = useModal();
  const { isAuthenticated } = useAuth();

  // Handle opening sign-in modal when not logged in
  const handleSignIn = React.useCallback(() => {
    openModal("login");
  }, [openModal]);

  // Wishlist hooks — only fetch when authenticated to avoid wasted 401 requests
  const { data: wishlistData } = useWishlist(isAuthenticated);
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Check if dataset is in wishlist
  const wishlistItems = wishlistData?.items || [];
  const isInWishlist = wishlistItems.some(
    (item) => item.datasetId === dataset.id
  );

  // Handle wishlist toggle
  const handleWishlistToggle = React.useCallback(async () => {
    if (!isAuthenticated) {
      handleSignIn();
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
      toast.error(
        error instanceof Error ? error.message : "Failed to update wishlist"
      );
    }
  }, [
    addToWishlistMutation,
    dataset.id,
    handleSignIn,
    isAuthenticated,
    isInWishlist,
    removeFromWishlistMutation,
  ]);

  // Get primary action based on access state
  const getPrimaryAction = () => {
    if (dataset.isSample) {
      if (accessState === "not-logged-in") {
        return {
          label: "Sign In to Inquire",
          onClick: handleSignIn,
          variant: "default" as const,
          intent: "default" as const,
        };
      }

      return {
        label: "Contact Kuinbee",
        onClick: onInquireSampleDataset,
        variant: "default" as const,
        intent: "contact" as const,
      };
    }

    if (accessState === "not-logged-in") {
      return {
        label: "Sign In to Access",
        onClick: handleSignIn,
        variant: "default" as const,
      };
    }

    if (isOwned) {
      return {
        label: "Download Dataset",
        onClick: onDownloadDataset,
        variant: "default" as const,
        intent: "download" as const,
      };
    }

    if (!isPaid) {
      return {
        label: "Claim Dataset",
        onClick: onClaimDataset,
        variant: "default" as const,
        intent: "default" as const,
      };
    }

    return {
      label: "Purchase Access",
      onClick: onPurchaseDataset,
      variant: "default" as const,
      intent: "default" as const,
    };
  };

  const primaryAction = getPrimaryAction();

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <div className="relative z-50">
        <NotchNavigation lite />
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      {/* Main Content */}
      <div className="relative pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <DatasetIdentityHeader dataset={dataset} isPaid={isPaid} />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mb-12">
            <DatasetSubstanceSection dataset={dataset} />

            <AccessPricingPanel
              dataset={dataset}
              isOwned={isOwned}
              isPaid={isPaid}
              accessState={accessState}
              primaryAction={primaryAction}
              onDownloadSampleFile={onDownloadSampleFile}
              isDownloadingSampleFile={isDownloadingSampleFile}
              onInquireSampleDataset={onInquireSampleDataset}
              isInWishlist={isInWishlist}
              isWishlistPending={
                addToWishlistMutation.isPending ||
                removeFromWishlistMutation.isPending
              }
              isAuthenticated={isAuthenticated}
              onWishlistToggle={handleWishlistToggle}
              onSignIn={handleSignIn}
            />
          </div>

          {/* ZONE 3: DEEP DETAIL & ASSURANCE — Bottom, Trust Reinforcement */}
          <section aria-label="Dataset details and governance">
            <div className="space-y-10">
              {/* KDTS Breakdown Card — deferred to Zone 3, total score badge stays in header */}
              <Suspense
                fallback={
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-muted/60 dark:bg-white/10 rounded w-1/3" />
                    <div className="h-32 bg-muted/40 dark:bg-white/5 rounded-xl" />
                  </div>
                }
              >
                <DatasetKdtsCard datasetId={dataset.id} />
              </Suspense>

              {/* About This Dataset */}
              <DatasetAboutSection dataset={dataset} />

              {/* Location & Coverage */}
              <DatasetLocationSection dataset={dataset} />

              {/* Source Information */}
              <DatasetSourceSection dataset={dataset} />

              {/* Governance & Review */}
              <DatasetGovernanceSection dataset={dataset} />

              {/* Usage & Restrictions */}
              <DatasetUsageSection dataset={dataset} />

              {/* Reviews & Ratings — code-split + lazy-rendered on scroll */}
              <LazySection minHeight={300}>
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-3">
                      <div className="h-6 bg-muted/60 dark:bg-white/10 rounded w-1/4" />
                      <div className="h-32 bg-muted/40 dark:bg-white/5 rounded-xl" />
                    </div>
                  }
                >
                  <ReviewsSection
                    datasetId={dataset.id}
                    isLoggedIn={isLoggedIn}
                    onSignIn={handleSignIn}
                  />
                </Suspense>
              </LazySection>

              {/* Questions & Answers — code-split + lazy-rendered on scroll */}
              <LazySection minHeight={300}>
                <Suspense
                  fallback={
                    <div className="animate-pulse space-y-3">
                      <div className="h-6 bg-muted/60 dark:bg-white/10 rounded w-1/4" />
                      <div className="h-32 bg-muted/40 dark:bg-white/5 rounded-xl" />
                    </div>
                  }
                >
                  <QuestionsSection
                    datasetId={dataset.id}
                    isLoggedIn={isLoggedIn}
                    onSignIn={handleSignIn}
                  />
                </Suspense>
              </LazySection>
            </div>
          </section>
        </div>
      </div>

      {/* Footer — lazy-loaded, never above-the-fold */}
      <Suspense
        fallback={
          <div className="h-64 bg-muted/20 dark:bg-white/5 animate-pulse" />
        }
      >
        <LandingFooter />
      </Suspense>
    </div>
  );
});

DatasetDetailPage.displayName = "DatasetDetailPage";
