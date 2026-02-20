"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LIBRARY_SIDEBAR_SECTIONS } from "@/constants/library-sidebar.constants";
import Link from "next/link";
import { MyDatasetsPage } from "./components/my-datasets-page";
import { WishlistTab } from "./tabs/wishlist-tab";

type LibraryTab = "datasets" | "wishlist" | "recent" | "favorites";

export function LibraryPage() {
  const pathname = usePathname();

  // Determine active tab from pathname
  const getActiveTab = (): LibraryTab => {
    if (pathname === "/wishlist") return "wishlist";
    if (pathname === "/library/recent") return "recent";
    if (pathname === "/library/favorites") return "favorites";
    return "datasets";
  };

  const activeTab = getActiveTab();

  // Get sidebar sections
  const sidebarSections = LIBRARY_SIDEBAR_SECTIONS;

  // Get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "datasets":
        return "My Datasets";
      case "wishlist":
        return "My Wishlist";
      case "recent":
        return "Recently Accessed";
      case "favorites":
        return "Favorites";
      default:
        return "Library";
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <div className="relative z-50">
        <NotchNavigation />
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      {/* Main Content */}
      <div className="relative pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Page Header */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <MainSectionTabs />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <aside className="space-y-6 relative">
              {/* Fade separator line */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 dark:via-white/10 to-transparent hidden lg:block" />

              {sidebarSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded-xl overflow-hidden">
                  {section.title && (
                    <div className="px-3 pt-4 pb-2 lg:px-4 lg:pt-5 lg:pb-2">
                      <h3 className="text-xs font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1 px-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 ${
                          (activeTab === "datasets" && item.href === "/my-datasets") ||
                          (activeTab === "wishlist" && item.href === "/wishlist") ||
                          (activeTab === "recent" && item.href === "/library/recent") ||
                          (activeTab === "favorites" && item.href === "/library/favorites")
                            ? "bg-[#1a2240]/10 dark:bg-white/10 text-[#1a2240] dark:text-white font-medium"
                            : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main Content */}
            <div>
              {/* Render active tab component */}
              {activeTab === "datasets" && <MyDatasetsPage />}
              {activeTab === "wishlist" && <WishlistTab />}
              {activeTab === "recent" && (
                <div className="text-center py-12">
                  <p className="text-[#4e5a7e] dark:text-white/60">Recently Accessed - Coming soon</p>
                </div>
              )}
              {activeTab === "favorites" && (
                <div className="text-center py-12">
                  <p className="text-[#4e5a7e] dark:text-white/60">Favorites - Coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
