"use client";
import Link from "next/link";
import { type ComponentProps } from "react";

import { supplierEntryUrl } from "@/lib/supplier-entry";

export function SupplierEntryLink({
  children,
  query = "",
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & { query?: string }) {
  const href = supplierEntryUrl(query);
  return (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
}
