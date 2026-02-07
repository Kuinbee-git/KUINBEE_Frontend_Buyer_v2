"use client";

import { Database, Users } from "lucide-react";
import { cn } from "@/shared/utils/cn";

type TabType = "datasets" | "suppliers";

interface DatasetSupplierTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function DatasetSupplierTabs({ activeTab, onTabChange }: DatasetSupplierTabsProps) {
  const tabs = [
    {
      id: "datasets" as TabType,
      label: "Datasets",
      icon: Database,
    },
    {
      id: "suppliers" as TabType,
      label: "Suppliers",
      icon: Users,
    },
  ];

  return (
    <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap flex-shrink-0",
              isActive
                ? "bg-[#1a2240] dark:bg-white/15 text-white border border-[#1a2240]/20 dark:border-white/20 shadow-sm"
                : "text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
            )}
          >
            <Icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
