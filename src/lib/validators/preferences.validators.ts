/**
 * Preferences validation schemas
 */

import { z } from "zod";

// Update preferences schema
export const updatePreferencesSchema = z.object({
  currency: z.enum(["INR", "USD", "EUR", "GBP"]).optional(),
  marketingEmails: z.boolean().optional(),
  productEmails: z.boolean().optional(),
});

// Export types
export type UpdatePreferencesFormData = z.infer<
  typeof updatePreferencesSchema
>;
