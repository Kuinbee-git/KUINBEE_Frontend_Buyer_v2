"use client";

import { type FormEvent, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Database,
  Loader2,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { DataRequestBackground } from "@/app/data-request/_components/DataRequestBackground";
import { useAuth } from "@/core/providers/AuthProvider";
import { useModal } from "@/core/providers/ModalProvider";
import {
  useCustomCollectionService,
  useGuestCustomCollectionRequest,
  useOneTapCustomCollectionRequest,
} from "@/hooks/api/useCustomCollection";
import { Button, Input, Label } from "@/shared/components/ui";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/components/ui/alert";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Textarea } from "@/shared/components/ui/textarea";
import type { ApiError, GuestCustomCollectionLeadInput } from "@/types";
import {
  customCollectionCoverUrl,
  missingFieldLabel,
  withOther,
} from "@/features/custom-collection/customCollection.utils";

export default function CustomCollectionServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { data, isLoading, isFetching, error, refetch } =
    useCustomCollectionService(slug);
  const apiError = error as ApiError | null;

  if (isLoading)
    return (
      <PageFrame>
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6">
          <Skeleton className="h-6 w-32" />
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-[16/10] rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </PageFrame>
    );
  if (!data?.service) {
    const isUnavailable = apiError?.status === 410;
    const isMissing = apiError?.status === 404;
    const isLoadFailure = Boolean(apiError && !isUnavailable && !isMissing);

    return (
      <PageFrame>
        <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
          <Database className="mb-4 size-12 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">
            {isUnavailable
              ? "This service is no longer available"
              : isLoadFailure
                ? "We could not load this service"
                : "Service not found"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isUnavailable
              ? "It has been archived and can no longer accept new requests."
              : isLoadFailure
                ? apiError?.message ||
                  "Please check your connection and try again."
                : "The service may have moved or is not publicly available."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isLoadFailure && (
              <Button
                variant="outline"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                {isFetching ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <RefreshCw />
                )}
                Try again
              </Button>
            )}
            <Button asChild>
              <Link href="/data-request/services">
                <ArrowLeft /> Browse services
              </Link>
            </Button>
          </div>
        </div>
      </PageFrame>
    );
  }

  const service = data.service;
  const r = service.publishedRevision;
  return (
    <PageFrame>
      <main>
        <section className="border-b border-border/60 bg-card/35 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
            <Link
              href="/data-request/services"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 size-4" />
              All collection services
            </Link>
            <div className="mt-7 grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border bg-muted shadow-sm">
                {r.coverImage ? (
                  <Image
                    src={customCollectionCoverUrl(r.coverImage.url)}
                    alt={`${r.title} cover`}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Database className="size-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {r.primaryCategory.name}
                  </span>
                  {r.secondaryCategories.slice(0, 2).map((category) => (
                    <span
                      key={category.id}
                      className="rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs text-muted-foreground"
                    >
                      {category.name}
                    </span>
                  ))}
                  <span className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium">
                    <ShieldCheck className="size-3 text-emerald-600" /> Kuinbee
                    reviewed
                  </span>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <SupplierLogo
                    name={service.supplier.displayName}
                    logoUrl={service.supplier.logoUrl}
                  />
                  <div>
                    <p className="text-xs text-muted-foreground">Offered by</p>
                    <p className="text-sm font-semibold">
                      {service.supplier.displayName}
                    </p>
                  </div>
                </div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
                  {r.title}
                </h1>
                <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                  {r.shortDescription}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-sm">
                  <span className="inline-flex items-center">
                    <Clock3 className="mr-2 size-4 text-primary" />
                    Typical turnaround: {r.estimatedTurnaroundMinDays}–
                    {r.estimatedTurnaroundMaxDays} days
                  </span>
                </div>
                <Button
                  size="lg"
                  className="mt-8 w-full sm:w-auto"
                  onClick={() =>
                    document
                      .getElementById("request-service")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Sparkles /> Request this service
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,3fr)_minmax(340px,2fr)]">
          <article className="space-y-10">
            <ContentSection title="About this service" value={r.description} />
            <div className="grid gap-6 sm:grid-cols-2">
              <Capability
                title="Collection methods"
                values={withOther(
                  r.collectionMethods,
                  r.collectionMethodsOther
                )}
              />
              <Capability
                title="Data types"
                values={withOther(r.dataTypes, r.dataTypesOther)}
              />
              <Capability
                title="Industries"
                values={withOther(r.industries, r.industriesOther)}
              />
              <Capability
                title="Geographic coverage"
                values={withOther(r.geographies, r.geographiesOther)}
              />
              <Capability
                title="Languages"
                values={withOther(r.languages, r.languagesOther)}
              />
              <Capability
                title="Delivery formats"
                values={withOther(r.supportedFormats, r.supportedFormatsOther)}
              />
            </div>
            <div className="grid gap-8 border-t pt-8 sm:grid-cols-2">
              <ContentSection
                title="Typical deliverables"
                value={r.deliverables}
              />
              <ContentSection
                title="Quality assurance"
                value={r.qualityAssurance}
              />
            </div>
            {r.complianceNotes && (
              <div className="rounded-2xl border bg-muted/30 p-6">
                <ContentSection
                  title="Compliance and privacy"
                  value={r.complianceNotes}
                />
              </div>
            )}
          </article>
          <RequestPanel slug={slug} serviceTitle={r.title} />
        </section>
      </main>
    </PageFrame>
  );
}

