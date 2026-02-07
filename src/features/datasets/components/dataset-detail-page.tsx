"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import {
  Shield,
  CheckCircle2,
  Database,
  MapPin,
  Calendar,
  RefreshCw,
  FileText,
  Download,
  Lock,
  CheckCircle,
  AlertCircle,
  Info,
  ArrowRight,
  Building2,
  Scale,
  Clock,
  HardDrive,
  ShoppingCart,
  Heart,
  Star,
  User,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Dataset } from "./types";

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
 *     - Add to Cart / Add to Wishlist CTAs
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
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  onBack?: () => void;
  isInCart?: boolean;
  isInWishlist?: boolean;
}

/**
 * Dataset Detail Page — Buyer Side
 * 
 * Registry record / procurement document experience
 * Three-zone composition: Identity → Decision Surface → Deep Detail
 * 
 * Reuses existing Kuinbee design system patterns exclusively
 */
export function DatasetDetailPage({
  dataset,
  accessState = "not-logged-in",
  onClaimDataset,
  onPurchaseDataset,
  onDownloadDataset,
  onLogin,
  onAddToCart,
  onAddToWishlist,
  onBack,
  isInCart,
  isInWishlist,
}: DatasetDetailPageProps) {
  const isPaid = dataset.pricing.type === "paid";
  const isOwned = accessState === "owned";

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
        onClick: onLogin,
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
            {/* Dataset ID */}
            <div className="mb-3">
              <span className="font-mono text-sm text-muted-foreground dark:text-white/60">
                {dataset.id}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold tracking-tight text-primary dark:text-white mb-4">
              {dataset.title}
            </h1>

            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {/* Category */}
              <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-3 py-1">
                {dataset.category}
              </Badge>

              {/* Verification badges */}
              {dataset.verification.supplierVerified && (
                <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-800">
                  <Shield className="w-3.5 h-3.5" />
                  Verified Supplier
                </div>
              )}

              {dataset.verification.datasetReviewed && (
                <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Dataset Reviewed
                </div>
              )}
            </div>

            {/* Rating and Review Count */}
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground dark:text-white/60">
                {dataset.rating} ({dataset.reviewCount} reviews)
              </span>
            </div>

            {/* Short Description */}
            <p className="text-base text-muted-foreground dark:text-white/70 max-w-4xl leading-relaxed">
              {dataset.description}
            </p>
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
                  {/* Coverage */}
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-white/10">
                        <MapPin className="h-4 w-4 text-primary dark:text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                          Coverage
                        </div>
                        <div className="text-sm font-semibold text-foreground dark:text-white">
                          {dataset.coverage}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Record Count */}
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 dark:bg-white/10">
                        <Database className="h-4 w-4 text-secondary dark:text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                          Records
                        </div>
                        <div className="text-sm font-semibold text-foreground dark:text-white font-mono">
                          {(dataset.records / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Frequency */}
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 dark:bg-purple-400/10">
                        <RefreshCw className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
                          Update Frequency
                        </div>
                        <div className="text-sm font-semibold text-foreground dark:text-white">
                          {dataset.updateFrequency}
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

              {/* License & Format Information */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
                  License & Compliance
                </h2>
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Scale className="h-5 w-5 text-primary dark:text-white mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                          {dataset.license}
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-white/60">
                          {dataset.license === "Open Data" 
                            ? "Publicly accessible under open data license. Usage subject to attribution requirements."
                            : "Commercial license required. Usage restricted to licensed entities. Redistribution prohibited."
                          }
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-4 border-t border-border/40 dark:border-white/10">
                      <HardDrive className="h-5 w-5 text-primary dark:text-white mt-0.5" />
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                          Data Format
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-white/60">
                          CSV, JSON, Parquet — Delivered via secure download link
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Metrics */}
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
                  Quality Metrics
                </h2>
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
                          Completeness
                        </span>
                        <span className="text-sm font-semibold text-foreground dark:text-white font-mono">
                          {dataset.quality.completeness}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                          style={{ width: `${dataset.quality.completeness}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
                          Accuracy
                        </span>
                        <span className="text-sm font-semibold text-foreground dark:text-white font-mono">
                          {dataset.quality.accuracy}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${dataset.quality.accuracy}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
                          Consistency
                        </span>
                        <span className="text-sm font-semibold text-foreground dark:text-white font-mono">
                          {dataset.quality.consistency}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{ width: `${dataset.quality.consistency}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
                          Timeliness
                        </span>
                        <span className="text-sm font-semibold text-foreground dark:text-white font-mono">
                          {dataset.quality.timeliness}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                          style={{ width: `${dataset.quality.timeliness}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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

                {/* Add to Cart / Add to Wishlist CTAs */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <Button
                    size="sm"
                    className={cn(
                      "h-10 text-xs font-semibold",
                      isInCart
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                        : "bg-white dark:bg-[#1e2847] text-primary dark:text-white border border-primary/20 dark:border-white/20 hover:bg-primary/10 dark:hover:bg-white/10"
                    )}
                    onClick={onAddToCart}
                  >
                    <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                    {isInCart ? "In Cart" : "Add to Cart"}
                  </Button>

                  <Button
                    size="sm"
                    className={cn(
                      "h-10 text-xs font-semibold",
                      isInWishlist
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800"
                        : "bg-white dark:bg-[#1e2847] text-primary dark:text-white border border-primary/20 dark:border-white/20 hover:bg-primary/10 dark:hover:bg-white/10"
                    )}
                    onClick={onAddToWishlist}
                  >
                    <Heart className="w-3.5 h-3.5 mr-1.5" />
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
            
            {/* Dataset Description */}
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                Dataset Description
              </h3>
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                  {dataset.description}
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed mt-4">
                  This dataset provides comprehensive coverage of {dataset.coverage.toLowerCase()} with {dataset.updateFrequency.toLowerCase()} updates. 
                  Data is collected, validated, and published by {dataset.provider} under strict quality control protocols.
                </p>
              </div>
            </div>

            {/* Data Coverage & Methodology */}
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                Data Coverage & Methodology
              </h3>
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                      Geographic Coverage
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                      {dataset.coverage}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                      Collection Methodology
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                      Data is collected through automated systems with manual validation checkpoints. 
                      All sources are verified and cross-referenced against regulatory standards.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground dark:text-white mb-2">
                      Update Process
                    </h4>
                    <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                      {dataset.updateFrequency} updates ensure data currency. 
                      All updates are version-controlled and auditable.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supplier Information */}
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                Supplier Information
              </h3>
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                      {dataset.provider}
                    </div>
                    <div className="text-xs text-muted-foreground dark:text-white/60 mb-3">
                      Verified Marketplace Supplier
                    </div>
                    {dataset.verification.supplierVerified && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                        <Shield className="w-3.5 h-3.5" />
                        Identity verified, compliance reviewed, credentials on file
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Governance & Review Notes */}
            <div>
              <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
                Governance & Review
              </h3>
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                <div className="space-y-4">
                  {dataset.verification.datasetReviewed && (
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-700 dark:text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                          Dataset Reviewed
                        </div>
                        <div className="text-xs text-muted-foreground dark:text-white/60">
                          This dataset has been reviewed for quality, accuracy, and compliance with marketplace standards.
                        </div>
                      </div>
                    </div>
                  )}
                  
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

                  <div className="flex items-start gap-3">
                    <Scale className="h-5 w-5 text-primary dark:text-white mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                        Regulatory Compliance
                      </div>
                      <div className="text-xs text-muted-foreground dark:text-white/60">
                        All transactions are governed, logged, and auditable. Access is subject to license terms and jurisdiction restrictions.
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
                    <strong className="text-foreground dark:text-white">Permitted Use:</strong>{" "}
                    {dataset.license === "Open Data" 
                      ? "This dataset may be used for research, analysis, and commercial applications with proper attribution."
                      : "This dataset is licensed for use by the purchasing entity only. Internal analysis and derivative works are permitted."
                    }
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-foreground dark:text-white">Restrictions:</strong>{" "}
                    {dataset.license === "Open Data"
                      ? "Attribution is required. Redistribution must preserve original license terms."
                      : "Redistribution, resale, or transfer to third parties is prohibited without explicit written consent."
                    }
                  </p>
                  <p className="leading-relaxed">
                    <strong className="text-foreground dark:text-white">Access Control:</strong>{" "}
                    Download links are time-limited and single-use. All access is logged for audit purposes.
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews & Ratings */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  Reviews & Ratings
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold text-foreground dark:text-white">
                      {dataset.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground dark:text-white/60">
                    ({dataset.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6 mb-6">
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const percentage = stars === 5 ? 65 : stars === 4 ? 25 : stars === 3 ? 8 : stars === 2 ? 2 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="text-sm text-muted-foreground dark:text-white/60">{stars}</span>
                          <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        </div>
                        <div className="flex-1 h-2 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground dark:text-white/60 w-12 text-right">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {/* Review 1 */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">
                            Sarah Chen
                          </div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">
                            Data Analyst, Fortune 500 Financial Institution
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed mb-3">
                        Excellent dataset with comprehensive coverage and consistent quality. The data is well-structured, 
                        properly documented, and updated reliably. We've integrated this into our risk assessment pipeline 
                        with minimal preprocessing required. The provider's support has been responsive and professional.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-white/60">
                        <span>January 15, 2026</span>
                        <button className="flex items-center gap-1 hover:text-foreground dark:hover:text-white transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>Helpful (24)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">
                            Michael Rodriguez
                          </div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">
                            Research Director, Policy Think Tank
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          ))}
                          <Star className="h-3.5 w-3.5 text-muted-foreground dark:text-white/30" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed mb-3">
                        High-quality dataset that meets our research needs. The geographic coverage is comprehensive and 
                        the methodology is transparent. Only minor issue was some inconsistency in historical backfill data, 
                        but recent data is excellent. Good value for the price.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-white/60">
                        <span>December 8, 2025</span>
                        <button className="flex items-center gap-1 hover:text-foreground dark:hover:text-white transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>Helpful (18)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-semibold text-foreground dark:text-white">
                            Lisa Patel
                          </div>
                          <div className="text-xs text-muted-foreground dark:text-white/60">
                            Chief Data Officer, Healthcare Analytics Firm
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed mb-3">
                        Outstanding dataset. Clean, reliable, and exactly as described. The licensing terms are clear and 
                        fair. We've been using this for 6+ months in production and have had zero issues. The update 
                        frequency matches our operational requirements perfectly. Highly recommended.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground dark:text-white/60">
                        <span>November 22, 2025</span>
                        <button className="flex items-center gap-1 hover:text-foreground dark:hover:text-white transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>Helpful (31)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
