"use client";

import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
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
import { ContentFacts } from "./ContentDescription";
import {
  DatasetDetailSection,
  MarketplaceContentDescription,
  datasetPanelClass,
} from "./MarketplaceContentDescription";
import { BuyerFilePanel } from "./BuyerFilePanel";
import { FullCollectionEnquiry } from "./FullCollectionEnquiry";
import { TableMetadataPanel } from "./TableMetadataPanel";
import { ReferenceViews } from "./ReferenceViews";
import {
  contentChoiceLabel,
  contentModalityLabels,
  contentPriceLabel,
  physicalBytes,
} from "./content-description";
import { Badge } from "@/shared/components/ui/badge";
import { EntityLogo } from "../components/entity-logo";
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  Database,
  Download,
  Eye,
  FileArchive,
  Lock,
  RefreshCw,
  Star,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { QuestionsSection } from "../components/QuestionsSection";
import { ReviewsSection } from "../components/ReviewsSection";
import {
  EnterpriseDatasetBadge,
  isEnterpriseDataset,
} from "../components/enterprise-dataset-badge";

const LandingFooter = lazy(() =>
  import("@/features/landing/components/LandingFooter").then((module) => ({
    default: module.LandingFooter,
  }))
);

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
  const { openModal, currentModal } = useModal();
  const sampleIntent = useRef<{
    datasetId: string;
    publicationId: string;
  } | null>(null);
  const lenis = useLenis();
  const [discussion, setDiscussion] = useState(false);
  const actorId = isAuthenticated ? user?.id : undefined;
  const item = data.item;
  const hasSample = item.uploadChoice !== "FULL_ONLY";
  const paid =
    item.fullCollectionOffer?.mode === "PAID_ON_REQUEST" ||
    item.purchase.mode === "PAID_CHECKOUT";
  const sampleMaterial = item.materials.find(
    (material) => material.component === "SAMPLE"
  );
  const fullMaterial = item.materials.find(
    (material) => material.component === "FULL"
  );
  const measuredMaterial = sampleMaterial ?? fullMaterial!;
  const scrollToSample = useCallback(() => {
    const target = document.getElementById("dataset-sample-files");
    if (!target) return;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(target, { offset: -112, immediate: true, force: true });
    } else target.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [lenis]);
  useEffect(() => {
    if (currentModal || !sampleIntent.current) return;
    const intent = sampleIntent.current;
    sampleIntent.current = null;
    if (
      actorId &&
      hasSample &&
      intent.datasetId === item.id &&
      intent.publicationId === item.publication.id
    )
      scrollToSample();
  }, [
    actorId,
    currentModal,
    hasSample,
    item.id,
    item.publication.id,
    scrollToSample,
  ]);
  function viewSample() {
    if (!actorId) {
      sampleIntent.current = {
        datasetId: item.id,
        publicationId: item.publication.id,
      };
      openModal("login");
      return;
    }
    scrollToSample();
  }

  return (
    <div className="min-h-screen relative">
      <div className="relative z-50">
        <NotchNavigation lite />
      </div>
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>
      <main className="relative mx-auto max-w-7xl px-6 pt-32 pb-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/datasets"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary dark:hover:text-white"
          >
            <ArrowLeft className="size-4" />
            Back to datasets
          </Link>
          <Button variant="ghost" size="sm" onClick={onRefresh}>
            <RefreshCw className="size-3.5" />
            Refresh listing
          </Button>
        </div>
        <header className="mb-10" data-content-identity>
          <p className="font-mono text-sm text-muted-foreground dark:text-white/60 mb-3">
            {item.datasetUniqueId}
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-primary dark:text-white mb-4 break-words">
            {item.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <EnterpriseDatasetBadge
              categories={[
                item.category.name,
                ...(item.secondaryCategories ?? []).map(
                  (category) => category.name
                ),
              ]}
            />
            <Badge className="bg-gradient-to-r from-[#1a2240] to-[#2d3a5f] dark:from-white/20 dark:to-white/15 text-white border-none px-3 py-1">
              {item.category.name}
            </Badge>
            {(item.secondaryCategories ?? [])
              .filter((category) => !isEnterpriseDataset([category.name]))
              .map((category) => (
                <Badge key={category.id} variant="outline">
                  {category.name}
                </Badge>
              ))}
            <Badge variant="success">
              <CheckCircle2 className="size-3.5" />
              Published
            </Badge>
            {paid && (
              <Badge variant="warning">
                <Lock className="size-3.5" />
                Paid Dataset
              </Badge>
            )}
            {hasSample && (
              <Badge variant="success">
                {item.fullCollectionOffer
                  ? "Free Sample Available"
                  : "Sample Available"}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground dark:text-white/60 mb-4">
            <span className="inline-flex items-center gap-1.5">
              <Star className="size-4 text-amber-500" />
              {item.stats.reviewCount > 0 && Number(item.stats.rating) > 0
                ? `${Number(item.stats.rating).toFixed(1)} (${item.stats.reviewCount} reviews)`
                : "No ratings"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-4" />
              {item.stats.viewCount.toLocaleString()} views
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Download className="size-4" />
              {item.stats.downloadCount.toLocaleString()} downloads
            </span>
          </div>
          <p className="text-base text-muted-foreground dark:text-white/70 max-w-4xl leading-relaxed">
            {item.overview}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {item.tags.length > 0 && (
              <Tag className="size-3.5 text-muted-foreground dark:text-white/50" />
            )}
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-muted/60 dark:bg-white/10 text-muted-foreground dark:text-white/70 px-2.5 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Award className="size-3.5" />
              KDTS {Number(item.assessment.score).toFixed(1)}
            </span>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 items-start">
          <div className="min-w-0 space-y-8">
            <section aria-label="Dataset metrics">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground dark:text-white/60 mb-4">
                Dataset Metrics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatasetMetric
                  icon={Database}
                  label="Data Types"
                  value={contentModalityLabels(item.modalities).join(", ")}
                />
                <DatasetMetric
                  icon={FileArchive}
                  label="Available Material"
                  value={contentChoiceLabel(item.uploadChoice)}
                />
                <DatasetMetric
                  icon={Download}
                  label={
                    sampleMaterial ? "Sample Download" : "Full Dataset Download"
                  }
                  value={`${physicalBytes(measuredMaterial.sizeBytes)} · ${measuredMaterial.fileCount} ${measuredMaterial.fileCount === 1 ? "file" : "files"}`}
                />
                <DatasetMetric
                  icon={Lock}
                  label="License"
                  value={item.license}
                />
              </div>
            </section>
            <MarketplaceContentDescription description={data.description} />
            {item.modalities.includes("TABULAR") && (
              <DatasetDetailSection title="Data Structure">
                <TableMetadataPanel
                  sourceKey={JSON.stringify([
                    item.id,
                    item.publication.id,
                    item.publication.contentId,
                  ])}
                  load={(filters, signal) =>
                    buyerDatasetApi.publicTables(
                      item.id,
                      {
                        ...filters,
                        publicationId: item.publication.id,
                        contentId: item.publication.contentId,
                      },
                      signal
                    )
                  }
                />
                <ReferenceViews
                  includeDictionary={false}
                  sourceKey={JSON.stringify([
                    item.id,
                    item.publication.id,
                    item.publication.contentId,
                  ])}
                  load={(filters, signal) =>
                    buyerDatasetApi.publicReferences(
                      item.id,
                      {
                        ...filters,
                        publicationId: item.publication.id,
                        contentId: item.publication.contentId,
                      },
                      signal
                    )
                  }
                />
              </DatasetDetailSection>
            )}
            {hasSample && (
              <DatasetDetailSection
                title="Sample files"
                id="dataset-sample-files"
              >
                <BuyerFilePanel
                  audience="SAMPLE"
                  datasetId={item.id}
                  contentId={item.publication.contentId}
                  publicationId={item.publication.id}
                />
              </DatasetDetailSection>
            )}
            <DatasetDetailSection title="Governance and Review">
              <div className="space-y-4">
                <ContentFacts
                  rows={[
                    ["KDTS score", Number(item.assessment.score).toFixed(1)],
                    [
                      "Assessed material",
                      item.assessment.components
                        .map((value) =>
                          value === "FULL"
                            ? "Uploaded full material"
                            : "Uploaded sample"
                        )
                        .join(" + "),
                    ],
                  ]}
                />
                <p className="text-sm text-muted-foreground dark:text-white/70 leading-relaxed">
                  The KDTS score covers the uploaded material. Collection scope
                  and coverage are provider declarations. License terms are
                  agreed with the provider.
                </p>
                <details className="border-t border-border/40 dark:border-white/10 pt-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    Current category and source facts
                  </summary>
                  <div className="mt-4">
                    <ContentFacts
                      rows={[
                        [
                          "Current categories",
                          data.currentCategoryFacts
                            .map((category) => category.name)
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
              </div>
            </DatasetDetailSection>
            <details
              className={datasetPanelClass}
              onToggle={(event) => setDiscussion(event.currentTarget.open)}
            >
              <summary className="cursor-pointer font-semibold">
                Dataset questions and customer reviews
              </summary>
              {discussion && (
                <div className="mt-5 space-y-6">
                  <QuestionsSection
                    datasetId={item.id}
                    isLoggedIn={isAuthenticated}
                    onSignIn={() => openModal("login")}
                  />
                  <ReviewsSection
                    datasetId={item.id}
                    isLoggedIn={isAuthenticated}
                    onSignIn={() => openModal("login")}
                  />
                </div>
              )}
            </details>
          </div>
          <aside
            className="order-first lg:order-last min-w-0 lg:sticky lg:top-24 space-y-6"
            aria-label="Dataset access"
            data-content-access
          >
            <div className={datasetPanelClass}>
              <div className="flex items-center gap-2 text-sm font-semibold mb-5">
                <Lock className="size-4" />
                {paid ? "Paid Dataset" : "Dataset Access"}
              </div>
              <div className="border-b border-border/40 dark:border-white/10 pb-5 mb-5">
                <p className="text-2xl font-semibold tracking-tight text-foreground dark:text-white">
                  {item.fullCollectionOffer
                    ? "Price on request"
                    : contentPriceLabel(item)}
                </p>
              </div>
              <FullCollectionEnquiry item={item} />
              {item.uploadChoice !== "SAMPLE_ONLY" && (
                <div className="mt-4">
                  <AcquisitionControls
                    key={actorId ?? "anonymous"}
                    data={data}
                    actorId={actorId}
                  />
                </div>
              )}
              {hasSample && (
                <Button
                  variant="outline"
                  className="w-full mt-4 border-emerald-400/40 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500/10 dark:border-emerald-400/35 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
                  onClick={viewSample}
                >
                  <Download className="size-4" />
                  View{" "}
                  {item.fullCollectionOffer ? "free sample" : "sample files"}
                </Button>
              )}
              {!item.fullCollectionOffer &&
                item.uploadChoice !== "SAMPLE_ONLY" && (
                  <p className="text-xs leading-relaxed text-muted-foreground mt-5">
                    Review the dataset description, license and available
                    material before requesting access.
                  </p>
                )}
            </div>
            <div className={datasetPanelClass}>
              <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-4">
                Provided By
              </p>
              <div className="flex items-start gap-3">
                <EntityLogo
                  name={item.owner.name}
                  logoUrl={item.owner.logoUrl}
                  ownerType={item.owner.type}
                  className="size-12"
                  imageClassName="p-1.5"
                  sizes="48px"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold break-words">
                    {item.owner.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.category.name}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Suspense fallback={null}>
        <LandingFooter />
      </Suspense>
    </div>
  );
}

function DatasetMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/90 dark:bg-[#1e2847]/80 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-white/10">
          <Icon className="size-4 text-primary dark:text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground dark:text-white/60 mb-1">
            {label}
          </p>
          <p className="text-sm font-semibold text-foreground dark:text-white break-words">
            {value}
          </p>
        </div>
      </div>
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
          {data.item.fullCollectionOffer?.mode === "PAID_ON_REQUEST"
            ? "Only the sample is hosted here. Enquire with Kuinbee to arrange access to the paid full collection."
            : "This listing displays a sample. No full dataset is available to claim or purchase."}
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
