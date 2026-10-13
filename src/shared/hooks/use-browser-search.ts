"use client";
import { useSyncExternalStore } from "react";

const subscribe = (notify: () => void) => {
  window.addEventListener("popstate", notify);
  window.addEventListener("pageshow", notify);
  return () => {
    window.removeEventListener("popstate", notify);
    window.removeEventListener("pageshow", notify);
  };
};
const getSnapshot = () => window.location.search;

// Browser-only initial query with a stable empty snapshot for server rendering.
// Route-driven renders also read the latest URL; back/forward notifies directly.
export function useBrowserSearch() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "");
}
