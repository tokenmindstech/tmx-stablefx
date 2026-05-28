"use client";

import * as React from "react";
import { useTransactionStore, type TxRecord } from "@/lib/transaction-store";
import { ASSET_COLORS, ALL_ASSETS, type StablecoinAsset } from "@/lib/rates";

// ── Badges ────────────────────────────────────────────────────────────────────

function AssetBadge({ asset }: { asset: StablecoinAsset }) {
  const c = ASSET_COLORS[asset];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${c.bg} ${c.text}`}>
      {asset}
    </span>
  );
}

function TypeBadge({ type }: { type: TxRecord["type"] }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
        type === "Swap" ? "bg-purple-100 text-purple-700" : "bg-pink-100 text-pink-700"
      }`}
    >
      {type}
    </span>
  );
}

function StatusBadge({ status }: { status: TxRecord["status"] }) {
  const styles = {
    Completed: { pill: "bg-green-50 text-green-700", dot: "bg-green-500" },
    Pending: { pill: "bg-yellow-50 text-yellow-700", dot: "bg-yellow-500" },
    Failed: { pill: "bg-red-50 text-red-700", dot: "bg-red-500" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold ${styles.pill}`}>
      <span className={`size-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { transactions } = useTransactionStore();
  const [assetFilter, setAssetFilter] = React.useState<StablecoinAsset | "All">("All");

  const filtered =
    assetFilter === "All"
      ? transactions
      : transactions.filter(
          (t) => t.fromAsset === assetFilter || t.toAsset === assetFilter,
        );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          History of all treasury transfers and swaps
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {(["All", ...ALL_ASSETS] as (StablecoinAsset | "All")[]).map((a) => (
          <button
            key={a}
            onClick={() => setAssetFilter(a)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              assetFilter === a
                ? "bg-[#FF4FD8] text-white border-[#FF4FD8]"
                : "border-border text-muted-foreground hover:border-[#FF4FD8] hover:text-[#FF4FD8]"
            }`}
          >
            {a}
          </button>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Tx Hash", "Type", "From Amount", "→", "To Amount", "Wallet", "Vendor", "Status", "Date"].map(
                (h) => (
                  <th
                    key={h}
                    className={`text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap ${h === "→" ? "text-center px-1" : ""}`}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No transactions found.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => <TxRow key={tx.id} tx={tx} />)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Transaction row ───────────────────────────────────────────────────────────

function TxRow({ tx }: { tx: TxRecord }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
      {/* Hash */}
      <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
        {tx.hash}
      </td>

      {/* Type */}
      <td className="px-4 py-3">
        <TypeBadge type={tx.type} />
      </td>

      {/* From amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">
            {tx.fromAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <AssetBadge asset={tx.fromAsset} />
        </div>
      </td>

      {/* Arrow */}
      <td className="px-1 py-3 text-center text-muted-foreground text-base">→</td>

      {/* To amount */}
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">
            {tx.toAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <AssetBadge asset={tx.toAsset} />
        </div>
      </td>

      {/* Wallet */}
      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[130px] truncate">
        {tx.fromWallet}
      </td>

      {/* Vendor */}
      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[130px] truncate">
        {tx.toVendor}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <StatusBadge status={tx.status} />
      </td>

      {/* Date */}
      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap text-xs">
        {tx.date}
      </td>
    </tr>
  );
}
