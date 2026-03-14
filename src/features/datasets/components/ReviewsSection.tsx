"use client";

import React, { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Star, User, Loader2, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useReviews, useCreateReview, useUpdateReview, useDeleteReview } from "@/hooks/api/useReviews";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface ReviewsSectionProps {
  datasetId: string;
  isLoggedIn: boolean;
  onSignIn: () => void;
}

/**
 * Reviews & Ratings section — self-contained.
 * Owns its own data-fetching hooks so they only run when this component mounts
 * (i.e. when the user scrolls near this section).
 */
const ReviewsSectionInner = ({ datasetId, isLoggedIn, onSignIn }: ReviewsSectionProps) => {
  // Dialog / form state
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Data fetching — deferred until this component mounts
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(datasetId);
  const reviews = reviewsData?.items || [];

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Mutations
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  const handleReviewSubmit = async () => {
    if (!isLoggedIn) {
      onSignIn();
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      toast.error("Please select a rating between 1 and 5");
      return;
    }

    try {
      if (editingReviewId) {
        await updateReviewMutation.mutateAsync({
          datasetId,
          reviewId: editingReviewId,
          data: { rating: reviewRating, comment: reviewComment || null },
        });
        toast.success("Review updated successfully");
      } else {
        await createReviewMutation.mutateAsync({
          datasetId,
          data: { rating: reviewRating, comment: reviewComment || null },
        });
        toast.success("Review submitted successfully");
      }

      setIsReviewDialogOpen(false);
      setEditingReviewId(null);
      setReviewRating(5);
      setReviewComment("");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("409") || error.message.includes("ALREADY_REVIEWED")) {
          toast.error("You have already reviewed this dataset. Edit your existing review instead.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to submit review");
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReviewMutation.mutateAsync({ datasetId, reviewId });
      toast.success("Review deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete review");
    }
  };

  const handleEditReview = (review: any) => {
    setEditingReviewId(review.id);
    setReviewRating(review.rating);
    setReviewComment(review.comment || "");
    setIsReviewDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-white">
          Reviews & Ratings
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-semibold text-foreground dark:text-white">
                {averageRating > 0 ? averageRating.toFixed(1) : "No ratings"}
              </span>
            </div>
            <span className="text-sm text-muted-foreground dark:text-white/60">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!isLoggedIn) {
                    onSignIn();
                  } else {
                    setEditingReviewId(null);
                    setReviewRating(5);
                    setReviewComment("");
                    setIsReviewDialogOpen(true);
                  }
                }}
                className="bg-white/90 dark:bg-[#1e2847]/80 border-border/40 dark:border-white/10"
              >
                <Star className="w-4 h-4 mr-2" />
                Write Review
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/95 dark:bg-[#1e2847]/95 backdrop-blur-xl border-border/40 dark:border-white/10">
              <DialogHeader>
                <DialogTitle className="text-foreground dark:text-white">
                  {editingReviewId ? "Edit Review" : "Write a Review"}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground dark:text-white/60">
                  Share your experience with this dataset
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                    Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          className={cn(
                            "h-8 w-8",
                            star <= reviewRating
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground dark:text-white/30",
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                    Comment (optional)
                  </label>
                  <Textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your thoughts about this dataset..."
                    rows={4}
                    className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/50"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsReviewDialogOpen(false);
                      setEditingReviewId(null);
                      setReviewRating(5);
                      setReviewComment("");
                    }}
                    className="border-border/40 dark:border-white/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReviewSubmit}
                    disabled={createReviewMutation.isPending || updateReviewMutation.isPending}
                    className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
                  >
                    {(createReviewMutation.isPending || updateReviewMutation.isPending) && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingReviewId ? "Update Review" : "Submit Review"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Loading State */}
      {reviewsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#1a2240] dark:text-white animate-spin" />
        </div>
      )}

      {/* No Reviews */}
      {!reviewsLoading && reviews.length === 0 && (
        <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-12 text-center">
          <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground dark:text-white/30" />
          <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">
            No reviews yet
          </h4>
          <p className="text-sm text-muted-foreground dark:text-white/60 mb-4">
            Be the first to share your experience with this dataset
          </p>
          <Button
            size="sm"
            onClick={() => {
              if (!isLoggedIn) {
                onSignIn();
              } else {
                setIsReviewDialogOpen(true);
              }
            }}
            className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
          >
            <Star className="w-4 h-4 mr-2" />
            Write the First Review
          </Button>
        </div>
      )}

      {/* Individual Reviews */}
      {!reviewsLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                        {review.authorName}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "h-3.5 w-3.5",
                                star <= review.rating
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground dark:text-white/30",
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground dark:text-white/60">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    {/* Edit/Delete buttons */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditReview(review)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground dark:text-white/60 dark:hover:text-white"
                        title="Edit this review"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteReview(review.id)}
                        disabled={deleteReviewMutation.isPending}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 dark:text-white/60 dark:hover:text-red-400"
                        title="Delete this review"
                      >
                        {deleteReviewMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ReviewsSection = React.memo(ReviewsSectionInner);
