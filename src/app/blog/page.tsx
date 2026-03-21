import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { blogPostsMeta } from "@/features/blog/blog-posts";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";

export const metadata: Metadata = genMeta({
  title: "Kuinbee Blog | AI Datasets, Buyer Guides & Insights",
  description:
    "Explore expert articles on the data economy, AI training datasets, and how to source verified data. Insights from the Kuinbee team.",
  keywords: ["data marketplace blog", "AI dataset insights", "data economy", "data access articles", "Kuinbee blog"],
  path: "/blog",
});

const CATEGORY_COLORS: Record<string, string> = {
  "Data Economy":      "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700/40",
  "Data Buyer's Guide":"bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-700/40",
  "Finance":           "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40",
  "Finance & Fintech": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40",
  "Energy & Sustainability": "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700/40",
  "Technology":        "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700/40",
  "default":           "bg-[#1a2240]/5 text-[#1a2240] dark:bg-white/10 dark:text-white/80 border-[#1a2240]/20 dark:border-white/20",
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS["default"];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function BlogPage() {
  const [hero, ...rest] = blogPostsMeta;

  return (
    <main className="min-h-screen relative bg-white dark:bg-[#111827]">
      <div className="sticky top-0 z-50">
        <NotchNavigation />
      </div>
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      <section className="relative pt-24 md:pt-36 pb-24">
        <div className="mx-auto max-w-6xl px-4 md:px-8">

          {/* ── Page Header ── */}
          <div className="text-center mb-16">
            <span className="inline-block rounded-full border border-[#1a2240]/20 dark:border-white/15 bg-white/80 dark:bg-white/5 backdrop-blur-sm px-4 py-1.5 mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a2240]/60 dark:text-white/50">
              Kuinbee Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a2240] dark:text-white mb-4 tracking-tight leading-tight">
              Kuinbee Blog — Data Marketplace, AI Datasets &amp; Buyer Guides
            </h1>
            <p className="text-base md:text-lg text-[#4e5a7e] dark:text-white/60 max-w-xl mx-auto leading-relaxed">
              Articles on the data economy, AI datasets, industry analysis, and the future of data access — from the Kuinbee team.
            </p>
          </div>

          {/* ── Hero post — full-width horizontal card ── */}
          {hero && (
            <Link href={`/blog/${hero.slug}`} className="group block mb-10">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a2240] to-[#2d3a6a] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Subtle grid texture */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

                <div className="relative z-10 p-8 md:p-12 md:flex md:items-center md:gap-12">
                  {/* Left content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(hero.category)}`}>
                        <Tag className="w-3 h-3" />
                        {hero.category}
                      </span>
                      <span className="text-xs font-semibold text-white/40 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        Featured
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight group-hover:text-white/90 transition-colors">
                      {hero.title}
                    </h2>
                    <p className="text-white/65 text-sm md:text-base leading-relaxed mb-6 line-clamp-2">
                      {hero.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-5 text-xs text-white/45">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />{formatDate(hero.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />{hero.readingTimeMinutes} min read
                      </span>
                    </div>
                  </div>

                  {/* Right CTA */}
                  <div className="mt-8 md:mt-0 md:flex-shrink-0">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-[#1a2240] text-sm font-bold group-hover:bg-white/90 transition-colors">
                      Read Article
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* ── All other posts — uniform 2-col grid ── */}
          {rest.length > 0 && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#4e5a7e] dark:text-white/40">
                  More Articles
                </p>
                <div className="flex-1 h-px bg-[#1a2240]/10 dark:bg-white/10" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rest.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <div className="h-full rounded-2xl border border-[#1a2240]/10 dark:border-white/10 bg-white dark:bg-[#1e2847] shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-7 flex flex-col">
                      {/* Top accent line */}
                      <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-[#4f6ef7] to-[#818cf8] mb-5" />

                      <span className={`inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${getCategoryColor(post.category)}`}>
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>

                      <h2 className="text-lg font-bold text-[#1a2240] dark:text-white mb-3 group-hover:text-[#2d3a5f] dark:group-hover:text-white/90 transition-colors leading-snug flex-1">
                        {post.title}
                      </h2>

                      <p className="text-sm text-[#4e5a7e] dark:text-white/55 leading-relaxed mb-5 line-clamp-2">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#1a2240]/8 dark:border-white/8">
                        <div className="flex items-center gap-4 text-xs text-[#4e5a7e]/70 dark:text-white/40">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formatDate(post.publishedAt)}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{post.readingTimeMinutes} min</span>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4f6ef7] dark:text-[#818cf8] group-hover:gap-2.5 transition-all duration-200">
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* "Coming soon" placeholder slot when there's an odd number of rest posts */}
                {rest.length % 2 !== 0 && (
                  <div className="rounded-2xl border border-dashed border-[#1a2240]/15 dark:border-white/10 p-7 flex flex-col items-center justify-center gap-3 text-center">
                    <div className="w-10 h-10 rounded-full bg-[#1a2240]/5 dark:bg-white/5 flex items-center justify-center text-lg">✍️</div>
                    <p className="text-sm font-semibold text-[#4e5a7e] dark:text-white/50">More articles coming soon</p>
                    <p className="text-xs text-[#4e5a7e]/60 dark:text-white/30">New guides published regularly</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
