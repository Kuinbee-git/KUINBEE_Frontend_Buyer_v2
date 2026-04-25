import React from "react";
import { CheckCircle2, Shield, Scale } from "lucide-react";
import type { Dataset } from "./types";

interface DatasetGovernanceSectionProps {
  dataset: Dataset;
}

export const DatasetGovernanceSection = React.memo(function DatasetGovernanceSection({
  dataset,
}: DatasetGovernanceSectionProps) {
  return (
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
  );
});
