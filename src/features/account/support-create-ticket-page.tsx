"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCreateTicket } from "@/hooks/api/useSupport";
import { toast } from "sonner";
import type { TicketCategory } from "@/types";

export function SupportCreateTicketPage() {
  const router = useRouter();
  const createTicketMutation = useCreateTicket();
  const [formData, setFormData] = useState({
    subject: "",
    category: "" as TicketCategory | "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }

    try {
      await createTicketMutation.mutateAsync({
        subject: formData.subject,
        message: formData.message,
        category: formData.category as TicketCategory,
      });
      
      toast.success("Support ticket created successfully");
      router.push("/support");
    } catch (err) {
      toast.error("Failed to create ticket");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-3xl">
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

        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2240] dark:text-white mb-2">
            Create Support Ticket
          </h1>
          <p className="text-sm sm:text-base text-[#4e5a7e] dark:text-white/60">
            Describe your issue and our team will help you resolve it
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardHeader>
              <CardTitle className="text-[#1a2240] dark:text-white">
                Ticket Information
              </CardTitle>
              <CardDescription className="text-[#4e5a7e] dark:text-white/60">
                Please provide as much detail as possible to help us assist you better
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject */}
              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-[#1a2240] dark:text-white font-medium"
                >
                  Subject *
                </Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your issue"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  required
                  className="bg-white dark:bg-[#0f1729] border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e] dark:placeholder:text-white/50"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-[#1a2240] dark:text-white font-medium"
                >
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  required
                >
                  <SelectTrigger className="bg-white dark:bg-[#0f1729] border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DATASET">Dataset Issues</SelectItem>
                    <SelectItem value="BILLING">Billing & Payments</SelectItem>
                    <SelectItem value="ACCOUNT">Account Management</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-[#1a2240] dark:text-white font-medium"
                >
                  Description *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please provide detailed information about your issue, including any error messages, steps to reproduce, and what you've already tried..."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  required
                  rows={8}
                  className="bg-white dark:bg-[#0f1729] border-[#1a2240]/20 dark:border-white/20 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e] dark:placeholder:text-white/50"
                />
                <p className="text-xs text-[#4e5a7e] dark:text-white/50">
                  The more details you provide, the faster we can help you.
                </p>
              </div>

              {/* Help Text */}
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Tips for getting help faster:
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                  <li>Include the dataset name or ID if your issue relates to a specific dataset</li>
                  <li>Describe what you were trying to do when the issue occurred</li>
                  <li>Include any error messages or screenshots if available</li>
                  <li>Mention if this is affecting your ability to meet a deadline</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={createTicketMutation.isPending}
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold"
                >
                  {createTicketMutation.isPending ? (
                    <>Creating...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Ticket
                    </>
                  )}
                </Button>
                <Link href="/support">
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
