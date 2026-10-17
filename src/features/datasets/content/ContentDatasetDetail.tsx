"use client";

import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/core/providers/AuthProvider";
import { useModal } from "@/core/providers";
import { useRouter } from "next/navigation";
import {
  buyerDatasetApi,
  type BuyerAcquisitionOffer,
  type BuyerCatalogueDetail,
} from "@/services/dataset-content.service";
import {
  readContentClaim,
  storeContentClaim,
  clearContentClaim,
  type ContentClaimIntent,
} from "@/lib/content-claim-intent";
import { Button } from "@/shared/components/ui/button";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { ContentDescription, ContentFacts } from "./ContentDescription";
import { BuyerFilePanel } from "./BuyerFilePanel";
import { TableMetadataPanel } from "./TableMetadataPanel";
import { ReferenceViews } from "./ReferenceViews";
import { contentPriceLabel } from "./content-description";
import { QuestionsSection } from "../components/QuestionsSection";
import { ReviewsSection } from "../components/ReviewsSection";

const Checkout = lazy(() =>
  import("../components/razorpay-checkout-flow").then((module) => ({
    default: module.RazorpayCheckoutFlow,
  }))
);
const missing = (error: unknown) =>
  error &&
  typeof error === "object" &&
  "status" in error &&
  error.status === 404;
