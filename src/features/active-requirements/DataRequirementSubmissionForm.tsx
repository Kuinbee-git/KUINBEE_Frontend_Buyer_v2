"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useAuth, useModal } from "@/core/providers";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { submitDataRequirement } from "@/services/data-requirement.service";
import type {
  DataRequirementReceipt,
  DataRequirementSubmission,
} from "@/types/data-requirement.types";
import type { ApiError } from "@/types";

const DRAFT_KEY = "kuinbee:data-requirement:user:v1";
const DRAFT_TTL = 2 * 60 * 60 * 1000;

type FormState = Omit<
  DataRequirementSubmission,
  "formats" | "geographies" | "languages"
> & {
  formats: string;
  geographies: string;
  languages: string;
};

const emptyForm = (): FormState => ({
  clientRequestId: "",
  contactName: "",
  organization: "",
  phone: "",
  title: "",
  industry: "",
  dataType: "",
  description: "",
  intendedUse: "",
  formats: "",
  geographies: "",
  languages: "",
  expectedVolume: "",
  targetDeliveryDate: "",
  budgetRange: "",
  licensingCompliance: "",
  notes: "",
});

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const optional = (value: string | undefined) => value?.trim() || undefined;

export function DataRequirementSubmissionForm() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { openModal } = useModal();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [hydrated, setHydrated] = useState(false);
  const [receipt, setReceipt] = useState<DataRequirementReceipt | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fallback = { ...emptyForm(), clientRequestId: crypto.randomUUID() };
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (!raw) {
        setForm(fallback);
      } else {
        const saved = JSON.parse(raw) as { version: number; savedAt: number; data: FormState };
        setForm(
          saved.version === 1 && Date.now() - saved.savedAt < DRAFT_TTL
            ? { ...fallback, ...saved.data }
            : fallback
        );
      }
    } catch {
      setForm(fallback);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || receipt) return;
    sessionStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ version: 1, savedAt: Date.now(), data: form })
    );
  }, [form, hydrated, receipt]);

  const update = (key: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const validate = () => {
    if (form.contactName.trim().length < 2) return "Enter your contact name.";
    if (form.title.trim().length < 5) return "Enter a clear requirement title.";
    if (!form.industry.trim()) return "Enter the relevant industry.";
    if (!form.dataType.trim()) return "Enter the required data type.";
    if (form.description.trim().length < 50)
      return "Describe the requirement in at least 50 characters.";
    if (form.intendedUse.trim().length < 20)
      return "Describe the intended use in at least 20 characters.";
    if (splitList(form.formats).length > 10) return "Add no more than 10 formats.";
    if (splitList(form.geographies).length > 20)
      return "Add no more than 20 geographies.";
    if (splitList(form.languages).length > 20)
      return "Add no more than 20 languages.";
    return "";
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const result = await submitDataRequirement({
        clientRequestId: form.clientRequestId || crypto.randomUUID(),
        contactName: form.contactName.trim(),
        organization: optional(form.organization),
        phone: optional(form.phone),
        title: form.title.trim(),
        industry: form.industry.trim(),
        dataType: form.dataType.trim(),
        description: form.description.trim(),
        intendedUse: form.intendedUse.trim(),
        formats: splitList(form.formats),
        geographies: splitList(form.geographies),
        languages: splitList(form.languages),
        expectedVolume: optional(form.expectedVolume),
        targetDeliveryDate: optional(form.targetDeliveryDate),
        budgetRange: optional(form.budgetRange),
        licensingCompliance: optional(form.licensingCompliance),
        notes: optional(form.notes),
      });
      sessionStorage.removeItem(DRAFT_KEY);
      setReceipt(result);
    } catch (caught) {
      const apiError = caught as ApiError;
      setError(apiError.message || "We could not submit your requirement. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <div className="data-requirement-form">
        <Card className="mx-auto max-w-2xl border-emerald-500/30 bg-card/95">
          <CardContent className="px-6 py-10 text-center sm:px-10">
            <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-600" aria-hidden="true" />
            <h2 className="mt-5 text-2xl font-semibold text-foreground">
              Requirement submitted
            </h2>
            <p className="mt-3 text-muted-foreground">
              Our team will review the requirement. Keep this reference for your records.
            </p>
            <p className="mx-auto mt-6 w-fit rounded-md bg-emerald-500/10 px-5 py-3 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
              {receipt.referenceCode}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              A confirmation has also been sent to {user?.email}.
            </p>
            <Button
              className="mt-7"
              variant="outline"
              onClick={() => {
                setReceipt(null);
                setForm({ ...emptyForm(), clientRequestId: crypto.randomUUID() });
              }}
            >
              Submit another requirement
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="data-requirement-form grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className="space-y-6">
        <Card className="bg-card/95">
          <CardHeader>
            <CardTitle>Your details</CardTitle>
            <CardDescription>
              Your account email is attached securely and cannot be changed here.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Contact name" required>
              <Input
                value={form.contactName}
                onChange={(event) => update("contactName", event.target.value)}
                maxLength={150}
                required
              />
            </Field>
            <Field label="Account email">
              <Input value={user?.email || (authLoading ? "Checking account…" : "Sign in to submit")} disabled />
            </Field>
            <Field label="Organisation">
              <Input
                value={form.organization}
                onChange={(event) => update("organization", event.target.value)}
                maxLength={200}
              />
            </Field>
            <Field label="Phone">
              <Input
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                maxLength={50}
              />
            </Field>
          </CardContent>
        </Card>

        <Card className="bg-card/95">
          <CardHeader>
            <CardTitle>Requirement</CardTitle>
            <CardDescription>Tell us exactly what data you need and how it will be used.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Requirement title" required className="sm:col-span-2">
              <Input value={form.title} onChange={(event) => update("title", event.target.value)} maxLength={160} required />
            </Field>
            <Field label="Industry" required>
              <Input value={form.industry} onChange={(event) => update("industry", event.target.value)} maxLength={150} required />
            </Field>
            <Field label="Data type" required>
              <Input value={form.dataType} onChange={(event) => update("dataType", event.target.value)} maxLength={150} placeholder="e.g. Speech audio, images, transactions" required />
            </Field>
            <Field label="Detailed description" required className="sm:col-span-2">
              <Textarea value={form.description} onChange={(event) => update("description", event.target.value)} rows={7} maxLength={5000} required />
              <Count value={form.description} min={50} max={5000} />
            </Field>
            <Field label="Intended use" required className="sm:col-span-2">
              <Textarea value={form.intendedUse} onChange={(event) => update("intendedUse", event.target.value)} rows={4} maxLength={2000} required />
              <Count value={form.intendedUse} min={20} max={2000} />
            </Field>
          </CardContent>
        </Card>

        <Card className="bg-card/95">
          <CardHeader>
            <CardTitle>Delivery preferences</CardTitle>
            <CardDescription>Optional details help the team assess the request faster.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Formats" hint="Comma-separated, up to 10">
              <Input value={form.formats} onChange={(event) => update("formats", event.target.value)} placeholder="CSV, JSON, WAV" />
            </Field>
            <Field label="Expected volume">
              <Input value={form.expectedVolume} onChange={(event) => update("expectedVolume", event.target.value)} maxLength={500} placeholder="e.g. 2,000 hours" />
            </Field>
            <Field label="Geographies" hint="Comma-separated">
              <Input value={form.geographies} onChange={(event) => update("geographies", event.target.value)} placeholder="India, United States" />
            </Field>
            <Field label="Languages" hint="Comma-separated">
              <Input value={form.languages} onChange={(event) => update("languages", event.target.value)} placeholder="Hindi, English" />
            </Field>
            <Field label="Target delivery date">
              <Input type="date" value={form.targetDeliveryDate} onChange={(event) => update("targetDeliveryDate", event.target.value)} />
            </Field>
            <Field label="Budget range">
              <Input value={form.budgetRange} onChange={(event) => update("budgetRange", event.target.value)} maxLength={100} />
            </Field>
            <Field label="Licensing or compliance needs" className="sm:col-span-2">
              <Textarea value={form.licensingCompliance} onChange={(event) => update("licensingCompliance", event.target.value)} rows={4} maxLength={2000} />
            </Field>
            <Field label="Additional notes" className="sm:col-span-2">
              <Textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={4} maxLength={3000} />
            </Field>
          </CardContent>
        </Card>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <Card className="bg-card/95">
          <CardHeader>
            <CardTitle>Submit for review</CardTitle>
            <CardDescription>
              This sends one requirement to Kuinbee. It does not create a user-managed listing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Your draft stays in this browser for two hours.</li>
              <li>• The admin team controls review and publication.</li>
              <li>• You receive a confirmation reference only.</li>
            </ul>
            {error ? (
              <p className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <Button className="mt-6 w-full" size="lg" disabled={submitting || authLoading || !hydrated}>
              {submitting ? "Submitting…" : isAuthenticated ? "Submit requirement" : "Sign in to submit"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By submitting, you confirm these details are accurate.
            </p>
          </CardContent>
        </Card>
      </aside>
    </form>
  );
}

function Field({
  label,
  hint,
  required,
  className,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-2 ${className || ""}`}>
      <Label>
        {label}
        {required ? <span className="text-destructive">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Count({ value, min, max }: { value: string; min: number; max: number }) {
  return (
    <p className="text-right text-xs text-muted-foreground">
      {value.length}/{max} {value.length < min ? `(minimum ${min})` : ""}
    </p>
  );
}
