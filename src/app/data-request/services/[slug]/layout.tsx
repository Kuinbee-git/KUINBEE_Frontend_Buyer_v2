import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Custom Data Collection Service | Kuinbee",
  description:
    "Review a Kuinbee-vetted custom data collection capability and submit your project requirements.",
};

export default function CustomCollectionServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
