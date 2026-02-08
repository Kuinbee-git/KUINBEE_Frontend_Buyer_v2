"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { HelpCircle, Plus, MessageSquare } from "lucide-react";

export function SupportTab() {
  const tickets = [
    {
      id: "TKT-001234",
      subject: "Unable to download dataset",
      status: "open",
      createdAt: "2024-12-15",
      lastUpdate: "2 hours ago",
    },
    {
      id: "TKT-001198",
      subject: "Question about license terms",
      status: "resolved",
      createdAt: "2024-12-10",
      lastUpdate: "3 days ago",
    },
  ];

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
          <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </CardContent>
      </Card>

      {/* Support Tickets Card */}
      <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-[#1a2240] dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Your Tickets
          </CardTitle>
          <CardDescription className="text-[#4e5a7e] dark:text-white/60">
            Track the status of your support requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length > 0 ? (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 rounded-lg bg-muted/30 dark:bg-white/5 border border-border/40 dark:border-white/10 hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-[#4e5a7e] dark:text-white/60">
                          {ticket.id}
                        </span>
                        <Badge
                          className={
                            ticket.status === "open"
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                              : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                          }
                        >
                          {ticket.status === "open" ? "Open" : "Resolved"}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm text-[#1a2240] dark:text-white">
                        {ticket.subject}
                      </h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#4e5a7e] dark:text-white/50">
                    <span>Created: {ticket.createdAt}</span>
                    <span>Updated: {ticket.lastUpdate}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/40 dark:border-white/10">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#1a2240] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/5"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
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
