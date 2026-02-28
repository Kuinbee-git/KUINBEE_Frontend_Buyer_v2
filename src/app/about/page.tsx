"use client";

import { useState, useEffect } from "react";
import { Link } from "@/components/router/Link";
import { LandingHeader, LandingFooter } from "@/features/landing";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { motion } from "framer-motion";
import {
  Target,
  Globe,
  Database,
  Zap,
  Users,
  Award,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui";

export default function AboutPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);

    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 lg:pt-48 pb-16 md:pb-20 lg:pb-32 overflow-hidden">
        <InstitutionalBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[900px] blur-3xl opacity-75 dark:opacity-85"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(26, 34, 64, 0.5) 0%, rgba(45, 58, 95, 0.35) 35%, rgba(26, 34, 64, 0.2) 55%, transparent 75%)'
                : 'radial-gradient(circle, rgba(100, 116, 139, 0.08) 0%, rgba(71, 85, 105, 0.05) 35%, rgba(51, 65, 85, 0.02) 55%, transparent 75%)'
            }}
          />

          <div
            className="absolute top-1/3 -left-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(78, 90, 126, 0.45) 0%, rgba(45, 58, 95, 0.3) 40%, rgba(36, 47, 82, 0.18) 60%, transparent 80%)'
                : 'radial-gradient(circle, rgba(71, 85, 105, 0.06) 0%, rgba(51, 65, 85, 0.04) 40%, rgba(30, 41, 59, 0.02) 60%, transparent 80%)'
            }}
          />

          <div
            className="absolute top-1/3 -right-32 w-[750px] h-[750px] blur-3xl opacity-65 dark:opacity-75"
            style={{
              background: isDark
                ? 'radial-gradient(circle, rgba(45, 58, 95, 0.45) 0%, rgba(78, 90, 126, 0.3) 40%, rgba(26, 34, 64, 0.18) 60%, transparent 80%)'
                : 'radial-gradient(circle, rgba(100, 116, 139, 0.06) 0%, rgba(71, 85, 105, 0.04) 40%, rgba(51, 65, 85, 0.02) 60%, transparent 80%)'
            }}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background dark:from-[#0a0f1e] to-transparent z-10" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6 md:space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10"
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Making Data Accessible</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-tight">
              With good data and the right access,{" "}
              <motion.span
                className="font-medium bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent bg-size-200 animate-gradient"
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: "100% 50%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                people can change the world
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed"
            >
              When we looked at the way data was being accessed and used, we saw bottlenecks everywhere. That's why we
              founded Kuinbee - to deliver trusted, ready-to-use data instantly while giving users the flexibility to
              request exactly what they need.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            >
              <Button asChild size="lg" className="w-full sm:w-auto group">
                <Link href="/pricing">
                  Get Started
                  <span className="ml-2 group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto">
                <Link href="/datasets">
                  Explore Datasets
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 text-muted-foreground"
              >
                <span className="text-sm font-medium">Scroll to explore</span>
                <div className="w-px h-8 bg-gradient-to-b from-muted-foreground/60 to-transparent"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 md:py-16 bg-background dark:bg-[#0a0f1e]">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-border"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">Trusted by hundreds</h2>
            <p className="text-muted-foreground text-sm md:text-base">500+ happy users</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: "10K+", label: "Datasets Available", icon: Database },
              { number: "500+", label: "Happy Users", icon: Users },
              { number: "99.9%", label: "Uptime Guarantee", icon: Award },
              { number: "24/7", label: "Expert Support", icon: TrendingUp },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group cursor-pointer"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-background rounded-xl md:rounded-2xl shadow-sm border border-border flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                  <stat.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1 md:mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottlenecks Section */}
      <section className="relative py-16 md:py-20 bg-background dark:bg-[#0a0f1e]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8 order-2 lg:order-1"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                </div>
                <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-primary to-transparent rounded-full"></div>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight">The bottlenecks we saw</h2>

              <div className="space-y-4 md:space-y-6 text-muted-foreground leading-relaxed text-base md:text-lg">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="relative pl-6"
                >
                  <span className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full"></span>
                  Public data was scattered across thousands of sources. Custom data collection was slow, expensive,
                  and inconsistent.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative pl-6"
                >
                  <span className="absolute left-0 top-2 w-2 h-2 bg-primary/70 rounded-full"></span>
                  Businesses, researchers, and governments had to choose between buying outdated datasets or building
                  their own from scratch - a process that often took weeks or months.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="relative pl-6"
                >
                  <span className="absolute left-0 top-2 w-2 h-2 bg-primary rounded-full"></span>
                  Complex tools required advanced technical skills just to ask a simple question. Valuable data was
                  locked behind paywalls, silos, and outdated processes.
                </motion.p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative order-1 lg:order-2"
            >
              <div className="bg-card rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-xl border border-border relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 text-center space-y-6 md:space-y-8">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <div className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground">Weeks</div>
                    <div className="text-muted-foreground font-medium text-sm md:text-base">to get basic data insights</div>
                  </motion.div>

                  <div className="relative">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card px-4">
                      <motion.div
                        whileInView={{ rotate: 360 }}
                        transition={{ duration: 1, delay: 0.6 }}
                        viewport={{ once: true }}
                        className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center"
                      >
                        <Zap className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground" />
                      </motion.div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <div className="text-4xl md:text-5xl lg:text-6xl font-light bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                      Days
                    </div>
                    <div className="text-muted-foreground font-medium text-sm md:text-base">with Kuinbee</div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-16 md:py-20 bg-background relative">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10 mb-4 md:mb-6">
              <span className="text-sm font-medium text-primary">What we do</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-tight mb-4 md:mb-6">
              We make data accessible, accurate, and actionable on demand
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We focus on creating the most seamless experience for finding, collecting, and working with data. Our
              goal is to empower anyone from a solo researcher to a Fortune 500 company.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                title: "Verified Datasets",
                description: "Available for instant download with quality guarantees",
                icon: CheckCircle,
              },
              {
                title: "Custom Analytics",
                description: "Requests fulfilled in days, not months",
                icon: Zap,
              },
              {
                title: "Aggregated Sources",
                description: "Public data from multiple sources in one place",
                icon: Database,
              },
              {
                title: "Analytics Tools",
                description: "Turn raw numbers into actionable insights",
                icon: TrendingUp,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-muted/30 rounded-xl md:rounded-2xl p-6 md:p-8 hover:shadow-lg hover:bg-card transition-all duration-300 group cursor-pointer border border-transparent hover:border-border"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="min-h-[60vh] py-16 md:py-20 bg-gradient-to-br from-primary via-primary to-primary/90 dark:from-primary/90 dark:via-primary dark:to-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-48 h-48 md:w-64 md:h-64 bg-primary-foreground/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-primary-foreground/3 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full border border-primary-foreground/20 mb-4 md:mb-6">
              <span className="text-sm font-medium text-primary-foreground">Where we're going</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-primary-foreground leading-tight mb-4 md:mb-6">
              People around the world are already using Kuinbee
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8 order-2 lg:order-1"
            >
              <div className="space-y-4 md:space-y-6 text-primary-foreground/90 leading-relaxed text-base md:text-lg">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  Researchers are accessing agriculture datasets to strengthen food security initiatives. Energy
                  analysts are tracking production patterns to drive smarter infrastructure investments.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Environmental specialists are monitoring climate data to plan sustainable interventions. Financial
                  institutions are leveraging market indicators to forecast trends and guide strategic decisions.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-primary-foreground font-medium text-lg md:text-xl"
                >
                  And this is just the beginning.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button asChild size="lg" variant="secondary" className="group">
                  <Link href="/pricing">
                    Start Your Journey
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl md:rounded-3xl p-8 md:p-12 border border-primary-foreground/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary-foreground/5 rounded-full blur-2xl"></div>
                <div className="relative z-10 space-y-6 md:space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-primary-foreground/10 backdrop-blur-sm rounded-xl md:rounded-2xl flex items-center justify-center border border-primary-foreground/20">
                      <Globe className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                    </div>
                    <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-primary-foreground/50 to-transparent rounded-full"></div>
                  </div>

                  <div className="text-2xl md:text-3xl lg:text-4xl font-light text-primary-foreground">Mission-driven engineering</div>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"></div>
                  <p className="text-primary-foreground/90 leading-relaxed text-base md:text-lg">
                    We're builders, not theorists. Our team blends expertise in data engineering, analytics, automation,
                    and product design with a relentless commitment to accuracy, speed, and usability.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <LandingFooter />
    </div>
  );
}
