/** Isolated Dataset contract adoption; production retains existing readers. */
export const DATASET_CONTENT_BUYER_ENABLED =
  process.env.NEXT_PUBLIC_APP_ENV === "staging" ||
  process.env.NEXT_PUBLIC_APP_ENV === "local" ||
  (!process.env.NEXT_PUBLIC_APP_ENV && process.env.NODE_ENV !== "production");

export const BUYER_DATASET_QUERY_VERSION = DATASET_CONTENT_BUYER_ENABLED
  ? "content-0.21"
  : "legacy-v1";
