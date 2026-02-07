"use client";

import { useModal } from "@/core/providers/ModalProvider";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { LoginModalContent } from "@/features/auth/components/login-modal-content";
import { SignupModalContent } from "@/features/auth/components/signup-modal-content";
import { VerifyEmailModalContent } from "@/features/auth/components/verify-email-modal-content";
import { ForgotPasswordModalContent } from "@/features/auth/components/forgot-password-modal-content";
import { ResetEmailSentModalContent } from "@/features/auth/components/reset-email-sent-modal-content";
import { ResetPasswordModalContent } from "@/features/auth/components/reset-password-modal-content";
import { ResetPasswordSuccessModalContent } from "@/features/auth/components/reset-password-success-modal-content";

/**
 * Renders the appropriate auth modal based on context state
 * Place this component at the root level of the app
 */
export function AuthModals() {
  const { currentModal, closeModal } = useModal();

  if (!currentModal) return null;

  return (
    <AuthModal onClose={closeModal}>
      {currentModal === "login" && <LoginModalContent />}
      {currentModal === "signup" && <SignupModalContent />}
      {currentModal === "verify-email" && <VerifyEmailModalContent />}
      {currentModal === "forgot-password" && <ForgotPasswordModalContent />}
      {currentModal === "reset-email-sent" && <ResetEmailSentModalContent />}
      {currentModal === "reset-password" && <ResetPasswordModalContent />}
      {currentModal === "reset-password-success" && <ResetPasswordSuccessModalContent />}
    </AuthModal>
  );
}
