import type { Dataset, DatasetPriceSurfaceUI } from "./types";

export type DatasetPriceDisplay = {
  hasPrice: boolean;
  isFree: boolean;
  isDiscounted: boolean;
  currency: string;
  finalAmount: number | null;
  originalAmount: number | null;
};

export const getCurrencySymbol = (currency?: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "INR":
      return "₹";
    default:
      return "₹";
  }
};

export const toSafeNumber = (value: unknown): number | null => {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const formatPriceAmount = (currency: string, amount: number) =>
  `${getCurrencySymbol(currency)}${amount.toLocaleString()}`;

const isValidDiscount = (
  surface: DatasetPriceSurfaceUI | null | undefined,
  baseAmount: number | null,
  finalAmount: number | null
) =>
  Boolean(
    surface?.discount &&
    baseAmount !== null &&
    finalAmount !== null &&
    finalAmount > 0 &&
    finalAmount < baseAmount
  );

const getSurfacePriceDisplay = ({
  surface,
  fallbackAmount,
  fallbackCurrency,
  freeWhenMissing = false,
}: {
  surface?: DatasetPriceSurfaceUI | null;
  fallbackAmount?: number | null;
  fallbackCurrency?: string | null;
  freeWhenMissing?: boolean;
}): DatasetPriceDisplay => {
  const baseAmount =
    toSafeNumber(surface?.baseAmount) ?? fallbackAmount ?? null;
  const finalAmount =
    toSafeNumber(surface?.finalAmount) ?? fallbackAmount ?? null;
  const currency = surface?.currency ?? fallbackCurrency ?? "INR";
  const isDiscounted = isValidDiscount(surface, baseAmount, finalAmount);

  if (finalAmount === null) {
    return {
      hasPrice: freeWhenMissing,
      isFree: freeWhenMissing,
      isDiscounted: false,
      currency,
      finalAmount: null,
      originalAmount: null,
    };
  }

  return {
    hasPrice: true,
    isFree: false,
    isDiscounted,
    currency,
    finalAmount,
    originalAmount: isDiscounted ? baseAmount : null,
  };
};

export const getDatasetAccessPriceDisplay = (
  dataset: Dataset
): DatasetPriceDisplay => {
  if (dataset.pricing.type === "free") {
    return getSurfacePriceDisplay({
      surface: dataset.accessPrice,
      fallbackAmount: null,
      fallbackCurrency: dataset.pricing.currency,
      freeWhenMissing: true,
    });
  }

  return getSurfacePriceDisplay({
    surface: dataset.accessPrice,
    fallbackAmount: dataset.pricing.amount ?? null,
    fallbackCurrency: dataset.pricing.currency,
  });
};

export const getDatasetCommercialPriceDisplay = (
  dataset: Dataset
): DatasetPriceDisplay =>
  getSurfacePriceDisplay({
    surface: dataset.commercialPrice,
    fallbackAmount: dataset.actualPrice ?? null,
    fallbackCurrency: dataset.actualPriceCurrency ?? dataset.pricing.currency,
  });

export const getDatasetMarketplacePriceDisplay = (
  dataset: Dataset
): DatasetPriceDisplay =>
  dataset.isSample
    ? getDatasetCommercialPriceDisplay(dataset)
    : getDatasetAccessPriceDisplay(dataset);
