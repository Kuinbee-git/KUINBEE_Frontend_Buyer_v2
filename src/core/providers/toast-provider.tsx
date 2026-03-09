"use client";

/**
 * Toast provider using Sonner
 */

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          actionButton:
            "!bg-transparent !text-current !border !border-current hover:!bg-current/10 !font-semibold !rounded-lg !transition-colors",
        },
      }}
    />
  );
}
