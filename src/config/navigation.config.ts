import {
  Database,
  TrendingUp,
  Zap,
  Leaf,
  Wheat,
  BarChart3,
  BookOpen,
  Users,
  GraduationCap,
  FileText,
  Info,
  Briefcase,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon?: any;
  description?: string;
  scroll?: boolean;
}

export interface NavigationConfig {
  showBack?: boolean;
  backUrl?: string;
  backLabel?: string;
  showBreadcrumb?: boolean;
  breadcrumbItems?: string[];
  directLinks?: Array<{
    label: string;
    href: string;
    prominent?: boolean;
  }>;
  dropdowns?: Array<"categories" | "resources" | "sort">;
  showSearch?: boolean;
  searchPlaceholder?: string;
  actions?: Array<"filters-badge" | "wishlist" | "view-toggle" | "export">;
  pageTitle?: string;
  isSupplierPage?: boolean;
}

// Dropdown configurations
export const categories: NavItem[] = [
  {
    name: "Finance & Markets",
    href: "/datasets?category=finance",
    icon: TrendingUp,
    description: "Verified market data & financial indicators",
  },
  {
    name: "Energy & Utilities",
    href: "/datasets?category=energy",
    icon: Zap,
    description: "Regulated energy consumption & production data",
  },
  {
    name: "Agriculture & Food",
    href: "/datasets?category=agriculture",
    icon: Wheat,
    description: "Farming metrics & crop analytics",
  },
  {
    name: "Environment & Climate",
    href: "/datasets?category=environment",
    icon: Leaf,
    description: "Climate data & sustainability indicators",
  },
  {
    name: "Economics & Trade",
    href: "/datasets?category=economics",
    icon: BarChart3,
    description: "GDP metrics & trade statistics",
  },
];

export const resources: NavItem[] = [
  {
    name: "About",
    href: "/about",
    icon: Info,
    description: "Learn about Kuinbee",
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
      { label: "Strotas", href: "/analytics" },
      { label: "Support", href: "/support" },
    ],
    dropdowns: ["categories", "resources"],
    showSearch: false,
    actions: [],
  },

  // Datasets marketplace
  "/datasets": {
    showBack: false,
    directLinks: [],
    dropdowns: ["categories", "sort"],
    showSearch: true,
    searchPlaceholder: "Search datasets...",
    actions: ["filters-badge"],
  },

  // Dataset detail
  "/datasets/[id]": {
    showBack: true,
    backUrl: "/datasets",
    backLabel: "Back to Marketplace",
    showBreadcrumb: true,
    directLinks: [],
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
    directLinks: [],
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
    directLinks: [],
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
    directLinks: [],
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
    directLinks: [],
    dropdowns: [],
    showSearch: false,
    actions: [],
  },

  // Support
  "/support": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back to Landing",
    pageTitle: "Support",
    directLinks: [],
    dropdowns: [],
    showSearch: false,
    actions: [],
  },

  // Supplier Resources
  "/supplier-resources": {
    showBack: true,
    backUrl: "/",
    backLabel: "Back",
    pageTitle: "For Suppliers",
    directLinks: [],
    dropdowns: [],
    showSearch: false,
    actions: [],
    isSupplierPage: true,
  },
};

// Default fallback config
export const DEFAULT_CONFIG: NavigationConfig = {
  showBack: false,
  directLinks: [
    { label: "Marketplace", href: "/datasets", prominent: true },
    { label: "Strotas", href: "/analytics" },
    { label: "Support", href: "/support" },
  ],
  dropdowns: ["categories", "resources"],
  showSearch: false,
  actions: [],
};
