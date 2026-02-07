"use client";

import { ReactNode } from "react";
import { Link } from "@/components/router/Link";
import { useRouter } from "next/navigation";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface AuthContainerProps {
  children: ReactNode;
  showBack?: boolean;
}

/**
 * Auth container providing full-screen institutional layout
 * Used by login and signup pages
 */
export function AuthContainer({ children, showBack = true }: AuthContainerProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Institutional background */}
      <InstitutionalBackground />

      {/* Back button - absolute positioned */}
      {showBack && (
        <div className="absolute top-6 left-6 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-background/50 dark:hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      )}

      {/* Main content - centered */}
      <div className="relative flex-1 flex items-center justify-center px-6 py-8">
        {/* Auth card with glassmorphism */}
        <div className="w-full max-w-[440px] rounded-2xl border border-primary/30 dark:border-white/20 bg-background/80 dark:bg-gradient-to-br dark:from-[#1a2240]/80 dark:via-[#242f52]/70 dark:to-[#2d3a5f]/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          {/* Shared header */}
          <div className="mb-6 text-center">
            <Link href="/" className="inline-block mb-2">
              <span className="text-2xl font-semibold text-primary dark:text-white">
                Kuinbee
              </span>
            </Link>
            <div className="text-xs font-medium text-muted-foreground dark:text-white/60 uppercase tracking-wider">
              Data Registry Access
            </div>
          </div>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  );
}
