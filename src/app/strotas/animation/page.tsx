import type { Metadata } from "next";
import { StrotasAnimationGallery } from "../_components/StrotasAnimationGallery";

export const metadata: Metadata = {
  title: "Strotas — Animation Versions",
  robots: { index: false, follow: false },
};

export default async function StrotasAnimationPage({
  searchParams,
}: {
  searchParams: Promise<{ version?: string }>;
}) {
  const { version } = await searchParams;
  return <StrotasAnimationGallery initialVersion={version} />;
}