function RequestPanel({
  slug,
  serviceTitle,
}: {
  slug: string;
  serviceTitle: string;
}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { openModal } = useModal();
  const guestRequest = useGuestCustomCollectionRequest(slug);
  const oneTapRequest = useOneTapCustomCollectionRequest(slug);
  const mutation = isAuthenticated ? oneTapRequest : guestRequest;
  const apiError = mutation.error as ApiError | null;
  const missing =
    apiError?.code === "PROFILE_INCOMPLETE" &&
    Array.isArray(apiError.details?.missingFields)
      ? (apiError.details.missingFields as string[])
      : [];

  const submitGuest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    guestRequest.mutate({
      submissionType: "GUEST_FORM",
      fullName: String(values.get("fullName") ?? "").trim(),
      email: String(values.get("email") ?? "").trim(),
      phone: String(values.get("phone") ?? "").trim(),
      organization: String(values.get("organization") ?? "").trim(),
      industry: String(values.get("industry") ?? "").trim(),
      dataDescription: String(values.get("dataDescription") ?? "").trim(),
      preferredFormat: String(values.get("preferredFormat") ?? "").trim(),
      timeline: String(values.get("timeline") ?? "").trim(),
      additionalNotes:
        String(values.get("additionalNotes") ?? "").trim() || undefined,
    } satisfies GuestCustomCollectionLeadInput);
  };

  if (mutation.isSuccess)
    return (
      <aside
        id="request-service"
        className="h-fit scroll-mt-24 rounded-2xl border bg-card p-6 text-center shadow-sm lg:sticky lg:top-24"
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="mt-5 text-xl font-semibold">Request received</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Kuinbee has recorded your interest in {serviceTitle}. Our team will
          review the request and contact you using the details provided.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/data-request/services">Browse more services</Link>
        </Button>
      </aside>
    );

  return (
    <aside
      id="request-service"
      className="h-fit scroll-mt-24 rounded-2xl border bg-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-24"
    >
      <h2 className="text-xl font-semibold">Tell Kuinbee what you need</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This is a project request, not a purchase. Kuinbee will confirm scope,
        feasibility, timing, and pricing with you.
      </p>
      {authLoading ? (
        <Skeleton className="mt-6 h-44" />
      ) : isAuthenticated ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <UserRound className="mt-0.5 size-5 text-primary" />
              <div>
                <p className="text-sm font-medium">
                  Use your verified account details
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your name, email, phone number, and organization will be sent
                  securely with this request.
                </p>
              </div>
            </div>
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => oneTapRequest.mutate()}
            disabled={oneTapRequest.isPending}
          >
            {oneTapRequest.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}{" "}
            Send one-tap request
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-5 flex items-center justify-between rounded-xl border bg-muted/30 p-3 text-sm">
            <span>Already have an account?</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal("login")}
            >
              Sign in
            </Button>
          </div>
          <form onSubmit={submitGuest} className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="fullName" label="Full name" minLength={2} />
              <Field name="email" label="Work email" type="email" />
              <Field
                name="phone"
                label="Phone number"
                type="tel"
                minLength={7}
              />
              <Field name="organization" label="Organization" minLength={2} />
            </div>
            <Field name="industry" label="Industry" />
            <Field
              name="preferredFormat"
              label="Preferred format"
              placeholder="Example: CSV, JSON, API"
            />
            <Field
              name="timeline"
              label="Target timeline"
              placeholder="Example: Within 8 weeks"
            />
            <label className="block space-y-2">
              <Label htmlFor="dataDescription">
                Data requirements <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="dataDescription"
                name="dataDescription"
                rows={5}
                minLength={30}
                maxLength={5000}
                required
                placeholder="Describe the data, population, geography, frequency, volume, and intended use."
              />
            </label>
            <label className="block space-y-2">
              <Label htmlFor="additionalNotes">Additional notes</Label>
              <Textarea
                id="additionalNotes"
                name="additionalNotes"
                rows={3}
                maxLength={3000}
              />
            </label>
            <Button
              className="w-full"
              size="lg"
              disabled={guestRequest.isPending}
            >
              {guestRequest.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Mail />
              )}{" "}
              Submit project request
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By submitting, you agree that Kuinbee may contact you about this
              request.
            </p>
          </form>
        </>
      )}
      {missing.length > 0 && (
        <Alert className="mt-5 border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertTitle>Complete your profile first</AlertTitle>
          <AlertDescription>
            <p>Add: {missing.map(missingFieldLabel).join(", ")}.</p>
            <Button asChild size="sm" className="mt-3">
              <Link
                href={`/account/profile?intent=custom-service-request&returnTo=${encodeURIComponent(`/data-request/services/${slug}`)}`}
              >
                Complete profile
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
      {apiError && missing.length === 0 && (
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>Request not sent</AlertTitle>
          <AlertDescription>
            {apiError.message}
            {apiError.status === 429 && " Please wait before trying again."}
          </AlertDescription>
        </Alert>
      )}
    </aside>
  );
}

function Field({
  name,
  label,
  type = "text",
  minLength,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  minLength?: number;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-2">
      <Label htmlFor={name}>
        {label} <span className="text-destructive">*</span>
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        minLength={minLength}
        maxLength={200}
        placeholder={placeholder}
        required
      />
    </label>
  );
}
function ContentSection({ title, value }: { title: string; value: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold sm:text-2xl">{title}</h2>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted-foreground sm:text-base">
        {value}
      </p>
    </div>
  );
}
function Capability({ title, values }: { title: string; values: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-full border bg-muted/40 px-3 py-1.5 text-xs"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

function SupplierLogo({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-background/70 text-xs font-semibold shadow-sm">
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={`${name} logo`}
          fill
          sizes="40px"
          className="object-contain p-1.5"
          unoptimized
        />
      ) : (
        initials || "S"
      )}
    </span>
  );
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-background">
      <DataRequestBackground />
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <div className="relative z-10 pt-16 sm:pt-20">{children}</div>
      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
}
