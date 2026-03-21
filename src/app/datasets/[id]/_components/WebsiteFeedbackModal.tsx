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
      <DialogContent className="bg-white/95 dark:bg-[#1e2847]/95 backdrop-blur-xl border-border/40 dark:border-white/10">
        <DialogHeader>
          <DialogTitle className="text-foreground dark:text-white">How was your experience?</DialogTitle>
          <DialogDescription className="text-muted-foreground dark:text-white/60">
            Rate your claim experience and share quick feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-foreground dark:text-white mb-2">Star Rating</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                  className="p-1"
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={cn(
                      "w-6 h-6 transition-colors",
                      star <= rating
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/40 dark:text-white/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground dark:text-white mb-2">Quick Feedback</p>
            <div className="grid grid-cols-3 gap-2">
              {(["great", "good", "bad"] as FeedbackSentiment[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSentiment(value)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors",
                    sentiment === value
                      ? "border-[#4f6ef7] bg-[#eef1fe] text-[#1a2240] dark:border-[#818cf8] dark:bg-[#2a3561] dark:text-white"
                      : "border-border text-muted-foreground hover:bg-muted/60 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !sentiment || rating < 1}
            className="bg-[#4f6ef7] hover:bg-[#3b55d9]"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
