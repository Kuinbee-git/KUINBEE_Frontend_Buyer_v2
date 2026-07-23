import { apiClient } from "@/core/api/client";
import type {
  CustomCollectionLeadReceipt,
  CustomCollectionListQuery,
  CustomCollectionListResponse,
  CustomCollectionService,
  GuestCustomCollectionLeadInput,
} from "@/types/custom-collection.types";

const ROOT = "/api/v1/marketplace/custom-collection-services";

export const customCollectionService = {
  list: (query?: CustomCollectionListQuery) =>
    apiClient.get<CustomCollectionListResponse>(
      ROOT,
      query as Record<string, unknown>
    ),
  get: (slug: string) =>
    apiClient.get<{ service: CustomCollectionService }>(`${ROOT}/${slug}`),
  requestAsGuest: (slug: string, input: GuestCustomCollectionLeadInput) =>
    apiClient.post<CustomCollectionLeadReceipt>(`${ROOT}/${slug}/leads`, input),
  requestOneTap: (slug: string) =>
    apiClient.post<CustomCollectionLeadReceipt>(`${ROOT}/${slug}/leads`, {
      submissionType: "SIGNED_IN_ONE_TAP",
    }),
};
