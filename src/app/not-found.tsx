"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";

export default function NotFound() {
    return (
        <div className="min-h-screen relative flex items-center justify-center">
            <InstitutionalBackground />

            <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    {/* 404 number */}
                    <div className="relative">
                        <h1 className="text-[120px] sm:text-[160px] font-bold leading-none bg-gradient-to-b from-primary/30 to-primary/5 dark:from-white/20 dark:to-white/5 bg-clip-text text-transparent select-none">
                            404
                        </h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/15 flex items-center justify-center backdrop-blur-sm">
                                <Search className="w-8 h-8 text-primary dark:text-white/80" />
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-3">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-primary dark:text-white tracking-tight">
                            Page Not Found
                        </h2>
                        <p className="text-muted-foreground dark:text-white/60 text-[15px] leading-relaxed max-w-sm mx-auto">
                            The page you&apos;re looking for doesn&apos;t exist or may have been
                            moved. Let&apos;s get you back on track.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button asChild size="lg" className="h-11 px-6 rounded-xl">
                            <Link href="/">
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="h-11 px-6 rounded-xl"
                        >
                            <Link href="/datasets">
                                Browse Datasets
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
