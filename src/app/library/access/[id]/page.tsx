"use client";

import { useParams } from "next/navigation";
import { DatasetAccessPage } from "@/features/library/components";

export default function DatasetAccessRoute() {
  const params = useParams();
  const datasetId = params?.id as string;

  return <DatasetAccessPage datasetId={datasetId} />;
}
