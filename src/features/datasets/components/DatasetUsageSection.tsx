import React from "react";
import type { Dataset } from "./types";

interface DatasetUsageSectionProps {
  dataset: Dataset;
}

export const DatasetUsageSection = React.memo(function DatasetUsageSection({
  dataset,
}: DatasetUsageSectionProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground dark:text-white mb-4">
        Usage & Restrictions
      </h3>
      <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6">
        <div className="space-y-3 text-sm text-muted-foreground dark:text-white/70">
          <p className="leading-relaxed">
            <strong className="text-foreground dark:text-white">
              License:
            </strong>{" "}
            {dataset.license}
          </p>
          <p className="leading-relaxed">
            Refer to the applicable license terms for permitted use and
            redistribution.
          </p>
        </div>
      </div>
    </div>
  );
});
