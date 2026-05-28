"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, ArrowLeftRight, MoreHorizontal, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWalletStore, type Wallet } from "@/lib/wallet-store";
import { ALL_ASSETS, ASSET_COLORS, type StablecoinAsset } from "@/lib/rates";
import { AssetIcon } from "@/components/asset-icon";

// ── helpers ──────────────────────────────────────────────────────────────────

function fmtBalance(n: number, asset: StablecoinAsset) {
  return (
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) +
    " " +
    asset
  );
}

function truncateAddr(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function lastActivityLabel(days: number) {
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

// ── Summary card ─────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl border border-border p-4 shadow-sm">
      <div className="size-10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Asset badge ──────────────────────────────────────────────────────────────

function AssetBadge({ asset }: { asset: StablecoinAsset }) {
  const c = ASSET_COLORS[asset];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${c.bg} ${c.text}`}
    >
      {asset}
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function TreasuryWalletsPage() {
  const { wallets, addWallet, updateWallet } = useWalletStore();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [asset, setAsset] = React.useState<StablecoinAsset>("USDC");
  const [address, setAddress] = React.useState("");

  // Summary totals
  const usdcTotal = wallets
    .filter((w) => w.asset === "USDC")
    .reduce((s, w) => s + w.balance, 0);
  const eurcTotal = wallets
    .filter((w) => w.asset === "EURC")
    .reduce((s, w) => s + w.balance, 0);
  const activeCount = wallets.filter((w) => w.status === "active").length;
  const totalCount = wallets.length;

  function handleAdd() {
    if (!name.trim()) return;
    addWallet({
      name: name.trim(),
      asset,
      address:
        address.trim() ||
        "0x" +
          Math.random().toString(16).slice(2, 10).toUpperCase() +
          "..." +
          Math.random().toString(16).slice(2, 6).toUpperCase(),
      balance: 0,
      status: "active",
      txnCount: 0,
      lastActivityDaysAgo: 0,
    });
    setOpen(false);
    setName("");
    setAsset("USDC");
    setAddress("");
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Treasury Wallets</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your MPC treasury wallets (USDC, EURC, AUDF, MXNB &amp; QCAD)
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="gap-2 text-white border-0"
          style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
        >
          <Plus className="size-4" />
          New Wallet
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="USDC Balance"
          value={fmtBalance(usdcTotal, "USDC")}
          icon={<AssetIcon asset="USDC" size={40} />}
        />
        <SummaryCard
          label="EURC Balance"
          value={fmtBalance(eurcTotal, "EURC")}
          icon={<AssetIcon asset="EURC" size={40} />}
        />
        <SummaryCard
          label="Active Wallets"
          value={`${activeCount} / ${totalCount}`}
          icon={
            <div
              className="size-10 rounded-xl flex items-center justify-center text-[13px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, #6b7280, #374151)",
              }}
            >
              {String(activeCount)}
            </div>
          }
        />
      </div>

      {/* Wallet table */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Wallet
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Address
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Asset
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Balance
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Status
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Last Activity
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w) => (
              <WalletRow key={w.id} wallet={w} onToggle={updateWallet} />
            ))}
          </tbody>
        </table>
      </div>

      {/* New Wallet dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Wallet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Wallet Name</Label>
              <Input
                placeholder="e.g. Primary USDC Vault"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Asset</Label>
              <Select
                value={asset}
                onValueChange={(v) => setAsset(v as StablecoinAsset)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_ASSETS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>
                Address{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="0x... (auto-generated if blank)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="text-white border-0"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
              }}
            >
              Create Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Wallet table row ──────────────────────────────────────────────────────────

function WalletRow({
  wallet: w,
  onToggle,
}: {
  wallet: Wallet;
  onToggle: (id: string, patch: Partial<Wallet>) => void;
}) {
  const [copied, setCopied] = React.useState(false);

  function copyAddr() {
    navigator.clipboard.writeText(w.address).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
      {/* Wallet */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-9 flex items-center justify-center shrink-0">
            <AssetIcon asset={w.asset} size={36} />
          </div>
          <div>
            <p className="font-medium leading-tight">{w.name}</p>
            <p className="text-xs text-muted-foreground">{w.txnCount} txns</p>
          </div>
        </div>
      </td>

      {/* Address */}
      <td className="px-4 py-3">
        <button
          onClick={copyAddr}
          className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors group"
          title={w.address}
        >
          {truncateAddr(w.address)}
          <Copy className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          {copied && (
            <span className="text-[10px] text-[#FF4FD8] font-sans">
              Copied!
            </span>
          )}
        </button>
      </td>

      {/* Asset */}
      <td className="px-4 py-3">
        <AssetBadge asset={w.asset} />
      </td>

      {/* Balance */}
      <td className="px-4 py-3 text-right">
        <span className="font-semibold">
          {w.balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>{" "}
        <span className="text-xs text-muted-foreground">{w.asset}</span>
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
            w.status === "active"
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              w.status === "active" ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {w.status === "active" ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Last Activity */}
      <td className="px-4 py-3 text-muted-foreground text-sm">
        {lastActivityLabel(w.lastActivityDaysAgo)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link
                href="/dashboard/transfer"
                className="flex items-center gap-2"
              >
                <ArrowLeftRight className="size-3.5" />
                Transfer
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onToggle(w.id, {
                  status: w.status === "active" ? "inactive" : "active",
                })
              }
            >
              {w.status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
