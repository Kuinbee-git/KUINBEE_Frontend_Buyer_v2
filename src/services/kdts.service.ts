/**
 * KDTS service — user/marketplace side
 * Public route: no auth required
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";

export interface KdtsBreakdown {
  Q: number;
  L: number;
  P: number;
  U: number;
  F: number;
}

export interface DatasetKdtsResponse {
  currentScore: string | null;
  breakdown: KdtsBreakdown | null;
  history: Array<{
    id: string;
    finalScore: string;
    breakdown: KdtsBreakdown;
    createdAt: string;
    note: string;
    admin: { id: string; name: string } | null;
  }>;
  updatedAt: string | null;
}

export async function getDatasetKdts(
  datasetId: string
): Promise<DatasetKdtsResponse> {
  return apiClient.get<DatasetKdtsResponse>(
    API_ENDPOINTS.MARKETPLACE.KDTS(datasetId)
  );
}
