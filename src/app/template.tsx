import { ReactNode } from "react";

/**
 * Next.js template.tsx — re-mounted on every navigation by the framework.
 * Uses a CSS-only fade-in animation — no client-side JS needed.
 * This keeps the template as a server component, avoiding a client boundary
 * that would inflate RSC payloads for every page.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
}
