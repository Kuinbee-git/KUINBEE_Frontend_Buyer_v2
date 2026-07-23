"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader2, SendHorizontal } from "lucide-react";
import { Button, Input, Label } from "@/shared/components/ui";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { toast } from "sonner";
import { CustomCollectionServicesSection } from "./CustomCollectionServicesSection";
import { CustomSourcingJourney } from "./CustomSourcingJourney";
import { DataRequestBackground } from "./DataRequestBackground";
import { DataRequestHero } from "./DataRequestHero";
import {
  DataRequestQuestionsCta,
  DataUseCasesSection,
  WhyKuinbeeSection,
} from "./DataRequestEditorialSections";
import { DataRequestSectionHeading } from "./DataRequestSectionHeading";

const industries = [
  "Healthcare & Life Sciences",
  "Finance & Banking",
  "Retail & E-Commerce",
  "Technology & IT",
  "Education & Research",
  "Government & Public Sector",
  "Real Estate & Infrastructure",
  "Agriculture & Environment",
  "Manufacturing & Supply Chain",
  "Media & Entertainment",
  "Energy & Utilities",
  "Transportation & Logistics",
  "Other",
];

const dataFormats = [
  "CSV",
  "JSON",
  "Excel (XLSX)",
  "SQL Database Dump",
  "API Access",
  "Parquet",
  "XML",
  "No Preference",
];

const budgetRanges = [
  "Under $500",
  "$500 - $2,000",
  "$2,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
  "Not Sure / Need a Quote",
];

const timelineOptions = [
  "Within 1 week",
  "1 - 2 weeks",
  "2 - 4 weeks",
  "1 - 2 months",
  "3+ months",
  "Flexible / No Rush",
];

const textControlClassName =
  "border-border bg-background text-foreground placeholder:text-muted-foreground/80 focus-visible:border-primary/45 focus-visible:ring-primary/15 focus-visible:ring-offset-0 dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:placeholder:text-white/55 dark:focus-visible:border-white/35 dark:focus-visible:ring-white/15";

const selectControlClassName =
  "border-border bg-background text-foreground data-[placeholder]:text-muted-foreground/80 focus:border-primary/45 focus:ring-primary/15 dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:data-[placeholder]:text-white/55 dark:focus:border-white/35 dark:focus:ring-white/15";

const selectContentClassName =
  "border-border bg-popover text-popover-foreground shadow-xl dark:border-white/15 dark:bg-[#0f1729] dark:text-white";

const selectItemClassName =
  "focus:bg-accent focus:text-accent-foreground dark:focus:bg-white/10 dark:focus:text-white";

interface FormData {
  fullName: string;
  email: string;
  organization: string;
  industry: string;
  dataDescription: string;
  dataFormat: string;
  budgetRange: string;
  timeline: string;
  additionalNotes: string;
}

const initialFormData: FormData = {
  fullName: "",
  email: "",
  organization: "",
  industry: "",
  dataDescription: "",
  dataFormat: "",
  budgetRange: "",
  timeline: "",
  additionalNotes: "",
};

