import { apiClient } from "@/core/api/client";
import type {
  DataRequirementReceipt,
  DataRequirementSubmission,
} from "@/types/data-requirement.types";

export const submitDataRequirement = (body: DataRequirementSubmission) =>
  apiClient.post<DataRequirementReceipt>("/api/v1/user/data-requirements", body);
