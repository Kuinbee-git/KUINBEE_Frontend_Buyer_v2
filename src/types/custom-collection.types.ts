export type CustomCollectionSort = "NEWEST" | "TITLE_ASC" | "TITLE_DESC";

export interface CustomCollectionCategory {
  id: string;
  name: string;
}

export interface CustomCollectionRevision {
  id: string;
  version: number;
  title: string;
  shortDescription: string;
  description: string;
  primaryCategory: CustomCollectionCategory;
  secondaryCategories: CustomCollectionCategory[];
  collectionMethods: string[];
  collectionMethodsOther: string | null;
  dataTypes: string[];
  dataTypesOther: string | null;
  supportedFormats: string[];
  supportedFormatsOther: string | null;
  industries: string[];
  industriesOther: string | null;
  geographies: string[];
  geographiesOther: string | null;
  languages: string[];
  languagesOther: string | null;
  estimatedTurnaroundMinDays: number;
  estimatedTurnaroundMaxDays: number;
  deliverables: string;
  qualityAssurance: string;
  complianceNotes: string | null;
  coverImage: {
    id: string;
    url: string;
    contentType: string;
    sizeBytes: string | null;
  } | null;
  publishedAt: string | null;
}

export interface CustomCollectionService {
  id: string;
  slug: string;
  publishedAt: string | null;
  supplier: {
    id: string;
    displayName: string;
    logoUrl: string | null;
  };
  publishedRevision: CustomCollectionRevision;
  createdAt: string;
  updatedAt: string;
}

export interface CustomCollectionListQuery {
  page?: number;
  pageSize?: number;
  q?: string;
  categoryId?: string;
  collectionMethods?: string[];
  industries?: string[];
  geographies?: string[];
  supportedFormats?: string[];
  languages?: string[];
  sort?: CustomCollectionSort;
}

export interface CustomCollectionListResponse {
  items: CustomCollectionService[];
  page: number;
  pageSize: number;
  total: number;
}

export interface GuestCustomCollectionLeadInput {
  submissionType: "GUEST_FORM";
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  industry: string;
  dataDescription: string;
  preferredFormat: string;
  timeline: string;
  additionalNotes?: string;
}

export interface CustomCollectionLeadReceipt {
  lead: { id: string; createdAt: string };
}
