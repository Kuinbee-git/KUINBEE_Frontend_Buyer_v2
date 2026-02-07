"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ModalType = 
  | "login" 
  | "signup" 
  | "verify-email" 
  | "forgot-password" 
  | "reset-email-sent" 
  | "reset-password" 
  | "reset-password-success" 
  | null;

interface ModalContextType {
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  activeModal: ModalType;
  currentModal: ModalType;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  const openModal = useCallback((type: ModalType) => {
    setActiveModal(type);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, activeModal, currentModal: activeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within ModalProvider");
  }
  return context;
}
