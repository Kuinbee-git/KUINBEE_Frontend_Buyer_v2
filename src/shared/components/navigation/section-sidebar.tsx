"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import { Separator } from "@/shared/components/ui/separator";

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  title?: string;
  items: NavItem[];
}

interface SectionSidebarProps {
  sections: NavSection[];
  className?: string;
}

export function SectionSidebar({ sections, className }: SectionSidebarProps) {
  const [currentPath, setCurrentPath] = React.useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  // Update path on navigation
  React.useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePathChange);

    // Listen for custom navigation events from app routing
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        setCurrentPath(window.location.pathname);
      }
    });

    return () => {
      window.removeEventListener("popstate", handlePathChange);
      observer.disconnect();
    };
  }, [currentPath]);

  return (
    <aside
      className={cn(
        "fixed left-24 top-[72px] bottom-0 w-[260px] overflow-y-auto",
        "hidden lg:block",
        className
      )}
    >
      {/* Fade separator line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 dark:via-white/10 to-transparent" />
      
      <nav className="py-6 px-3 space-y-3 pt-[104px]">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.title && (
              <div className="px-2 mb-2">
                <p className="text-[11px] font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                  {section.title}
                </p>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = currentPath === item.href || currentPath?.startsWith(item.href + '/');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors relative",
                      isActive
                        ? "bg-muted/60 dark:bg-white/5 text-foreground dark:text-white font-medium"
                        : "text-muted-foreground dark:text-white/50 hover:bg-muted/40 dark:hover:bg-white/5 hover:text-foreground dark:hover:text-white/70"
                    )}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#1a2240] dark:bg-white rounded-r" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            {sectionIndex < sections.length - 1 && (
              <Separator className="my-2 bg-border/40 dark:bg-white/10" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

// Pre-defined section configurations

export const LIBRARY_SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: "LIBRARY",
    items: [
      { label: "My Datasets", href: "/my-datasets" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Orders", href: "/orders" },
    ],
  },
];

export const ACCOUNT_SIDEBAR_SECTIONS = {
  profile: [
    {
      title: "PROFILE",
      items: [
        { label: "Personal Information", href: "/account/profile" },
        { label: "Security", href: "/account/security" },
        { label: "Linked Accounts", href: "/account/linked-accounts" },
      ],
    },
    {
      title: "RECORDS",
      items: [
        { label: "Orders", href: "/orders" },
      ],
    },
  ],
  preferences: [
    {
      title: "PREFERENCES",
      items: [
        { label: "Email Preferences", href: "/account/preferences/email" },
        { label: "Currency & Locale", href: "/account/preferences/locale" },
      ],
    },
    {
      title: "RECORDS",
      items: [
        { label: "Orders", href: "/orders" },
      ],
    },
  ],
  activity: [
    {
      title: "ACTIVITY",
      items: [
        { label: "Wishlist", href: "/account/activity/wishlist" },
      ],
    },
    {
      title: "RECORDS",
      items: [
        { label: "Orders", href: "/orders" },
      ],
    },
  ],
  support: [
    {
      title: "SUPPORT",
      items: [
        { label: "Tickets", href: "/account/support/tickets" },
        { label: "Create Ticket", href: "/account/support/create" },
      ],
    },
    {
      title: "RECORDS",
      items: [
        { label: "Orders", href: "/orders" },
      ],
    },
  ],
  orders: [
    {
      title: "ACCOUNT",
      items: [
        { label: "Profile", href: "/account/profile" },
        { label: "Preferences", href: "/account/preferences" },
        { label: "Activity", href: "/account/activity" },
        { label: "Support", href: "/account/support" },
      ],
    },
    {
      title: "RECORDS",
      items: [
        { label: "Orders", href: "/orders" },
      ],
    },
  ],
};
