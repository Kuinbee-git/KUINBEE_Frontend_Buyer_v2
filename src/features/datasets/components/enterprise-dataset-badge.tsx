import { Building2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

// Classification comes from catalogue categories for both platform and supplier datasets.
export function isEnterpriseDataset(categories: readonly string[]): boolean {
  return categories.some((name) =>
    /^enterprise datasets?$/.test(
      name.trim().replace(/\s+/g, " ").toLowerCase()
    )
  );
}

export function EnterpriseDatasetBadge({
  categories,
}: {
  categories: readonly string[];
}) {
  if (!isEnterpriseDataset(categories)) return null;
  return (
    <Badge variant="info" data-enterprise-dataset-badge>
      <Building2 className="size-3" aria-hidden="true" />
      Enterprise
    </Badge>
  );
}
