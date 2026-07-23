"use client";

import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "@/components/router/Link";
import { useModal, useAuth } from "@/core/providers";
import { useNavigationConfig } from "@/hooks/useNavigationConfig";
import { resources } from "@/config/navigation.config";
import { toast } from "sonner";

import {
  ArrowLeft,
  X,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "./button";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/shared/utils/cn";
import type { StagedDataset } from "./purchase-staging-panel";

const NotchNotificationBell = dynamic(
  () => import("./notch-notification-bell").then((module) => module.NotchNotificationBell),
  { ssr: false }
);

const NavDropdown = dynamic(
  () => import("./nav-dropdown").then((module) => module.NavDropdown),
  { ssr: false }
);

const MobileNav = dynamic(
  () => import("./mobile-nav").then((module) => module.MobileNav),
  { ssr: false }
);

const NotchUserMenu = dynamic(
  () => import("./notch-user-menu").then((module) => module.NotchUserMenu),
  { ssr: false }
);

const NotchStagingPopover = dynamic(
  () => import("./notch-staging-popover").then((module) => module.NotchStagingPopover),
  { ssr: false }
);

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium transition-colors duration-200",
        "hover:text-foreground dark:hover:text-white",
        isActive ? "text-foreground dark:text-white" : "text-muted-foreground dark:text-white/70",
        className
      )}
    >
      {children}
    </Link>
  );
}





interface NotchNavigationProps {
  lite?: boolean;
}

