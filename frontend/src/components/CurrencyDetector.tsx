// components/CurrencyDetector.tsx
"use client";

import { useDetectCurrency } from "@/hooks/useDetectCurrency";

export default function CurrencyDetector() {
  useDetectCurrency(); // runs the hook on client
  return null; // nothing to render
}
