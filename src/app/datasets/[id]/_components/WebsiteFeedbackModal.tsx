"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "@/shared/utils/cn";

export type FeedbackSentiment = "great" | "good" | "bad";

interface WebsiteFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onSubmit: (payload: { rating: number; sentiment: FeedbackSentiment }) => Promise<void>;
}

export function WebsiteFeedbackModal({ open, onOpenChange, loading, onSubmit }: WebsiteFeedbackModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [sentiment, setSentiment] = useState<FeedbackSentiment | null>(null);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setSentiment(null);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!sentiment || rating < 1) return;
    await onSubmit({ rating, sentiment });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border border-primary/20 dark:border-white/20 bg-gradient-to-br from-white/95 via-white/92 to-slate-50/95 dark:from-[#1a2240]/95 dark:via-[#242f52]/90 dark:to-[#2d3a5f]/95 backdrop-blur-xl shadow-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white text-xl font-semibold tracking-tight">How was your experience?</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-white/70">
            Rate your claim experience and share quick feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-white/80">Star Rating</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  className="rounded-md p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "w-6 h-6 transition-colors",
                      star <= rating
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-400 dark:text-white/35"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-white/80">Quick Feedback</p>
            <div className="grid grid-cols-3 gap-2">
              {(["great", "good", "bad"] as FeedbackSentiment[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSentiment(value)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                    sentiment === value
                      ? "border-primary/50 bg-primary/10 text-slate-900 dark:border-white/40 dark:bg-white/15 dark:text-white"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-white/20 dark:text-white/75 dark:hover:bg-white/10"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-slate-300 bg-white/70 text-slate-700 hover:bg-slate-100 dark:border-white/25 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !sentiment || rating < 1}
            className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white/20 dark:text-white dark:hover:bg-white/30 border border-transparent dark:border-white/30"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
