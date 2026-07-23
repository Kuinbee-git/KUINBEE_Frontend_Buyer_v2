import type { ReactNode } from "react";

interface DataRequestSectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function DataRequestSectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: DataRequestSectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : ""} ${className}`}>
      <div
        className={`mb-5 flex items-center gap-3 ${centered ? "justify-center" : ""}`}
      >
        <span className="h-px w-8 bg-primary/30 dark:bg-white/25" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/55 dark:text-white/50">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl font-medium tracking-[-0.025em] text-primary dark:text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-base leading-7 text-muted-foreground dark:text-white/60 ${centered ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
