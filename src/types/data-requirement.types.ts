export interface DataRequirementSubmission {
  clientRequestId: string;
  contactName: string;
  organization?: string;
  phone?: string;
  title: string;
  industry: string;
  dataType: string;
  description: string;
  intendedUse: string;
  formats: string[];
  geographies: string[];
  languages: string[];
  expectedVolume?: string;
  targetDeliveryDate?: string;
  budgetRange?: string;
  licensingCompliance?: string;
  notes?: string;
}

export interface DataRequirementReceipt {
  id: string;
  referenceCode: string;
  status: 'SUBMITTED';
  submittedAt: string;
  duplicate: boolean;
}

export interface MarketplaceDataRequirement {
  referenceCode: string;
  slug: string;
  title: string;
  summary: string;
  dataType: string;
  industry: string;
  specifications: string[];
  coverage: string[];
  volume: string[];
  deliveryDate: string | null;
  publishedAt: string;
}

export interface MarketplaceDataRequirementPage {
  items: MarketplaceDataRequirement[];
  page: number;
  pageSize: number;
  total: number;
}
