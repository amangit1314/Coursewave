import { createJSONStorage, type StateStorage } from "zustand/middleware";

/**
 * SSR-safe localStorage for Zustand persist middleware.
 *
 * Node 22+ exposes a broken global `localStorage` when `--localstorage-file`
 * has no valid path. The object exists but its methods aren't callable,
 * crashing Zustand's persist hydration with "localStorage.getItem is not a function".
 *
 * Fix: return a wrapper that validates every call at runtime, falling back to
 * no-op when localStorage is absent or broken.
 */
const safeStorage: StateStorage = {
  getItem(name: string): string | null {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage?.getItem === "function") {
        return window.localStorage.getItem(name);
      }
    } catch {
      // ignore
    }
    return null;
  },
  setItem(name: string, value: string): void {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage?.setItem === "function") {
        window.localStorage.setItem(name, value);
      }
    } catch {
      // ignore — quota exceeded, private browsing, or SSR
    }
  },
  removeItem(name: string): void {
    try {
      if (typeof window !== "undefined" && typeof window.localStorage?.removeItem === "function") {
        window.localStorage.removeItem(name);
      }
    } catch {
      // ignore
    }
  },
};

export const safeLocalStorage = createJSONStorage(() => safeStorage);
