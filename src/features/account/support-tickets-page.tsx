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
import { MessageSquare, Search, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SupportTicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const tickets = [
    {
      id: "TKT-001234",
      subject: "Unable to download dataset",
      status: "open",
      priority: "high",
      createdAt: "2024-12-15",
      lastUpdate: "2 hours ago",
      messages: 3,
    },
    {
      id: "TKT-001198",
      subject: "Question about license terms",
      status: "resolved",
      priority: "normal",
      createdAt: "2024-12-10",
      lastUpdate: "3 days ago",
      messages: 5,
    },
    {
      id: "TKT-001165",
      subject: "Data quality issue in Global Carbon Emissions dataset",
      status: "in-progress",
      priority: "high",
      createdAt: "2024-12-08",
      lastUpdate: "1 day ago",
      messages: 8,
    },
    {
      id: "TKT-001142",
      subject: "Billing inquiry",
      status: "resolved",
      priority: "normal",
      createdAt: "2024-11-28",
      lastUpdate: "2 weeks ago",
      messages: 4,
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      "in-progress": "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      resolved: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
      closed: "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    };

    return (
      <Badge
        variant="outline"
        className={variants[status as keyof typeof variants] || variants.open}
      >
        {status.toUpperCase().replace("-", " ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
      normal: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      low: "bg-gray-100 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700",
    };

    return (
      <Badge
        variant="outline"
        className={variants[priority as keyof typeof variants] || variants.normal}
      >
        {priority.toUpperCase()}
      </Badge>
    );
  };

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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white dark:bg-[#0f1729] border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tickets</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        {tickets.length > 0 ? (
          <div className="space-y-4">
            {tickets.map((ticket) => (
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
                        {ticket.id} · {ticket.messages} messages
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-[#4e5a7e] dark:text-white/60 pt-4 border-t border-border/40 dark:border-white/10">
                    <div className="flex items-center gap-4">
                      <span>Created: {ticket.createdAt}</span>
                      <span>Updated: {ticket.lastUpdate}</span>
                    </div>
                    <Link href={`/support/ticket/${ticket.id.split("-").pop()}`}>
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
            ))}
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
