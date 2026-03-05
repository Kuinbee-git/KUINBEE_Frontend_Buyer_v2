"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center space-y-8"
            >
                {/* Icon */}
                <div className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl font-semibold text-primary dark:text-white tracking-tight">
                        Something Went Wrong
                    </h2>
                    <p className="text-muted-foreground dark:text-white/60 text-[15px] leading-relaxed">
                        An unexpected error occurred. Please try again or contact support if
                        the problem persists.
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground/60 dark:text-white/30 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button
                        onClick={reset}
                        size="lg"
                        className="h-11 px-6 rounded-xl"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="h-11 px-6 rounded-xl"
                    >
                        <Link href="/">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                {/* Support link */}
                <p className="text-sm text-muted-foreground dark:text-white/40">
                    Need help?{" "}
                    <Link
                        href="/support"
                        className="text-primary dark:text-blue-400 underline underline-offset-2 hover:text-primary/80 dark:hover:text-blue-300 transition-colors"
                    >
                        Contact support
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
