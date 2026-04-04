"use client";
import { useEffect, useState } from "react";

type SetValue<T> = T | ((val: T) => T);

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: SetValue<T>) => void] {
  // Always start with initialValue to avoid hydration mismatch
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Sync from localStorage after mount (client only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // localStorage unavailable or invalid JSON — keep initialValue
    }
  }, [key]);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      const valueToStore =
        typeof storedValue === "function"
          ? (storedValue as (val: T) => T)(storedValue)
          : storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch {
      // localStorage unavailable
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
