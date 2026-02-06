/**
 * Q&A types
 */

import { PaginationQuery } from "./api.types";

export interface Question {
  id: string;
  question: string;
  createdAt: string;
}

export interface QuestionResponse {
  question: Question;
}

export interface CreateQuestionRequest {
  question: string;
}

export interface Answer {
  id: string;
  answer: string;
  createdAt: string;
}

export type QuestionListQuery = PaginationQuery;
