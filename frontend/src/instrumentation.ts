/**
 * Next.js instrumentation — runs before any other server code.
 *
 * Node 22+ creates a global `localStorage` when `--localstorage-file` is
 * present (even without a valid path). That object exists but its methods
 * aren't standard functions, which crashes libraries (Zustand, next-themes)
 * that call `localStorage.getItem` during SSR.
 *
 * Fix: replace the broken global with a proper no-op implementation.
 */
export async function register() {
  patchBrokenLocalStorage();
}

function patchBrokenLocalStorage() {
  if (typeof window !== "undefined") return; // Only patch server side

  const g = globalThis as any;
  if (g.localStorage && typeof g.localStorage.getItem !== "function") {
    g.localStorage = {
      _data: {} as Record<string, string>,
      getItem(key: string) { return this._data[key] ?? null; },
      setItem(key: string, value: string) { this._data[key] = String(value); },
      removeItem(key: string) { delete this._data[key]; },
      clear() { this._data = {}; },
      key(index: number) { return Object.keys(this._data)[index] ?? null; },
      get length() { return Object.keys(this._data).length; },
    };
  }
}

// Also run immediately at import time in case modules load before register()
patchBrokenLocalStorage();
