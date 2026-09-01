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
  updatedAt: string | null;
}

export async function getDatasetKdts(
  datasetId: string
): Promise<DatasetKdtsResponse> {
  return apiClient.get<DatasetKdtsResponse>(
    API_ENDPOINTS.MARKETPLACE.KDTS(datasetId)
  );
}
