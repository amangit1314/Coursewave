"use client";

import { useOAuthSync } from "@/hooks/useOAuthSync";

export function OAuthSyncProvider() {
  useOAuthSync();
  return null;
}
