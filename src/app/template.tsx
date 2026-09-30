import { ReactNode } from "react";

/**
 * Next.js template.tsx — re-mounted on every navigation by the framework.
 * Render content immediately. An opacity-zero entrance animation hides the
 * entire first paint and excludes initial content from Chrome's LCP candidates.
 * Navigation feedback is handled separately by NavigationProgress.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
