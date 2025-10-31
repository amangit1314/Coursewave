import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CurrencyState {
  currentCurrency: string;
  exchangeRates: Record<string, number>;
  setCurrency: (currency: string) => void;
  updateExchangeRates: (rates: Record<string, number>) => void;
  convertPrice: (
    price: number,
    fromCurrency?: string,
    toCurrency?: string
  ) => number;
  formatPrice: (
    price: number,
    currency?: string,
    showCurrencySign?: boolean
  ) => string;
  detectUserCurrency: () => Promise<void>;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: "USD",
      exchangeRates: {
        USD: 1,
        INR: 83.5,
      },

      setCurrency: (currency) => set({ currentCurrency: currency }),

      updateExchangeRates: (rates) =>
        set({ exchangeRates: { ...get().exchangeRates, ...rates } }),

      convertPrice: (price, fromCurrency = "USD", toCurrency) => {
        const { exchangeRates, currentCurrency } = get();
        const targetCurrency = toCurrency || currentCurrency;

        // If same currency, no conversion needed
        if (fromCurrency === targetCurrency) return price;

        // Convert from source currency to USD first (if needed)
        const usdAmount =
          fromCurrency === "USD" ? price : price / exchangeRates[fromCurrency];
        // Then convert from USD to target currency
        return usdAmount * exchangeRates[targetCurrency];
      },

      formatPrice: (price, currency, showCurrencySign = true) => {
        const { currentCurrency, convertPrice } = get();
        const targetCurrency = currency || currentCurrency;

        // Only convert if we're not displaying USD
        const displayPrice =
          targetCurrency === "USD"
            ? price
            : convertPrice(price, "USD", targetCurrency);

        // Determine locale based on currency
        const locale = targetCurrency === "INR" ? "en-IN" : "en-US";

        if (showCurrencySign) {
          return new Intl.NumberFormat(locale, {
            style: "currency",
            currency: targetCurrency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(displayPrice);
        } else {
          return new Intl.NumberFormat(locale, {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(displayPrice);
        }
      },

      // Function to detect user's currency based on location
      detectUserCurrency: async () => {
        try {
          // Method 1: Use browser's language setting (less accurate but works without API calls)
          const browserLanguage = navigator.language || "en-US";
          if (
            browserLanguage.includes("en-IN") ||
            browserLanguage.includes("hi-IN")
          ) {
            set({ currentCurrency: "INR" });
            return;
          }

          // Method 2: Use IP-based geolocation (more accurate)
          const response = await fetch("https://ipapi.co/json/");
          const locationData = await response.json();

          if (locationData.country_code === "IN") {
            set({ currentCurrency: "INR" });
          } else {
            set({ currentCurrency: "USD" });
          }
        } catch (error) {
          console.error("Error detecting currency:", error);
          // Fallback to USD if detection fails
          set({ currentCurrency: "USD" });
        }
      },
    }),
    {
      name: "currency-storage",
    }
  )
);
