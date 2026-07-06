interface WorkflowStepProps {
  stepNumber: string;
  title: string;
  description: string;
  progress: "one" | "two" | "three";
}

const progressWidth = {
  one: "w-1/3",
  two: "w-2/3",
  three: "w-full",
};

export function WorkflowStep({ stepNumber, title, description, progress }: WorkflowStepProps) {
  return (
    <div className="relative rounded-xl border border-primary/15 dark:border-white/10 bg-background dark:bg-white/[0.02] p-6 overflow-hidden transition-all duration-200 hover:border-primary/20 dark:hover:border-white/15 hover:shadow-sm flex flex-col">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 dark:via-white/20 to-transparent" />
      {/* Ghost number */}
      <div className="absolute -bottom-3 -right-1 text-[96px] font-black leading-none select-none pointer-events-none text-primary/[0.04] dark:text-white/[0.04] tabular-nums">
        {stepNumber}
      </div>

      <div className="relative flex-1">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-xs font-mono font-semibold text-primary/30 dark:text-white/25 tabular-nums">{stepNumber}</span>
          <span className="h-px w-3 bg-primary/20 dark:bg-white/15 mb-0.5" />
        </div>
        <h3 className="text-base font-semibold text-foreground dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground dark:text-white/60 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative mt-6 h-px bg-primary/8 dark:bg-white/5 rounded-full overflow-hidden">
        <div className={`absolute inset-y-0 left-0 ${progressWidth[progress]} bg-primary/25 dark:bg-white/20 rounded-full`} />
      </div>
    </div>
  );
}
