import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { LibraryPage } from "@/features/library";

export const metadata: Metadata = genMeta({
  title: "My Datasets",
  noIndex: true,
});

export default function Page() {
  return <LibraryPage />;
}
