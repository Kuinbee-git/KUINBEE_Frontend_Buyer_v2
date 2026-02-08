"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { FileText, Download, Printer, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface OrderDetailPageProps {
  orderId: string;
}

export function OrderDetailPage({ orderId }: OrderDetailPageProps) {
  // Mock data - replace with actual API call
  const order = {
    id: `ORD-2024-${orderId}`,
    datasetTitle: "US Treasury Bond Yields 2024",
    datasetId: "123",
    purchaseDate: "2024-12-15T10:30:00Z",
    status: "completed",
    paymentMethod: "Credit Card (•••• 4242)",
    billingAddress: {
      name: "John Doe",
      organization: "Acme Corporation",
      email: "john.doe@acme.com",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "United States",
    },
    pricing: {
      subtotal: 299.0,
      tax: 26.91,
      total: 325.91,
    },
    licenseType: "Commercial Use",
    downloadAvailable: true,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-5xl">
        {/* Back Button */}
        <Link href="/orders">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-[#4e5a7e] dark:text-white/70 hover:text-[#1a2240] dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
        </Link>

        {/* Page Header */}
        <div className="flex items-start justify-between mb-6 lg:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-8 h-8 text-[#1a2240] dark:text-white" />
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2240] dark:text-white">
                Order Details
              </h1>
            </div>
            <p className="text-sm sm:text-base text-[#4e5a7e] dark:text-white/60">
              {order.id}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Status Banner */}
        {order.status === "completed" && (
          <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 mb-6">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">
                    Order Completed
                  </h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    Your dataset is ready for download
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Dataset Info */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#1a2240] dark:text-white">
                  Dataset Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1a2240] dark:text-white mb-2">
                      {order.datasetTitle}
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                    >
                      {order.licenseType}
                    </Badge>
                  </div>
                  <Separator className="bg-border/50 dark:bg-white/10" />
                  <div className="flex items-center gap-4">
                    <Link href={`/datasets/${order.datasetId}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80"
                      >
                        View Dataset Details
                      </Button>
                    </Link>
                    {order.downloadAvailable && (
                      <Link href={`/library/access/${order.datasetId}`}>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Information */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#1a2240] dark:text-white">
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-1">
                      Name
                    </p>
                    <p className="text-[#1a2240] dark:text-white">
                      {order.billingAddress.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-1">
                      Organization
                    </p>
                    <p className="text-[#1a2240] dark:text-white">
                      {order.billingAddress.organization}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-1">
                      Email
                    </p>
                    <p className="text-[#1a2240] dark:text-white">
                      {order.billingAddress.email}
                    </p>
                  </div>
                  <Separator className="bg-border/50 dark:bg-white/10" />
                  <div>
                    <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-1">
                      Billing Address
                    </p>
                    <p className="text-[#1a2240] dark:text-white leading-relaxed">
                      {order.billingAddress.address}
                      <br />
                      {order.billingAddress.city}, {order.billingAddress.state}{" "}
                      {order.billingAddress.zipCode}
                      <br />
                      {order.billingAddress.country}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#1a2240] dark:text-white">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-1">
                      Purchase Date
                    </p>
                    <p className="text-[#1a2240] dark:text-white">
                      {new Date(order.purchaseDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4e5a7e] dark:text-white/60 mb-1">
                      Payment Method
                    </p>
                    <p className="text-[#1a2240] dark:text-white">
                      {order.paymentMethod}
                    </p>
                  </div>
                  <Separator className="bg-border/50 dark:bg-white/10" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#4e5a7e] dark:text-white/60">
                        Subtotal
                      </span>
                      <span className="text-[#1a2240] dark:text-white">
                        ${order.pricing.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#4e5a7e] dark:text-white/60">Tax</span>
                      <span className="text-[#1a2240] dark:text-white">
                        ${order.pricing.tax.toFixed(2)}
                      </span>
                    </div>
                    <Separator className="bg-border/50 dark:bg-white/10" />
                    <div className="flex justify-between font-bold text-lg">
                      <span className="text-[#1a2240] dark:text-white">Total</span>
                      <span className="text-[#1a2240] dark:text-white">
                        ${order.pricing.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
              <CardHeader>
                <CardTitle className="text-[#1a2240] dark:text-white">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                >
                  {order.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
