"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import {
  FaDiscord,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaRedditAlien,
  FaYoutube,
  FaGithub,
} from "react-icons/fa";
import { Link } from "@/components/router/Link";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

export function LandingFooter() {
  const handleScroll = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-background via-background to-background dark:from-background/0 dark:via-background/0 dark:to-background/0 text-foreground dark:text-white border-t border-border dark:border-white/5">
      {/* Fade separator line at top */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{
        background: 'linear-gradient(to right, transparent 0%, var(--border) 25%, var(--border) 75%, transparent 100%)',
      }} />
      
      {/* Subtle pattern for depth - only visible in dark mode */}
      <div className="absolute inset-0 hidden dark:block">
        <div 
          className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-6 gap-8 mb-12"
        >
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-1">
              <img
                src="/logo-light.png"
                alt="Kuinbee"
                className="block hidden dark:hidden h-20"
              />
              <img
                src="/logo-dark.png"
                alt="Kuinbee"
                className="hidden dark:block h-20"
              />
              <h3 className="text-2xl font-semibold text-primary dark:text-white leading-tight">
                Kuinbee
              </h3>
            </div>
            <p className="text-muted-foreground dark:text-white/70 leading-relaxed max-w-md text-sm">
              The world's datasets, aggregated for you. Discover, understand, and act on data with speed and confidence.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground dark:text-white">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/datasets" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  Data Marketplace
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  Analytics
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleScroll("security")}
                  className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-left w-full bg-transparent border-0 p-0 cursor-pointer text-sm"
                >
                  Security
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground dark:text-white">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/project-siddhi" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  Project Siddhi
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground dark:text-white">Community</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/community" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  Kuinbee Community Hub
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  For Researchers
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-sm">
                  For Students & Professionals
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground dark:text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleScroll("faq")}
                  className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200 text-left w-full bg-transparent border-0 p-0 cursor-pointer text-sm"
                >
                  FAQs
                </button>
              </li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          viewport={{ once: true }}
          className="border-t border-border dark:border-white/10 mt-8 pt-8"
        >
          {/* Office Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4 border border-border dark:border-white/5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground dark:text-white/50 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold text-foreground dark:text-white/80 mb-2 uppercase tracking-wide">
                    Registered Office - India
                  </h5>
                  <p className="text-muted-foreground dark:text-white/60 text-xs leading-relaxed">
                    S NO 71/8/2/1 Vasudha Itasha Apt Wing B FN 804,<br />
                    Kothrud, Pune 411038, Maharashtra, India
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/50 dark:bg-white/5 rounded-lg p-4 border border-border dark:border-white/5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground dark:text-white/50 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="text-xs font-semibold text-foreground dark:text-white/80 mb-2 uppercase tracking-wide">
                    International Office - UK
                  </h5>
                  <p className="text-muted-foreground dark:text-white/60 text-xs leading-relaxed">
                    6 Brook Street,<br />
                    Oxford, England, OX1 4JT, United Kingdom
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="border-t border-border dark:border-white/10 mt-12 pt-8"
        >
          <div className="max-w-md mx-auto text-center space-y-4">
            <h4 className="text-sm font-semibold text-foreground dark:text-white">
              Stay ahead with data
            </h4>
            <p className="text-muted-foreground dark:text-white/70 text-xs">
              Subscribe to get updates on datasets, features, and community insights.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background dark:bg-white/5 border-border dark:border-white/10 text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-white/40 text-xs"
              />
              <Button className="bg-primary dark:bg-white/10 hover:bg-primary/90 dark:hover:bg-white/20 text-primary-foreground dark:text-white border-0 dark:border dark:border-white/10 text-xs px-4">
                Subscribe
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-border dark:border-white/10 mt-8 pt-8"
        >
          {/* Social Media */}
          <div className="flex justify-center gap-6 mb-6">
            <a
              href="https://discord.gg/NhqGDsmzrM"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              aria-label="Discord"
            >
              <FaDiscord className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/kuinbee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/the_kuinbee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/Kuinbee00"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              aria-label="Twitter"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.reddit.com/user/Kuinbee00"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              aria-label="Reddit"
            >
              <FaRedditAlien className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              aria-label="YouTube"
            >
              <FaYoutube className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/kuinbee"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              aria-label="Github"
            >
              <FaGithub className="w-5 h-5" />
            </a>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground dark:text-white/60">
            <p>
              © 2025 Kuinbee information services pvt ltd. All rights reserved. Built with
              security, clarity, and community at the core.
            </p>
            <div className="flex gap-6 text-xs">
              <Link
                href="/terms-and-conditions"
                className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              >
                Terms & Conditions
              </Link>
              <Link
                href="/legal-compliance"
                className="text-muted-foreground dark:text-white/60 hover:text-foreground dark:hover:text-white/90 transition-colors duration-200"
              >
                Legal & Compliance
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
