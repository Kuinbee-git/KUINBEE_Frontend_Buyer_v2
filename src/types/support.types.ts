/**
 * Support ticket types
 */

import { PaginationQuery } from "./api.types";

export type TicketCategory = "DATASET" | "BILLING" | "ACCOUNT" | "OTHER";

export type TicketStatus = "OPEN" | "CLOSED" | "ALL";

export interface SupportTicket {
  id: string;
  subject: string;
  message?: string;
  category?: TicketCategory;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketRequest {
  subject: string;
  message: string;
  category?: TicketCategory;
}

export interface CreateTicketResponse {
  ticket: {
    id: string;
    status: "OPEN" | "CLOSED";
    createdAt: string;
  };
}

export interface TicketDetailsResponse {
  ticket: SupportTicket;
}

export interface TicketListQuery extends PaginationQuery {
  status?: TicketStatus;
}
