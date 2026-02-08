"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";

const mainSections = [
  {
    id: "account",
    label: "Account",
    href: "/account/profile",
  },
  {
    id: "library",
    label: "Library",
    href: "/my-datasets",
  },
];

export function MainSectionTabs() {
  const pathname = usePathname();

  const getActiveSection = () => {
    if (pathname?.startsWith("/account")) return "account";
    if (pathname?.startsWith("/my-datasets") || pathname?.startsWith("/library")) return "library";
    return "library";
  };

  const activeSection = getActiveSection();

  return (
    <div className="inline-flex items-center gap-1 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-lg p-1">
      {mainSections.map((section) => (
        <Link
          key={section.id}
          href={section.href}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            activeSection === section.id
              ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white shadow-sm"
              : "text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
          )}
        >
          {section.label}
        </Link>
      ))}
    </div>
  );
}
