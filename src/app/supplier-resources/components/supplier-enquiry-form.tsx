"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { apiClient } from "@/core/api/client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

const selectClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function SupplierEnquiryForm() {
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [supplierType, setSupplierType] = useState("ORGANIZATION");
  const [requirementRef, setRequirementRef] = useState("");

  useEffect(() => {
    setRequirementRef(new URLSearchParams(window.location.search).get("requirement")?.slice(0, 160) ?? "");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const body = {
      source: "SUPPLIER_RESOURCES",
      name: value("name"),
      email: value("email"),
      phone: value("phone"),
      supplierType: value("supplierType"),
      company: value("company"),
      role: value("role"),
      country: value("country"),
      dataType: value("dataType"),
      dataDescription: value("dataDescription"),
      estimatedVolume: value("estimatedVolume"),
      dataRights: value("dataRights"),
      availability: value("availability"),
      requirementRef: value("requirementRef"),
      message: value("message"),
      website: value("website"),
    };

    submitting.current = true;
    setPending(true);
    setError("");
    try {
      const result = await apiClient.post<{ success: boolean }>("/api/v1/contact", body);
      if (!result.success) throw new Error("Unexpected response");
      setSubmitted(true);
      form.reset();
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? err.code : "";
      setError(code === "RATE_LIMITED"
        ? "You’ve submitted several enquiries. Please try again later or email ceo@kuinbee.com."
        : "We couldn’t submit your enquiry. Please try again or email ceo@kuinbee.com.");
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <section id="supplier-enquiry" className="scroll-mt-24 px-6 py-16 md:py-24" aria-labelledby="supplier-enquiry-heading">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Supplier enquiry</p>
          <h2 id="supplier-enquiry-heading" className="mt-3 text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Tell us about your data</h2>
          <p className="mt-3 text-muted-foreground">Share enough detail for our team to assess your offer and contact you about the next steps.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {submitted ? (
            <div role="status" className="space-y-4 py-8">
              <h3 className="text-2xl font-semibold">Thank you for your enquiry.</h3>
              <p className="text-muted-foreground">Your details have been submitted. We’ll follow up using the contact information you provided.</p>
              <Button variant="outline" onClick={() => setSubmitted(false)}>Send another enquiry</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" aria-busy={pending}>
              <fieldset className="space-y-5" disabled={pending}>
                <legend className="mb-5 text-lg font-semibold">Your contact details</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name *" id="supplier-name"><Input id="supplier-name" name="name" autoComplete="name" required maxLength={120} /></Field>
                  <Field label="Work email *" id="supplier-email"><Input id="supplier-email" name="email" type="email" autoComplete="email" required maxLength={254} /></Field>
                  <Field label="Phone / WhatsApp *" id="supplier-phone"><Input id="supplier-phone" name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={30} placeholder="Include country code" /></Field>
                  <Field label="I’m contacting you as *" id="supplier-type">
                    <select id="supplier-type" name="supplierType" className={selectClassName} value={supplierType} onChange={(event) => setSupplierType(event.target.value)} required>
                      <option value="ORGANIZATION">An organization</option>
                      <option value="INDIVIDUAL">An individual</option>
                    </select>
                  </Field>
                  <Field label={`Organization name${supplierType === "ORGANIZATION" ? " *" : " (optional)"}`} id="supplier-company"><Input id="supplier-company" name="company" autoComplete="organization" required={supplierType === "ORGANIZATION"} maxLength={200} /></Field>
                  <Field label="Your role (optional)" id="supplier-role"><Input id="supplier-role" name="role" autoComplete="organization-title" maxLength={120} /></Field>
                  <Field label="Country *" id="supplier-country"><Input id="supplier-country" name="country" autoComplete="country-name" required minLength={2} maxLength={100} /></Field>
                </div>
              </fieldset>

              <fieldset className="space-y-5 border-t border-border pt-7" disabled={pending}>
                <legend className="text-lg font-semibold">About the data</legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Data type or domain *" id="supplier-data-type"><Input id="supplier-data-type" name="dataType" required minLength={2} maxLength={160} placeholder="e.g. medical imaging, speech, documents" /></Field>
                  <Field label="Estimated volume (optional)" id="supplier-volume"><Input id="supplier-volume" name="estimatedVolume" maxLength={200} placeholder="e.g. 2,000 studies or 500 hours" /></Field>
                </div>
                <Field label="Describe the dataset *" id="supplier-description">
                  <Textarea id="supplier-description" name="dataDescription" rows={5} required minLength={20} maxLength={5000} placeholder="What data do you have, how was it collected, and what coverage or annotations are available?" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Your rights to license this data *" id="supplier-rights">
                    <select id="supplier-rights" name="dataRights" className={selectClassName} required defaultValue="">
                      <option value="" disabled>Select an option</option>
                      <option value="OWNER">I own the data</option>
                      <option value="AUTHORIZED">I’m authorized to license it</option>
                      <option value="TO_CONFIRM">Rights need to be confirmed</option>
                    </select>
                  </Field>
                  <Field label="Availability (optional)" id="supplier-availability"><Input id="supplier-availability" name="availability" maxLength={200} placeholder="e.g. ready now or within 2 weeks" /></Field>
                  <Field label="Related active requirement (optional)" id="supplier-requirement"><Input id="supplier-requirement" name="requirementRef" value={requirementRef} onChange={(event) => setRequirementRef(event.target.value)} maxLength={160} placeholder="e.g. REQ-000016" /></Field>
                </div>
                <Field label="Anything else we should know? (optional)" id="supplier-message"><Textarea id="supplier-message" name="message" rows={3} maxLength={2000} /></Field>
              </fieldset>

              <div className="hidden" aria-hidden="true"><label htmlFor="supplier-website">Leave this field empty</label><input id="supplier-website" name="website" tabIndex={-1} autoComplete="off" /></div>
              <p className="text-xs leading-relaxed text-muted-foreground">Describe your dataset without including personal or patient records. By submitting, you agree that Kuinbee may contact you about your enquiry. Read our <Link href="/legal-compliance#s2" className="underline underline-offset-4">privacy information</Link>.</p>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" disabled={pending} className="w-full sm:w-auto">{pending ? "Submitting…" : "Send supplier enquiry"}</Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>;
}
