"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/providers/theme-provider";
import { GlobalQueryClientProvider } from "@/providers/query-client-provider";
import { OAuthSyncProvider } from "./oauth-sync-provider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <GlobalQueryClientProvider>
          <OAuthSyncProvider />
          <div className="dark:bg-zinc-800">{children}</div>
        </GlobalQueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
