import type { Metadata } from "next";
import { generateMetadata as genMeta } from "@/core/config";
import { OrdersPage } from "@/features/account";

export const metadata: Metadata = genMeta({
  title: "My Orders",
  noIndex: true,
});

export default function Page() {
  return <OrdersPage />;
}
