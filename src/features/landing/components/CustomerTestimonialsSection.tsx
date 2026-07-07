"use client";

import Image from "next/image";

type CustomerTestimonialBase = {
  founder: string;
  category: string;
  quote: string;
  role?: string;
};

type CustomerTestimonial =
  | (CustomerTestimonialBase & {
      company: string;
      logoSrc: string;
      logoDarkSrc?: string;
      logoType?: never;
      initials?: never;
    })
  | (CustomerTestimonialBase & {
      company: string;
      logoType: "oneclarity";
      logoSrc?: never;
      logoDarkSrc?: never;
      initials?: never;
    })
  | (CustomerTestimonialBase & {
      logoType: "initials";
      initials: string;
      company?: never;
      logoSrc?: never;
      logoDarkSrc?: never;
    });

const testimonials: CustomerTestimonial[] = [
  {
    company: "PolicySalah",
    founder: "Lakshya Jain",
    category: "Lead data sourcing",
    logoSrc: "/policysalah.avif",
    logoDarkSrc: "/policysalah-dark-tight.png",
    quote:
      "For our business development efforts, we needed lead data that was relevant, organized, and usable. Kuinbee's marketplace helped us find the right data source, and their team ensured the data was delivered on time with the quality we expected. It saved us time and gave our outreach team a much clearer starting point.",
  },
  {
    company: "OneClarity",
    founder: "Sanjay Vitkare",
    category: "Data source evaluation",
    logoType: "oneclarity",
    quote:
      "For a product like OneClarity, finding the right data is not just about availability, it is about relevance, quality, and reliability. Kuinbee's marketplace helped us evaluate suitable data sources, connect with the right suppliers, and move through the process in a more structured way. Their team was responsive and delivered within the expected timelines.",
  },
];

type SupplierTestimonial = {
  company: string;
  category: string;
  paragraphs: string[];
  signatory: string;
  role: string;
} & (
  | {
      signType: "text";
      signText: string;
      logoSrc?: never;
    }
  | {
      signType: "logo";
      logoSrc: string;
      signText?: never;
    }
);

const supplierTestimonials: SupplierTestimonial[] = [
  {
    company: "SIOM Technology",
    category: "Supplier market access",
    signType: "text",
    signText: "Siom Technology",
    signatory: "SIOM Technology",
    role: "Verified Supplier",
    paragraphs: [
      "Kuinbee has been a valuable partner for SIOM Technology in taking our data capabilities to the right market.",
      "As a data supplier, having strong data assets is only one part of the challenge. Finding serious clients with real requirements is equally important. Kuinbee helped us bridge that gap by bringing relevant opportunities, understanding client needs clearly, and positioning our data professionally.",
      "Their team made the process smooth across discovery, coordination, and follow-ups. What stood out most was their understanding of both sides of the data business: what suppliers can provide and what AI companies actually need.",
      "We see Kuinbee as a trusted partner for data sourcing and client access.",
    ],
  },
  {
    company: "Debashis Productions",
    category: "Supplier partnership",
    signType: "logo",
    logoSrc: "/dcp-light.png",
    signatory: "Debashish",
    role: "CEO & Founder, Debashis Productions",
    paragraphs: [
      "Working with Kuinbee has been a genuinely positive experience for Debashis Productions.",
      "For a young company, they operate with a level of clarity, maturity, and professionalism that stands out. Every conversation felt structured, expectations were clear, and the overall process was handled with transparency.",
      "What we appreciated most was the seriousness with which Kuinbee treated the partnership. Whether it was communication, coordination, or payment, everything was handled with respect and honesty.",
      "Kuinbee is the kind of company we would be happy to work with again.",
    ],
  },
];

function OneClarityLogo() {
  return (
    <div className="flex h-12 min-w-32 items-center justify-center rounded-lg border border-primary/10 bg-background px-3 shadow-sm dark:border-white/10 dark:bg-white/10">
      <span className="text-lg font-semibold tracking-tight text-black dark:text-white">
        OneClarity
      </span>
    </div>
  );
}

function InitialsLogo({ initials }: { initials: string }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-primary/10 bg-background shadow-sm dark:border-white/10 dark:bg-white/10">
      <span className="text-sm font-semibold tracking-tight text-primary dark:text-white">
        {initials}
      </span>
    </div>
  );
}

