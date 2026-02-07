"use client";

import { Link } from "@/components/router/Link";
import { Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerSections = [
  {
    title: "Platform",
    links: [
      { label: "Dataset Discovery", href: "/datasets" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Data Usage Policy", href: "/data-policy" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Contact Support", href: "/support" },
      { label: "System Status", href: "/status" },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border">
      {/* Background - Consistent with other sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30 dark:from-[#0a0f1e] dark:to-[#0f1729]/50" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 relative z-10">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand section */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Database className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="text-lg font-semibold text-foreground">Kuinbee</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A governed data marketplace for purchasing verified datasets.
            </p>
          </div>

          {/* Footer links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 Kuinbee. All rights reserved.</p>
          <p>Regulated data marketplace platform.</p>
        </div>
      </div>
    </footer>
  );
}
