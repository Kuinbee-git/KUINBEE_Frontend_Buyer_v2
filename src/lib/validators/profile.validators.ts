/**
 * Profile validation schemas
 */

import { z } from "zod";

// Update profile schema
export const updateProfileSchema = z.object({
  phone: z.string().optional().nullable(),
  personalInfo: z
    .object({
      firstName: z.string().min(1, "First name is required").optional().nullable(),
      lastName: z.string().min(1, "Last name is required").optional().nullable(),
      profileImage: z.string().url("Invalid image URL").optional().nullable(),
    })
    .optional(),
});

// Export types
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
