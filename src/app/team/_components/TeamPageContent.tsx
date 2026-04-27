"use client";

import { useState } from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { LandingHeader } from "@/features/landing/components/LandingHeader";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { cn } from "@/shared/utils/cn";

interface TeamMember {
  name: string;
  role: string;
  initials: string;
  imageSrc?: string;
  linkedinUrl?: string;
  displayName?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Aditya Patil",
    displayName: "Aditya Patil",
    role: "Co-Founder & Chief Executive Officer",
    initials: "AP",
    imageSrc: "/aditya.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/aditya-patil-64b87825a/",
  },
  {
    name: "Tamanud Ghule",
    displayName: "Tamanud Ghule",
    role: "Co-Founder, CTO & Head of Product",
    initials: "TG",
    imageSrc: "/tamanud.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/tamanudghule/",
  },
  {
    name: "Viraj Mahadeshwar",
    displayName: "Viraj",
    role: "Co-Founder & Chief Operating Officer",
    initials: "VM",
    imageSrc: "/viraj.png",
    linkedinUrl: "https://www.linkedin.com/in/deshpandeajay",
  },
];

const advisors: TeamMember[] = [
  {
    name: "Ajay Deshpande",
    displayName: "Ajay Deshpande",
    role: "Chief Advisor",
    initials: "AD",
    imageSrc: "/Ajay_2_large.jpg.jpeg",
    linkedinUrl: "https://www.linkedin.com/in/deshpandeajay",
  },
];

function TeamPhoto({ member }: { member: TeamMember }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative h-[250px] w-full overflow-hidden rounded-xl border border-border/50 bg-white/80 shadow-sm dark:bg-transparent dark:border-white/20 dark:bg-white/10">
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center bg-[#1a2240]/5 transition-opacity duration-200 dark:bg-white/10",
          loaded ? "opacity-0" : "opacity-100"
        )}
      >
        <span className="font-mono text-lg font-medium text-[#4e5a7e] dark:text-white/70">
          {member.initials}
        </span>
      </div>

      {!failed && member.imageSrc ? (
        <Image
          src={member.imageSrc}
          alt={member.name}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 240px, 180px"
          className={cn(
            "object-cover transition-all duration-300 group-hover:scale-[1.02]",
            loaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </div>
  );
}

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="group h-auto w-full max-w-[300px] rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-border/50 bg-white dark:bg-transparent dark:border-white/30 dark:bg-gradient-to-br dark:from-white/15 dark:via-white/10 dark:to-white/5 dark:backdrop-blur-xl dark:shadow-2xl flex flex-col">
      <TeamPhoto member={member} />
      <div className="flex flex-1 flex-col items-center justify-center pt-4 text-center">
        <h3 className="text-xl font-semibold tracking-tight text-[#1a2240] dark:text-white">
          {member.displayName || member.name}
        </h3>
        <p className="mt-1 max-w-[240px] text-sm leading-5 text-[#4e5a7e] dark:text-white/70">
          {member.role}
        </p>
      </div>
      {member.linkedinUrl && (
        <div className="flex items-center justify-center pt-4">
          <a
            href={member.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-[#0A66C2]/10 dark:hover:bg-white/10 group/linkedin"
            aria-label={`${member.name}'s LinkedIn profile`}
          >
            <Linkedin className="w-5 h-5 text-[#0A66C2] dark:text-white/50 transition-colors duration-200 group-hover/linkedin:text-[#0A66C2] dark:group-hover/linkedin:text-white/90" />
          </a>
        </div>
      )}
    </article>
  );
}

export function TeamPageContent() {
  return (
    <div className="relative isolate min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 hidden dark:block">
        <InstitutionalBackground />
      </div>
      <div className="pointer-events-none fixed inset-0 -z-10 hidden dark:block bg-[radial-gradient(circle_at_85%_18%,rgba(78,90,126,0.35),transparent_38%),radial-gradient(circle_at_14%_82%,rgba(45,58,95,0.22),transparent_42%)]" />

      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>

      <main>
        <section className="px-6 pb-8 pt-20 md:pb-10 md:pt-24 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Kuinbee Team</p>
            <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight tracking-tight text-[#1a2240] dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Meet the team behind Kuinbee.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#4e5a7e] dark:text-white/70 md:text-lg">
              We are builders, operators, and technologists working to make data discovery and access trusted, simple, and scalable. Together, we are shaping the operating layer for the next generation of digital commerce.
            </p>
            <div className="mt-8 h-px w-full bg-border/80 dark:bg-white/10" />
          </div>
        </section>

        <div className="mx-auto max-w-7xl border-x border-dashed border-[#1a2240]/25 dark:border-white/8">
        <section className="border-y border-dashed border-[#1a2240]/25 px-6 pb-12 pt-7 md:pt-9 lg:px-8 dark:border-white/8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[#1a2240] dark:text-white md:text-4xl">
              Our Leadership
            </h2>

            <div className="mt-8 rounded-xl border border-dashed border-[#1a2240]/25 p-5 md:p-7 dark:border-white/8">
            <div className="flex flex-wrap items-stretch justify-center gap-6 md:gap-7">
              {teamMembers.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
            </div>
          </div>
        </section>

        <section className="border-t border-dashed border-[#1a2240]/25 px-6 pb-16 pt-7 lg:px-8 dark:border-white/8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-[#1a2240] dark:text-white md:text-4xl">
              Advisors
            </h2>

            <div className="mt-8 rounded-xl border border-dashed border-[#1a2240]/25 p-5 md:p-7 dark:border-white/8">
            <div className="flex flex-wrap items-stretch justify-center gap-6 md:gap-7">
              {advisors.map((member) => (
                <TeamCard key={member.name} member={member} />
              ))}
            </div>
            </div>
          </div>
        </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
