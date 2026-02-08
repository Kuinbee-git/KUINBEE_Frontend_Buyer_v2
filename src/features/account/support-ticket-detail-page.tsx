"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Separator } from "@/shared/components/ui/separator";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { MessageSquare, Send, ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

interface SupportTicketDetailPageProps {
  ticketId: string;
}

export function SupportTicketDetailPage({ ticketId }: SupportTicketDetailPageProps) {
  const [newMessage, setNewMessage] = useState("");

  // Mock data - replace with actual API call
  const ticket = {
    id: `TKT-001${ticketId}`,
    subject: "Unable to download dataset",
    status: "open",
    priority: "high",
    createdAt: "2024-12-15T10:30:00Z",
    lastUpdate: "2 hours ago",
    category: "Technical Support",
    messages: [
      {
        id: 1,
        author: "John Doe",
        role: "user",
        message:
          "I'm having trouble downloading the US Treasury Bond Yields 2024 dataset. When I click the download button, I get an error message saying 'Access denied'. I've already purchased this dataset.",
        timestamp: "2024-12-15T10:30:00Z",
      },
      {
        id: 2,
        author: "Sarah Support",
        role: "support",
        message:
          "Thank you for contacting us, John. I'm sorry to hear you're experiencing issues with downloading the dataset. Let me look into this for you.",
        timestamp: "2024-12-15T11:00:00Z",
      },
      {
        id: 3,
        author: "Sarah Support",
        role: "support",
        message:
          "I've checked your account and confirmed that you have active access to this dataset. It appears there was a temporary issue with our download service. Could you please try downloading the dataset again? The issue should now be resolved.",
        timestamp: "2024-12-15T11:15:00Z",
      },
    ],
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
      "in-progress": "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
      resolved: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
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
                      Ticket ID: {ticket.id}
                    </CardDescription>
                  </div>
                  {ticket.status === "resolved" && (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Messages */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#1a2240] dark:text-white">
                  Conversation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {ticket.messages.map((message, index) => (
                    <div key={message.id}>
                      <div
                        className={`flex gap-4 ${
                          message.role === "support" ? "flex-row" : "flex-row"
                        }`}
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback
                            className={
                              message.role === "support"
                                ? "bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-[#1a2240] dark:text-white"
                            }
                          >
                            {message.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-[#1a2240] dark:text-white">
                              {message.author}
                            </span>
                            {message.role === "support" && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs"
                              >
                                Support Team
                              </Badge>
                            )}
                            <span className="text-xs text-[#4e5a7e] dark:text-white/50">
                              {new Date(message.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-[#4e5a7e] dark:text-white/70 leading-relaxed">
                            {message.message}
                          </p>
                        </div>
                      </div>
                      {index < ticket.messages.length - 1 && (
                        <Separator className="mt-6 bg-border/50 dark:bg-white/10" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reply */}
            {ticket.status !== "resolved" && (
              <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#1a2240] dark:text-white">
                    Add Reply
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={5}
                      className="bg-white dark:bg-[#0f1729] border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e] dark:placeholder:text-white/50"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
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
                    Priority
                  </p>
                  {getPriorityBadge(ticket.priority)}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                    Category
                  </p>
                  <p className="text-sm text-[#1a2240] dark:text-white">
                    {ticket.category}
                  </p>
                </div>
                <Separator className="bg-border/50 dark:bg-white/10" />
                <div>
                  <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                    Created
                  </p>
                  <p className="text-sm text-[#1a2240] dark:text-white">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-2">
                    Last Updated
                  </p>
                  <p className="text-sm text-[#1a2240] dark:text-white flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {ticket.lastUpdate}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {ticket.status !== "resolved" && (
              <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="text-[#1a2240] dark:text-white">
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark as Resolved
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
