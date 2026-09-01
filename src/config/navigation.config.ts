import { BookOpen, Info, Briefcase, LifeBuoy, Users, Database } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  scroll?: boolean;
}

export interface NavigationConfig {
  showBack?: boolean;
  backUrl?: string;
  backLabel?: string;
  useBack?: boolean; // When true, uses router.back() instead of navigating to backUrl
  showBreadcrumb?: boolean;
  breadcrumbItems?: string[];
  directLinks?: Array<{
    label: string;
    href: string;
    prominent?: boolean;
  }>;
  dropdowns?: Array<"resources" | "sort">;
  showSearch?: boolean;
  searchPlaceholder?: string;
  actions?: Array<"filters-badge" | "wishlist" | "view-toggle" | "export">;
  pageTitle?: string;
  isSupplierPage?: boolean;
}

export const resources: NavItem[] = [
  {
    name: "Request Data",
    href: "/data-request/submit-requirement",
    icon: Database,
    description: "Request a custom dataset from Kuinbee",
  },
  {
    name: "Support",
    href: "/support",
    icon: LifeBuoy,
    description: "Get help from the Kuinbee team",
  },
  {
    name: "About",
    href: "/about",
    icon: Info,
    description: "Learn about Kuinbee",
  },
  {
    name: "Team",
    href: "/team",
    icon: Users,
    description: "Meet the people building Kuinbee",
  },
  {
    name: "Careers",
    href: "/careers",
    icon: Briefcase,
    description: "Join our team",
  },
  {
    name: "Supplier Resources",
    href: "/supplier-resources",
    icon: BookOpen,
    description: "Guides and documentation for suppliers",
  },
];

// Consistent nav links across all pages
const HOME_LINKS: NavigationConfig["directLinks"] = [
  { label: "Buy Data", href: "/marketplace", prominent: true },
  { label: "Sell Data", href: "/data-request" },
  { label: "Strotas", href: "/strotas" },
];

const NON_HOME_LINKS: NavigationConfig["directLinks"] = [
  { label: "Home", href: "/" },
  { label: "Buy Data", href: "/marketplace", prominent: true },
  { label: "Sell Data", href: "/data-request" },
  { label: "Strotas", href: "/strotas" },
];

// Route-based navigation configurations
export const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  // Landing page
  "/": {
    showBack: false,
    directLinks: HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Marketplace hub
  "/marketplace": {
    showBack: false,
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Datasets marketplace
  "/datasets": {
    showBack: false,
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: true,
    searchPlaceholder: "Search datasets...",
    actions: ["filters-badge"],
  },

  // Custom data collection services marketplace
  "/data-request/services": {
    showBack: false,
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: true,
    searchPlaceholder: "Search services...",
    actions: [],
  },

  // Dataset detail
  "/datasets/[id]": {
    showBack: true,
    useBack: true,
    backUrl: "/datasets",
    backLabel: "Back to Marketplace",
    showBreadcrumb: true,
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: ["wishlist"],
  },

  // Account pages
  "/account": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "Account Settings",
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Orders
  "/orders": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "My Orders",
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: ["filters-badge", "export"],
  },

  // My Datasets / Library
  "/my-datasets": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "My Library",
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources", "sort"],
    showSearch: true,
    searchPlaceholder: "Search my datasets...",
    actions: ["view-toggle"],
  },

  // Wishlist
  "/wishlist": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "Wishlist",
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Support
  "/support": {
    showBack: false,
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Supplier Resources
  "/supplier-resources": {
    showBack: false,
    directLinks: NON_HOME_LINKS,
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
    isSupplierPage: true,
  },
};

// Default fallback config (any non-home page without explicit config)
export const DEFAULT_CONFIG: NavigationConfig = {
  showBack: false,

  

  directLinks: NON_HOME_LINKS,
  dropdowns: ["resources"],
  showSearch: false,
  actions: [],
};
