"use client";

import { useEffect, useRef, useState } from "react";
import { SupplierTestimonialsBlock } from "@/features/landing/components/CustomerTestimonialsSection";

export function SuppliersTestimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="supplier-page-testimonials"
      className={`relative overflow-hidden py-16 transition-opacity duration-1000 md:py-24 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.025] to-background dark:from-[#0a0f1e] dark:via-[#1a2240]/20 dark:to-[#0a0f1e]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_68%_34%,rgba(26,34,64,0.045),transparent_50%)] dark:bg-[radial-gradient(circle_at_68%_34%,rgba(255,255,255,0.025),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <SupplierTestimonialsBlock
          id="supplier-resources-testimonials"
          showDivider={false}
        />
      </div>
    </section>
  );
}
