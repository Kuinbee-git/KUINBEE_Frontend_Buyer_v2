"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Link2 } from "lucide-react";
import styles from "./PublicInformation.module.css";

type CopyTarget =
  | { email: string; roleId?: never }
  | { roleId: number; email?: never };

export function CopyAction({ email, roleId }: CopyTarget) {
  const [feedback, setFeedback] = useState("");
  const label = email ? "Copy email address" : "Copy role link";

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(""), 2200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  async function copy() {
    const value =
      email ?? new URL(`/careers#role-${roleId}`, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(value);
      setFeedback("Copied");
    } catch {
      setFeedback("Copy unavailable");
    }
  }

  const Icon = feedback === "Copied" ? Check : email ? Copy : Link2;
  return (
    <button
      type="button"
      className={styles.copy}
      onClick={copy}
      aria-label={label}
      title={label}
    >
      <Icon aria-hidden="true" size={15} />
      <span aria-live="polite">
        {feedback || (email ? "" : "Copy role link")}
      </span>
    </button>
  );
}
