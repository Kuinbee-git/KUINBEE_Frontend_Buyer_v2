import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";

export function MarketplaceBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-full max-h-[68rem] overflow-hidden"
    >
      {/* Gradient background with dot pattern */}
      <InstitutionalBackground />

      {/* Radial glow effects - visible brand-colored glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top center glow - light theme */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[900px] blur-3xl opacity-75 dark:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, rgba(71, 85, 105, 0.05) 35%, rgba(51, 65, 85, 0.02) 55%, transparent 75%)",
          }}
        />
        {/* Top center glow - dark theme */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 hidden h-[900px] w-[1100px] -translate-x-1/2 blur-3xl opacity-85 dark:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(26, 34, 64, 0.5) 0%, rgba(45, 58, 95, 0.35) 35%, rgba(26, 34, 64, 0.2) 55%, transparent 75%)",
          }}
        />

        {/* Left side glow - light theme */}
        <div
          className="absolute top-1/3 -left-32 h-[750px] w-[750px] blur-3xl opacity-65 dark:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, rgba(51, 65, 85, 0.04) 40%, rgba(30, 41, 59, 0.02) 60%, transparent 80%)",
          }}
        />
        {/* Left side glow - dark theme */}
        <div
          className="absolute top-1/3 -left-32 hidden h-[750px] w-[750px] blur-3xl opacity-75 dark:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(78, 90, 126, 0.45) 0%, rgba(45, 58, 95, 0.3) 40%, rgba(36, 47, 82, 0.18) 60%, transparent 80%)",
          }}
        />

        {/* Right side glow - light theme */}
        <div
          className="absolute top-1/3 -right-32 h-[750px] w-[750px] blur-3xl opacity-65 dark:hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(100, 116, 139, 0.06) 0%, rgba(71, 85, 105, 0.04) 40%, rgba(51, 65, 85, 0.02) 60%, transparent 80%)",
          }}
        />
        {/* Right side glow - dark theme */}
        <div
          className="absolute top-1/3 -right-32 hidden h-[750px] w-[750px] blur-3xl opacity-75 dark:block"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(45, 58, 95, 0.45) 0%, rgba(78, 90, 126, 0.3) 40%, rgba(26, 34, 64, 0.18) 60%, transparent 80%)",
          }}
        />
      </div>

      {/* Bottom gradient blend for seamless transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent" />
    </div>
  );
}
