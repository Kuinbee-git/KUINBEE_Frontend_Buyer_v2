/**
 * Question service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  Question,
  QuestionResponse,
  CreateQuestionRequest,
  QuestionListQuery,
  PaginatedResponse,
} from "@/types";

export const questionService = {
  // List questions for a dataset
  listQuestions: (datasetId: string, query?: QuestionListQuery) =>
    apiClient.get<PaginatedResponse<Question>>(
      API_ENDPOINTS.MARKETPLACE.QUESTIONS(datasetId),
      query as Record<string, unknown>
    ),

  // Ask a question
  askQuestion: (datasetId: string, data: CreateQuestionRequest) =>
    apiClient.post<QuestionResponse>(
      API_ENDPOINTS.MARKETPLACE.QUESTIONS(datasetId),
      data
    ),
};
