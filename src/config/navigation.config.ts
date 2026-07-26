import { BookOpen, Info, Briefcase, LifeBuoy, Users } from "lucide-react";
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

// Route-based navigation configurations
export const NAVIGATION_CONFIG: Record<string, NavigationConfig> = {
  // Landing page
  "/": {
    showBack: false,
    directLinks: [
      { label: "Marketplace", href: "/marketplace", prominent: true },
      { label: "Blog", href: "/blog" },
      { label: "Request Data", href: "/data-request" },
      { label: "Strotas", href: "/strotas" },
    ],
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Marketplace hub
  "/marketplace": {
    showBack: false,
    directLinks: [
      { label: "Home", href: "/" },
      { label: "Datasets", href: "/datasets", prominent: true },
      { label: "Blog", href: "/blog" },
      { label: "Request Data", href: "/data-request" },
      { label: "Strotas", href: "/strotas" },
    ],
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Datasets marketplace
  "/datasets": {
    showBack: false,
    directLinks: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Request Data", href: "/data-request" },
      { label: "Strotas", href: "/strotas" },
    ],
    dropdowns: ["resources"],
    showSearch: true,
    searchPlaceholder: "Search datasets...",
    actions: ["filters-badge"],
  },

  // Custom data collection services marketplace
  "/data-request/services": {
    showBack: false,
    directLinks: [
      { label: "Home", href: "/" },
      { label: "Blog", href: "/blog" },
      { label: "Request Data", href: "/data-request" },
      { label: "Strotas", href: "/strotas" },
    ],
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
    directLinks: [{ label: "Home", href: "/" }],
    dropdowns: [],
    showSearch: false,
    actions: ["wishlist"],
  },

  // Account pages
  "/account": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "Account Settings",
    directLinks: [{ label: "Home", href: "/" }],
    dropdowns: [],
    showSearch: false,
    actions: [],
  },

  // Orders
  "/orders": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "My Orders",
    directLinks: [{ label: "Home", href: "/" }],
    dropdowns: [],
    showSearch: false,
    actions: ["filters-badge", "export"],
  },

  // My Datasets / Library
  "/my-datasets": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "My Library",
    directLinks: [{ label: "Home", href: "/" }],
    dropdowns: ["sort"],
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
    directLinks: [{ label: "Home", href: "/" }],
    dropdowns: [],
    showSearch: false,
    actions: [],
  },

  // Support
  "/support": {
    showBack: false,
    directLinks: [
      { label: "Home", href: "/" },
      { label: "Marketplace", href: "/marketplace", prominent: true },
      { label: "Blog", href: "/blog" },
      { label: "Request Data", href: "/data-request" },
      { label: "Strotas", href: "/strotas" },
    ],
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },

  // Supplier Resources
  "/supplier-resources": {
    showBack: false,
    directLinks: [
      { label: "Home", href: "/" },
      { label: "Marketplace", href: "/marketplace", prominent: true },
      { label: "Blog", href: "/blog" },
      { label: "Request Data", href: "/data-request" },
      { label: "Strotas", href: "/strotas" },
    ],
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
    isSupplierPage: true,
  },
};

// Default fallback config
export const DEFAULT_CONFIG: NavigationConfig = {
  showBack: false,
  directLinks: [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace", prominent: true },
    { label: "Blog", href: "/blog" },
    { label: "Request Data", href: "/data-request" },
    { label: "Strotas", href: "/strotas" },
  ],
  dropdowns: ["resources"],
  showSearch: false,
  actions: [],
};
