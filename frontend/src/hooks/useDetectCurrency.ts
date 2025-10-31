// hooks/useDetectCurrency.ts
"use client"; // ✅ Must be at the very top

import { useCurrencyStore } from "@/zustand/currencyStore";
import { useEffect } from "react";

export const useDetectCurrency = () => {
  const { detectUserCurrency, currentCurrency } = useCurrencyStore();

  useEffect(() => {
    const storedCurrency = localStorage.getItem("currency-storage");
    if (!storedCurrency) {
      detectUserCurrency();
    } else {
      const parsedState = JSON.parse(storedCurrency);
      if (!parsedState.state?.currentCurrency) {
        detectUserCurrency();
      }
    }
  }, [detectUserCurrency]);

  return currentCurrency;
};
