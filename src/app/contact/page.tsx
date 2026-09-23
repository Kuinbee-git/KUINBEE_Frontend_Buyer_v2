import type { Metadata } from "next";
import { generateMetadata } from "@/core/config";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { ContactForm } from "./contact-form";
import { SupplierEnquiryForm } from "../supplier-resources/components/supplier-enquiry-form";

export const metadata: Metadata = generateMetadata({
  title: "Contact Us",
  description:
    "Talk to Kuinbee about supplying data, request a demo, or tell us what you need.",
  path: "/contact",
});

type ContactPageProps = {
  searchParams: Promise<{ source?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const isSupplierEnquiry = (await searchParams).source === "supplier";

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      {isSupplierEnquiry ? (
        <main className="pt-24">
          <SupplierEnquiryForm />
        </main>
      ) : (
        <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-20 pt-32 md:grid-cols-2 md:gap-16 md:pt-40">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Contact Kuinbee
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Let’s talk.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Want a demo, have data to share, or need help finding the right
              dataset? Tell us a little about yourself and we’ll get in touch.
            </p>
            <p className="mt-8 text-sm text-muted-foreground">
              Prefer email?{" "}
              <a
                className="font-medium text-foreground underline underline-offset-4"
                href="mailto:ceo@kuinbee.com"
              >
                ceo@kuinbee.com
              </a>
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Have data to supply?{" "}
              <a className="font-medium text-foreground underline underline-offset-4" href="/contact?source=supplier">
                Tell us about your dataset
              </a>
            </p>
          </div>
          <ContactForm />
        </main>
      )}
      <LandingFooter />
    </div>
  );
}
