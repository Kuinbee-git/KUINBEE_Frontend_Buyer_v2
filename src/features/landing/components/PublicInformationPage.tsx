import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { LandingHeader } from "./LandingHeader";
import { LandingFooter } from "./LandingFooter";
import { MarketplaceBackdrop } from "./MarketplaceBackdrop";
import styles from "./PublicInformation.module.css";

export function PublicInformationPage({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="sticky top-0 z-50">
        <LandingHeader />
      </div>
      <main className={styles.page}>
        <MarketplaceBackdrop />
        <div className={styles.content}>
          <nav className={styles.trail} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <ChevronRight size={13} aria-hidden="true" />
            <span aria-current="page">{current}</span>
          </nav>
          {children}
        </div>
      </main>
      <LandingFooter />
    </>
  );
}
