"use client";

import * as React from "react";
import { Trash2, Plus, Info, ArrowRight, Check, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWalletStore } from "@/lib/wallet-store";
import { useVendorStore, type Vendor } from "@/lib/vendor-store";
import { useTransactionStore } from "@/lib/transaction-store";
import {
  ALL_ASSETS,
  ASSET_COLORS,
  getRate,
  type StablecoinAsset,
} from "@/lib/rates";
import { AssetIcon } from "@/components/asset-icon";

// ── constants ─────────────────────────────────────────────────────────────────

const TENOR_OPTIONS = [
  { value: "instant", label: "Instant", desc: "Trade matures in 30 minutes." },
  { value: "t1", label: "T+1", desc: "Settlement by next business day." },
  { value: "t2", label: "T+2", desc: "Settlement in two business days." },
];

// ── Step indicator ────────────────────────────────────────────────────────────

const STEP_LABELS = ["Vendor", "Wallet", "Amount", "Confirm"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center gap-1">
              <div
                className={`size-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  done || active
                    ? "bg-[#FF4FD8] text-white"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {done ? <Check className="size-3.5" /> : num}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  active ? "text-[#FF4FD8]" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`h-px flex-1 mx-1.5 mb-5 transition-colors ${
                  step > num ? "bg-[#FF4FD8]" : "bg-border"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Asset chip (inline asset display) ────────────────────────────────────────

function AssetChip({ asset }: { asset: StablecoinAsset }) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-border bg-muted/40 text-sm font-semibold min-w-[90px] justify-center shrink-0">
      <AssetIcon asset={asset} size={20} />
      {asset}
    </div>
  );
}

// ── Vendor row ────────────────────────────────────────────────────────────────

function VendorRow({
  vendor: v,
  selected,
  onSelect,
  onDelete,
}: {
  vendor: Vendor;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const c = ASSET_COLORS[v.preferredAsset];
  return (
    <div
      onClick={onSelect}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${
        selected
          ? "border-[#FF4FD8] bg-[#FFF5FC]"
          : "border-border hover:border-[#FF4FD8]/50 hover:bg-muted/30"
      }`}
    >
      <div className="size-8 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground shrink-0">
        <svg viewBox="0 0 16 16" className="size-4 fill-current" aria-hidden>
          <rect x="1" y="3" width="14" height="10" rx="2" />
          <rect x="1" y="6" width="14" height="2" fill="white" opacity="0.3" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{v.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {v.bank} · {v.accountNumber}
        </p>
      </div>
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${c.bg} ${c.text} shrink-0`}
      >
        {v.preferredAsset}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-1"
        title="Remove vendor"
      >
        <Trash2 className="size-3.5" />
      </button>
    </div>
  );
}

// ── Summary row ───────────────────────────────────────────────────────────────

function SummaryRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span
        className={`font-medium text-sm ${muted ? "text-muted-foreground" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;
type FlowState = "idle" | "processing" | "success";

export default function TransferPage() {
  const { wallets } = useWalletStore();
  const { vendors, addVendor, deleteVendor } = useVendorStore();
  const { addTransaction } = useTransactionStore();

  // navigation
  const [step, setStep] = React.useState<Step>(1);
  const [flowState, setFlowState] = React.useState<FlowState>("idle");

  // step 1
  const [selectedVendorId, setSelectedVendorId] = React.useState<string | null>(
    null,
  );
  const [addOpen, setAddOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newBank, setNewBank] = React.useState("");
  const [newAccount, setNewAccount] = React.useState("");
  const [newAsset, setNewAsset] = React.useState<StablecoinAsset>("USDC");

  // step 2
  const [sourceWalletId, setSourceWalletId] = React.useState<string>("");

  // step 3
  const [fromAmt, setFromAmt] = React.useState("");
  const [toAmt, setToAmt] = React.useState("");
  const [tenor, setTenor] = React.useState("instant");

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId) ?? null;
  const sourceWallet = wallets.find((w) => w.id === sourceWalletId) ?? null;
  const fromAsset: StablecoinAsset = sourceWallet?.asset ?? "USDC";
  const toAsset: StablecoinAsset = selectedVendor?.preferredAsset ?? "EURC";
  const rate = getRate(fromAsset, toAsset);
  const tenorObj = TENOR_OPTIONS.find((t) => t.value === tenor)!;

  // ── Amount calculation ───────────────────────────────────────────────────
  function handleFromChange(val: string) {
    setFromAmt(val);
    const n = parseFloat(val);
    setToAmt(!isNaN(n) && n > 0 ? (n * rate).toFixed(4) : "");
  }

  function handleToChange(val: string) {
    setToAmt(val);
    const n = parseFloat(val);
    setFromAmt(!isNaN(n) && n > 0 ? (n / rate).toFixed(4) : "");
  }

  // ── Add vendor ───────────────────────────────────────────────────────────
  function handleAddVendor() {
    if (!newName.trim()) return;
    addVendor({
      name: newName.trim(),
      bank: newBank.trim(),
      accountNumber: newAccount.trim(),
      preferredAsset: newAsset,
    });
    setAddOpen(false);
    setNewName("");
    setNewBank("");
    setNewAccount("");
    setNewAsset("USDC");
  }

  // ── Confirm → processing → success ──────────────────────────────────────
  function handleConfirm() {
    setFlowState("processing");
    // simulate processing delay
    setTimeout(() => {
      const isSameAsset = fromAsset === toAsset;
      addTransaction({
        type: isSameAsset ? "Transfer" : "Swap",
        fromAsset,
        toAsset,
        fromAmount: parseFloat(fromAmt) || 0,
        toAmount: parseFloat(toAmt) || 0,
        fromWallet: sourceWallet?.name ?? "—",
        toVendor: selectedVendor?.name ?? "—",
        status: "Completed",
        tenor,
      });
      setFlowState("success");
    }, 2800);
  }

  function handleReset() {
    setStep(1);
    setFlowState("idle");
    setSelectedVendorId(null);
    setSourceWalletId("");
    setFromAmt("");
    setToAmt("");
    setTenor("instant");
  }

  // ── Processing overlay ───────────────────────────────────────────────────
  if (flowState === "processing") {
    return (
      <div
        className="p-6 flex items-center justify-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center space-y-5">
          <div className="relative size-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-[#FF4FD8]/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FF4FD8] animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Processing Transfer</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Broadcasting to the network, please wait…
            </p>
          </div>
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="size-2 rounded-full bg-[#FF4FD8] animate-pulse"
                style={{ animationDelay: `${i * 250}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Success state ────────────────────────────────────────────────────────
  if (flowState === "success") {
    return (
      <div
        className="p-6 flex items-center justify-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="text-center space-y-4">
          <div
            className="size-16 rounded-full flex items-center justify-center mx-auto text-white"
            style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
          >
            <Check className="size-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Transfer Submitted</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {parseFloat(fromAmt).toLocaleString()} {fromAsset} →{" "}
              {parseFloat(toAmt).toLocaleString()} {toAsset}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Settlement: {tenorObj.label}
            </p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Button variant="outline" asChild>
              <a href="/dashboard/transactions">View Transactions</a>
            </Button>
            <Button
              onClick={handleReset}
              className="text-white border-0"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
              }}
            >
              New Transfer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Transfer to Vendor</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Send stablecoins directly to a vendor&apos;s wallet
        </p>
      </div>

      <div className="max-w-lg">
        <StepIndicator step={step} />

        {/* ── Step 1: Vendor ── */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
            <div>
              <p className="font-semibold text-base">Select Vendor</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose from your address book or add a new entry
              </p>
            </div>

            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-0.5">
              {vendors.map((v) => (
                <VendorRow
                  key={v.id}
                  vendor={v}
                  selected={selectedVendorId === v.id}
                  onSelect={() =>
                    setSelectedVendorId((cur) => (cur === v.id ? null : v.id))
                  }
                  onDelete={() => deleteVendor(v.id)}
                />
              ))}
            </div>

            <button
              onClick={() => setAddOpen(true)}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-2.5 text-sm text-muted-foreground hover:border-[#FF4FD8] hover:text-[#FF4FD8] transition-colors"
            >
              <Plus className="size-4" />
              Add New Vendor
            </button>

            <div className="flex justify-end">
              <Button
                disabled={!selectedVendorId}
                onClick={() => setStep(2)}
                className="gap-2 text-white border-0"
                style={{
                  background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
                }}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 2: Source Wallet ── */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
            <div>
              <p className="font-semibold text-base">Select Source Wallet</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Sending to{" "}
                <span className="font-medium text-foreground">
                  {selectedVendor?.name}
                </span>{" "}
                ({selectedVendor?.preferredAsset})
              </p>
            </div>

            <div className="space-y-2">
              {wallets
                .filter((w) => w.status === "active")
                .map((w) => {
                  const selected = sourceWalletId === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setSourceWalletId(w.id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${
                        selected
                          ? "border-[#FF4FD8] bg-[#FFF5FC]"
                          : "border-border hover:border-[#FF4FD8]/50 hover:bg-muted/20"
                      }`}
                    >
                      <div className="size-9 flex items-center justify-center shrink-0">
                        <AssetIcon asset={w.asset} size={36} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{w.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {w.balance.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {w.asset}
                        </p>
                      </div>
                      <Wallet
                        className={`size-4 shrink-0 ${
                          selected ? "text-[#FF4FD8]" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  );
                })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                disabled={!sourceWalletId}
                onClick={() => setStep(3)}
                className="gap-2 text-white border-0"
                style={{
                  background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
                }}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Amount ── */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
            <div>
              <p className="font-semibold text-base">Set Amount</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Enter the amount you want to send or receive
              </p>
            </div>

            {/* From row */}
            <div className="space-y-1.5">
              <Label>From</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={fromAmt}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="flex-1"
                />
                <AssetChip asset={fromAsset} />
              </div>
              <p className="text-xs text-muted-foreground pl-0.5">
                Available:{" "}
                {sourceWallet?.balance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {fromAsset}
              </p>
            </div>

            {/* To row */}
            <div className="space-y-1.5">
              <Label>To</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  min="0"
                  placeholder="0.00"
                  value={toAmt}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="flex-1"
                />
                <AssetChip asset={toAsset} />
              </div>
              <p className="text-xs text-muted-foreground pl-0.5">
                Vendor receives in {toAsset}
              </p>
            </div>

            {/* Rate */}
            <div className="flex justify-between items-center text-xs px-3 py-2 bg-muted/40 rounded-md">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">
                1.00 {fromAsset} = {rate.toFixed(5)} {toAsset}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                disabled={!fromAmt || parseFloat(fromAmt) <= 0}
                onClick={() => setStep(4)}
                className="gap-2 text-white border-0"
                style={{
                  background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
                }}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 4: Review & Confirm ── */}
        {step === 4 && (
          <div className="bg-white rounded-xl border border-border shadow-sm p-5 space-y-4">
            <div>
              <p className="font-semibold text-base">Review Transfer</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Confirm the details before submitting
              </p>
            </div>

            <div className="space-y-2.5 bg-muted/30 rounded-lg p-4">
              <SummaryRow
                label="From Wallet"
                value={sourceWallet?.name ?? "—"}
              />
              <SummaryRow
                label="To Vendor"
                value={selectedVendor?.name ?? "—"}
              />
              <SummaryRow
                label="Bank"
                value={`${selectedVendor?.bank ?? "—"} · ${selectedVendor?.accountNumber ?? "—"}`}
              />
              <div className="border-t border-border my-1" />
              <SummaryRow
                label="Amount (From)"
                value={`${parseFloat(fromAmt || "0").toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${fromAsset}`}
              />
              <SummaryRow
                label="Amount (To)"
                value={`${parseFloat(toAmt || "0").toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${toAsset}`}
              />
              <SummaryRow
                label="Exchange Rate"
                value={`1 ${fromAsset} = ${rate.toFixed(5)} ${toAsset}`}
              />
              <SummaryRow label="Settlement" value={tenorObj.label} />
              <div className="border-t border-border my-1" />
              <SummaryRow label="Estimated Fee" value="0.10 USDC" muted />
            </div>

            <div className="flex items-center justify-between pt-1">
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                Back
              </Button>
              <Button
                onClick={handleConfirm}
                className="gap-2 text-white border-0"
                style={{
                  background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
                }}
              >
                <Check className="size-4" />
                Confirm Transfer
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Add Vendor dialog ── */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Vendor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input
                placeholder="Vendor or company name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Bank</Label>
              <Input
                placeholder="e.g. BBVA Mexico"
                value={newBank}
                onChange={(e) => setNewBank(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Account Number</Label>
              <Input
                placeholder="Account / CLABE / IBAN"
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Preferred Asset</Label>
              <Select
                value={newAsset}
                onValueChange={(v) => setNewAsset(v as StablecoinAsset)}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddVendor}
              disabled={!newName.trim()}
              className="text-white border-0"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
              }}
            >
              Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
