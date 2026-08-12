import type { ReactNode } from "react";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";

export function DataOpportunityShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen">
      <div className="sticky top-0 z-50">
        <NotchNavigation lite />
      </div>

      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      {children}

      <LandingFooter />
    </main>
  );
}
