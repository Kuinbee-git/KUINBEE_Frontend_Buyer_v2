import React from "react";
import type { Dataset } from "./types";

interface DatasetUsageSectionProps {
  dataset: Dataset;
}

export const DatasetUsageSection = React.memo(function DatasetUsageSection({
  dataset,
}: DatasetUsageSectionProps) {
  const getLicenseDescription = (license: string) => {
    if (license === "CC") {
      return "Creative Commons — This dataset may be used for research, analysis, and commercial applications with proper attribution.";
    }
    if (license === "Open Data" || license === "ODbL") {
      return "Open Data — This dataset may be used for research, analysis, and commercial applications with proper attribution.";
    }
    return `${license} — This dataset is licensed for use by the purchasing entity. Refer to the specific license terms for permitted use.`;
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
        Usage & Restrictions
      </h3>
      <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
        <div className="space-y-3 text-sm text-muted-foreground dark:text-white/70">
          <p className="leading-relaxed">
            <strong className="text-foreground dark:text-white">License:</strong>{" "}
            {getLicenseDescription(dataset.license)}
          </p>
          <p className="leading-relaxed">
            <strong className="text-foreground dark:text-white">Access Control:</strong>{" "}
            Download links are time-limited and single-use. All access is logged for audit purposes.
          </p>
        </div>
      </div>
    </div>
  );
});
