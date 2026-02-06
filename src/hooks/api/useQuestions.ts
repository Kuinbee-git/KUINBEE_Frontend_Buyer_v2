/**
 * Question React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { questionService } from "@/services";
import type { CreateQuestionRequest, QuestionListQuery } from "@/types";

// Query keys
export const questionKeys = {
  questions: (datasetId: string, query?: QuestionListQuery) =>
    ["questions", datasetId, query] as const,
};

// List questions
export const useQuestions = (datasetId: string, query?: QuestionListQuery) => {
  return useQuery({
    queryKey: questionKeys.questions(datasetId, query),
    queryFn: () => questionService.listQuestions(datasetId, query),
  });
};

// Ask question
export const useAskQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      datasetId,
      data,
    }: {
      datasetId: string;
      data: CreateQuestionRequest;
    }) => questionService.askQuestion(datasetId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["questions", variables.datasetId],
      });
    },
  });
};
