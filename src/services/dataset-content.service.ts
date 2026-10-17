import {
  DatasetCatalogueListQuerySchema,
  DatasetPrivateTableMetadataQuerySchema,
  DatasetPrivateTableMetadataResponseSchema,
  type DatasetPrivateTableMetadataQuery,
  DatasetPublicTableMetadataQuerySchema,
  DatasetPublicTableMetadataResponseSchema,
  type DatasetPublicTableMetadataQuery,
  DatasetPublicTableReferenceViewsQuerySchema,
  DatasetPublicTableReferenceViewsResponseSchema,
  type DatasetPublicTableReferenceViewsQuery,
  DatasetCatalogueListResponseSchema,
  DatasetCatalogueDetailResponseSchema,
  DatasetReaderIdParamsSchema,
  DatasetLibraryListQuerySchema,
  DatasetLibraryListResponseSchema,
  DatasetLibraryGetResponseSchema,
  DatasetAcquisitionOfferResponseSchema,
  DatasetAcquisitionTargetSchema,
  DatasetContentFreeClaimBodySchema,
  DatasetContentFreeClaimResponseSchema,
  DatasetFileAccessContextQuerySchema,
  DatasetFileAccessContextSchema,
  DatasetFileAccessPageQuerySchema,
  DatasetFileAccessPageResponseSchema,
  DatasetFileObservationQuerySchema,
  DatasetFileObservationResponseSchema,
  DatasetFileDownloadBodySchema,
  DatasetFileDownloadResponseSchema,
  type DatasetCatalogueListQuery,
  type DatasetLibraryListQuery,
  type DatasetAcquisitionTarget,
  type DatasetFileAccessSelection,
  type DatasetFileAccessContext,
  type DatasetFileAccessPageQuery,
  type DatasetFileObservationQuery,
  type DatasetFileDownloadBody,
} from "@kuinbee/dataset-preparation-contracts";
import { API_BASE_URL } from "@/core/api/endpoints";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import { z } from "zod";
import { DATASET_CONTENT_BUYER_ENABLED } from "@/lib/dataset-content-environment";

export type BuyerCatalogueList = ReturnType<
  typeof DatasetCatalogueListResponseSchema.parse
>;
export type BuyerCatalogueCard = BuyerCatalogueList["items"][number];
export type BuyerCatalogueDetail = ReturnType<
  typeof DatasetCatalogueDetailResponseSchema.parse
>;
export type BuyerLibraryList = ReturnType<
  typeof DatasetLibraryListResponseSchema.parse
>;
export type BuyerLibraryItem = BuyerLibraryList["items"][number];
export type BuyerAcquisitionOffer = ReturnType<
  typeof DatasetAcquisitionOfferResponseSchema.parse
>;
export type BuyerFilePage = ReturnType<
  typeof DatasetFileAccessPageResponseSchema.parse
>;
export type BuyerFileObservations = ReturnType<
  typeof DatasetFileObservationResponseSchema.parse
>;
export type BuyerFileAudience = "SAMPLE" | "LIBRARY";

export class BuyerDatasetError extends Error {
  constructor(
    message: string,
    public code: string,
    public status = 502
  ) {
    super(message);
  }
}
const incompatible = (): never => {
  throw new BuyerDatasetError(
    "The Dataset response does not match the selected content. Refresh before continuing.",
    "INCOMPATIBLE_DATASET_RESPONSE"
  );
};
const encodedId = (datasetId: string) => {
  const parsed = DatasetReaderIdParamsSchema.parse({ datasetId }).datasetId;
  if (parsed === "." || parsed === "..")
    throw new BuyerDatasetError(
      "Choose a valid Dataset identity.",
      "INVALID_DATASET_ID",
      400
    );
  return encodeURIComponent(parsed);
};
const legacyDownload = z.object({
  url: z.url().refine((value) => new URL(value).protocol === "https:"),
  expiresAt: z.string().datetime(),
});
const fileBase = (audience: BuyerFileAudience, datasetId: string) => {
  if (audience !== "SAMPLE" && audience !== "LIBRARY")
    throw new BuyerDatasetError(
      "Choose sample or owned Dataset files.",
      "INVALID_FILE_SCOPE",
      400
    );
  return audience === "SAMPLE"
    ? `/api/v2/marketplace/dataset-samples/${encodedId(datasetId)}`
    : `/api/v2/user/library-files/${encodedId(datasetId)}`;
};

