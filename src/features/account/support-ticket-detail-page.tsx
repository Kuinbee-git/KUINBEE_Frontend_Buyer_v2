"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ACCOUNT_SIDEBAR_SECTIONS } from "@/shared/components/navigation/section-sidebar";
import { MessageSquare, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTicket } from "@/hooks/api/useSupport";
import { formatDistanceToNow } from "date-fns";

interface SupportTicketDetailPageProps {
  ticketId: string;
}

export function SupportTicketDetailPage({ ticketId }: SupportTicketDetailPageProps) {
  const pathname = usePathname();
  const { data: ticketData, isLoading, error, refetch } = useTicket(ticketId);

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
              {/* Back Button */}
              <Link href="/account/support/tickets">
                <Button
                  variant="ghost"
                  size="sm"
                  className="mb-6 text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white -ml-2"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tickets
                </Button>
              </Link>

              {/* Loading State */}
              {isLoading && (
                <div className="space-y-4">
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="h-6 w-3/4 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                      <div className="h-4 w-1/4 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6 animate-pulse">
                    <div className="space-y-4">
                      <div className="h-4 w-1/4 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                      <div className="h-24 w-full bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center mb-6">
                    <MessageSquare className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    Ticket Not Found
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    {error instanceof Error ? error.message : "The ticket you're looking for doesn't exist."}
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white hover:border-[#1a2240]/50 dark:hover:border-white/30 font-medium"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <Link href="/account/support/tickets">
                      <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]">
                        Back to Tickets
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Ticket Content */}
              {!isLoading && !error && ticketData?.ticket && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Ticket Header */}
                    <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <MessageSquare className="w-6 h-6 text-[#1a2240] dark:text-white" />
                            <h1 className="text-xl font-semibold text-[#1a2240] dark:text-white">
                              {ticketData.ticket.subject}
                            </h1>
                          </div>
                          <p className="text-sm text-[#4e5a7e] dark:text-white/60">
                            Ticket ID: #{ticketData.ticket.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white mb-4">
                        Message
                      </h3>
                      <div className="p-4 rounded-lg bg-muted/30 dark:bg-white/5 border border-border/50 dark:border-white/10">
                        <p className="text-sm text-[#4e5a7e] dark:text-white/70 whitespace-pre-wrap leading-relaxed">
                          {ticketData.ticket.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Ticket Details Sidebar */}
                  <div className="space-y-6">
                    <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white mb-4">
                        Ticket Details
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                            Status
                          </p>
                          {getStatusBadge(ticketData.ticket.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                            Category
                          </p>
                          <Badge variant="outline" className="text-sm">
                            {ticketData.ticket.category}
                          </Badge>
                        </div>
                        <Separator className="bg-border/50 dark:bg-white/10" />
                        <div>
                          <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                            Created
                          </p>
                          <p className="text-sm text-[#1a2240] dark:text-white">
                            {formatDistanceToNow(new Date(ticketData.ticket.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                            Last Updated
                          </p>
                          <p className="text-sm text-[#1a2240] dark:text-white">
                            {formatDistanceToNow(new Date(ticketData.ticket.updatedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
