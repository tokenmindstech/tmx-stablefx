export type StablecoinAsset = "USDC" | "EURC" | "AUDF" | "MXNB" | "QCAD";

export const ASSET_LABELS: Record<StablecoinAsset, string> = {
  USDC: "USDC",
  EURC: "EURC",
  AUDF: "AUDF",
  MXNB: "MXNB",
  QCAD: "QCAD",
};

/** Static mid-market rates relative to USD (1 USDC = 1 USD) */
const USD_RATES: Record<StablecoinAsset, number> = {
  USDC: 1,
  EURC: 0.90269,
  AUDF: 1.5543,
  MXNB: 17.5,
  QCAD: 1.3621,
};

/**
 * Returns how many `to` units you get for 1 `from` unit.
 * USD_RATES stores "units of asset per 1 USD", so to go from→to:
 *   1 from = (1 / USD_RATES[from]) USD = (USD_RATES[to] / USD_RATES[from]) to-units
 * e.g. getRate("USDC", "MXNB") → 17.5  (1 USDC = 17.5 MXNB)
 *      getRate("USDC", "EURC") → 0.90269 (1 USDC = 0.90269 EURC)
 */
export function getRate(from: StablecoinAsset, to: StablecoinAsset): number {
  const fromUsd = USD_RATES[from];
  const toUsd = USD_RATES[to];
  return toUsd / fromUsd;
}

export const ALL_ASSETS: StablecoinAsset[] = [
  "USDC",
  "EURC",
  "AUDF",
  "MXNB",
  "QCAD",
];

/** Badge color classes per asset */
export const ASSET_COLORS: Record<
  StablecoinAsset,
  { bg: string; text: string }
> = {
  USDC: { bg: "bg-blue-100", text: "text-blue-700" },
  EURC: { bg: "bg-indigo-100", text: "text-indigo-700" },
  AUDF: { bg: "bg-yellow-100", text: "text-yellow-700" },
  MXNB: { bg: "bg-green-100", text: "text-green-700" },
  QCAD: { bg: "bg-red-100", text: "text-red-700" },
};

/** Short avatar initials per asset */
export const ASSET_INITIALS: Record<StablecoinAsset, string> = {
  USDC: "US",
  EURC: "EU",
  AUDF: "AU",
  MXNB: "MX",
  QCAD: "CA",
};

/** Avatar gradient per asset */
export const ASSET_GRADIENTS: Record<StablecoinAsset, string> = {
  USDC: "linear-gradient(135deg, #1a73e8, #0d47a1)",
  EURC: "linear-gradient(135deg, #3949ab, #1a237e)",
  AUDF: "linear-gradient(135deg, #f9a825, #e65100)",
  MXNB: "linear-gradient(135deg, #2e7d32, #1b5e20)",
  QCAD: "linear-gradient(135deg, #c62828, #b71c1c)",
};
