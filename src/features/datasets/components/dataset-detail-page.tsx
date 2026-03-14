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
  MapPin,
  FileText,
  Download,
  Lock,
  CheckCircle,
  Info,
  ArrowRight,
  Building2,
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
  ExternalLink,
  Lightbulb,
  TriangleAlert,
  Beaker,
  Gauge,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Dataset } from "./types";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "@/hooks/api/useWishlist";
import { toast } from "sonner";
import { useModal } from "@/core/providers";
import { useAuth } from "@/core/providers/AuthProvider";

// Lazy-loaded heavy components that are never above-the-fold
const LandingFooter = lazy(() =>
  import("@/features/landing/components/LandingFooter").then((m) => ({ default: m.LandingFooter }))
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
type AccessState = "not-logged-in" | "not-entitled-free" | "not-entitled-paid" | "owned";

interface DatasetDetailPageProps {
  dataset: Dataset;
  accessState?: AccessState;
  onClaimDataset?: () => void;
  onPurchaseDataset?: () => void;
  onDownloadDataset?: () => void;
  onLogin?: () => void;
  onBack?: () => void;
  currentUserId?: string;
}

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
  const handleSignIn = () => {
    openModal("login");
  };

  // Wishlist hooks
  const { data: wishlistData } = useWishlist();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  // Check if dataset is in wishlist
  const wishlistItems = wishlistData?.items || [];
  const isInWishlist = wishlistItems.some((item) => item.datasetId === dataset.id);

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
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
      default: return "$";
    }
  };

  // Get primary action based on access state
  const getPrimaryAction = () => {
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
      };
    }

    if (!isPaid) {
      return {
        label: "Claim Dataset",
        onClick: onClaimDataset,
        variant: "default" as const,
      };
    }

    return {
      label: "Purchase Access",
      onClick: onPurchaseDataset,
      variant: "default" as const,
    };
  };

  const primaryAction = getPrimaryAction();

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

          {/* ZONE 1: DATASET IDENTITY — Top, High Authority */}
          <div className="mb-10">
            {/* Dataset Unique ID */}
            <div className="mb-3">
              <span className="font-mono text-sm text-muted-foreground dark:text-white/60">
                {dataset.datasetUniqueId || dataset.id}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold tracking-tight text-primary dark:text-white mb-4">
              {dataset.title}
            </h1>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Primary Category */}
              <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-3 py-1">
                {dataset.category}
              </Badge>

              {/* Secondary Categories */}
              {dataset.secondaryCategories.map((cat) => (
                <Badge key={cat} variant="outline" className="border-border/40 dark:border-white/20 text-muted-foreground dark:text-white/70 px-2.5 py-1">
                  {cat}
                </Badge>
              ))}

              {/* Source verification badge */}
              {dataset.source?.isVerified && (
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-800">
                  <Shield className="w-3.5 h-3.5" />
                  Verified Source
                </div>
              )}

              {/* Published badge */}
              {dataset.verification.published && (
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Published
                </div>
              )}

              {/* Pricing badge */}
              <div className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border",
                isPaid
                  ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                  : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
              )}>
                {isPaid ? <Lock className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                {isPaid ? "Paid" : "Free"}
              </div>
            </div>

            {/* Stats Row: Rating, Views, Downloads */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-muted-foreground dark:text-white/60">
                  {dataset.rating != null && dataset.rating > 0 ? dataset.rating.toFixed(1) : "No ratings"} ({dataset.reviewCount ?? 0} {dataset.reviewCount === 1 ? "review" : "reviews"})
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
              {dataset.kdtsScore && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                  <Gauge className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 tracking-wide">
                    KDTS&nbsp;{parseFloat(dataset.kdtsScore).toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Short Description (overview or general description) */}
            <p className="text-base text-muted-foreground dark:text-white/70 max-w-4xl leading-relaxed">
              {dataset.aboutDataset?.overview || dataset.description}
            </p>

            {/* Tags */}
            {dataset.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <Tag className="h-3.5 w-3.5 text-muted-foreground dark:text-white/50" />
                {dataset.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-muted/60 dark:bg-white/10 text-muted-foreground dark:text-white/70 px-2.5 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ZONE 2: CORE FACTS & ACCESS — Middle, Decision Surface */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 mb-12">

            {/* LEFT: Dataset Substance (Creative, Not Tabular) */}
            <div className="space-y-6">

              {/* Dataset Metrics - Grouped fact cluster */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
                  Dataset Metrics
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Coverage / Location */}
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
                          {dataset.location?.coverage || dataset.location?.country || dataset.coverage || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rows */}
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
                          {dataset.dataFormat?.rows != null ? dataset.dataFormat.rows.toLocaleString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Columns */}
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
                          {dataset.dataFormat?.cols != null ? dataset.dataFormat.cols.toLocaleString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Last Updated */}
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

              {/* Data Format Information */}
              {dataset.dataFormat && (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
                    Data Format
                  </h2>
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <FileType className="h-4 w-4 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">Format</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.dataFormat.fileFormat}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">File Size</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.dataFormat.fileSize} KB</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">Encoding</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.dataFormat.encoding}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">Compression</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.dataFormat.compressionType}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features / Schema */}
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
                            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">Name</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">Type</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">Nullable</th>
                            <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataset.features.map((feature) => (
                            <tr key={feature.id} className="border-b border-border/20 dark:border-white/5 last:border-0">
                              <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground dark:text-white">{feature.name}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 dark:bg-white/10 text-primary dark:text-white">
                                  {feature.dataType}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-muted-foreground dark:text-white/60">{feature.isNullable ? "Yes" : "No"}</td>
                              <td className="px-4 py-3 text-xs text-muted-foreground dark:text-white/70 max-w-xs">{feature.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* License & Compliance */}
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
                          : dataset.license === "Open Data" || dataset.license === "ODbL"
                            ? "Publicly accessible under open data license. Usage subject to attribution requirements."
                            : "Commercial license required. Usage restricted to licensed entities."
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* KDTS Scoring — lazy-loaded, not above-the-fold */}
              <Suspense fallback={
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted/60 dark:bg-white/10 rounded w-1/3" />
                  <div className="h-32 bg-muted/40 dark:bg-white/5 rounded-xl" />
                </div>
              }>
                <DatasetKdtsCard datasetId={dataset.id} />
              </Suspense>
            </div>

            {/* RIGHT: Access & Pricing Panel (Sticky) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6 shadow-sm">

                {/* Access State Indicator */}
                <div className="mb-6">
                  {isOwned ? (
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">You own access to this dataset</span>
                    </div>
                  ) : isPaid ? (
                    <div className="flex items-center gap-2 text-primary dark:text-white">
                      <Lock className="h-5 w-5" />
                      <span className="text-sm font-semibold">Paid Dataset</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Free Dataset</span>
                    </div>
                  )}
                </div>

                {/* Price (if paid) */}
                {isPaid && !isOwned && (
                  <div className="mb-6 pb-6 border-b border-border/40 dark:border-white/10">
                    <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2">
                      One-Time Purchase
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-semibold text-foreground dark:text-white">
                        {getCurrencySymbol(dataset.pricing.currency)}{dataset.pricing.amount?.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground dark:text-white/60">
                        {dataset.pricing.currency}
                      </span>
                    </div>
                  </div>
                )}

                {/* License Summary */}
                <div className="mb-6 pb-6 border-b border-border/40 dark:border-white/10">
                  <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-2">
                    License
                  </div>
                  <div className="text-sm text-foreground dark:text-white font-medium">
                    {dataset.license}
                  </div>
                </div>

                {/* Primary Action */}
                <div className="mb-4">
                  <Button
                    size="lg"
                    className={cn(
                      "w-full h-12 text-sm font-semibold",
                      isOwned
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                        : "bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                    )}
                    onClick={primaryAction.onClick}
                  >
                    {isOwned ? (
                      <>
                        <Download className="w-4 h-4 mr-2" />
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

                {/* Add to Wishlist CTA */}
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
                        handleWishlistToggle();
                      } else {
                        toast.info("Sign in to add to wishlist");
                        handleSignIn();
                      }
                    }}
                    disabled={addToWishlistMutation.isPending || removeFromWishlistMutation.isPending}
                  >
                    {(addToWishlistMutation.isPending || removeFromWishlistMutation.isPending) ? (
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <Heart className={cn("w-3.5 h-3.5 mr-1.5", isInWishlist && "fill-current")} />
                    )}
                    {isInWishlist ? "Saved" : "Wishlist"}
                  </Button>
                </div>

                {/* Access Explanation */}
                <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-muted-foreground dark:text-white/60 mt-0.5 shrink-0" />
                    <div className="text-xs text-muted-foreground dark:text-white/60 leading-relaxed">
                      {isOwned ? (
                        "Download links are time-limited and expire after 24 hours. You can regenerate links from your account."
                      ) : accessState === "not-logged-in" ? (
                        "Sign in to claim or purchase this dataset. Access is granted immediately after authentication."
                      ) : isPaid ? (
                        "Access is granted immediately after purchase. Download links are time-limited for security."
                      ) : (
                        "Access is granted immediately after claiming. This dataset is free but requires authentication."
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ZONE 3: DEEP DETAIL & ASSURANCE — Bottom, Trust Reinforcement */}
          <div className="space-y-10">

            {/* About This Dataset */}
            {dataset.aboutDataset && (
              <div>
                <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                  About This Dataset
                </h3>
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                  <div className="space-y-5">
                    {/* Description */}
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                        {dataset.aboutDataset.description}
                      </p>
                    </div>

                    {/* Data Quality */}
                    {dataset.aboutDataset.dataQuality && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          Data Quality
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                          {dataset.aboutDataset.dataQuality}
                        </p>
                      </div>
                    )}

                    {/* Use Cases */}
                    {dataset.aboutDataset.useCases && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          Use Cases
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                          {dataset.aboutDataset.useCases}
                        </p>
                      </div>
                    )}

                    {/* Limitations */}
                    {dataset.aboutDataset.limitations && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                          <TriangleAlert className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          Limitations
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                          {dataset.aboutDataset.limitations}
                        </p>
                      </div>
                    )}

                    {/* Methodology */}
                    {dataset.aboutDataset.methodology && (
                      <div>
                        <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2 flex items-center gap-2">
                          <Beaker className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Methodology
                        </h4>
                        <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                          {dataset.aboutDataset.methodology}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Fallback: Plain description if no aboutDataset */}
            {!dataset.aboutDataset && dataset.description && (
              <div>
                <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                  Dataset Description
                </h3>
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                  <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                    {dataset.description}
                  </p>
                </div>
              </div>
            )}

            {/* Location & Coverage */}
            {dataset.location && (dataset.location.country || dataset.location.coverage || dataset.location.region) && (
              <div>
                <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                  Geographic Coverage
                </h3>
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {dataset.location.country && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">Country</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.location.country}</div>
                        </div>
                      </div>
                    )}
                    {dataset.location.region && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">Region</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.location.region}</div>
                        </div>
                      </div>
                    )}
                    {dataset.location.state && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">State</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.location.state}</div>
                        </div>
                      </div>
                    )}
                    {dataset.location.city && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">City</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.location.city}</div>
                        </div>
                      </div>
                    )}
                    {dataset.location.coverage && (
                      <div className="col-span-2 flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary dark:text-white/70" />
                        <div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">Coverage Detail</div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">{dataset.location.coverage}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Source Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                Source Information
              </h3>
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-foreground dark:text-white">
                        {dataset.source?.name || dataset.provider}
                      </span>
                      {dataset.source?.isVerified && (
                        <div className="flex items-center gap-1 text-xs text-blue-700 dark:text-blue-400">
                          <Shield className="w-3.5 h-3.5" />
                          Verified
                        </div>
                      )}
                    </div>
                    {dataset.source?.description && (
                      <p className="text-xs text-muted-foreground dark:text-white/60 mb-2">
                        {dataset.source.description}
                      </p>
                    )}
                    {dataset.source?.websiteUrl && (
                      <a
                        href={dataset.source.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary dark:text-blue-400 hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Visit Website
                      </a>
                    )}
                    {!dataset.source?.description && !dataset.source?.websiteUrl && (
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        Marketplace Data Source
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Governance & Review */}
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                Governance & Review
              </h3>
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                <div className="space-y-4">
                  {dataset.verification.published && (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                          Published Status
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-white/60">
                          This dataset is approved for marketplace distribution and meets all publication criteria.
                        </div>
                      </div>
                    </div>
                  )}

                  {dataset.source?.isVerified && (
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-700 dark:text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                          Verified Source
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-white/60">
                          The data source has been verified for authenticity and reliability.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-primary dark:text-white mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                        Regulatory Compliance
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        All transactions are governed, logged, and auditable. Access is subject to license terms.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage & Restrictions */}
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                Usage & Restrictions
              </h3>
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                <div className="space-y-3 text-sm text-muted-foreground dark:text-white/70">
                  <p className="leading-relaxed">
                    <strong className="text-foreground dark:text-white">License:</strong>{" "}
                    {dataset.license === "CC"
                      ? "Creative Commons — This dataset may be used for research, analysis, and commercial applications with proper attribution."
                      : dataset.license === "Open Data" || dataset.license === "ODbL"
                        ? "Open Data — This dataset may be used for research, analysis, and commercial applications with proper attribution."
                        : `${dataset.license} — This dataset is licensed for use by the purchasing entity. Refer to the specific license terms for permitted use.`
                    }
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-foreground dark:text-white">Access Control:</strong>{" "}
                    Download links are time-limited and single-use. All access is logged for audit purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews & Ratings — code-split + lazy-rendered on scroll */}
            <LazySection minHeight={300}>
              <Suspense fallback={
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-muted/60 dark:bg-white/10 rounded w-1/4" />
                  <div className="h-32 bg-muted/40 dark:bg-white/5 rounded-xl" />
                </div>
              }>
                <ReviewsSection
                  datasetId={dataset.id}
                  isLoggedIn={isLoggedIn}
                  onSignIn={handleSignIn}
                />
              </Suspense>
            </LazySection>

            {/* Questions & Answers — code-split + lazy-rendered on scroll */}
            <LazySection minHeight={300}>
              <Suspense fallback={
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-muted/60 dark:bg-white/10 rounded w-1/4" />
                  <div className="h-32 bg-muted/40 dark:bg-white/5 rounded-xl" />
                </div>
              }>
                <QuestionsSection
                  datasetId={dataset.id}
                  isLoggedIn={isLoggedIn}
                  onSignIn={handleSignIn}
                />
              </Suspense>
            </LazySection>
          </div>
        </div>
      </div>

      {/* Footer — lazy-loaded, never above-the-fold */}
      <Suspense fallback={
        <div className="h-64 bg-muted/20 dark:bg-white/5 animate-pulse" />
      }>
        <LandingFooter />
      </Suspense>
    </div>
  );
});

DatasetDetailPage.displayName = "DatasetDetailPage";
