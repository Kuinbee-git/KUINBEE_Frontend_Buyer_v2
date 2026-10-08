import type { ReactNode } from "react";
import { IndustryPageTransition } from "./_components/IndustryPageTransition";

export default function IndustryLayout({ children }: { children: ReactNode }) {
  return <IndustryPageTransition>{children}</IndustryPageTransition>;
}
