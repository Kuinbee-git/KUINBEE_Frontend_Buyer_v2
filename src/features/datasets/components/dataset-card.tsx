"use client";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Star,
  MapPin,
  Calendar,
  Database,
  Shield,
  CheckCircle2,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Dataset } from "./types";

interface DatasetCardProps {
  dataset: Dataset;
  onPreview: (dataset: Dataset) => void;
  onViewDetails?: (dataset: Dataset) => void;
}

export function DatasetCard({ dataset, onPreview, onViewDetails }: DatasetCardProps) {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(dataset);
    } else {
      // Fallback to global navigate
      if (typeof window !== "undefined" && (window as any).navigate) {
        (window as any).navigate(`/datasets/${dataset.id}`, { dataset });
      }
    }
  };

  return (
    <div className="group bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-4 md:p-6 hover:border-[#1a2240]/50 dark:hover:border-white/20 hover:shadow-2xl dark:hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            {dataset.verification.supplierVerified && (
              <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium border border-blue-200 dark:border-blue-800">
                <Shield className="w-3 md:w-3.5 h-3 md:h-3.5" />
                Verified
              </div>
            )}
            {dataset.verification.datasetReviewed && (
              <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md text-[10px] md:text-xs font-medium border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 md:w-3.5 h-3 md:h-3.5" />
                Reviewed
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-[#1a2240] dark:text-white text-base md:text-lg mb-1.5 md:mb-2 group-hover:text-[#4e5a7e] dark:group-hover:text-white transition-colors leading-tight">
            {dataset.title}
          </h3>
          
          <p className="text-xs md:text-sm text-[#4e5a7e] dark:text-white/60 mb-2">
            by <span className="font-semibold text-[#1a2240] dark:text-white/80">{dataset.provider}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 md:w-4 h-3.5 md:h-4 ${
                    i < Math.floor(dataset.rating)
                      ? "fill-amber-500 text-amber-500"
                      : "fill-none text-[#4e5a7e]/20 dark:text-white/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] md:text-xs font-medium text-[#1a2240]/70 dark:text-white/50">
              {dataset.rating} ({dataset.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Price badge */}
        <div className="text-left sm:text-right w-full sm:w-auto">
          {dataset.pricing.type === "free" ? (
            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 font-semibold px-2.5 md:px-3 py-0.5 md:py-1 text-xs md:text-sm">
              Free
            </Badge>
          ) : (
            <div className="bg-gradient-to-br from-[#1a2240]/5 to-[#4e5a7e]/5 dark:from-white/10 dark:to-white/5 rounded-lg px-2.5 md:px-3 py-1.5 md:py-2 border border-[#1a2240]/10 dark:border-white/10 inline-block">
              <div className="text-lg md:text-xl font-bold text-[#1a2240] dark:text-white">
                {dataset.pricing.currency === "USD" && "$"}
                {dataset.pricing.currency === "EUR" && "€"}
                {dataset.pricing.currency === "GBP" && "£"}
                {dataset.pricing.currency === "INR" && "₹"}
                {dataset.pricing.amount?.toLocaleString()}
              </div>
              <div className="text-[10px] md:text-xs text-[#4e5a7e] dark:text-white/50 font-medium">per month</div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs md:text-sm text-[#4e5a7e] dark:text-white/70 mb-4 md:mb-5 leading-relaxed line-clamp-2">
        {dataset.description}
      </p>

      {/* Metadata badges */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5 pb-4 md:pb-5 border-b border-border/50 dark:border-white/10">
        <div className="inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs bg-[#1a2240]/5 dark:bg-white/5 text-[#1a2240] dark:text-white/70 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-[#1a2240]/10 dark:border-white/10 font-medium">
          <MapPin className="w-3 md:w-3.5 h-3 md:h-3.5" />
          {dataset.coverage}
        </div>
        <div className="inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs bg-[#4e5a7e]/5 dark:bg-white/5 text-[#4e5a7e] dark:text-white/70 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-[#4e5a7e]/10 dark:border-white/10 font-medium">
          <Database className="w-3 md:w-3.5 h-3 md:h-3.5" />
          {(dataset.records / 1000000).toFixed(1)}M records
        </div>
        <div className="inline-flex items-center gap-1 md:gap-1.5 text-[10px] md:text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 font-medium">
          <Calendar className="w-3 md:w-3.5 h-3 md:h-3.5" />
          {dataset.updateFrequency}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
        <Button
          variant="outline"
          size="sm"
          className="h-9 md:h-10 text-xs md:text-sm border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white hover:border-[#1a2240]/50 dark:hover:border-white/30 font-medium"
          onClick={() => onPreview(dataset)}
        >
          <Eye className="w-3.5 md:w-4 h-3.5 md:h-4 mr-1.5 md:mr-2" />
          Preview
        </Button>
        <Button
          size="sm"
          className="h-9 md:h-10 text-xs md:text-sm bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold shadow-md hover:shadow-lg transition-all"
          onClick={handleViewDetails}
        >
          View Details
          <ArrowRight className="w-3.5 md:w-4 h-3.5 md:h-4 ml-1.5 md:ml-2" />
        </Button>
      </div>
    </div>
  );
}
