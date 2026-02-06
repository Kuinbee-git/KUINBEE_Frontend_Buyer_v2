/**
 * Support validation schemas
 */

import { z } from "zod";

// Create ticket schema
export const createTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must not exceed 200 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must not exceed 2000 characters"),
  category: z.enum(["DATASET", "BILLING", "ACCOUNT", "OTHER"]).optional(),
});

// Export types
export type CreateTicketFormData = z.infer<typeof createTicketSchema>;
