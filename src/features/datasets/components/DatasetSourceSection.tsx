import React from "react";
import { Building2, Shield, ExternalLink } from "lucide-react";
import type { Dataset } from "./types";

interface DatasetSourceSectionProps {
  dataset: Dataset;
}

export const DatasetSourceSection = React.memo(function DatasetSourceSection({
  dataset,
}: DatasetSourceSectionProps) {
  return (
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
  );
});