async function request<T>(
  path: string,
  schema: { parse(value: unknown): T },
  options: {
    method?: "GET" | "POST";
    body?: unknown;
    query?: object;
    authenticated?: boolean;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  if (!DATASET_CONTENT_BUYER_ENABLED)
    throw new BuyerDatasetError(
      "Dataset content is not enabled in this environment.",
      "NOT_ENABLED",
      404
    );
  const url = new URL(API_BASE_URL.replace(/\/+$/, "") + path);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value === undefined) continue;
    for (const item of Array.isArray(value) ? value : [value])
      url.searchParams.append(key, String(item));
  }
  const controller = new AbortController();
  const forwardAbort = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) forwardAbort();
  else options.signal?.addEventListener("abort", forwardAbort, { once: true });
  let timedOut = false;
  const timer = globalThis.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, 20_000);
  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      signal: controller.signal,
      cache: "no-store",
      credentials: options.authenticated ? "include" : "omit",
      ...(options.body === undefined
        ? {}
        : {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(options.body),
          }),
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      const error =
        payload && typeof payload === "object" && "error" in payload
          ? payload.error
          : payload;
      throw new BuyerDatasetError(
        error &&
          typeof error === "object" &&
          "message" in error &&
          typeof error.message === "string"
          ? error.message
          : "This Dataset request could not be completed.",
        error &&
          typeof error === "object" &&
          "code" in error &&
          typeof error.code === "string"
          ? error.code
          : "DATASET_REQUEST_FAILED",
        response.status
      );
    }
    if (
      !payload ||
      typeof payload !== "object" ||
      !("success" in payload) ||
      payload.success !== true ||
      !("data" in payload)
    )
      return incompatible();
    try {
      return schema.parse(payload.data);
    } catch {
      return incompatible();
    }
  } catch (error) {
    if (controller.signal.aborted)
      throw new BuyerDatasetError(
        timedOut
          ? "The request took too long. Refresh before continuing."
          : "The request was cancelled.",
        timedOut ? "REQUEST_TIMEOUT" : "REQUEST_ABORTED",
        0
      );
    if (error instanceof TypeError)
      throw new BuyerDatasetError(
        "The Dataset service could not be reached.",
        "NETWORK_ERROR",
        0
      );
    throw error;
  } finally {
    globalThis.clearTimeout(timer);
    options.signal?.removeEventListener("abort", forwardAbort);
  }
}

function checkPage(
  page: { page: number; pageSize: number; total: number; items: unknown[] },
  query: { page: number; pageSize: number }
) {
  if (
    page.page !== query.page ||
    page.pageSize !== query.pageSize ||
    page.items.length > query.pageSize ||
    page.total < page.items.length
  )
    incompatible();
}
function checkLibraryItem(item: BuyerLibraryItem) {
  if (item.representation !== "CONTENT") return;
  if (
    (item.grantId === null) !== (item.material === null) ||
    (item.material && item.material.datasetId !== item.datasetId) ||
    (item.description &&
      (item.description.title !== item.title ||
        item.metadataProvenance !== "FROZEN_GRANT_CONTENT")) ||
    (!item.description && item.metadataProvenance !== "UNRESOLVED") ||
    (item.metadataProvenance === "FROZEN_GRANT_CONTENT" && !item.material)
  )
    incompatible();
}
function checkScope(
  audience: BuyerFileAudience,
  value: {
    scope: string;
    component: string;
    expectedWorkflowRevision?: number;
    editOperation?: string;
  }
) {
  if (
    value.editOperation !== undefined ||
    (audience === "SAMPLE"
      ? value.scope !== "PUBLISHED" || value.component !== "SAMPLE"
      : audience !== "LIBRARY" ||
        value.scope !== "GRANTED" ||
        value.component !== "FULL" ||
        value.expectedWorkflowRevision !== undefined)
  ) {
    throw new BuyerDatasetError(
      "Choose the exact sample or owned full material.",
      "INVALID_FILE_SCOPE",
      400
    );
  }
}
function checkContext(
  audience: BuyerFileAudience,
  datasetId: string,
  context: DatasetFileAccessContext,
  expected: {
    scope: string;
    component: string;
    contentId?: string;
    contentGeneration?: number;
    expectedWorkflowRevision?: number;
  }
) {
  if (
    context.datasetId !== datasetId ||
    !context.frozen ||
    context.editOperation !== null ||
    context.scope !== expected.scope ||
    context.component !== expected.component ||
    (audience === "SAMPLE"
      ? !context.publicationId || context.workflowRevision === null
      : context.workflowRevision !== null) ||
    (expected.contentId !== undefined &&
      (context.contentId !== expected.contentId ||
        context.contentGeneration !== expected.contentGeneration ||
        context.workflowRevision !==
          (expected.expectedWorkflowRevision ?? null)))
  )
    incompatible();
}
function checkExactScope(
  audience: BuyerFileAudience,
  value: {
    scope: string;
    component: string;
    expectedWorkflowRevision?: number;
    editOperation?: string;
  }
) {
  checkScope(audience, value);
  if (audience === "SAMPLE" && value.expectedWorkflowRevision === undefined)
    throw new BuyerDatasetError(
      "Refresh the current sample context.",
      "INVALID_FILE_SCOPE",
      400
    );
}
function checkOrdered(
  items: { id: string }[],
  afterId: string | undefined,
  limit: number
) {
  if (
    items.length > limit ||
    items.some(
      (item, index) =>
        (afterId !== undefined && item.id <= afterId) ||
        (index > 0 && item.id <= items[index - 1]!.id)
    )
  )
    incompatible();
}

