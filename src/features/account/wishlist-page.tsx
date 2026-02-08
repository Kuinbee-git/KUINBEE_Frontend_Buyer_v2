"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Heart, Trash2, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";

export function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: "1",
      title: "European Energy Grid Analytics",
      supplier: "European Data Coalition",
      category: "Energy & Utilities",
      price: "$599",
      verified: true,
      reviewed: true,
      description: "Comprehensive energy grid performance and consumption patterns across 27 European nations.",
      addedDate: "2024-12-10",
    },
    {
      id: "2",
      title: "Asia-Pacific Trade Routes 2024",
      supplier: "Global Trade Insights",
      category: "Economics & Trade",
      price: "$449",
      verified: true,
      reviewed: false,
      description: "Detailed shipping routes, cargo volumes, and trade flow analysis for the Asia-Pacific region.",
      addedDate: "2024-12-08",
    },
    {
      id: "3",
      title: "Machine Learning Model Performance Benchmarks",
      supplier: "AI Research Collective",
      category: "Technology & AI",
      price: "$349",
      verified: false,
      reviewed: true,
      description: "Comprehensive benchmarking data for 100+ ML models across various tasks and datasets.",
      addedDate: "2024-12-05",
    },
  ]);

  const handleRemove = (id: string) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9fa] via-white to-[#e8eaf6] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-[#1a2240] dark:text-white" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a2240] dark:text-white">
              My Wishlist
            </h1>
          </div>
          <p className="text-sm sm:text-base text-[#4e5a7e] dark:text-white/60">
            Datasets you're interested in purchasing ({wishlistItems.length} items)
          </p>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {wishlistItems.map((item) => (
              <Card
                key={item.id}
                className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10 hover:border-[#1a2240]/30 dark:hover:border-white/20 transition-all"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#1a2240] dark:text-white mb-2">
                        {item.title}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {item.verified && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs"
                          >
                            Verified
                          </Badge>
                        )}
                        {item.reviewed && (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs"
                          >
                            Reviewed
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardDescription className="text-[#4e5a7e] dark:text-white/60">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4e5a7e] dark:text-white/60">
                        Supplier
                      </span>
                      <span className="text-[#1a2240] dark:text-white font-medium">
                        {item.supplier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4e5a7e] dark:text-white/60">
                        Category
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#4e5a7e] dark:text-white/60">
                        Added
                      </span>
                      <span className="text-[#1a2240] dark:text-white">
                        {new Date(item.addedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-border/50 dark:border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-[#1a2240] dark:text-white">
                          {item.price}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Link href={`/datasets/${item.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-[#1a2240]/30 dark:border-white/20 text-[#4e5a7e] dark:text-white/80 hover:bg-[#1a2240]/5 dark:hover:bg-white/10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border-border/50 dark:border-white/10">
            <CardContent className="py-16">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-[#4e5a7e] dark:text-white/40" />
                <h3 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-2">
                  Your Wishlist is Empty
                </h3>
                <p className="text-[#4e5a7e] dark:text-white/60 mb-6">
                  Start exploring datasets and add them to your wishlist.
                </p>
                <Link href="/datasets">
                  <Button className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240] hover:from-[#2d3a5f] hover:to-[#1a2240] dark:hover:from-white/95 dark:hover:to-white/90 font-semibold">
                    Browse Datasets
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
