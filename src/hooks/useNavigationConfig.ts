import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { NAVIGATION_CONFIG, DEFAULT_CONFIG, NavigationConfig } from "@/config/navigation.config";

export function useNavigationConfig(): NavigationConfig {
  const pathname = usePathname();

  const config = useMemo(() => {
    if (!pathname) return DEFAULT_CONFIG;

    // Exact match
    if (NAVIGATION_CONFIG[pathname]) {
      return NAVIGATION_CONFIG[pathname];
    }

    // Pattern matching for dynamic routes
    if (pathname.startsWith("/datasets/") && pathname !== "/datasets") {
      return NAVIGATION_CONFIG["/datasets/[id]"];
    }

    if (pathname.startsWith("/account")) {
      return NAVIGATION_CONFIG["/account"];
    }

    if (pathname.startsWith("/support")) {
      return NAVIGATION_CONFIG["/support"];
    }

    // Default fallback
    return DEFAULT_CONFIG;
  }, [pathname]);

  return config;
}
