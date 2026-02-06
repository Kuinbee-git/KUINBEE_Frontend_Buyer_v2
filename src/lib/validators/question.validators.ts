/**
 * Question validation schemas
 */

import { z } from "zod";

// Ask question schema
export const createQuestionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(500, "Question must not exceed 500 characters"),
});

// Export types
export type CreateQuestionFormData = z.infer<typeof createQuestionSchema>;
