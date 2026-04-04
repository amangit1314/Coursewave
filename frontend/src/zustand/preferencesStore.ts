"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "./safe-storage";

type PreferencesState = {
  // Notifications
  courseUpdates: boolean;
  newMessages: boolean;
  marketingEmails: boolean;

  // Reminders
  remindersEnabled: boolean;

  // In-Mails
  inMailsEnabled: boolean;

  // Appearance
  darkMode: boolean;
  reduceAnimations: boolean;

  // Security
  twoFactorAuth: boolean;

  // Actions
  toggle: (key: keyof PreferencesState) => void;
  setPreference: <K extends keyof PreferencesState>(
    key: K,
    value: PreferencesState[K]
  ) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      courseUpdates: true,
      newMessages: true,
      marketingEmails: false,

      remindersEnabled: false,
      inMailsEnabled: false,

      darkMode: false,
      reduceAnimations: false,

      twoFactorAuth: false,

      toggle: (key) => set((state) => ({ [key]: !state[key] })),
      setPreference: (key, value) => set(() => ({ [key]: value })),
    }),
    { name: "preferences-store", storage: safeLocalStorage }
  )
);
