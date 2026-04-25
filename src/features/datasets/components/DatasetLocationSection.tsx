import React from "react";
import { Globe, MapPin, Building2 } from "lucide-react";
import type { Dataset } from "./types";

interface DatasetLocationSectionProps {
  dataset: Dataset;
}

export const DatasetLocationSection = React.memo(function DatasetLocationSection({
  dataset,
}: DatasetLocationSectionProps) {
  // Don't render if no location data
  if (!dataset.location ||
      (!dataset.location.country && !dataset.location.coverage && !dataset.location.region)) {
    return null;
  }

  return (
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
                <div className="text-sm font-semibold text-foreground dark:text-white">
                  {dataset.location.country}
                </div>
              </div>
            </div>
          )}
          {dataset.location.region && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary dark:text-white/70" />
              <div>
                <div className="text-xs text-muted-foreground dark:text-white/60">Region</div>
                <div className="text-sm font-semibold text-foreground dark:text-white">
                  {dataset.location.region}
                </div>
              </div>
            </div>
          )}
          {dataset.location.state && (
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary dark:text-white/70" />
              <div>
                <div className="text-xs text-muted-foreground dark:text-white/60">State</div>
                <div className="text-sm font-semibold text-foreground dark:text-white">
                  {dataset.location.state}
                </div>
              </div>
            </div>
          )}
          {dataset.location.city && (
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-primary dark:text-white/70" />
              <div>
                <div className="text-xs text-muted-foreground dark:text-white/60">City</div>
                <div className="text-sm font-semibold text-foreground dark:text-white">
                  {dataset.location.city}
                </div>
              </div>
            </div>
          )}
          {dataset.location.coverage && (
            <div className="col-span-2 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary dark:text-white/70" />
              <div>
                <div className="text-xs text-muted-foreground dark:text-white/60">Coverage Detail</div>
                <div className="text-sm font-semibold text-foreground dark:text-white">
                  {dataset.location.coverage}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
