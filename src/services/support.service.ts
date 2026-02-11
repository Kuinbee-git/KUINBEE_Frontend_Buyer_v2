/**
 * Support service
 */

import { apiClient, API_ENDPOINTS } from "@/core/api";
import type {
  SupportTicket,
  CreateTicketRequest,
  CreateTicketResponse,
  TicketDetailsResponse,
  TicketListQuery,
  PaginatedResponse,
  ApiResponse,
} from "@/types";

export const supportService = {
  // Create ticket
  createTicket: (data: CreateTicketRequest) =>
    apiClient.post<CreateTicketResponse>(
      API_ENDPOINTS.SUPPORT.TICKETS,
      data
    ),

  // List tickets
  listTickets: (query?: TicketListQuery) =>
    apiClient.get<PaginatedResponse<SupportTicket>>(
      API_ENDPOINTS.SUPPORT.TICKETS,
      query as Record<string, unknown>
    ),

  // Get ticket by ID
  getTicket: (ticketId: string) =>
    apiClient.get<TicketDetailsResponse>(
      API_ENDPOINTS.SUPPORT.TICKET(ticketId)
    ),
};
