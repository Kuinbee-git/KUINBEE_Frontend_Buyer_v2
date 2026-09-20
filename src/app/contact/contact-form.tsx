"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { apiClient } from "@/core/api/client";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

export function ContactForm() {
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const body = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };
    if (!body.name || !body.message) {
      setError("Please enter your name and a message.");
      return;
    }
    submitting.current = true;
    setPending(true);
    setError("");
    try {
      const result = await apiClient.post<{ success: boolean }>(
        "/api/v1/contact",
        body
      );
      if (!result.success) throw new Error("Unexpected response");
      setSubmitted(true);
      form.reset();
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err ? err.code : "";
      setError(
        code === "RATE_LIMITED"
          ? "You’ve submitted several messages. Please try again later or email ceo@kuinbee.com."
          : "We couldn’t submit your message. Please try again or email ceo@kuinbee.com."
      );
    } finally {
      submitting.current = false;
      setPending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      {submitted ? (
        <div role="status" className="space-y-4 py-8">
          <h2 className="text-2xl font-semibold">
            Thank you for reaching out.
          </h2>
          <p className="text-muted-foreground">
            Your message has been submitted. We’ll get back to you at the email
            address you provided.
          </p>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Send another message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" aria-busy={pending}>
          <h2 className="text-xl font-semibold">Send us a message</h2>
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name *</Label>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              maxLength={120}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Email *</Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-company">Company (optional)</Label>
            <Input
              id="contact-company"
              name="company"
              autoComplete="organization"
              maxLength={200}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">Message *</Label>
            <Textarea
              id="contact-message"
              name="message"
              rows={5}
              required
              maxLength={5000}
              disabled={pending}
              placeholder="Tell us what you’re looking for."
            />
          </div>
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            By submitting, you agree that Kuinbee may contact you about your
            enquiry. Read our{" "}
            <Link
              href="/legal-compliance#s2"
              className="underline underline-offset-4"
            >
              privacy information
            </Link>
            .
          </p>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Submitting…" : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}