// Public catalogue metadata never authorizes files. Private reads/writes always
// use their own backend checks; no method retries, retargets a grant or caches URLs.
export const buyerDatasetApi = {
  async publicReferences(
    datasetId: string,
    input: DatasetPublicTableReferenceViewsQuery,
    signal?: AbortSignal
  ) {
    const query = DatasetPublicTableReferenceViewsQuerySchema.parse(input);
    const result = await request(
      `/api/v2/marketplace/datasets/${encodedId(datasetId)}/table-references`,
      DatasetPublicTableReferenceViewsResponseSchema,
      { query, signal }
    );
    if (
      result.datasetId !== datasetId ||
      result.publicationId !== query.publicationId ||
      result.page.contentId !== query.contentId ||
      (query.contentGeneration !== undefined &&
        result.page.contentGeneration !== query.contentGeneration) ||
      result.page.component !== (query.component ?? null) ||
      result.page.tableId !== (query.tableId ?? null) ||
      result.page.items.length > query.limit ||
      (result.page.nextCursor && result.page.nextCursor.limit !== query.limit)
    )
      incompatible();
    checkOrdered(result.page.items, query.afterId, query.limit);
    return result;
  },
  async publicTables(
    datasetId: string,
    input: DatasetPublicTableMetadataQuery,
    signal?: AbortSignal
  ) {
    const query = DatasetPublicTableMetadataQuerySchema.parse(input);
    const result = await request(
      `/api/v2/marketplace/datasets/${encodedId(datasetId)}/tables`,
      DatasetPublicTableMetadataResponseSchema,
      { query, signal }
    );
    if (
      result.datasetId !== datasetId ||
      result.publicationId !== query.publicationId ||
      result.page.contentId !== query.contentId ||
      (query.contentGeneration !== undefined &&
        result.page.contentGeneration !== query.contentGeneration) ||
      result.page.component !== (query.component ?? null) ||
      result.page.tableId !== (query.tableId ?? null) ||
      result.page.items.length > query.limit ||
      (result.page.nextCursor && result.page.nextCursor.limit !== query.limit)
    )
      incompatible();
    return result;
  },
  async tableMetadata(
    audience: BuyerFileAudience,
    datasetId: string,
    input: DatasetPrivateTableMetadataQuery,
    signal?: AbortSignal
  ) {
    const query = DatasetPrivateTableMetadataQuerySchema.parse(input);
    checkExactScope(audience, query);
    const result = await request(
      `${fileBase(audience, datasetId)}/tables`,
      DatasetPrivateTableMetadataResponseSchema,
      { query, signal, authenticated: true }
    );
    checkContext(audience, datasetId, result.context, query);
    if (
      result.memberId !== (query.memberId ?? null) ||
      result.page.tableId !== (query.tableId ?? null) ||
      result.page.items.length > query.limit ||
      (result.page.nextCursor && result.page.nextCursor.limit !== query.limit)
    )
      incompatible();
    return result;
  },
  async catalogue(
    input: Partial<DatasetCatalogueListQuery> = {},
    signal?: AbortSignal
  ) {
    const query = DatasetCatalogueListQuerySchema.parse(input);
    const result = await request(
      "/api/v2/marketplace/datasets",
      DatasetCatalogueListResponseSchema,
      { query, signal }
    );
    checkPage(result, query);
    const ids = result.items.map((card) =>
      card.representation === "CONTENT" ? card.item.id : card.legacy.id
    );
    if (new Set(ids).size !== ids.length) incompatible();
    return result;
  },
  async detail(datasetId: string, signal?: AbortSignal) {
    const result = await request(
      `/api/v2/marketplace/datasets/${encodedId(datasetId)}`,
      DatasetCatalogueDetailResponseSchema,
      { signal }
    );
    const selected =
      result.representation === "CONTENT" ? result.item : result.legacy.dataset;
    if (selected.id !== datasetId && selected.datasetUniqueId !== datasetId)
      incompatible();
    if (
      result.representation === "CONTENT" &&
      (result.description.title !== result.item.title ||
        result.description.license !== result.item.license ||
        result.description.uploadChoice !== result.item.uploadChoice ||
        result.description.categoriesAtFreeze.primary.id !==
          result.item.categoryAtFreeze.id ||
        JSON.stringify(result.description.modalities) !==
          JSON.stringify(result.item.modalities))
    )
      incompatible();
    return result;
  },
  async library(
    input: Partial<DatasetLibraryListQuery> = {},
    signal?: AbortSignal
  ) {
    const query = DatasetLibraryListQuerySchema.parse(input);
    const result = await request(
      "/api/v2/user/library",
      DatasetLibraryListResponseSchema,
      { query, signal, authenticated: true }
    );
    checkPage(result, query);
    result.items.forEach(checkLibraryItem);
    if (
      new Set(result.items.map((item) => item.datasetId)).size !==
      result.items.length
    )
      incompatible();
    return result;
  },
  async libraryItem(datasetId: string, signal?: AbortSignal) {
    const result = await request(
      `/api/v2/user/library/${encodedId(datasetId)}`,
      DatasetLibraryGetResponseSchema,
      { signal, authenticated: true }
    );
    if (result.item.datasetId !== datasetId) incompatible();
    checkLibraryItem(result.item);
    return result;
  },
  async legacyLibraryDownload(
    item: Extract<BuyerLibraryItem, { representation: "LEGACY" }>,
    signal?: AbortSignal
  ) {
    if (item.recordedAccess !== "RECORDED" || !item.recordedUploadId)
      throw new BuyerDatasetError(
        "The recorded legacy file is unavailable.",
        "LEGACY_ACCESS_UNRESOLVED",
        409
      );
    return request(
      API_ENDPOINTS.LIBRARY.DOWNLOAD_URL(encodedId(item.datasetId)),
      legacyDownload,
      { authenticated: true, signal }
    );
  },
  async offer(datasetId: string, signal?: AbortSignal) {
    const result = await request(
      `/api/v2/user/dataset-access/${encodedId(datasetId)}/offer`,
      DatasetAcquisitionOfferResponseSchema,
      { signal, authenticated: true }
    );
    const cents = BigInt(result.target.amount.replace(".", "")),
      base = BigInt(result.baseAmount.replace(".", ""));
    if (
      result.target.datasetId !== datasetId ||
      (result.accessFlow === "FREE_CLAIM"
        ? cents !== BigInt(0)
        : cents <= BigInt(0)) ||
      cents > base ||
      (result.discountAmount !== null &&
        BigInt(result.discountAmount.replace(".", "")) !== base - cents) ||
      (result.discountProposalId === null) !== (result.discountAmount === null)
    )
      incompatible();
    return result;
  },
  async claim(
    datasetId: string,
    expectedTarget: DatasetAcquisitionTarget,
    signal?: AbortSignal
  ) {
    const body = DatasetContentFreeClaimBodySchema.parse({ expectedTarget });
    if (
      body.expectedTarget.datasetId !== datasetId ||
      body.expectedTarget.amount !== "0.00"
    )
      throw new BuyerDatasetError(
        "Review this Dataset's exact free offer first.",
        "INVALID_ACQUISITION_TARGET",
        400
      );
    const result = await request(
      `/api/v2/user/dataset-access/${encodedId(datasetId)}/claim`,
      DatasetContentFreeClaimResponseSchema,
      { method: "POST", body, signal, authenticated: true }
    );
    if (
      result.material.datasetId !== datasetId ||
      result.material.contentId !== body.expectedTarget.contentId
    )
      incompatible();
    return result;
  },
  async fileContext(
    audience: BuyerFileAudience,
    datasetId: string,
    input: DatasetFileAccessSelection,
    signal?: AbortSignal
  ) {
    const query = DatasetFileAccessContextQuerySchema.parse(input);
    checkScope(audience, query);
    const result = await request(
      `${fileBase(audience, datasetId)}/context`,
      DatasetFileAccessContextSchema,
      { query, signal, authenticated: true }
    );
    checkContext(audience, datasetId, result, query);
    return result;
  },
  async files(
    audience: BuyerFileAudience,
    datasetId: string,
    input: DatasetFileAccessPageQuery,
    signal?: AbortSignal
  ) {
    const query = DatasetFileAccessPageQuerySchema.parse(input);
    checkExactScope(audience, query);
    const result = await request(
      `${fileBase(audience, datasetId)}/inventory`,
      DatasetFileAccessPageResponseSchema,
      { query, signal, authenticated: true }
    );
    checkContext(audience, datasetId, result.context, query);
    checkOrdered(result.items, query.afterId, query.limit);
    if (result.total < result.items.length) incompatible();
    if (result.nextCursor) {
      checkExactScope(audience, result.nextCursor);
      checkContext(audience, datasetId, result.context, result.nextCursor);
      if (
        result.nextCursor.afterId !== result.items.at(-1)?.id ||
        result.nextCursor.limit !== query.limit
      )
        incompatible();
    }
    return result;
  },
  async observations(
    audience: BuyerFileAudience,
    datasetId: string,
    input: DatasetFileObservationQuery,
    signal?: AbortSignal
  ) {
    const query = DatasetFileObservationQuerySchema.parse(input);
    checkExactScope(audience, query);
    const result = await request(
      `${fileBase(audience, datasetId)}/observations`,
      DatasetFileObservationResponseSchema,
      { query, signal, authenticated: true }
    );
    checkContext(audience, datasetId, result.context, query);
    checkOrdered(result.items, query.afterId, query.limit);
    if (
      result.memberId !== query.memberId ||
      result.evidenceId !== query.evidenceId ||
      result.total < result.items.length ||
      result.items.some((item) => item.evidenceId !== query.evidenceId)
    )
      incompatible();
    if (result.nextCursor) {
      checkExactScope(audience, result.nextCursor);
      checkContext(audience, datasetId, result.context, result.nextCursor);
      if (
        result.nextCursor.memberId !== query.memberId ||
        result.nextCursor.evidenceId !== query.evidenceId ||
        result.nextCursor.afterId !== result.items.at(-1)?.id ||
        result.nextCursor.limit !== query.limit
      )
        incompatible();
    }
    return result;
  },
  async download(
    audience: BuyerFileAudience,
    datasetId: string,
    supplied: DatasetFileDownloadBody,
    signal?: AbortSignal
  ) {
    const body = DatasetFileDownloadBodySchema.parse(supplied);
    checkExactScope(audience, body);
    const result = await request(
      `${fileBase(audience, datasetId)}/download-url`,
      DatasetFileDownloadResponseSchema,
      { method: "POST", body, signal, authenticated: true }
    );
    checkContext(audience, datasetId, result.context, body);
    if (
      result.memberId !== body.memberId ||
      result.downloadIntentId !== body.downloadIntentId
    )
      incompatible();
    return result;
  },
};

