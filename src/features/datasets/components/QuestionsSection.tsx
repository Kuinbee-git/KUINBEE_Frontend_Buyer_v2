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
import { MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { useQuestions, useAskQuestion } from "@/hooks/api/useQuestions";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface QuestionsSectionProps {
  datasetId: string;
  isLoggedIn: boolean;
  onSignIn: () => void;
}

/**
 * Questions & Answers section — self-contained.
 * Owns its own data-fetching hooks so they only run when this component mounts
 * (i.e. when the user scrolls near this section).
 */
const QuestionsSectionInner = ({ datasetId, isLoggedIn, onSignIn }: QuestionsSectionProps) => {
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [questionText, setQuestionText] = useState("");

  // Data fetching — deferred until this component mounts
  const { data: questionsData, isLoading: questionsLoading } = useQuestions(datasetId);
  const questions = questionsData?.items || [];

  const askQuestionMutation = useAskQuestion();

  const handleQuestionSubmit = async () => {
    if (!isLoggedIn) {
      onSignIn();
      return;
    }

    if (!questionText.trim()) {
      toast.error("Please enter a question");
      return;
    }

    try {
      await askQuestionMutation.mutateAsync({
        datasetId,
        data: { question: questionText },
      });
      toast.success("Question submitted successfully");
      setIsQuestionDialogOpen(false);
      setQuestionText("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit question");
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-white">
          Questions & Answers
        </h3>
        <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (!isLoggedIn) {
                  onSignIn();
                } else {
                  setQuestionText("");
                  setIsQuestionDialogOpen(true);
                }
              }}
              className="bg-white/90 dark:bg-[#1e2847]/80 border-border/40 dark:border-white/10"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white/95 dark:bg-[#1e2847]/95 backdrop-blur-xl border-border/40 dark:border-white/10">
            <DialogHeader>
              <DialogTitle className="text-foreground dark:text-white">
                Ask a Question
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-white/60">
                Ask about this dataset and the supplier or admin will respond
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                  Your Question
                </label>
                <Textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Ask about dataset coverage, format, update frequency, licensing..."
                  rows={4}
                  className="bg-white dark:bg-[#0f1729] border-border/40 dark:border-white/20 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/50"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsQuestionDialogOpen(false);
                    setQuestionText("");
                  }}
                  className="border-border/40 dark:border-white/20"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleQuestionSubmit}
                  disabled={askQuestionMutation.isPending || !questionText.trim()}
                  className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
                >
                  {askQuestionMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Submit Question
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {questionsLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#1a2240] dark:text-white animate-spin" />
        </div>
      )}

      {/* No Questions */}
      {!questionsLoading && questions.length === 0 && (
        <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground dark:text-white/30" />
          <h4 className="text-lg font-semibold text-foreground dark:text-white mb-2">
            No questions yet
          </h4>
          <p className="text-sm text-muted-foreground dark:text-white/60 mb-4">
            Be the first to ask about this dataset
          </p>
          <Button
            size="sm"
            onClick={() => {
              if (!isLoggedIn) {
                onSignIn();
              } else {
                setIsQuestionDialogOpen(true);
              }
            }}
            className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white dark:to-white/95 text-white dark:text-[#1a2240]"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask the First Question
          </Button>
        </div>
      )}

      {/* Individual Questions */}
      {!questionsLoading && questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q: any) => (
            <div
              key={q.id}
              className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/10">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="text-sm font-semibold text-foreground dark:text-white mb-1">
                      Question
                    </div>
                    <p className="text-sm text-foreground dark:text-white/90 leading-relaxed">
                      {q.question}
                    </p>
                    <span className="text-xs text-muted-foreground dark:text-white/60 mt-1 inline-block">
                      {formatDistanceToNow(new Date(q.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mt-4 pl-4 border-l-2 border-border/40 dark:border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground dark:text-white/60">
                        SUPPLIER
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                      {(q as any).answer || "Awaiting response from supplier..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const QuestionsSection = React.memo(QuestionsSectionInner);
