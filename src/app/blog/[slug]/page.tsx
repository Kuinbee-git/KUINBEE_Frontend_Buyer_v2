import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateMetadata as genMeta, generateBreadcrumbSchema } from "@/core/config";
import { blogPosts, getBlogPost, type ContentBlock } from "@/features/blog/blog-posts";
import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Tag, ArrowRight, CheckCircle2 } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Static generation                                                           */
/* -------------------------------------------------------------------------- */
export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const canonicalUrl = `https://www.kuinbee.com/blog/${slug}`;
  const base = genMeta({
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    path: `/blog/${slug}`,
  });

  return {
    ...base,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...base.openGraph,
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.description,
      images: [
        {
          url: "https://www.kuinbee.com/og-image.png",
          width: 1200,
          height: 630,
          alt: `${post.title} | Kuinbee`,
        },
      ],
    },
    twitter: {
      ...base.twitter,
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["https://www.kuinbee.com/og-image.png"],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Content block renderers                                                     */
/* -------------------------------------------------------------------------- */
function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-[#374151] dark:text-white/80 leading-relaxed text-base md:text-[17px]">{block.text}</p>;

    case "heading2":
      return <h2 className="text-2xl md:text-3xl font-semibold text-[#1a2240] dark:text-white leading-tight mt-14 first:mt-0 mb-1">{block.text}</h2>;

    case "heading3":
      return <h3 className="text-lg md:text-xl font-semibold text-[#1a2240] dark:text-white mt-8 mb-1">{block.text}</h3>;

    case "bullet-list":
      return (
        <ul className="space-y-2.5 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#374151] dark:text-white/80 text-base">
              <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1a2240] dark:bg-white/60" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "stat-row":
      return (
        <div className="grid grid-cols-3 gap-4 rounded-2xl bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] p-6 text-center my-8">
          {block.items.map((item, i) => (
            <div key={i}>
              <div className="text-2xl md:text-3xl font-bold text-white">{item.num}</div>
              <div className="text-xs text-white/60 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      );

    case "tldr":
      return (
        <div className="rounded-xl border-l-4 border-[#4f6ef7] bg-[#eef1fe] dark:bg-[#1e2847] dark:border-[#4f6ef7]/70 p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4f6ef7] mb-4">⚡ Key Takeaways</p>
          <ul className="space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base text-[#1a2240] dark:text-white/85 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-[#4f6ef7] flex-shrink-0 mt-0.5" />
                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </li>
            ))}
          </ul>
        </div>
      );

    case "pull-quote":
      return (
        <blockquote className="border-l-4 border-[#1a2240] dark:border-white/30 bg-[#f8f9fc] dark:bg-white/5 rounded-r-xl ml-0 pl-6 pr-6 py-5 my-8 text-lg md:text-xl italic text-[#374151] dark:text-white/80 leading-relaxed">
          {block.text}
        </blockquote>
      );

    case "insight":
      return (
        <div className="rounded-xl border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/20 p-5 my-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-3">💡 Original Insight</p>
          <p className="text-sm md:text-base text-amber-900 dark:text-amber-100/80 leading-relaxed">{block.text}</p>
        </div>
      );

    case "citation":
      return (
        <div className="rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fc] dark:bg-white/5 p-5 my-8">
          <p className="text-sm md:text-base text-[#374151] dark:text-white/80 leading-relaxed">{block.text}</p>
          <p className="mt-3 text-xs text-[#6b7280] dark:text-white/40 font-medium">— {block.source}</p>
        </div>
      );

    case "user-grid":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {block.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#1e2847] p-5">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-semibold text-sm text-[#1a2240] dark:text-white mb-2">{item.title}</h4>
              <p className="text-sm text-[#6b7280] dark:text-white/60 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      );

    case "feature-list":
      return (
        <ul className="my-8 space-y-0 divide-y divide-[#e5e7eb] dark:divide-white/10 rounded-xl border border-[#e5e7eb] dark:border-white/10 overflow-hidden">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-4 px-5 py-4 bg-white dark:bg-[#1e2847]">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#1a2240] dark:text-white text-sm">{item.label}: </span>
                <span className="text-sm text-[#6b7280] dark:text-white/70 leading-relaxed">{item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      );

    case "bar-chart": {
      const max = Math.max(...block.bars.map(b => b.value));
      return (
        <figure className="my-10 rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-[#f8f9fc] dark:bg-[#1e2847] p-6">
          <p className="text-sm font-semibold text-[#1a2240] dark:text-white text-center mb-6">{block.title}</p>
          <div className="flex items-end justify-center gap-3 md:gap-5 h-40">
            {block.bars.map((bar, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-xs font-bold text-[#4f6ef7]">{bar.displayValue}</span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-[#4f6ef7] to-[#818cf8] transition-all duration-500"
                  style={{ height: `${(bar.value / max) * 120}px` }}
                />
                <span className="text-xs text-[#6b7280] dark:text-white/50">{bar.label}</span>
              </div>
            ))}
          </div>
          <figcaption className="text-xs text-center text-[#6b7280] dark:text-white/40 mt-4">{block.caption}</figcaption>
        </figure>
      );
    }

    case "faq":
      return (
        <div className="my-8 space-y-3">
          {block.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#1e2847] p-5">
              <h3 className="font-semibold text-[#1a2240] dark:text-white text-base mb-2">{item.q}</h3>
              <p className="text-sm text-[#6b7280] dark:text-white/70 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      );

    case "cta":
      return (
        <div className="my-10 rounded-2xl bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] p-8 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">{block.heading}</h3>
          <p className="text-white/70 text-sm mb-6 max-w-md mx-auto">{block.body}</p>
          <Link href={block.href} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1a2240] text-sm font-semibold hover:bg-white/90 transition-colors">
            {block.buttonText}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      );

    case "checklist":
      return (
        <ul className="my-6 space-y-0 divide-y divide-[#e5e7eb] dark:divide-white/10 rounded-xl border border-[#e5e7eb] dark:border-white/10 overflow-hidden">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-4 px-5 py-4 bg-white dark:bg-[#1e2847]">
              <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
              <div>
                <span className="font-semibold text-[#1a2240] dark:text-white text-sm">{item.label}: </span>
                <span className="text-sm text-[#6b7280] dark:text-white/70 leading-relaxed">{item.body}</span>
              </div>
            </li>
          ))}
        </ul>
      );

    case "step-grid":
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {block.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-[#e5e7eb] dark:border-white/10 bg-white dark:bg-[#1e2847] p-5">
              <div className="text-3xl font-extrabold text-[#4f6ef7] mb-3">{item.num}</div>
              <h4 className="font-semibold text-sm text-[#1a2240] dark:text-white mb-2">{item.title}</h4>
              <p className="text-sm text-[#6b7280] dark:text-white/60 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      );

    case "source-table": {
      const tagBadge = (tag?: string, color?: "green" | "emerald" | "amber" | "red" | "blue" | "purple") => {
        if (!tag) return null;
        
        // Map old formats
        if (tag === "free") { tag = "Free"; color = "emerald"; }
        if (tag === "paid") { tag = "Paid"; color = "amber"; }
        if (tag === "both") { tag = "Free+Paid"; color = "purple"; }
        
        const c = color || "emerald"; // Default color if not provided
        
        const styles: Record<string, string> = {
          emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40",
          green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/40",
          amber: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-700/40",
          purple: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700/40",
          blue: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700/40",
          red: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-700/40",
        };
        return <span className={`ml-1 px-2 py-0.5 rounded text-xs font-bold border ${styles[c]}`}>{tag}</span>;
      };
      return (
        <div className="my-8">
          {block.caption && (
            <p className="text-sm font-semibold text-[#1a2240] dark:text-white mb-3 text-left">
              {block.caption}
            </p>
          )}
          <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] dark:border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a2240] text-white">
                  {block.headers.map((h, i) => (
                    <th key={i} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${i === 0 ? "rounded-tl-xl" : ""} ${i === block.headers.length - 1 ? "rounded-tr-xl" : ""}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e7eb] dark:divide-white/10">
                {block.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-white dark:bg-[#1e2847]" : "bg-[#f8f9fc] dark:bg-white/5"}>
                    {row.cells.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 text-[#374151] dark:text-white/80 align-top">
                        {cell.split("\n").map((line, li) => (
                          <span key={li} className={`block ${li > 0 ? "text-xs text-[#6b7280] dark:text-white/40 mt-0.5" : "font-medium"}`}>{line}</span>
                        ))}
                        {ci === row.cells.length - 1 && tagBadge(row.tag, row.tagColor)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                        */
/* -------------------------------------------------------------------------- */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const breadcrumbJsonLd = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${slug}` },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: "Kuinbee" },
    publisher: { "@type": "Organization", name: "Kuinbee", logo: { "@type": "ImageObject", url: "https://www.kuinbee.com/logo.png" } },
    keywords: post.keywords.join(", "),
    url: `https://www.kuinbee.com/blog/${slug}`,
  };

  const internalLinks = [
    { href: "/datasets", label: "Explore verified datasets" },
    { href: "/pricing", label: "View enterprise pricing" },
    { href: "/about", label: "Learn about Kuinbee governance" },
  ];

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <main className="min-h-screen relative bg-white dark:bg-[#111827]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="sticky top-0 z-50">
        <NotchNavigation />
      </div>
      <div className="fixed inset-0 -z-10">
        <InstitutionalBackground />
      </div>

      <div className="relative pt-24 md:pt-36 pb-20">
        <div className="mx-auto max-w-3xl px-4 md:px-6">

          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[#4e5a7e] dark:text-white/60 hover:text-[#1a2240] dark:hover:text-white transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700/40 mb-5">
              <Tag className="w-3 h-3" />{post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1a2240] dark:text-white leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-lg text-[#4e5a7e] dark:text-white/70 leading-relaxed mb-6">{post.description}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-[#4e5a7e]/80 dark:text-white/50 pb-8 border-b border-[#1a2240]/10 dark:border-white/10">
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(post.publishedAt)}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readingTimeMinutes} min read</span>
              <span className="font-medium text-[#1a2240] dark:text-white">By Kuinbee Team</span>
            </div>
          </header>

          {/* Article body — spaced content blocks */}
          <article className="space-y-5">
            {post.content.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </article>

          <section className="mt-12 rounded-xl border border-[#1a2240]/10 dark:border-white/10 bg-white dark:bg-[#1e2847] p-6">
            <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-4">Explore Marketplace Resources</h2>
            <div className="flex flex-wrap gap-3">
              {internalLinks.map((resource) => (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#1a2240]/15 dark:border-white/15 text-sm font-medium text-[#1a2240] dark:text-white/90 hover:bg-[#1a2240]/5 dark:hover:bg-white/5 transition-colors"
                >
                  {resource.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </section>

          {/* Keyword tags */}
          <div className="mt-12 pt-8 border-t border-[#1a2240]/10 dark:border-white/10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#4e5a7e] dark:text-white/40 mb-3">Topics</p>
            <div className="flex flex-wrap gap-2">
              {post.keywords.map((kw) => (
                <span key={kw} className="px-3 py-1 rounded-full text-xs font-medium bg-[#1a2240]/5 dark:bg-white/5 text-[#1a2240] dark:text-white/70 border border-[#1a2240]/10 dark:border-white/10">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mx-auto max-w-6xl px-4 md:px-6 mt-20">
            <h2 className="text-xl font-semibold text-[#1a2240] dark:text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="group block">
                  <div className="h-full rounded-xl border border-[#1a2240]/10 dark:border-white/10 bg-white dark:bg-[#1e2847] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 p-6">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#4e5a7e] dark:text-white/50 mb-3 uppercase tracking-wider">{p.category}</span>
                    <h3 className="text-base font-semibold text-[#1a2240] dark:text-white mb-2 leading-snug group-hover:text-[#2d3a5f] transition-colors">{p.title}</h3>
                    <span className="flex items-center gap-1 text-xs text-[#4e5a7e]/70 dark:text-white/40"><Clock className="w-3 h-3" />{p.readingTimeMinutes} min</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-6xl px-4 md:px-6 mt-10">
          <div className="rounded-2xl bg-gradient-to-br from-[#1a2240] to-[#2d3a5f] p-8 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">Need data for your next AI or research project?</h2>
            <p className="text-white/70 text-sm md:text-base mb-6">Browse trusted, verified datasets and evaluate options quickly with transparent governance information.</p>
            <Link
              href="/datasets"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#1a2240] text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Explore Datasets →
            </Link>
          </div>
        </div>
      </div>

      <LandingFooter />
    </main>
  );
}
