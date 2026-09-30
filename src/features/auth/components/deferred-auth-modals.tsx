"use client";

import dynamic from "next/dynamic";
import { useModal } from "@/core/providers/ModalProvider";

// Public pages do not need sign-in, registration, and password-reset forms
// in their initial JavaScript. Keep the existing flows intact and load them
// only when a visitor opens an authentication modal.
const AuthModals = dynamic(
  () => import("./auth-modals").then((module) => module.AuthModals),
  {
    loading: () => (
      <div role="status" className="fixed bottom-6 right-6 z-50 rounded-lg border border-border bg-background px-4 py-3 shadow-lg">
        Loading account form…
      </div>
    ),
  }
);

export function DeferredAuthModals() {
  const { currentModal } = useModal();
  return currentModal ? <AuthModals /> : null;
}
