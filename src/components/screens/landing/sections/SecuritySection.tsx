"use client";

import { Shield, Lock, Eye, Activity, Code, UserCheck } from "lucide-react";
import { FadeInOnView, ScaleOnView, StaggeredItem } from "@/components/motion";

const securityFeatures = [
  {
    icon: Shield,
    title: "Secure by Design",
    description: "Zero-trust architecture and defense-in-depth protect your data from day one.",
    angle: -90, // Fixed angle to position at top (12 o'clock)
  },
  {
    icon: Lock,
    title: "Data-Centric Protection",
    description:
      "End-to-end encryption, strict access controls, and anonymization ensure sensitive data is always safe.",
    angle: -30, // Fixed angle for top-right position
  },
  {
    icon: UserCheck,
    title: "Least Privilege Access",
    description: "Role-based controls and identity management minimize risks by default.",
    angle: 30, // Fixed angle for bottom-right position
  },
  {
    icon: Activity,
    title: "Continuous Monitoring",
    description: "Real-time logging, audit trails, and anomaly detection keep threats in check.",
    angle: 90, // Fixed angle for bottom position (6 o'clock)
  },
  {
    icon: Code,
    title: "DevSecOps at the Core",
    description: "Security is part of every build, deployment, and update — not an afterthought.",
    angle: 150, // Fixed angle for bottom-left position
  },
  {
    icon: Eye,
    title: "Privacy by Default",
    description: "GDPR-ready, transparent policies with privacy-first practices you can trust.",
    angle: -150, // Fixed angle for top-left position
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="relative py-16 md:py-24 min-h-[70vh] overflow-hidden">
      {/* Background - Consistent with other sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background dark:from-[#0a0f1e] dark:via-[#0f1729] dark:to-[#0a0f1e]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(26,34,64,0.05),transparent_60%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_60%)]" />
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(26,34,64,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,34,64,0.1) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInOnView className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 dark:bg-white/10 text-primary dark:text-white rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6 border border-primary/20 dark:border-white/20 backdrop-blur-sm">
            <Shield className="w-4 h-4" />
            Enterprise Security
          </div>

          <h2 className="text-3xl font-medium tracking-tight text-primary dark:text-white sm:text-4xl md:text-5xl mb-4 md:mb-6">
            Enterprise-Grade Data Security <span className="text-muted-foreground dark:text-white/60">You Can Trust</span>
          </h2>

          <p className="text-lg text-muted-foreground dark:text-white/70 max-w-3xl mx-auto">
            At Kuinbee, security isn&apos;t an add-on, it&apos;s built into our DNA. From zero-trust design to end-to-end
            encryption, every layer of our platform is engineered to keep your data safe, compliant, and private.
          </p>
        </FadeInOnView>

        {/* Orbit layout for md+ screens */}
        <div className="hidden md:block relative max-w-5xl mx-auto">
          {/* Central Security Hub */}
          <ScaleOnView 
            delay={0.2} 
            duration={0.8}
            initialScale={0.8}
            className="relative w-[600px] h-[600px] mx-auto"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-[#1a2240]/95 via-[#242f52]/90 to-[#2d3a5f]/95 dark:from-white/15 dark:via-white/10 dark:to-white/5 rounded-full flex items-center justify-center shadow-2xl border-4 border-primary/30 dark:border-white/30 backdrop-blur-xl">
              <div className="text-center text-white">
                <Shield className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Kuinbee</h3>
                <p className="text-base text-white/80">Security Core</p>
                <div className="mt-3 flex justify-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            </div>

            {/* Orbiting Security Features */}
            {securityFeatures.map((feature, index) => {
              const radius = 220;
              const angleRad = (feature.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius + 300;
              const y = Math.sin(angleRad) * radius + 300;

              return (
                <StaggeredItem
                  key={feature.title}
                  index={index}
                  className="absolute group cursor-pointer"
                  style={{
                    left: `${x - 48}px`,
                    top: `${y - 48}px`,
                  }}
                >
                  {/* Connection Line */}
                  <div
                    className="absolute w-0.5 bg-gradient-to-r from-primary/30 dark:from-white/30 to-transparent opacity-60"
                    style={{
                      width: `${radius - 80}px`,
                      height: "2px",
                      left: "48px",
                      top: "47px",
                      transform: `rotate(${feature.angle + 180}deg)`,
                      transformOrigin: "left center",
                    }}
                  ></div>

                  <div
                    className="w-24 h-24 bg-background dark:bg-gradient-to-br dark:from-[#1a2240]/60 dark:to-[#2d3a5f]/60 rounded-full border-4 border-primary/30 dark:border-white/30 flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-110 hover:border-primary/50 dark:hover:border-white/50 transition-all duration-300 relative z-20 backdrop-blur-sm"
                    style={{ pointerEvents: "auto" }}
                  >
                    <feature.icon className="w-10 h-10 text-primary dark:text-white group-hover:text-primary/80 dark:group-hover:text-white/80 transition-colors duration-300" />
                  </div>

                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-72 p-5 bg-gradient-to-br from-[#1a2240]/95 via-[#242f52]/90 to-[#2d3a5f]/95 dark:from-white/15 dark:via-white/10 dark:to-white/5 rounded-xl shadow-2xl border border-primary/30 dark:border-white/30 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 pointer-events-none backdrop-blur-xl">
                    <h4 className="font-semibold text-white mb-3 text-base">{feature.title}</h4>
                    <p className="text-sm text-white/80 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </StaggeredItem>
              );
            })}
          </ScaleOnView>

          <FadeInOnView delay={1} className="mt-16 text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-card/50 dark:bg-white/5 rounded-full border border-primary/20 dark:border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/70">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">All systems secure</span>
              </div>
              <div className="w-px h-6 bg-primary/20 dark:bg-white/20"></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/70">
                <Shield className="w-4 h-4" />
                <span className="font-medium">6 layers of protection</span>
              </div>
            </div>
          </FadeInOnView>
        </div>

        {/* Stacked feature list for mobile */}
        <div className="block md:hidden">
          <div className="flex flex-col gap-6">
            <div className="mx-auto w-32 h-32 bg-gradient-to-br from-[#1a2240]/95 via-[#242f52]/90 to-[#2d3a5f]/95 dark:from-white/15 dark:via-white/10 dark:to-white/5 rounded-full flex items-center justify-center shadow-2xl border-4 border-primary/30 dark:border-white/30 mb-6 backdrop-blur-xl">
              <div className="text-center text-white">
                <Shield className="w-10 h-10 mx-auto mb-2" />
                <h3 className="text-lg font-bold mb-1">Kuinbee</h3>
                <p className="text-xs text-white/80">Security Core</p>
              </div>
            </div>
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 bg-card/50 dark:bg-white/5 rounded-xl p-4 border border-primary/20 dark:border-white/20 shadow backdrop-blur-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-background dark:bg-gradient-to-br dark:from-[#1a2240]/60 dark:to-[#2d3a5f]/60 rounded-full border-2 border-primary/30 dark:border-white/30 flex items-center justify-center shadow">
                  <feature.icon className="w-7 h-7 text-primary dark:text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground dark:text-white mb-1 text-base">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground dark:text-white/70 leading-relaxed font-medium">{feature.description}</p>
                </div>
              </div>
            ))}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 dark:bg-white/5 rounded-full text-xs text-muted-foreground dark:text-white/70 border border-primary/20 dark:border-white/20 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">All systems secure</span>
                <span className="mx-2">|</span>
                <Shield className="w-4 h-4" />
                <span className="font-medium">6 layers of protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
