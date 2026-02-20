"use client";

import * as React from "react";
import { Link } from "@/components/router/Link";
import { useModal, useAuth } from "@/core/providers";
import { useNavigationConfig } from "@/hooks/useNavigationConfig";
import { categories, resources } from "@/config/navigation.config";
import { useNotifications } from "@/hooks/api/useNotifications";
import { useNotificationStore } from "@/core/store/notification.store";

import {
  ChevronDown,
  Menu,
  Database,
  ArrowLeft,
  ArrowRight,
  Receipt,
  X,
  User,
  LogOut,
  Settings,
  FolderOpen,
  Heart,
  ShoppingCart,
  Search,
  Bell,
} from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { ThemeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";
import { cn } from "@/shared/utils/cn";

// Simple pathname hook for client-side routing
function usePathname() {
  const [pathname, setPathname] = React.useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  React.useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return pathname;
}

// Purchase Staging Types
interface StagedDataset {
  id: string;
  datasetUniqueId: string;
  title: string;
  category: string;
  license: string;
  pricing: {
    type: "free" | "paid";
    amount?: number;
    currency?: string;
  };
  verification: {
    supplierVerified: boolean;
    datasetReviewed: boolean;
  };
}

interface PurchaseStagingPanelProps {
  dataset: StagedDataset;
  onProceedToCheckout: () => void;
  onRemove: () => void;
}

function PurchaseStagingPanel({ dataset, onProceedToCheckout, onRemove }: PurchaseStagingPanelProps) {
  const getCurrencySymbol = (currency?: string) => {
    switch (currency) {
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "INR": return "₹";
      default: return "$";
    }
  };

  return (
    <div className="w-[380px]">
      {/* Header */}
      <div className="border-b border-border/40 dark:border-white/10 px-5 py-4">
        <div className="text-sm font-semibold text-foreground dark:text-white">
          Purchase Staging
        </div>
        <div className="text-xs text-muted-foreground dark:text-white/60 mt-0.5">
          Review dataset before checkout
        </div>
      </div>

      {/* Dataset Summary */}
      <div className="px-5 py-4 space-y-4">
        {/* Title & ID */}
        <div>
          <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
            {dataset.title}
          </div>
          <div className="font-mono text-xs text-muted-foreground dark:text-white/60">
            {dataset.datasetUniqueId}
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-2.5 py-0.5 text-xs">
            {dataset.category}
          </Badge>
          {dataset.verification.supplierVerified && (
            <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-xs">
              Verified
            </Badge>
          )}
          {dataset.verification.datasetReviewed && (
            <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-xs">
              Reviewed
            </Badge>
          )}
        </div>

        {/* License & Pricing */}
        <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
              License
            </span>
            <span className="text-xs font-semibold text-foreground dark:text-white">
              {dataset.license}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground dark:text-white/60">
              Price
            </span>
            <span className="text-sm font-semibold text-foreground dark:text-white">
              {dataset.pricing.type === "paid" 
                ? `${getCurrencySymbol(dataset.pricing.currency)}${dataset.pricing.amount?.toLocaleString()} ${dataset.pricing.currency}`
                : "Free"
              }
            </span>
          </div>
        </div>

        {/* Helper Text */}
        <div className="text-xs text-muted-foreground dark:text-white/60 leading-relaxed">
          Access is granted immediately after successful payment.
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border/40 dark:border-white/10 px-5 py-4 space-y-2">
        <Button
          className="w-full bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
          onClick={onProceedToCheckout}
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground dark:text-white/70 dark:hover:text-white"
          onClick={onRemove}
        >
          Remove from staging
        </Button>
      </div>
    </div>
  );
}

// Categories and resources now imported from config

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

interface NavDropdownProps {
  label: string;
  items: typeof categories | typeof resources;
  align?: "start" | "center" | "end";
}

function NavDropdown({ label, items, align = "start" }: NavDropdownProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "group flex items-center gap-1 text-sm font-medium transition-colors duration-200",
            "text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white focus:outline-none",
            open && "text-foreground dark:text-white"
          )}
        >
          {label}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} sideOffset={12} className="w-72 p-2">
        <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((item) => (
          <DropdownMenuItem key={item.name} asChild>
            <Link
              href={item.href}
              className="group flex cursor-pointer items-start gap-3 rounded-lg p-2 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted transition-colors group-hover:bg-accent">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.description}
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        {label === "Categories" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href="/datasets"
                className="flex cursor-pointer items-center justify-between rounded-lg p-2 text-sm font-medium text-primary transition-colors hover:bg-accent"
              >
                Browse Marketplace
                <ArrowRight className="h-4 w-4" />
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const { openModal } = useModal();
  const { user } = useAuth();
  const navConfig = useNavigationConfig();

  const closeNav = () => setOpen(false);

  const handleSignup = () => {
    closeNav();
    openModal("signup");
  };

  const handleSignin = () => {
    closeNav();
    openModal("login");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Database className="h-4 w-4 text-primary-foreground" />
            </div>
            <span>Kuinbee Registry</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Navigation menu
          </SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col gap-1 py-4">
          {/* Back button if configured */}
          {navConfig.showBack && (
            <Link
              href={navConfig.backUrl || "/"}
              onClick={closeNav}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {navConfig.backLabel || "Back"}
            </Link>
          )}

          {/* Direct Links */}
          {navConfig.directLinks?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeNav}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                pathname === link.href
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Categories Section */}
          {navConfig.dropdowns?.includes("categories") && (
            <>
              <div className="px-2 py-2 mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Data Categories
                </span>
              </div>
              {categories.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeNav}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </>
          )}

          {/* Resources Section */}
          {navConfig.dropdowns?.includes("resources") && (
            <>
              <div className="mt-4 px-2 py-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Resources
                </span>
              </div>
              {resources.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={closeNav}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        {/* Mobile Auth Buttons */}
        {!user && (
          <div className="absolute inset-x-0 bottom-0 border-t bg-background p-4">
            <div className="flex flex-col gap-2">
              <Button
                className="w-full bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                onClick={handleSignup}
              >
                Sign Up
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleSignin}
              >
                Sign In
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function NotchNavigation() {
  const [scrolled, setScrolled] = React.useState(false);
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const navConfig = useNavigationConfig();
  const pathname = usePathname();

  // Notifications
  const { data: notificationsData } = useNotifications(
    { unreadOnly: true },
    {
      refetchInterval: 120000, // Poll every 2 minutes
      enabled: !!user, // Only fetch when user is logged in
    }
  );
  const { unreadCount, setUnreadCount } = useNotificationStore();
  
  // Update unread count from API
  React.useEffect(() => {
    if (notificationsData?.items) {
      setUnreadCount(notificationsData.items.length);
    }
  }, [notificationsData, setUnreadCount]);

  // Handle scroll state
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // Reduced threshold for earlier transition
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate actual width based on scroll state
  const actualMaxWidth = scrolled ? 1152 : 1400; // 1152px = max-w-6xl, 1400px default

  // Get staged dataset from global state (if exists)
  const [stagedDataset, setStagedDataset] = React.useState<StagedDataset | null>(null);

  // Listen for staged dataset updates
  React.useEffect(() => {
    const handleStagedDatasetUpdate = (event: CustomEvent) => {
      setStagedDataset(event.detail);
    };

    window.addEventListener("stagedDatasetUpdate" as any, handleStagedDatasetUpdate);
    return () => window.removeEventListener("stagedDatasetUpdate" as any, handleStagedDatasetUpdate);
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
                >
                  {/* Show favicon black logo in light mode, dark logo in dark mode */}
                  <img 
                    src="/favicon-black.png" 
                    alt="Kuinbee Logo"
                    className={cn(
                      "transition-all duration-500 block dark:hidden",
                      scrolled ? "h-3 w-6" : "h-4 w-8"
                    )}
                  />
                  <img 
                    src="/favicon.svg" 
                    alt="Kuinbee Logo Dark"
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
                  <Link
                    href={navConfig.backUrl || "/"}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden lg:inline">{navConfig.backLabel || "Back"}</span>
                  </Link>
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
                {navConfig.dropdowns?.includes("categories") && (
                  <NavDropdown label="Categories" items={categories} />
                )}
                {navConfig.dropdowns?.includes("resources") && (
                  <NavDropdown label="Resources" items={resources} />
                )}

                {/* Search Bar (if configured) */}
                {navConfig.showSearch && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-white/40" />
                    <input
                      type="search"
                      placeholder={navConfig.searchPlaceholder || "Search..."}
                      className="h-9 w-64 rounded-lg border border-border/40 dark:border-white/10 bg-background/50 dark:bg-white/5 pl-9 pr-3 text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:focus:ring-white/20"
                    />
                  </div>
                )}
              </nav>

              {/* Right Side Actions (Fixed Width - Equal to Logo) */}
              <div className="w-32 flex items-center justify-end gap-2">
                <ThemeToggle />
                
                {/* Notifications Bell (Only for logged-in users) */}
                {user && (
                  <Link href="/account/activity">
                    <button
                      className="relative p-2 text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors focus:outline-none"
                      aria-label="Notifications"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a2240] dark:bg-white text-white dark:text-[#1a2240] text-[10px] font-semibold">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>
                  </Link>
                )}
                
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

                {/* Cart Action */}
                {navConfig.actions?.includes("cart") && (
                  <button
                    className="relative p-2 text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors focus:outline-none"
                    aria-label="Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                )}
                
                {/* Purchase Staging Utility (Conditional) */}
                {stagedDataset && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="relative p-2 text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors focus:outline-none"
                        aria-label="Purchase staging"
                      >
                        <Receipt className="h-4 w-4" />
                        {/* Badge */}
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
                        onProceedToCheckout={handleProceedToCheckout}
                        onRemove={handleRemoveFromStaging}
                      />
                    </PopoverContent>
                  </Popover>
                )}
                
                {/* Desktop Auth */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white"
                      >
                        <User className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={12}
                      className="p-0 border-border/40 dark:border-white/10 bg-background/95 dark:bg-[#1e2847]/95 backdrop-blur-xl"
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/my-datasets"
                          className="cursor-pointer"
                        >
                          <FolderOpen className="h-4 w-4 mr-2" />
                          My Datasets
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/account"
                          className="cursor-pointer"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="hidden items-center gap-2 md:flex">
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
                      className="bg-primary dark:bg-white text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
                      onClick={() => openModal("signup")}
                    >
                      Sign Up
                    </Button>
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
