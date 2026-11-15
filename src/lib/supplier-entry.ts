/** One destination for supplier application links and retired enquiry URLs. */
export function supplierEntryUrl(search = "") {
  const staging =
    process.env.NEXT_PUBLIC_APP_ENV === "staging" ||
    process.env.NEXT_PUBLIC_SITE_URL === "https://staging.kuinbee.com";
  const origin =
    process.env.NEXT_PUBLIC_SUPPLIER_URL ||
    (staging
      ? "https://supplier.staging.kuinbee.com"
      : "https://supplier.kuinbee.com");
  const url = new URL("/apply", origin);
  const params = new URLSearchParams(search);
  if (!params.has("source")) params.set("source", "supplier");
  url.search = params.toString();
  return url.toString();
}
