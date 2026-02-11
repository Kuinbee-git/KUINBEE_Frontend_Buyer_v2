"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Download,
  Copy,
  ChevronDown,
  FileText,
  Calendar,
  Building2,
} from "lucide-react";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LIBRARY_SIDEBAR_SECTIONS } from "@/constants/library-sidebar.constants";
import { useLibraryItem, useDownloadUrl } from "@/hooks/api/useLibrary";

// Access states
type AccessStatus = "active" | "expired" | "revoked" | "not-entitled";
type DownloadState = "no-link" | "link-generated" | "error";

interface DatasetAccess {
  id: string;
  datasetUniqueId: string;
  title: string;
  category: string;
  supplierName: string;
  accessType: "free" | "purchased";
  grantedAt: string;
  license: string;
  status: AccessStatus;
  expiresAt?: string;
}

interface DownloadLink {
  url: string;
  expiresAt: string;
  generatedAt: string;
}

interface DatasetAccessPageProps {
  datasetId?: string;
}

export function DatasetAccessPage({ datasetId }: DatasetAccessPageProps) {
  // Fetch dataset access details
  const { 
    data: libraryItemResponse, 
    isLoading: isLoadingItem, 
    error: itemError 
  } = useLibraryItem(datasetId || "");
  
  const [shouldFetchDownload, setShouldFetchDownload] = useState(false);
  
  // Fetch download URL conditionally
  const {
    data: downloadUrlResponse,
    isLoading: isGenerating,
    error: downloadError,
    refetch: regenerateLink
  } = useDownloadUrl(datasetId || "", shouldFetchDownload);

  const libraryItem = libraryItemResponse?.item;
  
  // Map API response to component format
  const datasetAccess: DatasetAccess | null = libraryItem ? {
    id: libraryItem.datasetId,
    datasetUniqueId: "N/A", // API doesn't provide
    title: "N/A", // API doesn't provide
    category: "Unknown", // API doesn't provide
    supplierName: "Unknown", // API doesn't provide
    accessType: libraryItem.accessType === "FREE_CLAIM" ? "free" : "purchased",
    grantedAt: libraryItem.grantedAt,
    license: "Unknown", // API doesn't provide
    status: "active", // Assume active if we can fetch it
  } : null;

  // Loading state
  if (isLoadingItem) {
    return (
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <NotchNavigation />
        </div>
        <div className="fixed inset-0 -z-10">
          <InstitutionalBackground />
        </div>
        <div className="relative pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex justify-center lg:justify-start">
              <MainSectionTabs />
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-sm text-muted-foreground">Loading dataset access...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (itemError || !datasetAccess) {
    return (
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <NotchNavigation />
        </div>
        <div className="fixed inset-0 -z-10">
          <InstitutionalBackground />
        </div>
        <div className="relative pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex justify-center lg:justify-start">
              <MainSectionTabs />
            </div>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Unable to load dataset access</p>
                <p className="text-sm text-muted-foreground">
                  {itemError instanceof Error ? itemError.message : "Dataset not found or you don't have access"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Derive download state
  const downloadState: DownloadState = 
    downloadError ? "error" : 
    downloadUrlResponse ? "link-generated" : 
    "no-link";

  const handleGenerateLink = () => {
    setShouldFetchDownload(true);
  };

  const handleDownload = () => {
    if (downloadUrlResponse?.url) {
      window.open(downloadUrlResponse.url, "_blank");
    }
  };

  const handleRegenerateLink = () => {
    setShouldFetchDownload(false);
    setTimeout(() => {
      regenerateLink();
    }, 100);
  };

  const handleCopyLink = () => {
    if (downloadUrlResponse?.url) {
      navigator.clipboard.writeText(downloadUrlResponse.url);
    }
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: AccessStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 mr-1" />
            Expired
          </Badge>
        );
      case "revoked":
        return (
          <Badge className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            Revoked
          </Badge>
        );
      case "not-entitled":
        return (
          <Badge className="bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800">
            <AlertCircle className="w-3 h-3 mr-1" />
            No Access
          </Badge>
        );
    }
  };

  // Render error states
  if (datasetAccess.status === "not-entitled") {
    return (
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <NotchNavigation />
        </div>
        <div className="fixed inset-0 -z-10">
          <InstitutionalBackground />
        </div>
        <div className="relative pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex justify-center lg:justify-start">
              <MainSectionTabs />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              <aside className="space-y-6 relative">
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 dark:via-white/10 to-transparent hidden lg:block" />
                {LIBRARY_SIDEBAR_SECTIONS.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="rounded-xl overflow-hidden">
                    {section.title && (
                      <div className="px-3 pt-4 pb-2 lg:px-4 lg:pt-5 lg:pb-2">
                        <h3 className="text-xs font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                          {section.title}
                        </h3>
                      </div>
                    )}
                    <div className="space-y-1 px-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </aside>
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                    Dataset Access
                  </h1>
                  <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                    Access details and download controls for this dataset.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    You do not currently have access to this dataset.
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    Access may have been revoked or not yet granted. Please verify your entitlements or contact support.
                  </p>
                  <Link href="/datasets">
                    <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Return to Marketplace
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (datasetAccess.status === "expired") {
    return (
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <NotchNavigation />
        </div>
        <div className="fixed inset-0 -z-10">
          <InstitutionalBackground />
        </div>
        <div className="relative pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex justify-center lg:justify-start">
              <MainSectionTabs />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              <aside className="space-y-6 relative">
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 dark:via-white/10 to-transparent hidden lg:block" />
                {LIBRARY_SIDEBAR_SECTIONS.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="rounded-xl overflow-hidden">
                    {section.title && (
                      <div className="px-3 pt-4 pb-2 lg:px-4 lg:pt-5 lg:pb-2">
                        <h3 className="text-xs font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                          {section.title}
                        </h3>
                      </div>
                    )}
                    <div className="space-y-1 px-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </aside>
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                    Dataset Access
                  </h1>
                  <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                    Access details and download controls for this dataset.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center justify-center mb-6">
                    <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    Your access to this dataset has expired.
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-2 max-w-md leading-relaxed">
                    Access expired on {datasetAccess.expiresAt ? formatDate(datasetAccess.expiresAt) : "N/A"}.
                  </p>
                  <p className="text-sm text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    Please contact support or return to the marketplace for renewal options.
                  </p>
                  <Link href="/library">
                    <Button variant="outline" className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to My Datasets
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (datasetAccess.status === "revoked") {
    return (
      <div className="min-h-screen relative">
        <div className="relative z-50">
          <NotchNavigation />
        </div>
        <div className="fixed inset-0 -z-10">
          <InstitutionalBackground />
        </div>
        <div className="relative pt-32 pb-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex justify-center lg:justify-start">
              <MainSectionTabs />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
              <aside className="space-y-6 relative">
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border/40 dark:via-white/10 to-transparent hidden lg:block" />
                {LIBRARY_SIDEBAR_SECTIONS.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="rounded-xl overflow-hidden">
                    {section.title && (
                      <div className="px-3 pt-4 pb-2 lg:px-4 lg:pt-5 lg:pb-2">
                        <h3 className="text-xs font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                          {section.title}
                        </h3>
                      </div>
                    )}
                    <div className="space-y-1 px-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </aside>
              <div>
                <div className="mb-6">
                  <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                    Dataset Access
                  </h1>
                  <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                    Access details and download controls for this dataset.
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center mb-6">
                    <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    Access has been revoked.
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    Your access to this dataset has been revoked. Please contact support for clarification and further assistance.
                  </p>
                  <Button variant="outline" className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active access state - main content
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

              {LIBRARY_SIDEBAR_SECTIONS.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded-xl overflow-hidden">
                  {section.title && (
                    <div className="px-3 pt-4 pb-2 lg:px-4 lg:pt-5 lg:pb-2">
                      <h3 className="text-xs font-semibold text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider">
                        {section.title}
                      </h3>
                    </div>
                  )}
                  <div className="space-y-1 px-2">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 text-[#4e5a7e] dark:text-white/70 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 hover:text-[#1a2240] dark:hover:text-white"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            {/* Main Content Column */}
            <div>
              {/* Section Title & Description */}
              <div className="mb-6">
                <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Dataset Access
                </h1>
                <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                  Access details and download controls for this dataset.
                </p>
              </div>

              <div className="space-y-6">
                {/* 1. Dataset Identity Block */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-4 sm:p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white">
                          {datasetAccess.title}
                        </h2>
                        {getStatusBadge(datasetAccess.status)}
                      </div>
                      <p className="font-mono text-sm text-[#4e5a7e] dark:text-white/60">
                        {datasetAccess.datasetUniqueId}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 pt-2">
                      <div className="inline-flex items-center gap-2 text-sm bg-[#1a2240]/5 dark:bg-white/5 text-[#1a2240] dark:text-white/70 px-3 py-2 rounded-lg border border-[#1a2240]/10 dark:border-white/10">
                        <FileText className="w-4 h-4" />
                        {datasetAccess.category}
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-800">
                        <Shield className="w-4 h-4" />
                        {datasetAccess.license}
                      </div>
                      <div className="inline-flex items-center gap-2 text-sm bg-[#4e5a7e]/5 dark:bg-white/5 text-[#4e5a7e] dark:text-white/70 px-3 py-2 rounded-lg border border-[#4e5a7e]/10 dark:border-white/10">
                        <Building2 className="w-4 h-4" />
                        {datasetAccess.supplierName}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Access Summary Panel */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white mb-4">
                    Access Summary
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <div className="text-xs font-medium text-[#4e5a7e]/70 dark:text-white/60 uppercase tracking-wider mb-2">
                        Access Type
                      </div>
                      <div className="text-sm text-[#1a2240] dark:text-white font-medium">
                        {datasetAccess.accessType === "purchased" ? "Purchased" : "Free"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-[#4e5a7e]/70 dark:text-white/60 uppercase tracking-wider mb-2">
                        Granted On
                      </div>
                      <div className="text-sm text-[#1a2240] dark:text-white font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#4e5a7e] dark:text-white/60" />
                        {formatDate(datasetAccess.grantedAt)}
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="text-xs font-medium text-[#4e5a7e]/70 dark:text-white/60 uppercase tracking-wider mb-2">
                        License Terms
                      </div>
                      <div className="text-sm text-[#1a2240] dark:text-white font-medium">
                        {datasetAccess.license}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Download Control Section */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white mb-4">
                    Download Control
                  </h3>

                  {downloadState === "no-link" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                              Secure Download System
                            </h4>
                            <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed">
                              Download links are time-limited and expire after 24 hours for security. 
                              Generate a new link when you're ready to download.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleGenerateLink}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold h-11"
                      >
                        {isGenerating ? "Generating..." : "Generate Download Link"}
                      </Button>
                    </div>
                  )}

                  {downloadState === "link-generated" && downloadUrlResponse && (
                    <div className="space-y-4">
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-300 mb-1">
                              Download Link Generated
                            </h4>
                            <p className="text-xs text-emerald-800 dark:text-emerald-400">
                              Your secure download link is ready. This link will expire in 24 hours.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white dark:bg-[#1e2847] rounded-md p-3 border border-emerald-200 dark:border-emerald-800">
                            <div className="text-xs font-medium text-[#4e5a7e]/70 dark:text-white/60 uppercase tracking-wider mb-1">
                              Download URL
                            </div>
                            <div className="font-mono text-xs text-[#1a2240] dark:text-white break-all">
                              {downloadUrlResponse?.url}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[#4e5a7e]/70 dark:text-white/60">Generated:</span>{" "}
                              <span className="text-[#1a2240] dark:text-white">
                                {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-[#4e5a7e]/70 dark:text-white/60">Expires:</span>{" "}
                              <span className="text-[#1a2240] dark:text-white">
                                {downloadUrlResponse?.expiresAt ? new Date(downloadUrlResponse.expiresAt).toLocaleString() : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Button
                          onClick={handleDownload}
                          className="sm:col-span-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:from-emerald-700 hover:to-emerald-800 font-semibold h-11"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Dataset
                        </Button>
                        <Button
                          onClick={handleCopyLink}
                          variant="outline"
                          className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 h-11"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                      </div>
                      <Button
                        onClick={handleRegenerateLink}
                        variant="ghost"
                        className="w-full text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white text-sm"
                      >
                        Generate New Link
                      </Button>
                    </div>
                  )}

                  {downloadState === "error" && (
                    <div className="space-y-4">
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 mb-1">
                              Failed to Generate Link
                            </h4>
                            <p className="text-xs text-red-800 dark:text-red-400 leading-relaxed">
                              There was an error generating your download link. Please try again or contact support if the issue persists.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handleRegenerateLink}
                        variant="outline"
                        className="w-full border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10 h-11"
                      >
                        Try Again
                      </Button>
                    </div>
                  )}
                </div>

                {/* 4. Access Rules & Audit Notes - Collapsible on Mobile */}
                <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-4 sm:p-6">
                  <details className="group">
                    <summary className="cursor-pointer list-none">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white">
                          Access Rules & Compliance
                        </h3>
                        <ChevronDown className="w-5 h-5 text-[#4e5a7e] dark:text-white/60 transition-transform group-open:rotate-180" />
                      </div>
                    </summary>
                    <div className="mt-4 space-y-2 text-sm text-[#4e5a7e] dark:text-white/70 leading-relaxed">
                      <p>• All downloads are logged and auditable for compliance purposes</p>
                      <p>• Dataset may not be redistributed without explicit authorization</p>
                      <p>• Usage is subject to the license terms displayed above</p>
                      <p>• Access can be revoked if terms are violated</p>
                    </div>
                  </details>
                </div>

                {/* Back Link */}
                <div className="pt-4">
                  <Link href="/library">
                    <Button variant="ghost" className="text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to My Datasets
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