function CustomerLogo({ testimonial }: { testimonial: CustomerTestimonial }) {
  if (testimonial.logoSrc) {
    return (
      <div className="flex h-12 min-w-32 items-center justify-center rounded-lg border border-primary/10 bg-background px-3 shadow-sm dark:border-white/10 dark:bg-white/10">
        <Image
          src={testimonial.logoSrc}
          alt={`${testimonial.company} customer logo | Kuinbee`}
          width={132}
          height={61}
          loading="lazy"
          className="h-9 w-auto object-contain dark:hidden"
        />
        {testimonial.logoDarkSrc && (
          <Image
            src={testimonial.logoDarkSrc}
            alt={`${testimonial.company} customer logo | Kuinbee`}
            width={150}
            height={34}
            loading="lazy"
            className="hidden h-7 w-auto object-contain dark:block"
          />
        )}
      </div>
    );
  }

  if ("logoType" in testimonial && testimonial.logoType === "oneclarity") {
    return <OneClarityLogo />;
  }

  if ("logoType" in testimonial && testimonial.logoType === "initials") {
    return <InitialsLogo initials={testimonial.initials} />;
  }

  return null;
}

function SupplierSign({ testimonial }: { testimonial: SupplierTestimonial }) {
  return (
    <div className="flex h-12 min-w-36 items-center justify-center rounded-lg border border-primary/10 bg-background px-3 shadow-sm dark:border-white/10 dark:bg-white/10">
      {testimonial.signType === "logo" ? (
        <Image
          src={testimonial.logoSrc}
          alt={`${testimonial.company} supplier logo | Kuinbee`}
          width={72}
          height={66}
          loading="lazy"
          className="h-9 w-auto object-contain dark:invert"
        />
      ) : (
        <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-primary dark:text-white">
          {testimonial.signText}
        </span>
      )}
    </div>
  );
}

type SupplierTestimonialsBlockProps = {
  id?: string;
  className?: string;
  showDivider?: boolean;
};

export function SupplierTestimonialsBlock({
  id = "supplier-testimonials",
  className = "",
  showDivider = true,
}: SupplierTestimonialsBlockProps) {
  return (
    <div
      id={id}
      className={[
        "scroll-mt-24",
        showDivider ? "border-t border-primary/10 pt-10 dark:border-white/10" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto max-w-2xl text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50 dark:text-white/40">Supplier Testimonials</span>
          <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
        </div>
        <h3 className="text-2xl font-medium tracking-tight text-primary dark:text-white md:text-3xl">
          Suppliers Trust Kuinbee for Market Access
        </h3>
      </div>

      <div className="mx-auto mt-7 grid max-w-5xl gap-4 md:grid-cols-2">
        {supplierTestimonials.map((testimonial) => (
          <article
            key={testimonial.company}
            className="relative flex flex-col rounded-xl border border-primary/10 bg-white/60 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20"
          >
            <blockquote className="flex-1 space-y-3 text-[13px] leading-6 text-foreground/80 dark:text-white/80">
              {testimonial.paragraphs.map((paragraph, index) => (
                <p key={paragraph}>
                  {index === 0 && <>&quot;</>}
                  {paragraph}
                  {index === testimonial.paragraphs.length - 1 && <>&quot;</>}
                </p>
              ))}
            </blockquote>

            <div className="mt-5 border-t border-primary/10 pt-4 dark:border-white/10">
              <div className="flex items-center gap-3">
                <SupplierSign testimonial={testimonial} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary dark:text-white">
                    {testimonial.signatory}
                  </p>
                  <p className="text-xs text-muted-foreground dark:text-white/55">
                    {testimonial.role}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80 dark:text-white/45">
                    {testimonial.category}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export function CustomerTestimonialsSection() {
  return (
    <section
      id="client-testimonials"
      className="relative scroll-mt-24 overflow-hidden py-16 md:py-24"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background dark:from-[#0a0f1e] dark:via-[#1a2240]/20 dark:to-[#0a0f1e]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(26,34,64,0.04),transparent_48%)] dark:bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.025),transparent_48%)]" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/50 dark:text-white/40">Client Testimonials</span>
            <span className="h-px w-8 bg-primary/25 dark:bg-white/20" />
          </div>
          <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl">
            Customers Trust Kuinbee
            <br />
            <span className="text-muted-foreground dark:text-white/70">
              for Relevant, Reliable Data
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground dark:text-white/70 md:text-lg">
            Teams use Kuinbee to find better data sources, evaluate suppliers, and move from discovery to delivery with clearer expectations.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-4xl grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.founder}
              className="relative flex min-h-[320px] flex-col rounded-xl border border-primary/15 bg-white/70 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/25"
            >
              <blockquote className="flex-1 text-sm leading-6 text-foreground/85 dark:text-white/85">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              <div className="mt-5 border-t border-primary/10 pt-4 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <CustomerLogo testimonial={testimonial} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-primary dark:text-white">
                      {testimonial.founder}
                    </p>
                    <p className="truncate text-xs text-muted-foreground dark:text-white/60">
                      {testimonial.role ??
                        ("company" in testimonial
                          ? `Founder, ${testimonial.company}`
                          : testimonial.category)}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/80 dark:text-white/45">
                      {testimonial.category}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <SupplierTestimonialsBlock className="mt-12 md:mt-14 md:pt-12" />
      </div>
    </section>
  );
}
