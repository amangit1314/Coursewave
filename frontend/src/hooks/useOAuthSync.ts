"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "@/zustand/userStore";

/**
 * Syncs NextAuth OAuth session with the Zustand user store.
 * Place this in a layout or provider that wraps authenticated pages.
 */
export function useOAuthSync() {
  const { data: session, status } = useSession();
  const { isLoggedIn, login } = useUserStore();

  useEffect(() => {
    if (status !== "authenticated" || isLoggedIn) return;

    const backendUser = (session as any)?.backendUser;
    const backendToken = (session as any)?.backendAccessToken;

    if (backendUser && backendToken) {
      login(backendUser, backendToken);
    }
  }, [session, status, isLoggedIn, login]);
}
