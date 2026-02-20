"use client";

import { useState } from "react";
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
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ACCOUNT_SIDEBAR_SECTIONS } from "@/shared/components/navigation/section-sidebar";
import { ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCreateTicket } from "@/hooks/api/useSupport";
import { toast } from "sonner";
import type { TicketCategory } from "@/types";

export function SupportCreateTicketPage() {
  const pathname = usePathname();
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
      router.push("/account/support/tickets");
    } catch (err) {
      toast.error("Failed to create ticket");
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
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
            <div className="max-w-2xl">
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

              {/* Section Title & Description */}
              <div className="mb-6">
                <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Create Support Ticket
                </h1>
                <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                  Describe your issue and our team will help you resolve it.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6">
                  <div className="space-y-6">
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
                        className="bg-white dark:bg-[#0f1729] border-border/50 dark:border-white/20 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e] dark:placeholder:text-white/50"
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
                        <SelectTrigger className="bg-white dark:bg-[#0f1729] border-border/50 dark:border-white/20 text-[#1a2240] dark:text-white">
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
                        className="bg-white dark:bg-[#0f1729] border-border/50 dark:border-white/20 text-[#1a2240] dark:text-white placeholder:text-[#4e5a7e] dark:placeholder:text-white/50"
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
                      <Link href="/account/support/tickets">
                        <Button
                          type="button"
                          variant="outline"
                          className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80"
                        >
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