export function DataRequestPageContent() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.industry) newErrors.industry = "Please select an industry";
    if (!formData.dataDescription.trim()) {
      newErrors.dataDescription = "Please describe the data you need";
    } else if (formData.dataDescription.trim().length < 30) {
      newErrors.dataDescription =
        "Please provide at least 30 characters of detail";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Build mailto link with form details
    const subject = `Data Request: ${formData.industry} - ${formData.fullName}`;
    const body = [
      `Name: ${formData.fullName}`,
      `Email: ${formData.email}`,
      `Organization: ${formData.organization || "N/A"}`,
      `Industry: ${formData.industry}`,
      ``,
      `Data Description:`,
      formData.dataDescription,
      ``,
      `Preferred Format: ${formData.dataFormat || "No preference"}`,
      `Budget Range: ${formData.budgetRange || "Not specified"}`,
      `Timeline: ${formData.timeline || "Not specified"}`,
      ``,
      `Additional Notes:`,
      formData.additionalNotes || "None",
    ].join("\n");

    // Simulate brief processing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Open Gmail compose in a new tab
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=info@kuinbee.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");

    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success(
      "Your data request has been prepared. Complete sending it in your email."
    );
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="relative isolate min-h-screen overflow-x-clip bg-background">
      <DataRequestBackground />
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>

      <DataRequestHero />

      <CustomSourcingJourney />

      <DataUseCasesSection />

      <CustomCollectionServicesSection />

      {/* ── Request Form ────────────────────────────────────────── */}
      <section
        id="request-form"
        className="relative z-10 scroll-mt-24 overflow-hidden py-16 md:py-24"
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <DataRequestSectionHeading
            eyebrow="Request form"
            title="Tell us what you need"
            description="Give us enough detail to evaluate feasibility, identify the right sourcing approach, and respond with a useful scope."
            align="center"
            className="mb-10"
          />

          {/* Supplier nudge */}
          <div className="max-w-3xl mx-auto mb-10 flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-card/60 px-5 py-3.5 dark:border-white/10 dark:bg-white/[0.03]">
            <p className="text-sm text-muted-foreground dark:text-white/55">
              Prefer to choose a supplier yourself?
            </p>
            <Link
              href="/data-request/services"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary/80 transition-colors hover:text-primary dark:text-white/70 dark:hover:text-white"
            >
              Browse verified services
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="max-w-3xl mx-auto">
            {isSubmitted ? (
              /* ── Success state ─────────────────────────── */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-medium text-foreground dark:text-white mb-3">
                  Request Prepared
                </h3>
                <p className="text-muted-foreground dark:text-white/60 mb-2 leading-relaxed max-w-lg mx-auto">
                  Your data request details have been composed in a new email
                  window. Please review and hit send to complete your
                  submission.
                </p>
                <p className="text-sm text-muted-foreground dark:text-white/50 mb-8">
                  Our team typically responds within 24 hours.
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:border-white/15 dark:bg-white/[0.055] dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
                >
                  Submit Another Request
                </Button>
              </motion.div>
            ) : (
              /* ── Form ──────────────────────────────────── */
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="space-y-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm dark:border-white/10 md:p-10"
              >
                {/* Contact Details */}
                <div>
                  <h3 className="text-lg font-medium text-foreground dark:text-white mb-1">
                    Contact Details
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-white/50 mb-6">
                    How should we reach you about this request?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label className="text-foreground dark:text-white">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        className={`${textControlClassName} ${errors.fullName ? "border-destructive dark:border-destructive" : ""}`}
                      />
                      {errors.fullName && (
                        <p className="text-destructive text-sm">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground dark:text-white">
                        Email Address{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={`${textControlClassName} ${errors.email ? "border-destructive dark:border-destructive" : ""}`}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground dark:text-white">
                        Organization
                      </Label>
                      <Input
                        placeholder="Company or institution name"
                        value={formData.organization}
                        onChange={(e) =>
                          handleChange("organization", e.target.value)
                        }
                        className={textControlClassName}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground dark:text-white">
                        Industry <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(val) => handleChange("industry", val)}
                      >
                        <SelectTrigger
                          className={`h-10 ${selectControlClassName} ${errors.industry ? "border-destructive dark:border-destructive" : ""}`}
                        >
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent className={selectContentClassName}>
                          {industries.map((ind) => (
                            <SelectItem
                              key={ind}
                              value={ind}
                              className={selectItemClassName}
                            >
                              {ind}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.industry && (
                        <p className="text-destructive text-sm">
                          {errors.industry}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border" />

                {/* Data Requirements */}
                <div>
                  <h3 className="text-lg font-medium text-foreground dark:text-white mb-1">
                    Data Requirements
                  </h3>
                  <p className="text-sm text-muted-foreground dark:text-white/50 mb-6">
                    Be as specific as possible to help us understand your needs.
                  </p>
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Label className="text-foreground dark:text-white">
                        Describe the Data You Need{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        placeholder="E.g. I need a dataset of all active SaaS companies in North America with 50-500 employees, including company name, website, revenue range, employee count, funding stage, and key technologies used. The data should be from the last 12 months."
                        value={formData.dataDescription}
                        onChange={(e) =>
                          handleChange("dataDescription", e.target.value)
                        }
                        className={`min-h-[140px] ${textControlClassName} ${errors.dataDescription ? "border-destructive dark:border-destructive" : ""}`}
                      />
                      {errors.dataDescription && (
                        <p className="text-destructive text-sm">
                          {errors.dataDescription}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="space-y-2">
                        <Label className="text-foreground dark:text-white">
                          Preferred Format
                        </Label>
                        <Select
                          value={formData.dataFormat}
                          onValueChange={(val) =>
                            handleChange("dataFormat", val)
                          }
                        >
                          <SelectTrigger
                            className={`h-10 ${selectControlClassName}`}
                          >
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent className={selectContentClassName}>
                            {dataFormats.map((fmt) => (
                              <SelectItem
                                key={fmt}
                                value={fmt}
                                className={selectItemClassName}
                              >
                                {fmt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground dark:text-white">
                          Budget Range
                        </Label>
                        <Select
                          value={formData.budgetRange}
                          onValueChange={(val) =>
                            handleChange("budgetRange", val)
                          }
                        >
                          <SelectTrigger
                            className={`h-10 ${selectControlClassName}`}
                          >
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent className={selectContentClassName}>
                            {budgetRanges.map((range) => (
                              <SelectItem
                                key={range}
                                value={range}
                                className={selectItemClassName}
                              >
                                {range}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-foreground dark:text-white">
                          Timeline
                        </Label>
                        <Select
                          value={formData.timeline}
                          onValueChange={(val) => handleChange("timeline", val)}
                        >
                          <SelectTrigger
                            className={`h-10 ${selectControlClassName}`}
                          >
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent className={selectContentClassName}>
                            {timelineOptions.map((opt) => (
                              <SelectItem
                                key={opt}
                                value={opt}
                                className={selectItemClassName}
                              >
                                {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground dark:text-white">
                        Additional Notes
                      </Label>
                      <Textarea
                        placeholder="Any other details, compliance requirements, or special instructions..."
                        value={formData.additionalNotes}
                        onChange={(e) =>
                          handleChange("additionalNotes", e.target.value)
                        }
                        className={`min-h-[100px] ${textControlClassName}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-muted-foreground dark:text-white/40 max-w-sm">
                    By submitting, you agree to our privacy policy. We&apos;ll
                    never share your information with third parties.
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full px-10 shadow-sm sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="w-5 h-5 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </section>

      <WhyKuinbeeSection />

      <DataRequestQuestionsCta />

      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
}
