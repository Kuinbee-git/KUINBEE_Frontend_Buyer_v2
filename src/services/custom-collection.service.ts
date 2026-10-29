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

export const downloadCustomServiceSample = async (
  slug: string,
  revisionId: string,
  sampleId: string
) =>
  validateServiceSampleDownload(
    await apiClient.post<{ url: string; expiresAt: string; fileName: string }>(
      `${ROOT}/${slug}/samples/download-url`,
      { revisionId, sampleId }
    )
  );

function validateServiceSampleDownload(result: {
  url: string;
  expiresAt: string;
  fileName: string;
}) {
  const url = new URL(result.url);
  const expiresAt = Date.parse(result.expiresAt);
  if (
    !(
      url.protocol === "https:" ||
      (url.protocol === "http:" &&
        ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname))
    ) ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= Date.now()
  )
    throw new Error("This download link is unavailable. Please try again.");
  return result;
}
