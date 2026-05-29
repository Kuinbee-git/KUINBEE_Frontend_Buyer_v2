import Link from "next/link";
import { ArrowRight, Home, RefreshCw, Wrench } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";

type MaintenancePageProps = {
  searchParams?: Promise<{
    from?: string;
  }>;
};

export default async function MaintenancePage({ searchParams }: MaintenancePageProps) {
  const params = await searchParams;
  const retryHref = params?.from?.startsWith("/") && !params.from.startsWith("//")
    ? params.from
    : "/datasets";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <InstitutionalBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-20">
        <section className="w-full max-w-xl text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-200">
            <Wrench className="h-7 w-7" />
          </div>

          <p className="mb-3 font-mono text-xs text-[#4e5a7e] dark:text-white/60">
            UNDER MAINTENANCE
          </p>
          <h1 className="text-3xl font-semibold text-[#1a2240] dark:text-white sm:text-4xl">
            Marketplace service is temporarily unavailable
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#4e5a7e] dark:text-white/70">
            We are updating part of the platform. Please try again in a few minutes.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-6 rounded-xl">
              <Link href={retryHref}>
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6 rounded-xl">
              <Link href="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          <p className="mt-6 text-sm text-[#4e5a7e] dark:text-white/50">
            Still stuck?{" "}
            <Link
              href="/support"
              className="font-medium text-[#1a2240] underline underline-offset-4 transition-colors hover:text-[#1a2240]/75 dark:text-white dark:hover:text-white/75"
            >
              Contact support
              <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
