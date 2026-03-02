"use client";

import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { MainSectionTabs } from "@/shared/components/ui/main-section-tabs";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ACCOUNT_SIDEBAR_SECTIONS } from "@/shared/components/navigation/section-sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, RefreshCw, ArrowRight } from "lucide-react";
import { usePaymentOrders } from "@/hooks/api/usePayments";
import type { PaymentOrderListItem, OrderStatus } from "@/types";

/**
 * ORDERS PAGE (BUYER · FINANCIAL RECORDS)
 * 
 * Purpose: Read-only, auditable record of completed transactions.
 * This is NOT a commerce experience. This is a financial ledger.
 * 
 * Compliance: Follows KUINBEE ACCOUNT & OWNERSHIP DESIGN LANGUAGE AUDIT
 */

export function OrdersPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isLoading, error, refetch } = usePaymentOrders();

  const orders = data?.items ?? [];
  const isEmpty = !isLoading && !error && orders.length === 0;

  const handleViewDetails = (order: PaymentOrderListItem) => {
    router.push(`/order/${order.id}`);
  };

  const formatDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCurrencySymbol = (c: string) => {
    switch (c) {
      case "INR": return "₹";
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      default: return c;
    }
  };

  const formatAmount = (amount: string, currency: string) => {
    return `${getCurrencySymbol(currency)}${parseFloat(amount).toLocaleString()}`;
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
            COMPLETED
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
            PENDING
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800">
            FAILED
          </Badge>
        );
      case "REFUNDED":
        return (
          <Badge className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
            REFUNDED
          </Badge>
        );
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    return (
      <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-2.5 py-1 text-xs font-semibold">
        {method}
      </Badge>
    );
  };

  // Sidebar sections for Account area
  const sidebarSections = ACCOUNT_SIDEBAR_SECTIONS.orders;

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
            {/* Left Sidebar - Navigation (same pattern as Account & Library pages) */}
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
                          className={`block w-full text-left px-3 py-2 min-h-[44px] flex items-center rounded-lg text-sm transition-all duration-200 ${isActive
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
                <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Orders
                </h1>
                <p className="text-sm text-[#4e5a7e] dark:text-white/70">
                  A complete record of your dataset purchases and access grants.
                </p>
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
                          <div className="h-6 w-24 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-5 w-3/4 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                          <div className="h-3 w-1/2 bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-4 w-full bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                          <div className="h-4 w-full bg-[#1a2240]/10 dark:bg-white/10 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {isEmpty && (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-[#1a2240]/5 dark:bg-white/5 border border-[#1a2240]/10 dark:border-white/10 flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-[#4e5a7e] dark:text-white/40" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    No orders yet
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    Your completed dataset purchases will appear here.
                  </p>
                  <Link href="/datasets">
                    <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold shadow-md hover:shadow-lg transition-all">
                      Browse Datasets
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-3 text-center">
                    Unable to load orders
                  </h2>
                  <p className="text-[#4e5a7e] dark:text-white/60 text-center mb-8 max-w-md leading-relaxed">
                    There was an issue retrieving your order history. Please try again.
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

              {/* Data State - Orders List */}
              {!isLoading && !error && orders.length > 0 && (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/50 dark:border-white/10 rounded-xl p-6 hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-all hover:shadow-sm"
                    >
                      {/* Mobile/Tablet Layout */}
                      <div className="lg:hidden space-y-4">
                        {/* Header Row */}
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/50 dark:border-white/10">
                          <div className="flex-1">
                            <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1">
                              Order
                            </div>
                            <div className="font-mono text-sm text-[#4e5a7e] dark:text-white/60">
                              {order.orderNumber}
                            </div>
                          </div>
                          <div>{getStatusBadge(order.status)}</div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1">
                              Payment
                            </div>
                            <div>{getPaymentMethodBadge(order.paymentMethod)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1">
                              Amount
                            </div>
                            <div className="text-sm font-medium text-[#1a2240] dark:text-white">
                              {formatAmount(order.totalAmount, order.currency)}
                            </div>
                          </div>
                        </div>

                        {/* Footer Row */}
                        <div className="flex items-center justify-between pt-4 border-t border-border/50 dark:border-white/10">
                          <div className="text-xs text-[#4e5a7e] dark:text-white/60">
                            {formatDate(order.createdAt)}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white font-medium"
                            onClick={() => handleViewDetails(order)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden lg:grid lg:grid-cols-[140px_1fr_120px_120px_110px_auto] gap-6 items-start">
                        {/* Order Number */}
                        <div>
                          <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1.5">
                            Order
                          </div>
                          <div className="font-mono text-sm text-[#4e5a7e] dark:text-white/60">
                            {order.orderNumber}
                          </div>
                        </div>

                        {/* Date */}
                        <div>
                          <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1.5">
                            Date
                          </div>
                          <div className="text-sm text-[#1a2240] dark:text-white">
                            {formatDate(order.createdAt)}
                          </div>
                          <div className="text-xs text-[#4e5a7e] dark:text-white/60 mt-0.5">
                            {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1.5">
                            Amount
                          </div>
                          <div className="text-sm font-medium text-[#1a2240] dark:text-white">
                            {formatAmount(order.totalAmount, order.currency)}
                          </div>
                        </div>

                        {/* Payment */}
                        <div>
                          <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1.5">
                            Payment
                          </div>
                          <div>{getPaymentMethodBadge(order.paymentMethod)}</div>
                        </div>

                        {/* Status */}
                        <div>
                          <div className="text-xs text-[#4e5a7e]/70 dark:text-white/40 uppercase tracking-wider mb-1.5">
                            Status
                          </div>
                          <div>{getStatusBadge(order.status)}</div>
                        </div>

                        {/* Action */}
                        <div className="flex items-start justify-end pt-5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white font-medium hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
                            onClick={() => handleViewDetails(order)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}