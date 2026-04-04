"use client";

// stores/userStore.ts
import { User } from "@/types/auth.service.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeLocalStorage } from "./safe-storage";

type UserState = {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
};

type UserActions = {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (user, token) =>
        set({ user, token, isLoggedIn: true }),

      logout: () =>
        set({ user: null, token: null, isLoggedIn: false }),

      updateUser: (user) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...user } : null,
        })),
    }),
    {
      name: "Coursewave-User-Store",
      storage: safeLocalStorage,
    }
  )
);