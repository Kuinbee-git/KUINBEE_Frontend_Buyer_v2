"use client";
import Link from "next/link";
import { useSyncExternalStore, type ComponentProps } from "react";

function destination(search = "") {
  const environment = process.env.NEXT_PUBLIC_APP_ENV;
  const staging = environment === "staging" || process.env.NEXT_PUBLIC_SITE_URL === "https://staging.kuinbee.com";
  const origin = process.env.NEXT_PUBLIC_SUPPLIER_URL || (staging ? "https://supplier.staging.kuinbee.com" : "https://supplier.kuinbee.com");
  const url = new URL(origin);
  const params = new URLSearchParams(search);
  if (!params.has("source")) params.set("source", "supplier");
  url.search = params.toString();
  return url.toString();
}
export function SupplierEntryLink({children, ...props}: Omit<ComponentProps<typeof Link>, "href">) {
  const search = useSyncExternalStore(() => () => {}, () => window.location.search, () => "");
  const href = destination(search);
  return <Link {...props} href={href}>{children}</Link>;
}
