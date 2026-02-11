"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { MessageSquare, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTicket } from "@/hooks/api/useSupport";
import { formatDistanceToNow } from "date-fns";

interface SupportTicketDetailPageProps {
  ticketId: string;
}

export function SupportTicketDetailPage({ ticketId }: SupportTicketDetailPageProps) {
  const { data: ticketData, isLoading, error } = useTicket(ticketId);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-[#1a2240] dark:text-white animate-spin" />
              <p className="text-[#4e5a7e] dark:text-white/60">Loading ticket...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !ticketData?.ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardContent className="py-16">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Ticket Not Found
                </h3>
                <p className="text-[#4e5a7e] dark:text-white/60 mb-6">
                  {error instanceof Error ? error.message : "The ticket you're looking for doesn't exist."}
                </p>
                <Link href="/support">
                  <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]">
                    Back to Tickets
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const ticket = ticketData.ticket;
  const createdDate = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });
  const updatedDate = formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl">
        {/* Back Button */}
        <Link href="/support">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Header */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MessageSquare className="w-6 h-6 text-[#1a2240] dark:text-white" />
                      <CardTitle className="text-xl text-[#1a2240] dark:text-white">
                        {ticket.subject}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-[#4e5a7e] dark:text-white/60">
                      Ticket ID: #{ticket.id}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Message Content */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#1a2240] dark:text-white">
                  Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-muted/30 dark:bg-white/5 border border-border/50 dark:border-white/10">
                  <p className="text-sm text-[#4e5a7e] dark:text-white/70 whitespace-pre-wrap leading-relaxed">
                    {ticket.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#1a2240] dark:text-white">
                  Ticket Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                    Status
                  </p>
                  {getStatusBadge(ticket.status)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                    Category
                  </p>
                  <Badge variant="outline" className="text-sm">
                    {ticket.category}
                  </Badge>
                </div>
                <Separator className="bg-border/50 dark:bg-white/10" />
                <div>
                  <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                    Created
                  </p>
                  <p className="text-sm text-[#1a2240] dark:text-white">
                    {createdDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                    Last Updated
                  </p>
                  <p className="text-sm text-[#1a2240] dark:text-white">
                    {updatedDate}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
