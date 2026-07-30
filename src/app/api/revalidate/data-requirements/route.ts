import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const configuredSecret = process.env.FRONTEND_REVALIDATION_SECRET;
  if (!configuredSecret) {
    return NextResponse.json({ error: "Revalidation is not configured" }, { status: 503 });
  }
  if (request.headers.get("x-revalidation-secret") !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { slug?: unknown } | null;
  const slug =
    typeof body?.slug === "string" && body.slug.length <= 220 ? body.slug : null;

  revalidateTag("data-requirements", "max");
  revalidatePath("/data-request/active-requirements");
  if (slug) {
    revalidateTag(`data-requirement:${slug}`, "max");
    revalidatePath(`/data-request/active-requirements/${slug}`);
  }
  return NextResponse.json({ revalidated: true });
}
