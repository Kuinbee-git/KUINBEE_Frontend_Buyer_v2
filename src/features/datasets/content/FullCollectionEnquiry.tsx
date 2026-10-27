"use client";

import { useState } from "react";
import { useAuth } from "@/core/providers/AuthProvider";
import { useModal } from "@/core/providers";
import { useInquireDataset } from "@/hooks/api/useMarketplace";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import type { ContentCatalogueCard } from "./content-description";

export function FullCollectionEnquiry({
  item,
}: {
  item: ContentCatalogueCard;
}) {
  const { isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const mutation = useInquireDataset();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (item.fullCollectionOffer?.mode !== "PAID_ON_REQUEST") return null;
  function start() {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    setError(null);
    setOpen(true);
  }
  return (
    <div className="space-y-3" data-full-collection-enquiry>
      <p className="text-sm text-muted-foreground">
        The sample is free. Full-collection access is paid; price and license
        terms are available on enquiry.
      </p>
      <Button className="w-full" onClick={start}>
        Enquire for full dataset price
      </Button>
      {sent && (
        <p role="status" className="text-sm">
          Your enquiry has been sent to Kuinbee.
        </p>
      )}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!mutation.isPending) setOpen(value);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enquire for full dataset price</DialogTitle>
            <DialogDescription>{item.title}</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              if (mutation.isPending) return;
              setError(null);
              try {
                await mutation.mutateAsync({
                  datasetId: item.id,
                  message:
                    message.trim() ||
                    "Please share pricing, available scope and license terms for the full collection.",
                });
                setSent(true);
                setOpen(false);
                setMessage("");
              } catch (caught) {
                setError(
                  getErrorMessage(caught) ||
                    "Your enquiry could not be sent. Please try again."
                );
              }
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="full-collection-enquiry-message">
                Your requirements (optional)
              </Label>
              <Textarea
                id="full-collection-enquiry-message"
                maxLength={2_000}
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Describe the projects, formats, intended use and delivery scope you need."
              />
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full"
            >
              {mutation.isPending ? "Sending enquiry…" : "Send enquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
