/**
 * Currency formatting utilities
 */

import type { Currency } from "@/types";

const currencySymbols: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function formatPrice(
  amount: string | number,
  currency: Currency = "INR"
): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  const symbol = currencySymbols[currency];

  return `${symbol}${numAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getCurrencySymbol(currency: Currency): string {
  return currencySymbols[currency];
}
