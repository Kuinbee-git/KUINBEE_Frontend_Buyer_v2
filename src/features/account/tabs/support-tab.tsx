"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { HelpCircle, Plus, MessageSquare, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTickets } from "@/hooks/api/useSupport";
import { formatDistanceToNow } from "date-fns";

export function SupportTab() {
  const { data: ticketsData, isLoading, error } = useTickets({ status: "ALL" });

  const tickets = ticketsData?.items || [];
  const openTickets = tickets.filter(t => t.status.toUpperCase() === "OPEN");

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<string, string> = {
      open: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
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

  return (
    <div className="space-y-4 lg:space-y-6 max-w-2xl">
      {/* Create Ticket Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Ticket
          </CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Get help with any issues or questions about your datasets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/account/support/create">
            <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Support Tickets Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Your Tickets
                {openTickets.length > 0 && (
                  <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                    {openTickets.length} Open
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-[#4e5a7e] dark:text-white/60">
                Track the status of your support requests.
              </CardDescription>
            </div>
            {tickets.length > 0 && (
              <Link href="/account/support/tickets">
                <Button variant="ghost" size="sm" className="text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-[#1a2240] dark:text-white animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-sm text-[#4e5a7e] dark:text-white/60 text-center">
                Failed to load tickets
              </p>
            </div>
          ) : tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.slice(0, 3).map((ticket) => {
                const createdAgo = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });
                const updatedAgo = formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true });
                
                return (
                  <div
                    key={ticket.id}
                    className="p-4 rounded-lg bg-muted/30 dark:bg-white/5 border border-border/40 dark:border-white/10 hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-[#4e5a7e] dark:text-white/60">
                            {ticket.id}
                          </span>
                          {getStatusBadge(ticket.status)}
                        </div>
                        <h4 className="font-medium text-sm text-[#1a2240] dark:text-white">
                          {ticket.subject}
                        </h4>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#4e5a7e] dark:text-white/50 mb-3">
                      <span>Created {createdAgo}</span>
                      <span>Updated {updatedAgo}</span>
                    </div>
                    <div className="pt-3 border-t border-border/40 dark:border-white/10">
                      <Link href={`/account/support/tickets/${ticket.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#1a2240] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#4e5a7e] dark:text-white/60 text-center py-8">
              No support tickets yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Help Resources Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Help Resources
          </CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Find answers to common questions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
          >
            View Documentation
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
          >
            FAQs
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
          >
            Contact Sales
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
