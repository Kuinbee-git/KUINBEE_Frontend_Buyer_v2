"use client";

import { NotchNavigation } from "@/shared/components/ui/notch-navigation";
import { InstitutionalBackground } from "@/shared/components/ui/institutional-background";
import { LandingFooter } from "@/features/landing/components/LandingFooter";
import { HoverEffect, type HoverEffectItem } from "@/shared/components/ui/card-hover-effect";

/* ─── Inline SVG icons (zero-dependency, matches footer style) ─── */

const DiscordIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="#5865F2">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="#004182">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="#C13584">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
);

const RedditIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="#FF4500">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="#FF0000">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

/* ─── Social platforms data ─── */

const socialPlatforms: HoverEffectItem[] = [
    {
        title: "Discord",
        icon: (props) => <DiscordIcon {...props} />,
        link: "https://discord.gg/NhqGDsmzrM",
        description:
            "Join Kuinbee's dynamic data community on Discord for real-time collaboration, insightful discussions, freelance gig opportunities, exciting competitions, and direct interaction with our team and fellow data professionals.",
        color: "from-[#5865F2]/10 to-[#5865F2]/5",
        comingSoon: true,
    },
    {
        title: "LinkedIn",
        icon: (props) => <LinkedinIcon {...props} />,
        link: "https://www.linkedin.com/company/kuinbee",
        description:
            "At Kuinbee, we're building more than a platform, we're shaping the future of data accessibility and integrity. Follow us on LinkedIn to connect with industry leaders, explore real-world applications of data, and gain perspectives that bridge technology, business, and innovation.",
        color: "from-[#004182]/10 to-[#004182]/5",
    },
    {
        title: "Instagram",
        icon: (props) => <InstagramIcon {...props} />,
        link: "https://www.instagram.com/the_kuinbee",
        description:
            "Follow Kuinbee on Instagram for curated data insights, educational content, behind-the-scenes moments, and an inside look at life in a data startup.",
        color: "from-[#C13584]/10 to-[#C13584]/5",
    },
    {
        title: "Twitter (X)",
        icon: (props) => <TwitterIcon {...props} />,
        link: "https://twitter.com/Kuinbee00",
        description:
            "Follow Kuinbee on X for sharp data insights, educational threads, and real-time conversations on how data is transforming industries, shaping decisions, and influencing the world around us.",
        color: "from-[#0a192f]/10 to-[#0a192f]/5",
    },
    {
        title: "Reddit",
        icon: (props) => <RedditIcon {...props} />,
        link: "https://www.reddit.com/user/Kuinbee00",
        description:
            "Join Kuinbee's Reddit community, a space for thoughtful discussions and in-depth educational threads that explore the many dimensions of data, its applications, challenges, and the ways it shapes industries, decisions, and the world around us.",
        color: "from-[#FF4500]/10 to-[#FF4500]/5",
    },
    {
        title: "YouTube",
        icon: (props) => <YoutubeIcon {...props} />,
        link: "https://www.youtube.com",
        description:
            "Watch our latest videos, tutorials, and product demos. Subscribe to stay updated!",
        color: "from-[#FF0000]/10 to-[#FF0000]/5",
        comingSoon: true,
    },
];

/* ─── Page ─── */

export default function CommunityPage() {
    return (
        <div className="min-h-screen relative">
            {/* Navigation */}
            <div className="relative z-50">
                <NotchNavigation />
            </div>

            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <InstitutionalBackground />
            </div>

            {/* Main Content */}
            <div className="relative pt-32 pb-16">
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-primary dark:text-white leading-tight mb-6">
                            Join Our Community
                        </h1>
                        <p className="text-base sm:text-lg max-w-3xl mx-auto text-muted-foreground dark:text-white/70 leading-relaxed">
                            Welcome to the Kuinbee Community! Connect, share, and grow with
                            other users. Explore our channels below:
                        </p>
                    </div>

                    {/* Social Platform Cards */}
                    <HoverEffect items={socialPlatforms} className="mb-16 sm:mb-20" />

                    {/* Get Involved Section */}
                    <section className="text-center max-w-3xl mx-auto">
                        <div className="bg-white/80 dark:bg-[#1e2847]/60 backdrop-blur-sm border border-border/40 dark:border-white/10 rounded-2xl p-8 sm:p-10">
                            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-primary dark:text-white mb-4">
                                Get Involved
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground dark:text-white/70 mb-4 leading-relaxed">
                                Have questions, feedback, or want to contribute? Reach out on
                                any platform above or email us at{" "}
                                <a
                                    href="mailto:community@kuinbee.com"
                                    className="text-primary dark:text-blue-400 underline underline-offset-2 hover:text-primary/80 dark:hover:text-blue-300 transition-colors"
                                >
                                    community@kuinbee.com
                                </a>
                                .
                            </p>
                            <p className="text-sm sm:text-base text-muted-foreground dark:text-white/70 leading-relaxed">
                                Stay tuned for upcoming events, webinars, and more ways to
                                connect!
                            </p>
                        </div>
                    </section>
                </main>
            </div>

            {/* Footer */}
            <LandingFooter />
        </div>
    );
}
