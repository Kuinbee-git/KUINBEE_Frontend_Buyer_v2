"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { SectionSidebar, ACCOUNT_SIDEBAR_SECTIONS } from "@/shared/components/navigation/section-sidebar";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import Link from "next/link";
import { ProfileTab } from "./tabs/profile-tab";
import { PreferencesTab } from "./tabs/preferences-tab";
import { ActivityTab } from "./tabs/activity-tab";
import { SupportTab } from "./tabs/support-tab";
import { useAuth } from "@/core/providers";
import { useModal } from "@/core/providers";
import { Button } from "@/shared/components/ui/button";
import { AlertCircle } from "lucide-react";

type AccountTab = "profile" | "preferences" | "activity" | "support" | "orders";

export function AccountPage() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { openModal } = useModal();

  // Determine active tab from pathname
  const getActiveTab = (): AccountTab => {
    if (pathname === "/account/preferences" || pathname?.startsWith("/account/preferences/")) return "preferences";
    if (pathname === "/account/activity" || pathname?.startsWith("/account/activity/")) return "activity";
    if (pathname === "/account/support" || pathname?.startsWith("/account/support/")) return "support";
    if (pathname === "/orders" || pathname?.startsWith("/order/")) return "orders";
    return "profile";
  };

  const activeTab = getActiveTab();
  
  // Determine which specific profile section to show
  const getProfileSection = () => {
    if (pathname === "/account/security") return "security";
    if (pathname === "/account/linked-accounts") return "linked-accounts";
    return "personal"; // default to personal information
  };
  
  const profileSection = getProfileSection();

  // Get sidebar sections based on active tab
  const sidebarSections = ACCOUNT_SIDEBAR_SECTIONS[activeTab];

  // Function to get page title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case "profile":
        return "Profile";
      case "preferences":
        return "Preferences";
      case "activity":
        return "Activity";
      case "support":
        return "Support";
      default:
        return "Account";
    }
  };

  // Function to get page description based on active tab
  const getPageDescription = () => {
    switch (activeTab) {
      case "profile":
        return "Manage your personal information and settings.";
      case "preferences":
        return "Customize your experience with various preferences.";
      case "activity":
        return "View your recent activities and interactions.";
      case "support":
        return "Get help and support for any issues you may have.";
      default:
        return "Manage your account settings and preferences.";
    }
  };

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <NotchNavigation />
        </div>
        <div className="fixed inset-0 -z-10">
          <InstitutionalBackground />
        </div>
        <div className="relative pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-r-primary dark:border-white/20 dark:border-r-white" />
                <p className="mt-4 text-muted-foreground dark:text-white/70">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated, show sign-in prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <NotchNavigation />
        </div>
        <div className="fixed inset-0 -z-10">
          <InstitutionalBackground />
        </div>
        <div className="relative pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex items-center justify-center py-20">
              <div className="text-center max-w-md">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 dark:bg-white/10 mb-4">
                  <AlertCircle className="h-6 w-6 text-primary dark:text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground dark:text-white mb-2">
                  Sign In Required
                </h1>
                <p className="text-muted-foreground dark:text-white/70 mb-6">
                  You need to sign in to access your account and profile. Sign in now to manage your settings, view your activity, and more.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    size="lg"
                    className="w-full bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                    onClick={() => openModal("login")}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => openModal("signup")}
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          {/* Page Header - Just tabs */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <MainSectionTabs />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Left Sidebar - Navigation */}
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
                        className="block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main Content Column */}
            <div>
              {/* Section Title & Description - Above content */}
              <div className="mb-6">
                <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  {getPageTitle()}
                </h1>
                <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                  {getPageDescription()}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 bg-muted/50 dark:bg-white/5 border border-border/40 dark:border-white/10 p-1 rounded-lg w-fit">
                <Link href="/account/profile">
                  <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-white dark:bg-[#1e2847] text-[#1a2240] dark:text-white" : "text-muted-foreground hover:text-foreground"}`}>
                    Profile
                  </button>
                </Link>
                <Link href="/account/preferences">
                  <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "preferences" ? "bg-white dark:bg-[#1e2847] text-[#1a2240] dark:text-white" : "text-muted-foreground hover:text-foreground"}`}>
                    Preferences
                  </button>
                </Link>
                <Link href="/account/activity">
                  <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "activity" ? "bg-white dark:bg-[#1e2847] text-[#1a2240] dark:text-white" : "text-muted-foreground hover:text-foreground"}`}>
                    Activity
                  </button>
                </Link>
                <Link href="/account/support">
                  <button className={`px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeTab === "support" ? "bg-white dark:bg-[#1e2847] text-[#1a2240] dark:text-white" : "text-muted-foreground hover:text-foreground"}`}>
                    Support
                  </button>
                </Link>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === "profile" && <ProfileTab section={profileSection} />}
                {activeTab === "preferences" && <PreferencesTab />}
                {activeTab === "activity" && <ActivityTab />}
                {activeTab === "support" && <SupportTab />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
