import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicInformationPage } from "@/features/landing/components/PublicInformationPage";
import { RoleBrowser } from "./RoleBrowser";
import styles from "@/features/landing/components/PublicInformation.module.css";

export function CareersPageContent() {
  return (
    <PublicInformationPage current="Careers">
      <div className={styles.careersLayout}>
        <header className={styles.careersIntro}>
          <h1 className={styles.title}>Careers at Kuinbee</h1>
          <p className={styles.lead}>
            Join the team building a marketplace for trusted data.
          </p>
          <Link href="/team" className={styles.inlineLink}>
            Meet the team <ArrowRight size={15} />
          </Link>
        </header>
        <div>
          <RoleBrowser />
          <div className={styles.resume}>
            <span>Don’t see your role?</span>
            <a
              href="mailto:info@kuinbee.com?subject=Careers%20at%20Kuinbee"
              className={styles.inlineLink}
            >
              Send us your resume <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </PublicInformationPage>
  );
}
