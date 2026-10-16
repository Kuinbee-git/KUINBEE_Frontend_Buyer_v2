// Synthetic public descriptions and exact grants. Never scanner/provider proof.
import {
  DatasetCatalogueDetailResponseSchema,
  DatasetLibraryItemSchema,
  DatasetFileAccessContextSchema,
} from "@kuinbee/dataset-preparation-contracts";
export const id = (value) => "c" + String(value).padStart(24, "0");
export const now = "2026-10-16T00:00:00.000Z",
  actorId = id(1),
  otherActorId = id(2);
let sequence = 100;
export const nextId = () => id(sequence++);
export const modalitySets = [
  ["TABULAR"],
  ["AUDIO"],
  ["IMAGE"],
  ["VIDEO"],
  ["TEXT"],
  ["SENSOR"],
  ["AUDIO", "VIDEO", "SENSOR"],
];
export function dataset(
  choice = "FULL_AND_SAMPLE",
  modalities = ["AUDIO"],
  paid = false
) {
  const datasetId = nextId(),
    contentId = nextId(),
    publicationId = nextId(),
    priceId = nextId();
  const components =
    choice === "FULL_AND_SAMPLE"
      ? ["FULL", "SAMPLE"]
      : [choice === "SAMPLE_ONLY" ? "SAMPLE" : "FULL"];
  const metric =
    modalities[0] === "AUDIO"
      ? "AUDIO_DURATION"
      : modalities[0] === "VIDEO"
        ? "VIDEO_DURATION"
        : modalities[0] === "IMAGE"
          ? "IMAGE_COUNT"
          : modalities[0] === "TEXT"
            ? "DOCUMENT_COUNT"
            : modalities[0] === "SENSOR"
              ? "STREAM_COUNT"
              : "ROW_COUNT";
  const unit = metric.endsWith("DURATION") ? "HOUR" : "COUNT";
  const measurements = [
    {
      scope: "REPRESENTED_COLLECTION",
      origin: "SUPPLIER_DECLARED",
      values: [{ metric, state: "KNOWN", value: "200", unit }],
    },
    ...components.map((component) => ({
      scope: component === "FULL" ? "FULL_MATERIAL" : "SAMPLE_MATERIAL",
      origin: "SUPPLIER_DECLARED",
      values: [{ metric, state: "UNKNOWN", unit }],
    })),
  ];
  const title = `Collection ${modalities.join(" + ")} ${choice}`;
  const category = { id: "category", name: "Current category name" },
    captured = { ...category, name: "Category at submission" };
  const source = {
    id: "source",
    name: "Source at submission",
    description: null,
    websiteUrl: null,
    isVerifiedAtFreeze: false,
  };
  const price = paid ? "12.50" : "0.00";
  const pricing = {
    surface: "DATASET_PRICING",
    baseAmount: price,
    finalAmount: price,
    currency: "INR",
    discount: null,
    payable: paid,
    visible: true,
  };
  return DatasetCatalogueDetailResponseSchema.parse({
    representation: "CONTENT",
    item: {
      id: datasetId,
      datasetUniqueId: "D" + datasetId.slice(-10),
      title,
      status: "PUBLISHED",
      license: "CC-BY-4.0",
      owner: { id: id(9), type: "supplier", name: "Fixture supplier" },
      publication: { id: publicationId, contentId, publishedAt: now },
      overview: "A defined supplier collection",
      uploadChoice: choice,
      modalities,
      contexts: [],
      category,
      categoryAtFreeze: captured,
      categoryNameOrigin: "CURRENT_CATEGORY",
      tags: ["Research"],
      measurements,
      materials: components.map((component) => ({
        component,
        origin: "SELECTED_PHYSICAL_FILES",
        fileCount: 1,
        sizeBytes: "48044",
      })),
      assessment: {
        score: "80.00",
        scope: "UPLOADED_COMPONENTS",
        components,
        representedCollection: "SUPPLIER_DECLARATION",
      },
      purchase:
        choice === "SAMPLE_ONLY"
          ? {
              mode: "DISPLAY_ONLY",
              component: null,
              pricing: null,
              pricingReference: null,
              eligibilityCheckRequired: true,
            }
          : {
              mode: paid ? "PAID_CHECKOUT" : "FREE_CLAIM",
              component: "FULL",
              pricing,
              pricingReference: { id: priceId, revision: 1 },
              eligibilityCheckRequired: true,
            },
      stats: { viewCount: 0, downloadCount: 0, reviewCount: 0, rating: null },
      searchScore: null,
      createdAt: now,
      updatedAt: now,
    },
    description: {
      title,
      license: "CC-BY-4.0",
      overview: "A defined supplier collection",
      description: "The frozen description of this collection.",
      dataQuality: "Supplier declared quality",
      collectionBoundary: "Exactly the recorded collection boundary.",
      limitations: null,
      methodology: null,
      useCases: null,
      uploadChoice: choice,
      modalities,
      contexts: [],
      studyStructure: null,
      tags: ["Research"],
      categoriesAtFreeze: { primary: captured, additional: [] },
      sourceAtFreeze: source,
      measurements,
      sample:
        choice === "FULL_ONLY"
          ? null
          : {
              selectionMethod: "Selected sessions",
              coverage: "A representative declared subset",
            },
      fullCompleteness: choice === "SAMPLE_ONLY" ? null : true,
      profiles: {},
    },
    currentCategoryFacts: [category],
    currentSourceFacts: {
      id: source.id,
      name: "Current source name",
      isVerified: true,
    },
  });
}
export function offer(data, amount) {
  const price =
    amount ?? (data.item.purchase.mode === "PAID_CHECKOUT" ? "12.50" : "0.00");
  return {
    target: {
      datasetId: data.item.id,
      contentId: data.item.publication.contentId,
      component: "FULL",
      publicationId: data.item.publication.id,
      pricingVersionId: data.item.purchase.pricingReference?.id ?? nextId(),
      pricingRevision: 1,
      amount: price,
      currency: "INR",
    },
    accessFlow: price === "0.00" ? "FREE_CLAIM" : "PAID_CHECKOUT",
    baseAmount: price,
    discountProposalId: null,
    discountAmount: null,
  };
}
export function grant(data, updates = {}) {
  return DatasetLibraryItemSchema.parse({
    datasetId: data.item.id,
    datasetUniqueId: data.item.datasetUniqueId,
    accessType: "FREE_CLAIM",
    grantedAt: now,
    expiresAt: null,
    representation: "CONTENT",
    recordedAccess: "RECORDED",
    metadataProvenance: "FROZEN_GRANT_CONTENT",
    title: data.description.title,
    description: data.description,
    grantId: nextId(),
    material: {
      datasetId: data.item.id,
      contentId: data.item.publication.contentId,
      component: "FULL",
    },
    ...updates,
  });
}
export function fileContext(data, audience) {
  return DatasetFileAccessContextSchema.parse({
    datasetId: data.item.id,
    scope: audience === "SAMPLE" ? "PUBLISHED" : "GRANTED",
    component: audience === "SAMPLE" ? "SAMPLE" : "FULL",
    contentId: data.item.publication.contentId,
    contentGeneration: 1,
    workflowRevision: audience === "SAMPLE" ? 1 : null,
    frozen: true,
    publicationId: audience === "SAMPLE" ? data.item.publication.id : null,
    editOperation: null,
  });
}
export function fileMember(context, name = "sample.wav") {
  const evidenceId = nextId();
  return {
    id: nextId(),
    contentId: context.contentId,
    component: context.component,
    role: "PRIMARY",
    relativePath: null,
    groupId: null,
    uploadObjectId: nextId(),
    originalFileName: name,
    measuredSizeBytes: "48044",
    membershipEvidenceId: evidenceId,
    inspection: {
      securityState: "ACCEPTED",
      currentEvidenceId: evidenceId,
      recordedOutcome: "PASS",
      current: true,
      eligibility: "NOT_EVALUATED",
    },
  };
}
export function legacyCard() {
  const datasetId = nextId(),
    emptyPrice = {
      surface: null,
      baseAmount: null,
      finalAmount: null,
      currency: null,
      discount: null,
      payable: false,
      visible: false,
    };
  return {
    id: datasetId,
    datasetUniqueId: "D" + datasetId.slice(-10),
    title: "Legacy collection with unknown format",
    status: "PUBLISHED",
    license: "CC-BY-4.0",
    owner: { id: id(9), type: "supplier", name: "Existing supplier" },
    category: { name: "CI fixture subject" },
    location: null,
    dataFormatInfo: {
      fileFormat: null,
      rows: null,
      cols: null,
      fileSize: null,
    },
    tags: [],
    isPaid: false,
    price: null,
    currency: "INR",
    accessFlow: "FREE_CLAIM",
    commercialFlow: "NONE",
    accessPrice: emptyPrice,
    commercialPrice: emptyPrice,
    viewCount: 0,
    downloadCount: 0,
    reviewCount: 0,
    rating: null,
    kdtsScore: null,
    searchScore: null,
    isSample: false,
    sampleFileAvailable: false,
    sampleNotes: null,
    actualPrice: null,
    actualPriceCurrency: null,
    buyInPartsAvailable: false,
    createdAt: now,
    updatedAt: now,
  };
}
