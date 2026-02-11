/**
 * React Query hooks for security
 */

import { useQuery } from "@tanstack/react-query";
import { securityService } from "@/services";

// Query keys
export const securityKeys = {
  all: ["security"] as const,
  overview: () => [...securityKeys.all, "overview"] as const,
};

/**
 * Get security overview
 */
export function useSecurityOverview() {
  return useQuery({
    queryKey: securityKeys.overview(),
    queryFn: async () => {
      const response = await securityService.getSecurityOverview();
      return response.security;
    },
  });
}
