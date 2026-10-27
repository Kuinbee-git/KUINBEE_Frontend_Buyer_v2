import {
  DATASET_MODALITIES,
  DATASET_UPLOAD_CHOICES,
  type DatasetDeclaredMeasurement,
  type DatasetPublicDescription,
} from "@kuinbee/dataset-preparation-contracts";
import type { BuyerCatalogueCard } from "@/services/dataset-content.service";
export type ContentCatalogueCard = Extract<
  BuyerCatalogueCard,
  { representation: "CONTENT" }
>["item"];
export type ContentListing = {
  representation: "CONTENT";
  id: string;
  searchScore: number | null;
  item: ContentCatalogueCard;
};
export const contentChoiceLabel = (
  choice: ContentCatalogueCard["uploadChoice"]
) => DATASET_UPLOAD_CHOICES.find((item) => item.value === choice)!.label;
export const contentModalityLabels = (
  modalities: DatasetPublicDescription["modalities"]
) =>
  modalities.map(
    (value) => DATASET_MODALITIES.find((item) => item.value === value)!.label
  );
export const measurementScopeLabels = {
  REPRESENTED_COLLECTION: "Represented collection",
  FULL_MATERIAL: "Uploaded full material",
  SAMPLE_MATERIAL: "Uploaded sample",
} as const;
const metrics: Record<DatasetDeclaredMeasurement["metric"], string> = {
  RECORD_COUNT: "records",
  ROW_COUNT: "rows",
  COLUMN_COUNT: "columns",
  AUDIO_DURATION: "audio duration",
  VIDEO_DURATION: "video duration",
  IMAGE_COUNT: "images",
  DOCUMENT_COUNT: "documents",
  SESSION_COUNT: "sessions",
  PARTICIPANT_COUNT: "participants",
  STREAM_COUNT: "streams",
  BYTE_SIZE: "size",
};
const units: Record<DatasetDeclaredMeasurement["unit"], string> = {
  COUNT: "",
  SECOND: "seconds",
  MINUTE: "minutes",
  HOUR: "hours",
  BYTE: "bytes",
};
export function declaredMeasurement(value: DatasetDeclaredMeasurement) {
  if (value.state === "UNKNOWN") return `${metrics[value.metric]} unknown`;
  return `${value.state === "ESTIMATED" ? "Estimated " : ""}${value.value} ${units[value.unit] || metrics[value.metric]}${value.unit !== "COUNT" ? ` (${metrics[value.metric]})` : ""}`;
}
export function physicalBytes(value: string) {
  const bytes = Number(value);
  if (bytes >= 1_000_000_000)
    return `${(bytes / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} GB`;
  if (bytes >= 1_000_000)
    return `${(bytes / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} MB`;
  if (bytes >= 1_000)
    return `${(bytes / 1_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} KB`;
  return `${bytes} bytes`;
}
export function contentPriceLabel(item: ContentCatalogueCard) {
  if (item.fullCollectionOffer?.mode === "PAID_ON_REQUEST")
    return "Full dataset: price on request";
  if (item.purchase.mode === "DISPLAY_ONLY") return "Sample on display";
  if (item.purchase.mode === "UNAVAILABLE") return "Full access unavailable";
  if (item.purchase.mode === "FREE_CLAIM") return "Free full dataset";
  const price = item.purchase.pricing;
  return price?.finalAmount !== null &&
    price?.finalAmount !== undefined &&
    price.currency
    ? `${price.currency} ${price.finalAmount}`
    : "Price unavailable";
}
