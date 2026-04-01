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
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";

interface WebsiteFeedbackModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading: boolean;
  onSubmit: (payload: { rating: number; review: string }) => Promise<void>;
}

export function WebsiteFeedbackModal({
  open,
  onOpenChange,
  loading,
  onSubmit,
}: WebsiteFeedbackModalProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setRating(0);
      setReview("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (rating < 1) return;
    await onSubmit({ rating, review: review.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden border border-primary/20 dark:border-white/20 bg-gradient-to-br from-white/95 via-white/92 to-slate-50/95 dark:from-[#1a2240]/95 dark:via-[#242f52]/90 dark:to-[#2d3a5f]/95 backdrop-blur-xl shadow-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            How was your website experience?
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-white/70">
            Rate your experience and share a short review about the website.
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
                      "h-6 w-6 transition-colors",
                      star <= rating ? "fill-amber-500 text-amber-500" : "text-slate-400 dark:text-white/35"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-white/80">Website Review (optional)</p>
            <Textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="Tell us what worked well or what we can improve..."
              rows={4}
              className="resize-none border-slate-300 bg-white/80 text-slate-700 placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-slate-300/50 dark:border-white/25 dark:bg-white/10 dark:text-white dark:placeholder:text-white/45 dark:focus-visible:border-white/40 dark:focus-visible:ring-white/30"
            />
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
            disabled={loading || rating < 1}
            className="border border-transparent bg-slate-900 text-white hover:bg-slate-800 dark:border-white/30 dark:bg-white/20 dark:text-white dark:hover:bg-white/30"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
