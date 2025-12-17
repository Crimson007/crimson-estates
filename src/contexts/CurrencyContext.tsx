import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Currency = "KES" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInKES: number) => number;
  formatPrice: (priceInKES: number) => string;
}

const EXCHANGE_RATE = 0.0078; // 1 KES = 0.0078 USD (approximate)

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("currency");
      return (saved as Currency) || "KES";
    }
    return "KES";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
  };

  const convertPrice = (priceInKES: number): number => {
    if (currency === "USD") {
      return Math.round(priceInKES * EXCHANGE_RATE);
    }
    return priceInKES;
  };

  const formatPrice = (priceInKES: number): string => {
    const converted = convertPrice(priceInKES);
    if (currency === "USD") {
      return `$${converted.toLocaleString()}`;
    }
    return `KES ${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
