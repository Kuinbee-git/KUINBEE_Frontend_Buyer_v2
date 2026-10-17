import { DatasetAccessPage } from "@/features/library/components";

export default async function DatasetAccessRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DatasetAccessPage datasetId={id} />;
}