export function ContentDatasetDetail({
  data,
  onRefresh,
}: {
  data: Extract<BuyerCatalogueDetail, { representation: "CONTENT" }>;
  onRefresh: () => void;
}) {
  const { user, isAuthenticated } = useAuth();
  const { openModal } = useModal();
  const [discussion, setDiscussion] = useState(false);
  const actorId = isAuthenticated ? user?.id : undefined;
  return (
    <div className="min-h-screen relative">
      <div className="relative z-50">
        <NotchNavigation />
      </div>
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>
      <main className="relative mx-auto max-w-7xl px-6 pt-32 pb-16 space-y-6">
        <Link
          href="/datasets"
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to datasets
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold break-words">
              {data.item.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {data.item.owner.name} · {data.item.category.name}
              {data.item.categoryNameOrigin === "CAPTURED_CATEGORY"
                ? " (at submission)"
                : ""}
            </p>
          </div>
          <Button variant="outline" onClick={onRefresh}>
            Refresh listing
          </Button>
        </div>
        <div className="rounded-xl border border-border/50 dark:border-white/10 bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
            <section className="min-w-0 p-5 sm:p-6">
              <h2 className="text-xl font-semibold mb-5">
                About this collection
              </h2>
              <ContentDescription description={data.description} />
              <div className="mt-5">
                <TableMetadataPanel
                  sourceKey={JSON.stringify([
                    data.item.id,
                    data.item.publication.id,
                    data.item.publication.contentId,
                  ])}
                  load={(filters, signal) =>
                    buyerDatasetApi.publicTables(
                      data.item.id,
                      {
                        ...filters,
                        publicationId: data.item.publication.id,
                        contentId: data.item.publication.contentId,
                      },
                      signal
                    )
                  }
                />
                <ReferenceViews
                  includeDictionary={false}
                  sourceKey={JSON.stringify([
                    data.item.id,
                    data.item.publication.id,
                    data.item.publication.contentId,
                  ])}
                  load={(filters, signal) =>
                    buyerDatasetApi.publicReferences(
                      data.item.id,
                      {
                        ...filters,
                        publicationId: data.item.publication.id,
                        contentId: data.item.publication.contentId,
                      },
                      signal
                    )
                  }
                />
              </div>
            </section>
            <aside className="min-w-0 p-5 sm:p-6 border-t lg:border-t-0 lg:border-l border-border/50 dark:border-white/10 space-y-5">
              <h2 className="text-xl font-semibold">Dataset access</h2>
              <p className="font-semibold">{contentPriceLabel(data.item)}</p>
              <AcquisitionControls
                key={actorId ?? "anonymous"}
                data={data}
                actorId={actorId}
              />
              <div className="border-t border-border pt-5 space-y-3">
                <h3 className="font-medium">Recorded assessment</h3>
                <ContentFacts
                  rows={[
                    ["KDTS score", data.item.assessment.score],
                    [
                      "Assessed material",
                      data.item.assessment.components
                        .map((value) =>
                          value === "FULL"
                            ? "Uploaded full material"
                            : "Uploaded sample"
                        )
                        .join(" + "),
                    ],
                  ]}
                />
                <p className="text-xs text-muted-foreground">
                  This assessment concerns uploaded material. The represented
                  collection remains supplier declared. Licensing agreements and
                  other terms are handled outside the platform.
                </p>
              </div>
              <details className="border-t border-border pt-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Current category and source facts
                </summary>
                <div className="mt-3">
                  <ContentFacts
                    rows={[
                      [
                        "Current categories",
                        data.currentCategoryFacts
                          .map((item) => item.name)
                          .join(", "),
                      ],
                      ["Current source", data.currentSourceFacts?.name],
                      [
                        "Current source verification",
                        data.currentSourceFacts
                          ? data.currentSourceFacts.isVerified
                            ? "Recorded as verified"
                            : "Not recorded as verified"
                          : null,
                      ],
                    ]}
                  />
                </div>
              </details>
            </aside>
          </div>
          {data.item.uploadChoice !== "FULL_ONLY" && (
            <section className="p-5 sm:p-6 border-t border-border/50 dark:border-white/10 space-y-4">
              <h2 className="text-xl font-semibold">Sample files</h2>
              <BuyerFilePanel
                audience="SAMPLE"
                datasetId={data.item.id}
                contentId={data.item.publication.contentId}
                publicationId={data.item.publication.id}
              />
            </section>
          )}
        </div>
        <details
          className="rounded-xl border border-border/50 dark:border-white/10 bg-white/90 dark:bg-[#1e2847]/80 p-5"
          onToggle={(event) => setDiscussion(event.currentTarget.open)}
        >
          <summary className="cursor-pointer font-semibold">
            Dataset questions and customer reviews
          </summary>
          {discussion && (
            <div className="mt-5 space-y-6">
              <p className="text-sm text-muted-foreground">
                Questions and customer reviews concern the Dataset listing and
                the experience of using it.
              </p>
              <QuestionsSection
                datasetId={data.item.id}
                isLoggedIn={isAuthenticated}
                onSignIn={() => openModal("login")}
              />
              <ReviewsSection
                datasetId={data.item.id}
                isLoggedIn={isAuthenticated}
                onSignIn={() => openModal("login")}
              />
            </div>
          )}
        </details>
      </main>
    </div>
  );
}

function AcquisitionControls({
  data,
  actorId,
}: {
  data: Extract<BuyerCatalogueDetail, { representation: "CONTENT" }>;
  actorId?: string;
}) {
  const { openModal } = useModal(),
    router = useRouter(),
    client = useQueryClient();
  const { user, isAuthenticated } = useAuth();
  const live = useRef(false),
    flight = useRef(false);
  useLayoutEffect(() => {
    live.current = Boolean(actorId && isAuthenticated && user?.id === actorId);
    return () => {
      live.current = false;
    };
  }, [actorId, isAuthenticated, user?.id]);
  const [offer, setOffer] = useState<BuyerAcquisitionOffer | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null),
    [checkout, setCheckout] = useState(false);
  const intentKey = ["dataset-claim-intent", actorId, data.item.id];
  const retained = useQuery({
    queryKey: intentKey,
    enabled: Boolean(actorId),
    retry: false,
    gcTime: 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: () => readContentClaim(actorId!, data.item.id),
  });
  const owned = useQuery({
    queryKey: ["library", "content-0.21", actorId, "lookup", data.item.id],
    enabled: Boolean(actorId),
    retry: false,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    queryFn: async ({ signal }) => {
      try {
        return await buyerDatasetApi.libraryItem(data.item.id, signal);
      } catch (problem) {
        if (missing(problem)) return null;
        throw problem;
      }
    },
  });
  function current() {
    if (!live.current || !actorId)
      throw new Error("Sign in again before requesting access.");
  }
  async function perform(task: () => Promise<void>) {
    if (flight.current) return;
    flight.current = true;
    setBusy(true);
    setError(null);
    try {
      current();
      await task();
    } catch (problem) {
      setError(getErrorMessage(problem));
    } finally {
      flight.current = false;
      setBusy(false);
    }
  }
  function clear(intent: ContentClaimIntent) {
    current();
    clearContentClaim(intent);
    client.setQueryData(intentKey, null);
  }
  async function checkRecorded(intent: ContentClaimIntent) {
    try {
      const result = await buyerDatasetApi.libraryItem(data.item.id);
      current();
      if (
        result.item.representation === "CONTENT" &&
        result.item.material?.contentId === intent.expectedTarget.contentId
      ) {
        clear(intent);
        router.push(`/library/access/${data.item.id}`);
        return true;
      }
      throw new Error(
        "Your library has a different recorded access for this Dataset. Open that record before continuing."
      );
    } catch (problem) {
      if (missing(problem)) return false;
      throw problem;
    }
  }
  const reviewOffer = () =>
    perform(async () => {
      if (retained.data)
        throw new Error(
          "Check the previous claim before reviewing a different offer."
        );
      const result = await buyerDatasetApi.offer(data.item.id);
      current();
      setOffer(result);
    });
  const claim = () =>
    perform(async () => {
      const intent =
        retained.data ??
        (offer?.accessFlow === "FREE_CLAIM"
          ? {
              actorId: actorId!,
              datasetId: data.item.id,
              expectedTarget: offer.target,
            }
          : null);
      if (!intent) throw new Error("Review the exact free offer first.");
      if (retained.data && (await checkRecorded(intent))) return;
      storeContentClaim(intent);
      client.setQueryData(intentKey, intent);
      await buyerDatasetApi.claim(data.item.id, intent.expectedTarget);
      current();
      clear(intent);
      void client.invalidateQueries({ queryKey: ["library"] });
      void client.invalidateQueries({ queryKey: ["entitlements"] });
      router.push(`/library/access/${data.item.id}`);
    });
  const refreshUnconfirmedOffer = () =>
    perform(async () => {
      if (!retained.data) return;
      if (await checkRecorded(retained.data)) return;
      // Explicitly confirmed absence of a current library record does not assert
      // historical failure. The backend still enforces ownership and exact target.
      clear(retained.data);
      const result = await buyerDatasetApi.offer(data.item.id);
      current();
      setOffer(result);
    });
  const hasFull = data.item.uploadChoice !== "SAMPLE_ONLY";
  const offerChanged =
    offer &&
    (offer.target.contentId !== data.item.publication.contentId ||
      offer.target.publicationId !== data.item.publication.id ||
      offer.target.pricingVersionId !==
        data.item.purchase.pricingReference?.id ||
      offer.target.pricingRevision !==
        data.item.purchase.pricingReference?.revision ||
      Number(offer.target.amount) !==
        Number(data.item.purchase.pricing?.finalAmount ?? NaN) ||
      offer.target.currency !== data.item.purchase.pricing?.currency);
  return (
    <div className="space-y-4">
      {!hasFull && (
        <p className="text-sm text-muted-foreground">
          This listing displays a sample. No full dataset is available to claim
          or purchase.
        </p>
      )}
      {!actorId ? (
        <Button variant="outline" onClick={() => openModal("login")}>
          Sign in {hasFull ? "to review access" : "to view sample files"}
        </Button>
      ) : (
        <>
          {error && <p role="alert">{error}</p>}
          {retained.isError && (
            <p role="alert">{getErrorMessage(retained.error)}</p>
          )}
          {owned.isError && (
            <div className="space-y-2">
              <p role="alert">
                Your recorded access could not be checked.{" "}
                {getErrorMessage(owned.error)}
              </p>
              <Button variant="outline" onClick={() => void owned.refetch()}>
                Retry access check
              </Button>
            </div>
          )}
          {owned.data && (
            <div className="space-y-2">
              <p className="text-sm">
                Your library contains recorded access for this Dataset. Its
                material can differ from the current listing.
              </p>
              <Link
                className="text-sm underline"
                href={`/library/access/${data.item.id}`}
              >
                View your recorded access
              </Link>
            </div>
          )}
          {hasFull && retained.data ? (
            <div className="space-y-3">
              <p className="text-sm">
                A previous free claim is unconfirmed. Check your library and, if
                absent, retry the same selected offer. No new offer is
                substituted automatically.
              </p>
              <Button disabled={busy} onClick={claim}>
                Check previous claim
              </Button>
              <Button
                variant="outline"
                disabled={busy}
                onClick={refreshUnconfirmedOffer}
              >
                Check library and review current offer
              </Button>
            </div>
          ) : (
            hasFull &&
            !owned.data && (
              <>
                {!offer ? (
                  <Button
                    disabled={
                      busy ||
                      !retained.isSuccess ||
                      owned.isPending ||
                      owned.isError ||
                      data.item.purchase.mode === "UNAVAILABLE"
                    }
                    onClick={reviewOffer}
                  >
                    Review full dataset access
                  </Button>
                ) : (
                  <div className="space-y-3">
                    {offerChanged && (
                      <p role="alert" className="text-sm">
                        The available publication or price changed since this
                        listing loaded. Review the current selected offer below
                        before continuing.
                      </p>
                    )}
                    <ContentFacts
                      rows={[
                        [
                          "Current offer",
                          offer.accessFlow === "FREE_CLAIM"
                            ? "Free full dataset"
                            : `${offer.target.currency} ${offer.target.amount}`,
                        ],
                        ["Selected material", "Uploaded full dataset"],
                        [
                          "Current base amount",
                          `${offer.target.currency} ${offer.baseAmount}`,
                        ],
                        [
                          "Discount",
                          offer.discountAmount
                            ? `${offer.target.currency} ${offer.discountAmount}`
                            : "None",
                        ],
                      ]}
                    />
                    <p className="text-xs text-muted-foreground">
                      Access binds the selected publication and price.
                      Availability is checked again when you confirm.
                    </p>
                    <Button
                      disabled={busy || !retained.isSuccess}
                      onClick={
                        offer.accessFlow === "FREE_CLAIM"
                          ? claim
                          : () => setCheckout(true)
                      }
                    >
                      {offer.accessFlow === "FREE_CLAIM"
                        ? "Confirm free full dataset claim"
                        : "Purchase selected full dataset"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={reviewOffer}
                    >
                      Refresh offer
                    </Button>
                  </div>
                )}
              </>
            )
          )}
        </>
      )}
      {offer?.accessFlow === "PAID_CHECKOUT" && checkout && (
        <Suspense fallback={<p role="status">Loading checkout…</p>}>
          <Checkout
            datasetId={data.item.id}
            datasetTitle={data.item.title}
            amount={Number(offer.target.amount)}
            currency={offer.target.currency}
            expectedTarget={offer.target}
            expectedActorId={actorId}
            open={checkout}
            onOpenChange={setCheckout}
            onComplete={() => router.push(`/library/access/${data.item.id}`)}
          />
        </Suspense>
      )}
    </div>
  );
}
