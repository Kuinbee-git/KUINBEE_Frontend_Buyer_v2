"use client";

import { useState } from "react";
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
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ACCOUNT_SIDEBAR_SECTIONS } from "@/shared/components/navigation/section-sidebar";
import { MessageSquare, Search, Plus, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTickets } from "@/hooks/api/useSupport";
import { formatDistanceToNow } from "date-fns";
import type { TicketStatus } from "@/types";

export function SupportTicketsPage() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus>("ALL");
  
  const { data: ticketsData, isLoading, error, refetch } = useTickets({ 
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

  const sidebarSections = ACCOUNT_SIDEBAR_SECTIONS.support;

  return (
    <div className="min-h-screen relative">
      {/* Navigation */}
      <div className="relative z-50">
        <NotchNavigation />
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      {/* Main Content */}
      <div className="relative pt-32 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          {/* Page Header - Just tabs */}
          <div className="mb-8 flex justify-center lg:justify-start">
            <MainSectionTabs />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
            {/* Left Sidebar - Navigation */}
            <aside className="space-y-6 relative">
              {/* Fade separator line */}
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 dark:via-white/10 to-transparent hidden lg:block" />

              {sidebarSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded-xl overflow-hidden">
                  {section.title && (
                    <div className="px-3 pt-4 pb-2 lg:px-4 lg:pt-5 lg:pb-2">
                      <h3 className="text-xs font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1 px-2">
                    {section.items.map((item) => {
                      const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 ${
                            isActive
                              ? "bg-[#1a2240]/5 dark:bg-white/10 text-[#1a2240] dark:text-white font-medium"
                              : "text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                          }`}
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main Content Column */}
            <div>
              {/* Section Title & Description */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                      Support Tickets
                    </h1>
                    <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                      Track and manage your support requests.
                    </p>
                  </div>
                  <Link href="/account/support/create">
                    <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold shadow-md hover:shadow-lg transition-all">
                      <Plus className="w-4 h-4 mr-2" />
                      New Ticket
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#4e5a7e] dark:text-white/50" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e] dark:placeholder:text-white/50"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as TicketStatus)}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10 text-[#1a2240] dark:text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Tickets</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="CLOSED">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6 animate-pulse"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="h-4 w-32 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                          <div className="h-6 w-16 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                        </div>
                        <div className="h-5 w-3/4 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                        <div className="flex gap-4">
                          <div className="h-4 w-32 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                          <div className="h-4 w-32 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    Unable to load tickets
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    {error instanceof Error ? error.message : "There was an issue retrieving your tickets. Please try again."}
                  </p>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white hover:border-[#1a2240]/50 dark:hover:border-white/30 font-medium"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry
                  </Button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !error && filteredTickets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-[#1a2240]/5 dark:bg-white/5 border border-[#1a2240]/10 dark:border-white/10 flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-[#4e5a7e] dark:text-white/40" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    {searchQuery ? "No matching tickets" : "No support tickets yet"}
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    {searchQuery 
                      ? "Try adjusting your search terms or filters."
                      : "When you need help, create a support ticket and our team will assist you."
                    }
                  </p>
                  {!searchQuery && (
                    <Link href="/account/support/create">
                      <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold shadow-md hover:shadow-lg transition-all">
                        Create Your First Ticket
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Tickets List */}
              {!isLoading && !error && filteredTickets.length > 0 && (
                <div className="space-y-4">
                  {filteredTickets.map((ticket) => {
                    const createdDate = formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true });
                    const updatedDate = formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true });
                    
                    return (
                      <div
                        key={ticket.id}
                        className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6 hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-all hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-xs text-[#4e5a7e] dark:text-white/60">
                                #{ticket.id}
                              </span>
                              {getStatusBadge(ticket.status)}
                            </div>
                            <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white">
                              {ticket.subject}
                            </h3>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-[#4e5a7e] dark:text-white/60 pt-4 border-t border-border/40 dark:border-white/10">
                          <div className="flex items-center gap-4">
                            <span>Created {createdDate}</span>
                            <span>Updated {updatedDate}</span>
                          </div>
                          <Link href={`/account/support/tickets/${ticket.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#1a2240] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
                            >
                              View Details
                              <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
