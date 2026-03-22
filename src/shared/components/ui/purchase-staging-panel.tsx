"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";

export interface StagedDataset {
  id: string;
  datasetUniqueId: string;
  title: string;
  category: string;
  license: string;
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency?: string;
  };
  verification: {
    supplierVerified: boolean;
    datasetReviewed: boolean;
  };
}

export interface PurchaseStagingPanelProps {
  dataset: StagedDataset;
  onProceedToCheckout: () => void;
  onRemove: () => void;
}

export function PurchaseStagingPanel({ dataset, onProceedToCheckout, onRemove }: PurchaseStagingPanelProps) {
  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "INR": return "₹";
      default: return "$";
    }
  };

  return (
    <div className="w-[380px]">
      {/* Header */}
      <div className="border-b border-border/40 dark:border-white/10 px-5 py-4">
        <div className="text-sm font-semibold text-foreground dark:text-white">
          Purchase Staging
        </div>
        <div className="text-xs text-muted-foreground dark:text-white/60 mt-0.5">
          Review dataset before checkout
        </div>
      </div>

      {/* Dataset Summary */}
      <div className="px-5 py-4 space-y-4">
        {/* Title & ID */}
        <div>
          <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
            {dataset.title}
          </div>
          <div className="font-mono text-xs text-muted-foreground dark:text-white/60">
            {dataset.datasetUniqueId}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-2.5 py-0.5 text-xs">
            {dataset.category}
          </Badge>
          {dataset.verification.supplierVerified && (
            <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-xs">
              Verified
            </Badge>
          )}
          {dataset.verification.datasetReviewed && (
            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs">
              Reviewed
            </Badge>
          )}
        </div>

        {/* License & Pricing */}
        <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
              License
            </span>
            <span className="text-xs font-semibold text-foreground dark:text-white">
              {dataset.license}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
              Price
            </span>
            <span className="text-sm font-semibold text-foreground dark:text-white">
              {dataset.pricing.type === "paid"
                ? `${getCurrencySymbol(dataset.pricing.currency)}${dataset.pricing.amount?.toLocaleString()} ${dataset.pricing.currency}`
                : "Free"
              }
            </span>
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground dark:text-white/60 leading-relaxed">
          Access is granted immediately after successful payment.
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border/40 dark:border-white/10 px-5 py-4 space-y-2">
        <Button
          className="w-full bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white"
          onClick={onRemove}
        >
          Remove from staging
        </Button>
      </div>
    </div>
  );
}