function NotchNavigationInner({ lite = false }: NotchNavigationProps) {
  const [scrolled, setScrolled] = React.useState(false);
  const router = useRouter();
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const navConfig = useNavigationConfig();
  const pathname = usePathname();

  // Search bar state
  const [navSearchQuery, setNavSearchQuery] = React.useState("");

  // Keep search input synced from URL (e.g. direct link /datasets?q=...)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const query = new URLSearchParams(window.location.search).get("q") || "";
    setNavSearchQuery(query);
  }, [pathname]);

  // Handle scroll state
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // Reduced threshold for earlier transition
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lite]);

  // Calculate actual width based on scroll state
  const actualMaxWidth = scrolled ? 1152 : 1400; // 1152px = max-w-6xl, 1400px default

  // Get staged dataset from global state (if exists)
  const [stagedDataset, setStagedDataset] = React.useState<StagedDataset | null>(null);

  // Listen for staged dataset updates
  React.useEffect(() => {
    const handleStagedDatasetUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<StagedDataset>;
      setStagedDataset(customEvent.detail);
    };

    window.addEventListener("stagedDatasetUpdate", handleStagedDatasetUpdate as EventListener);
    return () => window.removeEventListener("stagedDatasetUpdate", handleStagedDatasetUpdate as EventListener);
  }, []);

  const handleProceedToCheckout = () => {
    // Dispatch checkout event
    window.dispatchEvent(new CustomEvent("proceedToCheckout", { detail: stagedDataset }));
  };

  const handleRemoveFromStaging = () => {
    setStagedDataset(null);
    window.dispatchEvent(new CustomEvent("removeFromStaging"));
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="flex justify-center px-6">
        {/* Notch container */}
        <div
          className="relative w-full transition-all duration-500 ease-out"
          style={{ maxWidth: `${actualMaxWidth}px` }}
        >
          {/* Main notch */}
          <div
            className={cn(
              "relative overflow-hidden rounded-b-[2.5rem]",
              "border-x border-b transition-all duration-500 ease-out",
              scrolled
                ? "border-border/20 dark:border-white/5 bg-background/95 dark:bg-[#1a2240]/90 backdrop-blur-3xl shadow-2xl shadow-black/5 dark:shadow-black/10"
                : "border-transparent bg-transparent backdrop-blur-none shadow-none"
            )}
          >
            {/* Top highlight - only visible when scrolled */}
            <div className={cn(
              "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/10 dark:via-white/[0.05] to-transparent transition-opacity duration-500",
              scrolled ? "opacity-100" : "opacity-0"
            )} />

            {/* Content */}
            <div className={cn(
              "flex items-center justify-between transition-all duration-500",
              scrolled ? "h-14 px-5" : "h-16 px-6"
            )}>
              {/* Left: Logo (Fixed Width) */}
              <div className="w-32">
                <Link
                  href="/"
                  className="group flex items-center gap-2 transition-opacity hover:opacity-80"
                  onClick={(e) => {
                    if (pathname === "/") {
                      e.preventDefault();
                      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {/* Show favicon black logo in light mode, dark logo in dark mode */}
                  <Image
                    src="/favicon-black.png"
                    alt="Kuinbee marketplace favicon light theme | Kuinbee"
                    width={32}
                    height={32}
                    priority
                    fetchPriority="high"
                    sizes="32px"
                    className={cn(
                      "transition-all duration-500 block dark:hidden",
                      scrolled ? "h-3 w-6" : "h-4 w-8"
                    )}
                  />
                  <Image
                    src="/favicon.svg"
                    alt="Kuinbee marketplace favicon dark theme | Kuinbee"
                    width={32}
                    height={32}
                    priority
                    fetchPriority="high"
                    sizes="32px"
                    className={cn(
                      "transition-all duration-500 hidden dark:block dark:brightness-200",
                      scrolled ? "h-6 w-6" : "h-8 w-8"
                    )}
                  />
                  <span className={cn(
                    "font-semibold leading-none tracking-tight text-foreground dark:text-white transition-all duration-500 hidden lg:inline",
                    scrolled ? "text-xs" : "text-sm"
                  )}>
                    Kuinbee
                  </span>
                </Link>
              </div>

              {/* Center: Navigation (Flex-1, Centered) */}
              <nav className={cn(
                "hidden items-center md:flex flex-1 justify-center transition-all duration-500",
                scrolled ? "gap-4" : "gap-6"
              )}>
                {/* Back Button (if configured) */}
                {navConfig.showBack && (
                  navConfig.useBack ? (
                    <button
                      onClick={() => router.back()}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden lg:inline">{navConfig.backLabel || "Back"}</span>
                    </button>
                  ) : (
                    <Link
                      href={navConfig.backUrl || "/"}
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span className="hidden lg:inline">{navConfig.backLabel || "Back"}</span>
                    </Link>
                  )
                )}

                {/* Page Title (if configured) */}
                {navConfig.pageTitle && (
                  <span className="text-sm font-semibold text-foreground dark:text-white">
                    {navConfig.pageTitle}
                  </span>
                )}

                {/* Direct Links */}
                {navConfig.directLinks?.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    className={link.prominent ? "font-semibold" : ""}
                  >
                    {link.label}
                  </NavLink>
                ))}

                {/* Dropdowns */}
                {navConfig.dropdowns?.includes("resources") && (
                  <NavDropdown label="Resources" items={resources} />
                )}

                {/* Search Bar (if configured) */}
                {navConfig.showSearch && (
                  <form
                    className="relative"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (navSearchQuery.length > 200) {
                        toast.error("Search query cannot exceed 200 characters.");
                        return;
                      }
                      const params = new URLSearchParams();
                      if (navSearchQuery) params.set("q", navSearchQuery);
                      router.push(`/datasets${params.toString() ? `?${params.toString()}` : ""}`);
                    }}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-white/40" />
                    <input
                      type="text"
                      placeholder={navConfig.searchPlaceholder || "Search datasets..."}
                      value={navSearchQuery}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.length > 200) {
                          toast.error("Search query cannot exceed 200 characters.");
                          return;
                        }
                        setNavSearchQuery(val);
                        // If already on /datasets, update the URL in real-time (debounced by dataset-discovery)
                        if (pathname === "/datasets") {
                          const params = new URLSearchParams(window.location.search);
                          if (e.target.value) {
                            params.set("q", e.target.value);
                          } else {
                            params.delete("q");
                          }
                          router.replace(`/datasets?${params.toString()}`, { scroll: false });
                        }
                      }}
                      className="h-9 w-64 rounded-lg border border-border/40 dark:border-white/10 bg-background/50 dark:bg-white/5 pl-9 pr-8 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-white/20"
                    />
                    {navSearchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setNavSearchQuery("");
                          if (pathname === "/datasets") {
                            const params = new URLSearchParams(window.location.search);
                            params.delete("q");
                            router.replace(`/datasets?${params.toString()}`, { scroll: false });
                          }
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-muted-foreground/60 hover:text-foreground dark:text-white/50 dark:hover:text-white transition-colors"
                        aria-label="Clear search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </form>
                )}
              </nav>

              {/* Right Side Actions (Fixed Width - Equal to Logo) */}
              <div className="w-32 flex items-center justify-end gap-2">
                <ThemeToggle />

                {/* Notifications Bell (code-split and disabled for lite nav) */}
                <NotchNotificationBell enabled={!!user && !lite} />

                {/* Wishlist Action */}
                {navConfig.actions?.includes("wishlist") && (
                  <Link href="/wishlist">
                    <button
                      className="relative p-2 text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors focus:outline-none"
                      aria-label="Wishlist"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </Link>
                )}


                {/* Purchase Staging Utility (Conditional) */}
                {stagedDataset && (
                  <NotchStagingPopover
                    stagedDataset={stagedDataset}
                    onProceedToCheckout={handleProceedToCheckout}
                    onRemove={handleRemoveFromStaging}
                  />
                )}

                {/* Desktop Auth */}
                {user ? (
                  <NotchUserMenu onLogout={logout} />
                ) : (
                  <div className="hidden items-center gap-2 md:flex">
                    {navConfig.isSupplierPage ? (
                      <Button
                        size="sm"
                        className="bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                        asChild
                      >
                        <a href="https://calendly.com/ceo-kuinbee/30min" target="_blank" rel="noopener noreferrer">
                          Book a Demo
                        </a>
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white"
                          onClick={() => openModal("login")}
                        >
                          Sign In
                        </Button>
                        <Button
                          size="sm"
                          className="relative bg-gradient-to-b from-black/5 to-transparent dark:!bg-none dark:bg-white/[0.04] backdrop-blur-md border border-black/10 dark:border-white/10 text-[#1a2240] dark:text-white/90 shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-[#1a2240] hover:to-[#2d3a5f] hover:text-white dark:hover:!bg-none dark:hover:bg-white/[0.08] hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-all duration-300"
                          onClick={() => openModal("signup")}
                        >
                          Sign Up
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {/* Mobile Menu */}
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function NotchNavigation({ lite = false }: NotchNavigationProps) {
  return <NotchNavigationInner lite={lite} />;
}
