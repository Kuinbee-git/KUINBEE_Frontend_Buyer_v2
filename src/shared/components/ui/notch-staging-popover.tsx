"use client";

import * as React from "react";
import { Receipt } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { PurchaseStagingPanel, type StagedDataset } from "./purchase-staging-panel";

interface NotchStagingPopoverProps {
  stagedDataset: StagedDataset;
  onProceedToCheckout: () => void;
  onRemove: () => void;
}

export function NotchStagingPopover({ stagedDataset, onProceedToCheckout, onRemove }: NotchStagingPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative p-2 text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors focus:outline-none"
          aria-label="Purchase staging"
        >
          <Receipt className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a2240] dark:bg-white text-white dark:text-[#1a2240] text-[10px] font-semibold">
            1
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={12}
        className="p-0 border-border/40 dark:border-white/10 bg-background/95 dark:bg-[#1e2847]/95 backdrop-blur-xl"
      >
        <PurchaseStagingPanel
          dataset={stagedDataset}
          onProceedToCheckout={onProceedToCheckout}
          onRemove={onRemove}
        />
      </PopoverContent>
    </Popover>
  );
}
