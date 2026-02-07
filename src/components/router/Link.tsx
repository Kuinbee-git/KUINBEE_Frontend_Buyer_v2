"use client";

import NextLink from "next/link";
import { type ComponentProps } from "react";
import { cn } from "@/lib/utils";

type LinkProps = ComponentProps<typeof NextLink>;

export function Link({ className, ...props }: LinkProps) {
  return <NextLink className={cn(className)} {...props} />;
}
