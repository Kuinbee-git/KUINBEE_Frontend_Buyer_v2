import {
  Database,
  BookOpen,
  FileText,
  Info,
  Briefcase,
  Users,
} from "lucide-react";
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
    name: "Blog",
    href: "/blog",
    icon: FileText,
    description: "Data marketplace insights and buyer guides",
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
  // FAQs removed
  {
    name: "Request Data",
    href: "/data-request",
    icon: Database,
    description: "Can't find it? Request a custom dataset",
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
      { label: "Marketplace", href: "/datasets", prominent: true },
      { label: "Custom Data", href: "/data-request/services" },
      { label: "Strotas", href: "/strotas" },
      { label: "Support", href: "/support" },
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
      { label: "Custom Data", href: "/data-request/services" },
      { label: "Be a Supplier", href: "/supplier-resources" },
    ],
    dropdowns: ["resources"],
    showSearch: true,
    searchPlaceholder: "Search datasets...",
    actions: ["filters-badge"],
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
      { label: "Marketplace", href: "/datasets", prominent: true },
      { label: "Custom Data", href: "/data-request/services" },
      { label: "Strotas", href: "/strotas" },
      { label: "Support", href: "/support" },
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
      { label: "Marketplace", href: "/datasets", prominent: true },
      { label: "Custom Data", href: "/data-request/services" },
      { label: "Strotas", href: "/strotas" },
      { label: "Support", href: "/support" },
    ],
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
    isSupplierPage: true,
  },

  // Pricing
  "/pricing": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Home",
    pageTitle: "Pricing",
    directLinks: [{ label: "Home", href: "/" }],
    dropdowns: ["resources"],
    showSearch: false,
    actions: [],
  },
};

// Default fallback config
export const DEFAULT_CONFIG: NavigationConfig = {
  showBack: false,
  directLinks: [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/datasets", prominent: true },
    { label: "Custom Data", href: "/data-request/services" },
    { label: "Strotas", href: "/strotas" },
    { label: "Support", href: "/support" },
  ],
  dropdowns: ["resources"],
  showSearch: false,
  actions: [],
};
