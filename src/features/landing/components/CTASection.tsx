"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/ui";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { ArrowRight } from "lucide-react";
import { useModal } from "@/core/providers";

export function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { openModal } = useModal();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative overflow-hidden py-16 md:py-24 transition-opacity duration-1000 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Background pattern */}
      <InstitutionalBackground />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-primary dark:text-white md:text-4xl">
          Request Registry Access
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground dark:text-white/60">
          Purchase verified datasets through a controlled, transparent process.
          All transactions are governed, logged, and auditable.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="bg-primary dark:bg-white px-8 text-white dark:text-[#1a2240] hover:bg-primary/90 dark:hover:bg-white/90"
            onClick={() => openModal("signup")}
          >
            Apply for Access
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/20 dark:border-white/20 bg-primary/5 dark:bg-white/5 text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-white/10 backdrop-blur-sm"
            onClick={() => openModal("login")}
          >
            Sign In to Registry
          </Button>
        </div>

        <p className="mt-8 text-sm text-muted-foreground/60 dark:text-white/40">
          Identity verification required. Access subject to compliance review.
        </p>
      </div>
    </section>
  );
}