/** Validate an exact existing Razorpay item; does not create a new checkout flow. */
export function contentCheckoutItem(
  datasetId: string,
  expectedTarget: DatasetAcquisitionTarget
) {
  const target = DatasetAcquisitionTargetSchema.parse(expectedTarget);
  if (
    target.datasetId !== datasetId ||
    BigInt(target.amount.replace(".", "")) <= BigInt(0)
  )
    throw new BuyerDatasetError(
      "Review this Dataset's exact paid offer first.",
      "INVALID_ACQUISITION_TARGET",
      400
    );
  return { datasetId, expectedTarget: target };
}
export function assertContentCheckout(
  expectedTarget: DatasetAcquisitionTarget,
  checkout: { amount: string; currency: string; amountPaise: number }
) {
  const target = DatasetAcquisitionTargetSchema.parse(expectedTarget);
  const validAmount = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(
    checkout.amount
  );
  const [whole, fraction = ""] = validAmount
    ? checkout.amount.split(".")
    : ["0"];
  const minor = BigInt(whole + fraction.padEnd(2, "0"));
  if (
    !validAmount ||
    minor !== BigInt(target.amount.replace(".", "")) ||
    checkout.currency !== target.currency ||
    !Number.isSafeInteger(checkout.amountPaise) ||
    BigInt(checkout.amountPaise) !== minor
  ) {
    throw new BuyerDatasetError(
      "The checkout does not match the selected offer. Review your order before continuing.",
      "INCOMPATIBLE_CHECKOUT_RESPONSE"
    );
  }
}
