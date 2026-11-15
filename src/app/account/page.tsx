import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const section =
    tab && ["profile", "preferences", "activity", "support"].includes(tab)
      ? tab
      : "profile";
  redirect(`/account/${section}`);
}
