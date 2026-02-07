"use client";

import { useParams } from "next/navigation";
import { DatasetDetailPage } from "@/features/datasets/components";
import { Dataset } from "@/features/datasets/components/types";

// Mock dataset data for demonstration
const mockDataset: Dataset = {
  id: "DS-2025-001",
  title: "Global E-Commerce Transaction Dataset",
  provider: "DataStream Analytics",
  category: "E-Commerce",
  description:
    "Comprehensive global e-commerce transaction dataset covering 45+ countries with detailed transaction-level data, customer demographics, and product classifications. Updated daily with 99.5% completeness and verified accuracy across all major markets.",
  coverage: "Global (45+ countries)",
  updateFrequency: "Daily",
  records: 2500000000, // 2.5 billion
  lastUpdated: "Jan 15, 2025",
  status: "published",
  license: "Commercial",
  rating: 4.7,
  reviewCount: 324,
  pricing: {
    type: "paid",
    amount: 5000,
    currency: "USD",
  },
  quality: {
    completeness: 99.5,
    accuracy: 98.8,
    consistency: 99.2,
    timeliness: 99.7,
  },
  verification: {
    supplierVerified: true,
    datasetReviewed: true,
    published: true,
  },
};

export default function DatasetDetailPageRoute() {
  const params = useParams();
  const id = params?.id as string;

  // In a real app, fetch the dataset by ID from your API
  // For now, we use mock data
  const dataset = mockDataset;

  return (
    <DatasetDetailPage
      dataset={dataset}
      accessState="not-logged-in"
      onLogin={() => console.log("Login clicked")}
      onClaimDataset={() => console.log("Claim dataset clicked")}
      onPurchaseDataset={() => console.log("Purchase dataset clicked")}
      onDownloadDataset={() => console.log("Download dataset clicked")}
      onAddToCart={() => console.log("Add to cart clicked")}
      onAddToWishlist={() => console.log("Add to wishlist clicked")}
      isInCart={false}
      isInWishlist={false}
    />
  );
}
