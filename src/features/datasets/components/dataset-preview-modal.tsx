"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Dataset } from "./types";
import { Copy, Download, Eye } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface DatasetPreviewModalProps {
  dataset: Dataset | null;
  isOpen: boolean;
  onClose: () => void;
}

// Mock preview data
const mockPreviewData = [
  { id: 1, region: "North America", value: 2847, change: 12.5 },
  { id: 2, region: "Europe", value: 3125, change: 8.3 },
  { id: 3, region: "Asia Pacific", value: 5420, change: 18.7 },
  { id: 4, region: "South America", value: 1834, change: -2.1 },
  { id: 5, region: "Africa", value: 945, change: 6.4 },
];

export function DatasetPreviewModal({
  dataset,
  isOpen,
  onClose,
}: DatasetPreviewModalProps) {
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(mockPreviewData, null, 2));
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  if (!dataset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto w-[95vw] sm:w-auto bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{dataset.title}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">{dataset.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Stats Cards */}
          <div className="bg-accent/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Records
            </p>
            <p className="text-2xl font-bold text-foreground">
              {(dataset.records / 1000000).toFixed(1)}M
            </p>
            <p className="text-xs text-muted-foreground mt-2">{dataset.coverage}</p>
          </div>

          <div className="bg-accent/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              Update Frequency
            </p>
            <p className="text-2xl font-bold text-foreground">
              {dataset.updateFrequency}
            </p>
            <p className="text-xs text-muted-foreground mt-2">Last updated {new Date(dataset.lastUpdated).toLocaleDateString()}</p>
          </div>

          <div className="bg-accent/30 backdrop-blur-sm rounded-lg p-4 border border-border/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              License
            </p>
            <p className="text-2xl font-bold text-foreground">{dataset.license}</p>
            <p className="text-xs text-muted-foreground mt-2">{dataset.pricing.type === "free" ? "Free Access" : `Starting at $${dataset.pricing.amount?.toLocaleString()}`}</p>
          </div>
        </div>

        {/* Data Preview Table */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Data Preview</h3>
            <p className="text-xs text-muted-foreground">
              Showing 5 of {(Math.random() * 100000).toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })} rows
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-left font-semibold text-foreground">
                    ID
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-foreground">
                    Region
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-foreground">
                    Value
                  </th>
                  <th className="px-4 py-2 text-right font-semibold text-foreground">
                    Change %
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockPreviewData.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-2 text-muted-foreground">#{row.id}</td>
                    <td className="px-4 py-2 text-foreground font-medium">
                      {row.region}
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-foreground">
                      {row.value.toLocaleString("en-US")}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-2 text-right font-medium",
                        row.change >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      {row.change >= 0 ? "+" : ""}
                      {row.change.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Data Quality Indicators */}
        <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">Data Quality</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">Completeness</p>
              <div className="bg-muted rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div className="bg-success h-full" style={{ width: `${dataset.quality.completeness}%` }} />
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-foreground mt-1">{dataset.quality.completeness}%</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">Accuracy</p>
              <div className="bg-muted rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div className="bg-success h-full" style={{ width: `${dataset.quality.accuracy}%` }} />
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-foreground mt-1">{dataset.quality.accuracy}%</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">Consistency</p>
              <div className="bg-muted rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div className="bg-success h-full" style={{ width: `${dataset.quality.consistency}%` }} />
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-foreground mt-1">{dataset.quality.consistency}%</p>
            </div>
            <div className="hidden lg:block">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">Timeliness</p>
              <div className="bg-muted rounded-full h-1.5 sm:h-2 overflow-hidden">
                <div className="bg-primary h-full" style={{ width: `${dataset.quality.timeliness}%` }} />
              </div>
              <p className="text-[10px] sm:text-xs font-medium text-foreground mt-1">{dataset.quality.timeliness}%</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="outline"
            className="flex-1 h-10 bg-transparent"
          >
            <Copy className="w-4 h-4 mr-2" />
            {copiedText ? "Copied!" : "Copy Sample"}
          </Button>
          <Button variant="outline" className="flex-1 h-10 bg-transparent">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button className="flex-1 h-10 bg-primary text-primary-foreground">
            <Eye className="w-4 h-4 mr-2" />
            Get Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
