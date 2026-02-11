"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { MessageSquare, Search, Plus, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTickets } from "@/hooks/api/useSupport";
import { formatDistanceToNow } from "date-fns";
import type { TicketStatus } from "@/types";

export function SupportTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus>("ALL");
  
  const { data: ticketsData, isLoading, error } = useTickets({ 
    status: statusFilter,
  });

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<string, string> = {
      open: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      closed: "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    };

    return (
      <Badge
        variant="outline"
        className={variants[statusLower] || variants.open}
      >
        {status.toUpperCase()}
      </Badge>
    );
  };

  const tickets = ticketsData?.items || [];
  const filteredTickets = searchQuery
    ? tickets.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tickets;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#1a2240] dark:text-white animate-spin" />
              <p className="text-[#4e5a7e] dark:text-white/60">Loading tickets...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Failed to Load Tickets
                </h3>
                <p className="text-[#4e5a7e] dark:text-white/60 mb-6">
                  {error instanceof Error ? error.message : "An error occurred while loading tickets."}
                </p>
                <Button
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-[#1a2240] dark:text-white" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2240] dark:text-white">
                Support Tickets
              </h1>
            </div>
            <Link href="/support/create">
              <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
            </Link>
          </div>
          <p className="text-sm sm:text-base text-[#4e5a7e] dark:text-white/60">
            Track and manage your support requests
          </p>
        </div>

        {/* Filters */}
        <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10 mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4e5a7e] dark:text-white/50" />
                <Input
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white dark:bg-[#0f1729] border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e] dark:placeholder:text-white/50"
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus)}>
                <SelectTrigger className="bg-white dark:bg-[#0f1729] border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Tickets</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {filteredTickets.length > 0 ? (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const createdDate = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });
              const updatedDate = formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true });
              
              return (
                <Card
                  key={ticket.id}
                  className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10 hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-all"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white">
                            {ticket.subject}
                          </h3>
                        </div>
                        <p className="text-sm text-[#4e5a7e] dark:text-white/60 mb-3">
                          #{ticket.id}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#4e5a7e] dark:text-white/60 pt-4 border-t border-border/40 dark:border-white/10">
                      <div className="flex items-center gap-4">
                        <span>Created: {createdDate}</span>
                        <span>Updated: {updatedDate}</span>
                      </div>
                      <Link href={`/support/ticket/${ticket.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white"
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardContent className="py-16">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[#4e5a7e] dark:text-white/40" />
                <h3 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  No Support Tickets
                </h3>
                <p className="text-[#4e5a7e] dark:text-white/60 mb-6">
                  You haven't created any support tickets yet.
                </p>
                <Link href="/support/create">
                  <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Ticket
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
