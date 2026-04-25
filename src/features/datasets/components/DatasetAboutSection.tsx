import React from "react";
import { CheckCircle2, Lightbulb, TriangleAlert, Beaker } from "lucide-react";
import type { Dataset } from "./types";

interface DatasetAboutSectionProps {
  dataset: Dataset;
}

export const DatasetAboutSection = React.memo(function DatasetAboutSection({
  dataset,
}: DatasetAboutSectionProps) {
  // If no aboutDataset object, show plain description
  if (!dataset.aboutDataset) {
    if (!dataset.description) return null;

    return (
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
    );
  }

  return (
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
  );
});
