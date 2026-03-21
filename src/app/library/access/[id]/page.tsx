import type { DatasetDetailsResponse } from "@/types";
import { DatasetAccessPage } from "@/features/library/components";

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchDatasetDetailsResponse(id: string): Promise<DatasetDetailsResponse | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
    const res = await fetch(`${apiUrl}/api/v1/marketplace/datasets/${id}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const json = await res.json();
      const payload = json?.data ?? json;
      return payload?.dataset ? (payload as DatasetDetailsResponse) : null;
    }
  } catch {
    // no-op
  }
  return null;
}

export default async function DatasetAccessRoute({ params }: Props) {
  const { id } = await params;
  const initialDatasetDetails = await fetchDatasetDetailsResponse(id);

  return <DatasetAccessPage datasetId={id} initialDatasetDetails={initialDatasetDetails ?? undefined} />;
}
