"use client";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  Calendar,
  FileText,
} from "lucide-react";

export interface OwnedDataset {
  id: string;
  datasetUniqueId: string;
  title: string;
  category: string;
  license: string;
  grantedAt: string;
  accessType: "free" | "purchased";
  verification: {
    supplierVerified: boolean;
    datasetReviewed: boolean;
  };
  status: "active" | "expired" | "pending";
}

interface OwnedDatasetCardProps {
  dataset: OwnedDataset;
  onAccess: (dataset: OwnedDataset) => void;
  onViewDetails: (dataset: OwnedDataset) => void;
}

export function OwnedDatasetCard({
  dataset,
  onAccess,
  onViewDetails,
}: OwnedDatasetCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-4 sm:p-6 hover:border-[#1a2240]/50 dark:hover:border-white/20 hover:shadow-2xl dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        {/* Badges Row */}
        <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
          {/* Access Type Badge */}
          {dataset.accessType === "purchased" ? (
            <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-2.5 py-1 text-xs font-semibold">
              PURCHASED
            </Badge>
          ) : (
            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-semibold">
              FREE ACCESS
            </Badge>
          )}

          {/* Verification Badges */}
          {dataset.verification.supplierVerified && (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-800">
              <Shield className="w-3.5 h-3.5" />
              Verified
            </div>
          )}
          {dataset.verification.datasetReviewed && (
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-md text-xs font-medium border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Reviewed
            </div>
          )}

          {/* Status Badge (if not active) */}
          {dataset.status === "expired" && (
            <Badge className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800 px-2.5 py-1 text-xs font-medium">
              Expired
            </Badge>
          )}
          {dataset.status === "pending" && (
            <Badge className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 px-2.5 py-1 text-xs font-medium">
              Pending
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-[#1a2240] dark:text-white text-lg mb-2 group-hover:text-[#4e5a7e] dark:group-hover:text-white transition-colors leading-tight">
          {dataset.title}
        </h3>

        {/* Dataset ID */}
        <p className="font-mono text-sm text-[#4e5a7e] dark:text-white/60 mb-2 sm:mb-3">
          {dataset.datasetUniqueId}
        </p>
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap gap-2 mb-4 sm:mb-5 pb-4 sm:pb-5 border-b border-border/50 dark:border-white/10">
        <div className="inline-flex items-center gap-1.5 text-xs bg-[#1a2240]/5 dark:bg-white/5 text-[#1a2240] dark:text-white/70 px-3 py-1.5 rounded-lg border border-[#1a2240]/10 dark:border-white/10 font-medium">
          <FileText className="w-3.5 h-3.5" />
          {dataset.category}
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 font-medium">
          <Shield className="w-3.5 h-3.5" />
          {dataset.license}
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs bg-[#4e5a7e]/5 dark:bg-white/5 text-[#4e5a7e] dark:text-white/70 px-3 py-1.5 rounded-lg border border-[#4e5a7e]/10 dark:border-white/10 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          Granted {formatDate(dataset.grantedAt)}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          className="h-10 text-sm flex-1 bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold shadow-md hover:shadow-lg transition-all"
          onClick={() => onAccess(dataset)}
          disabled={dataset.status !== "active"}
        >
          Access Dataset
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-10 text-sm text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white font-medium"
          onClick={() => onViewDetails(dataset)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}
