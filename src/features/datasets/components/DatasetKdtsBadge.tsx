"use client";

import { useState, useEffect } from "react";
import { getDatasetKdts, type DatasetKdtsResponse } from "@/services/kdts.service";
import { Gauge } from "lucide-react";

interface DatasetKdtsBadgeProps {
  datasetId: string;
}

export function DatasetKdtsBadge({ datasetId }: DatasetKdtsBadgeProps) {
  const [data, setData] = useState<DatasetKdtsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDatasetKdts(datasetId)
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => { /* silently ignore */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [datasetId]);

  if (loading || !data?.currentScore) {
    return null;
  }

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
      <Gauge className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 tracking-wide">
        KDTS&nbsp;{parseFloat(data.currentScore).toFixed(1)}
      </span>
    </div>
  );
}
