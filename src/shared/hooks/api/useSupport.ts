/**
 * Support React Query hooks
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supportService } from "@/services";
import type { CreateTicketRequest, TicketListQuery } from "@/types";

// Query keys
export const supportKeys = {
  tickets: (query?: TicketListQuery) => ["tickets", query] as const,
  ticket: (ticketId: string) => ["tickets", ticketId] as const,
};

// List tickets
export const useTickets = (query?: TicketListQuery) => {
  return useQuery({
    queryKey: supportKeys.tickets(query),
    queryFn: () => supportService.listTickets(query),
  });
};

// Get ticket by ID
export const useTicket = (ticketId: string, enabled = true) => {
  return useQuery({
    queryKey: supportKeys.ticket(ticketId),
    queryFn: () => supportService.getTicket(ticketId),
    enabled,
  });
};

// Create ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTicketRequest) =>
      supportService.createTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};
