import {
  DatasetCategoryDirectoryQuerySchema,
  DatasetCategoryDirectoryResponseSchema,
  DatasetCategoryResolveParamsSchema,
  DatasetCategoryResolveResponseSchema,
  type DatasetCategoryDirectoryQuery,
  type DatasetPublicCategory,
} from "@kuinbee/dataset-preparation-contracts";
import { API_BASE_URL } from "@/core/api/endpoints";
import { DATASET_CONTENT_BUYER_ENABLED } from "@/lib/dataset-content-environment";
export const isDatasetCategoryId = (value: string) =>
  /^c[a-z0-9]{20,31}$/.test(value);

export class DatasetCategoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public status = 502
  ) {
    super(message);
  }
}
async function request<T>(
  path: string,
  schema: { parse(value: unknown): T },
  signal?: AbortSignal
) {
  if (!DATASET_CONTENT_BUYER_ENABLED)
    throw new DatasetCategoryError(
      "Dataset categories are not enabled here.",
      "NOT_ENABLED",
      404
    );
  const controller = new AbortController(),
    abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) abort();
  const timer = setTimeout(abort, 12_000);
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v2/marketplace/dataset-categories${path}`,
      { cache: "no-store", credentials: "omit", signal: controller.signal }
    );
    const body = await response.json().catch(() => null);
    if (!response.ok || body?.success !== true)
      throw new DatasetCategoryError(
        body?.error?.code === "CATEGORY_NOT_FOUND"
          ? "This category link is not currently available. Choose a current category or clear the filter."
          : "Dataset categories could not be loaded. Refresh and try again.",
        typeof body?.error?.code === "string"
          ? body.error.code
          : "CATEGORY_DIRECTORY_UNAVAILABLE",
        response.ok ? 502 : response.status
      );
    try {
      return schema.parse(body.data);
    } catch {
      throw new DatasetCategoryError(
        "The category response changed. Refresh before continuing.",
        "INCOMPATIBLE_RESPONSE"
      );
    }
  } catch (error) {
    if (error instanceof DatasetCategoryError) throw error;
    throw new DatasetCategoryError(
      "Dataset categories could not be loaded. Refresh and try again.",
      "CATEGORY_DIRECTORY_UNAVAILABLE",
      503
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
const params = (query: object) =>
  new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)])
  );
export const datasetCategoryApi = {
  async page(supplied: DatasetCategoryDirectoryQuery, signal?: AbortSignal) {
    const query = DatasetCategoryDirectoryQuerySchema.parse(supplied);
    const result = await request(
      `?${params(query)}`,
      DatasetCategoryDirectoryResponseSchema,
      signal
    );
    if (
      (query.expectedRevision && result.revision !== query.expectedRevision) ||
      result.items.length > query.limit ||
      result.items.some(
        (row, index) =>
          (query.afterId && row.id <= query.afterId) ||
          (index > 0 && row.id <= result.items[index - 1].id)
      ) ||
      (result.nextCursor &&
        (result.nextCursor.limit !== query.limit ||
          result.nextCursor.q !== query.q))
    )
      throw new DatasetCategoryError(
        "The category page changed. Restart from its first page.",
        "INCOMPATIBLE_RESPONSE"
      );
    return result;
  },
  async resolve(key: string, signal?: AbortSignal) {
    const parsed = DatasetCategoryResolveParamsSchema.safeParse({ key });
    if (!parsed.success)
      throw new DatasetCategoryError(
        "This category link is not recognized. Choose a current category or clear the filter.",
        "INVALID_CATEGORY_LINK",
        400
      );
    const result = await request(
      `/${encodeURIComponent(parsed.data.key)}`,
      DatasetCategoryResolveResponseSchema,
      signal
    );
    if (result.requestedKey !== key)
      throw new DatasetCategoryError(
        "The category link changed. Refresh before continuing.",
        "INCOMPATIBLE_RESPONSE"
      );
    return result;
  },
  async all(signal?: AbortSignal) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        let query: DatasetCategoryDirectoryQuery = { limit: 100 },
          revision: string | undefined,
          total: number | undefined;
        const items: DatasetPublicCategory[] = [],
          ids = new Set<string>();
        for (let page = 0; page < 20; page++) {
          const result = await datasetCategoryApi.page(query, signal);
          if (
            revision !== undefined &&
            (result.revision !== revision || result.total !== total)
          )
            throw new DatasetCategoryError(
              "Dataset categories changed.",
              "CATEGORY_DIRECTORY_CHANGED",
              409
            );
          revision = result.revision;
          total = result.total;
          for (const row of result.items) {
            if (ids.has(row.id))
              throw new DatasetCategoryError(
                "The category page did not advance.",
                "INCOMPATIBLE_RESPONSE"
              );
            ids.add(row.id);
            items.push(row);
          }
          if (!result.nextCursor) {
            if (items.length !== total)
              throw new DatasetCategoryError(
                "The category directory is incomplete. Refresh before continuing.",
                "INCOMPATIBLE_RESPONSE"
              );
            return {
              revision,
              items: items.sort(
                (a, b) =>
                  a.name.localeCompare(b.name) || a.id.localeCompare(b.id)
              ),
              total,
              page: 1,
              pageSize: Math.max(1, items.length),
            };
          }
          query = result.nextCursor;
        }
        throw new DatasetCategoryError(
          "The category directory exceeds this view's display budget.",
          "CATEGORY_DIRECTORY_CAPACITY"
        );
      } catch (error) {
        if (
          !(error instanceof DatasetCategoryError) ||
          error.code !== "CATEGORY_DIRECTORY_CHANGED" ||
          attempt === 1 ||
          signal?.aborted
        )
          throw error;
      }
    }
    throw new DatasetCategoryError(
      "Dataset categories could not be loaded.",
      "CATEGORY_DIRECTORY_UNAVAILABLE",
      503
    );
  },
};
