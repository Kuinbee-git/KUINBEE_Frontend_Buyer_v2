import { z } from "zod";
import { DatasetAcquisitionTargetSchema } from "@kuinbee/dataset-preparation-contracts";
const id = z.string().cuid();
export const ContentClaimIntentSchema = z
  .object({
    actorId: id,
    datasetId: id,
    expectedTarget: DatasetAcquisitionTargetSchema,
  })
  .strict()
  .refine(
    (value) =>
      value.expectedTarget.datasetId === value.datasetId &&
      value.expectedTarget.amount === "0.00",
    "Retain the exact free full Dataset offer"
  );
export type ContentClaimIntent = z.infer<typeof ContentClaimIntentSchema>;
const key = (actorId: string, datasetId: string) =>
  `kuinbee:content-claim:v1:${id.parse(actorId)}:${id.parse(datasetId)}`;
export function readContentClaim(actorId: string, datasetId: string) {
  const raw = sessionStorage.getItem(key(actorId, datasetId));
  if (raw === null) return null;
  if (new TextEncoder().encode(raw).length > 8192)
    throw new Error("The retained claim exceeds its limit.");
  const intent = ContentClaimIntentSchema.parse(JSON.parse(raw));
  if (intent.actorId !== actorId || intent.datasetId !== datasetId)
    throw new Error("The retained claim belongs to another session context.");
  return intent;
}
export function storeContentClaim(input: ContentClaimIntent) {
  const intent = ContentClaimIntentSchema.parse(input),
    encoded = JSON.stringify(intent),
    previous = readContentClaim(intent.actorId, intent.datasetId);
  if (previous && JSON.stringify(previous) !== encoded)
    throw new Error(
      "Check your previous claim before reviewing another offer."
    );
  if (new TextEncoder().encode(encoded).length > 8192)
    throw new Error("The claim exceeds its limit.");
  sessionStorage.setItem(key(intent.actorId, intent.datasetId), encoded);
  if (sessionStorage.getItem(key(intent.actorId, intent.datasetId)) !== encoded)
    throw new Error("The exact claim could not be retained.");
}
export function clearContentClaim(intent: ContentClaimIntent) {
  const previous = readContentClaim(intent.actorId, intent.datasetId);
  if (previous && JSON.stringify(previous) !== JSON.stringify(intent))
    throw new Error("The retained claim changed.");
  sessionStorage.removeItem(key(intent.actorId, intent.datasetId));
  if (sessionStorage.getItem(key(intent.actorId, intent.datasetId)) !== null)
    throw new Error("The retained claim could not be cleared.");
}
