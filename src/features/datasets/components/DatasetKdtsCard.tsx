"use client";

import { useState, useEffect } from "react";
import { getDatasetKdts, type DatasetKdtsResponse } from "@/services/kdts.service";

interface DatasetKdtsCardProps {
  datasetId: string;
}

const KDTS_DIMS = [
  { key: "Q" as const, label: "Completeness", gradientFrom: "from-emerald-500", gradientTo: "to-emerald-600" },
  { key: "L" as const, label: "Legitimacy",   gradientFrom: "from-blue-500",    gradientTo: "to-blue-600"    },
  { key: "P" as const, label: "Precision",    gradientFrom: "from-purple-500",  gradientTo: "to-purple-600"  },
  { key: "U" as const, label: "Usefulness",   gradientFrom: "from-amber-500",   gradientTo: "to-amber-600"   },
  { key: "F" as const, label: "Freshness",    gradientFrom: "from-rose-500",    gradientTo: "to-rose-600"    },
] as const;

export function DatasetKdtsCard({ datasetId }: DatasetKdtsCardProps) {
  const [data, setData] = useState<DatasetKdtsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDatasetKdts(datasetId)
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => { /* silently ignore — KDTS is supplementary info */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [datasetId]);

  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
        KDTS Scoring
      </h2>
      <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-5">
        {loading ? (
          /* Skeleton */
          <div className="space-y-4 animate-pulse">
            <div className="h-8 w-32 bg-muted dark:bg-white/10 rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={i === 4 ? "col-span-2" : ""}>
                  <div className="h-3 w-20 bg-muted dark:bg-white/10 rounded mb-2" />
                  <div className="h-1.5 bg-muted dark:bg-white/10 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        ) : !data?.currentScore ? (
          /* Not yet scored */
          <div className="flex items-center gap-3 py-2">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/30 dark:bg-white/20" />
            <span className="text-sm text-muted-foreground dark:text-white/60">
              Not yet rated by Kuinbee
            </span>
          </div>
        ) : (
          <>
            {/* Overall score headline */}
            <div className="flex items-baseline gap-1.5 mb-5">
              <span className="text-4xl font-bold text-foreground dark:text-white">
                {parseFloat(data.currentScore).toFixed(1)}
              </span>
              <span className="text-sm font-medium text-muted-foreground dark:text-white/60">/&nbsp;100</span>
              <span className="ml-2 text-xs font-medium text-muted-foreground dark:text-white/60 uppercase tracking-wide">
                overall
              </span>
            </div>

            {/* Dimension breakdown */}
            <div className="grid grid-cols-2 gap-4">
              {KDTS_DIMS.map(({ key, label, gradientFrom, gradientTo }, i) => (
                <div key={key} className={i === 4 ? "col-span-2" : ""}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
                      {key} — {label}
                    </span>
                    <span className="text-sm font-semibold text-foreground dark:text-white font-mono">
                      {data.breakdown?.[key] ?? 0}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full transition-all duration-500`}
                      style={{ width: `${data.breakdown?.[key] ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {data.updatedAt && (
              <p className="mt-4 text-xs text-muted-foreground dark:text-white/40">
                Last assessed {new Date(data.updatedAt).toLocaleDateString()}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
