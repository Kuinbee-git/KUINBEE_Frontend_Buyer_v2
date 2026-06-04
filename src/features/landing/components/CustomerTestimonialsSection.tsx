"use client";

import Image from "next/image";
import { Quote, ShieldCheck } from "lucide-react";

const testimonials = [
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

function OneClarityLogo() {
  return (
    <div className="flex h-14 min-w-36 items-center justify-center rounded-lg border border-primary/10 bg-background px-4 shadow-sm dark:border-white/10 dark:bg-white/10">
      <span className="text-xl font-semibold tracking-tight text-black dark:text-white">
        OneClarity
      </span>
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
          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm backdrop-blur-sm dark:border-white/20 dark:bg-white/5 dark:text-white">
            <ShieldCheck className="h-4 w-4" />
            Client Testimonials
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

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.company}
              className="relative flex min-h-[300px] flex-col rounded-xl border border-primary/15 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/25 md:p-8"
            >
              <Quote className="h-9 w-9 text-primary/25 dark:text-white/25" />

              <blockquote className="mt-6 flex-1 text-base leading-8 text-foreground/85 dark:text-white/85">
                "{testimonial.quote}"
              </blockquote>

              <div className="mt-8 border-t border-primary/10 pt-5 dark:border-white/10">
                <div className="flex items-center gap-3">
                  {testimonial.logoSrc ? (
                    <div className="flex h-14 min-w-36 items-center justify-center rounded-lg border border-primary/10 bg-background px-3 shadow-sm dark:border-white/10 dark:bg-white/10">
                      <Image
                        src={testimonial.logoSrc}
                        alt={`${testimonial.company} customer logo | Kuinbee`}
                        width={132}
                        height={61}
                        loading="lazy"
                        className="h-10 w-auto object-contain dark:hidden"
                      />
                      {testimonial.logoDarkSrc && (
                        <Image
                          src={testimonial.logoDarkSrc}
                          alt={`${testimonial.company} customer logo | Kuinbee`}
                          width={150}
                          height={34}
                          loading="lazy"
                          className="hidden h-8 w-auto object-contain dark:block"
                        />
                      )}
                    </div>
                  ) : testimonial.logoType === "oneclarity" ? (
                    <OneClarityLogo />
                  ) : (
                    <OneClarityLogo />
                  )}
                  <div>
                    <p className="font-semibold text-primary dark:text-white">
                      {testimonial.founder}
                    </p>
                    <p className="text-sm text-muted-foreground dark:text-white/60">
                      Founder, {testimonial.company}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground/80 dark:text-white/45">
                      {testimonial.category}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
