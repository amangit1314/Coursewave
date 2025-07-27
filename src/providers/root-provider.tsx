"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { GlobalQueryClientProvider } from "@/providers/query-client-provider";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GlobalQueryClientProvider>
        <div className="dark:bg-zinc-800">{children}</div>
      </GlobalQueryClientProvider>
    </ThemeProvider>
  );
} 