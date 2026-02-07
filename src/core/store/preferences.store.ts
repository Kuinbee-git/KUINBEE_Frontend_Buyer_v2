/**
 * Preferences store
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/types";

interface PreferencesState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      currency: "INR",

      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "preferences-storage",
    }
  )
);
