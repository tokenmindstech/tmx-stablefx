"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  DollarSign,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Check,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  useCostStore,
  type CostEntry,
  type CostCategory,
  type PaymentStatus,
  type PaymentMethod,
  type Currency,
} from "@/lib/cost-store";
import { useCampaignStore } from "@/lib/campaign-store";
import { useContentBriefStore } from "@/lib/content-brief-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ─── Constants ────────────────────────────────────────────────────────────────

const COST_CATEGORIES: CostCategory[] = [
  "KOL Fee",
  "Content Production",
  "Platform Fee",
  "Ad Spend",
  "Agency Fee",
  "Legal / Compliance",
  "Design",
  "Tools & Software",
  "Travel & Events",
  "Miscellaneous",
];

const PAYMENT_STATUSES: PaymentStatus[] = [
  "Pending",
  "Invoiced",
  "Partial",
  "Paid",
  "Overdue",
  "Cancelled",
];

const PAYMENT_METHODS: PaymentMethod[] = [
  "Bank Transfer",
  "Crypto",
  "PayPal",
  "Credit Card",
  "Wise",
  "Other",
];

const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "USDT", "BTC", "ETH"];

const PAYMENT_STATUS_STYLE: Record<PaymentStatus, string> = {
  Pending: "bg-slate-50 text-slate-700 border-slate-200",
  Invoiced: "bg-blue-50 text-blue-700 border-blue-200",
  Partial: "bg-amber-50 text-amber-700 border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Overdue: "bg-red-50 text-red-700 border-red-200",
  Cancelled: "bg-zinc-50 text-zinc-500 border-zinc-200",
};

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptyForm(
  overrides?: Partial<CostEntry>,
): Omit<CostEntry, "id" | "createdAt" | "updatedAt"> {
  return {
    description: "",
    category: "KOL Fee",
    campaignId: "",
    campaignTitle: "",
    contentBriefId: "",
    contentBriefTitle: "",
    amount: 0,
    currency: "USD",
    amountUSD: 0,
    paymentStatus: "Pending",
    paymentMethod: "Bank Transfer",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    paidDate: "",
    notes: "",
    ...overrides,
  };
}

// ─── Cost Dialog ──────────────────────────────────────────────────────────────

interface CostDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<CostEntry>;
  editId?: string;
}

function CostDialog({ open, onClose, initial, editId }: CostDialogProps) {
  const { addEntry, updateEntry } = useCostStore();
  const { campaigns } = useCampaignStore();
  const { briefs } = useContentBriefStore();

  const [form, setForm] = React.useState<
    Omit<CostEntry, "id" | "createdAt" | "updatedAt">
  >(emptyForm(initial));

  React.useEffect(() => {
    if (open) setForm(emptyForm(initial));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [campaignOpen, setCampaignOpen] = React.useState(false);
  const [briefOpen, setBriefOpen] = React.useState(false);

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleCampaignSelect(campaignId: string) {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    setForm((f) => ({ ...f, campaignId, campaignTitle: campaign.title }));
  }

  function handleBriefSelect(briefId: string) {
    const brief = briefs.find((b) => b.id === briefId);
    if (!brief) return;
    setForm((f) => ({
      ...f,
      contentBriefId: briefId,
      contentBriefTitle: brief.title,
      // Auto-fill campaign from brief if not already set
      campaignId: f.campaignId || brief.campaignId,
      campaignTitle: f.campaignTitle || brief.campaignTitle,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.description) return;
    if (editId) {
      updateEntry(editId, form);
    } else {
      const id = addEntry(form);
      useCostStore.getState().setHighlightId(id);
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editId ? "Edit cost entry" : "New cost entry"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Description */}
          <div className="space-y-1.5">
            <Label>
              Description <span className="text-destructive">*</span>
            </Label>
            <Input
              required
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="e.g. KOL fee — Twitter Thread — @cryptoking"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setField("category", v as CostCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COST_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campaign + KOL */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Campaign</Label>
              <Popover open={campaignOpen} onOpenChange={setCampaignOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    {form.campaignTitle || "Select campaign…"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command className="max-h-80">
                    <CommandInput placeholder="Search campaigns…" />
                    <CommandList>
                      <CommandEmpty>No campaigns found.</CommandEmpty>
                      <CommandGroup>
                        {campaigns.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={`${c.title} ${c.partnerName}`}
                            onSelect={() => {
                              handleCampaignSelect(c.id);
                              setCampaignOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {c.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {c.partnerName || "No partner"}
                              </div>
                            </div>
                            {form.campaignId === c.id && (
                              <Check className="h-4 w-4 text-[#FF4FD8] shrink-0" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5">
              <Label>Content Brief</Label>
              <Popover open={briefOpen} onOpenChange={setBriefOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    {form.contentBriefTitle || "Select brief…"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="start">
                  <Command className="max-h-80">
                    <CommandInput placeholder="Search briefs…" />
                    <CommandList>
                      <CommandEmpty>No briefs found.</CommandEmpty>
                      <CommandGroup>
                        {briefs.map((b) => (
                          <CommandItem
                            key={b.id}
                            value={`${b.title} ${b.campaignTitle}`}
                            onSelect={() => {
                              handleBriefSelect(b.id);
                              setBriefOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {b.title}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {b.campaignTitle || "No campaign"}
                              </div>
                            </div>
                            {form.contentBriefId === b.id && (
                              <Check className="h-4 w-4 text-[#FF4FD8] shrink-0" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Amount + Currency + USD equivalent */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => setField("amount", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => setField("currency", v as Currency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>USD equivalent</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amountUSD || ""}
                onChange={(e) => setField("amountUSD", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Payment status + method */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Payment status</Label>
              <Select
                value={form.paymentStatus}
                onValueChange={(v) =>
                  setField("paymentStatus", v as PaymentStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment method</Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) =>
                  setField("paymentMethod", v as PaymentMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Invoice date</Label>
              <Input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => setField("invoiceDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Paid date</Label>
              <Input
                type="date"
                value={form.paidDate}
                onChange={(e) => setField("paidDate", e.target.value)}
              />
            </div>
          </div>

          {/* Invoice number */}
          <div className="space-y-1.5">
            <Label>Invoice number</Label>
            <Input
              value={form.invoiceNumber}
              onChange={(e) => setField("invoiceNumber", e.target.value)}
              placeholder="INV-001"
            />
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Internal notes…"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FF4FD8] hover:bg-[#e040c0] text-white"
              disabled={!form.description}
            >
              {editId ? "Save changes" : "Add entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Cost Detail Drawer ───────────────────────────────────────────────────────

function initCostForm(
  e: CostEntry,
): Omit<CostEntry, "id" | "createdAt" | "updatedAt"> {
  return {
    description: e.description,
    category: e.category,
    campaignId: e.campaignId,
    campaignTitle: e.campaignTitle,
    contentBriefId: e.contentBriefId,
    contentBriefTitle: e.contentBriefTitle,
    amount: e.amount,
    currency: e.currency,
    amountUSD: e.amountUSD,
    paymentStatus: e.paymentStatus,
    paymentMethod: e.paymentMethod,
    invoiceNumber: e.invoiceNumber,
    invoiceDate: e.invoiceDate,
    dueDate: e.dueDate,
    paidDate: e.paidDate,
    notes: e.notes,
  };
}

const fmtDateDrawer = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function CostDetailDrawer({
  entry,
  onClose,
}: {
  entry: CostEntry | null;
  onClose: () => void;
}) {
  const { updateEntry, deleteEntry } = useCostStore();
  const { campaigns } = useCampaignStore();
  const { briefs } = useContentBriefStore();

  const linkedCampaign = React.useMemo(
    () =>
      entry?.campaignId
        ? (campaigns.find((c) => c.id === entry.campaignId) ?? null)
        : null,
    [campaigns, entry?.campaignId],
  );
  const linkedBrief = React.useMemo(
    () =>
      entry?.contentBriefId
        ? (briefs.find((b) => b.id === entry.contentBriefId) ?? null)
        : null,
    [briefs, entry?.contentBriefId],
  );

  const [form, setForm] = React.useState<
    Omit<CostEntry, "id" | "createdAt" | "updatedAt">
  >(entry ? initCostForm(entry) : emptyForm());
  const [campaignOpen, setCampaignOpen] = React.useState(false);
  const [briefOpen, setBriefOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (entry) {
      setForm(initCostForm(entry));
      setConfirmDelete(false);
    }
  }, [entry]);

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleCampaignSelect(campaignId: string) {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    setForm((f) => ({ ...f, campaignId, campaignTitle: campaign.title }));
  }

  function handleBriefSelect(briefId: string) {
    const brief = briefs.find((b) => b.id === briefId);
    if (!brief) return;
    setForm((f) => ({
      ...f,
      contentBriefId: briefId,
      contentBriefTitle: brief.title,
      campaignId: f.campaignId || brief.campaignId,
      campaignTitle: f.campaignTitle || brief.campaignTitle,
    }));
  }

  function handleSave() {
    if (!entry || !form.description) return;
    updateEntry(entry.id, form);
    onClose();
  }

  function handleDelete() {
    if (!entry) return;
    deleteEntry(entry.id);
    onClose();
  }

  return (
    <Sheet open={!!entry} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="truncate pr-6">
            {form.description || "Cost Entry"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Description */}
          <div className="space-y-1.5">
            <Label>
              Description <span className="text-destructive">*</span>
            </Label>
            <Input
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="e.g. KOL fee — Twitter Thread…"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setField("category", v as CostCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COST_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campaign + Content Brief */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Campaign</Label>
              <Popover open={campaignOpen} onOpenChange={setCampaignOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    {form.campaignTitle || "Select campaign…"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <Command className="max-h-80">
                    <CommandInput placeholder="Search campaigns…" />
                    <CommandList>
                      <CommandEmpty>No campaigns found.</CommandEmpty>
                      <CommandGroup>
                        {campaigns.map((c) => (
                          <CommandItem
                            key={c.id}
                            value={`${c.title} ${c.partnerName}`}
                            onSelect={() => {
                              handleCampaignSelect(c.id);
                              setCampaignOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {c.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {c.partnerName || "No partner"}
                              </div>
                            </div>
                            {form.campaignId === c.id && (
                              <Check className="h-4 w-4 text-[#FF4FD8] shrink-0" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Content Brief</Label>
              <Popover open={briefOpen} onOpenChange={setBriefOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start font-normal"
                  >
                    {form.contentBriefTitle || "Select brief…"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="start">
                  <Command className="max-h-80">
                    <CommandInput placeholder="Search briefs…" />
                    <CommandList>
                      <CommandEmpty>No briefs found.</CommandEmpty>
                      <CommandGroup>
                        {briefs.map((b) => (
                          <CommandItem
                            key={b.id}
                            value={`${b.title} ${b.campaignTitle}`}
                            onSelect={() => {
                              handleBriefSelect(b.id);
                              setBriefOpen(false);
                            }}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">
                                {b.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {b.campaignTitle || "No campaign"}
                              </div>
                            </div>
                            {form.contentBriefId === b.id && (
                              <Check className="h-4 w-4 text-[#FF4FD8] shrink-0" />
                            )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Amount + Currency + USD */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => setField("amount", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => setField("currency", v as Currency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>USD equivalent</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amountUSD || ""}
                onChange={(e) => setField("amountUSD", Number(e.target.value))}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Status + Method */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Payment status</Label>
              <Select
                value={form.paymentStatus}
                onValueChange={(v) =>
                  setField("paymentStatus", v as PaymentStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Payment method</Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) =>
                  setField("paymentMethod", v as PaymentMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Invoice date</Label>
              <Input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => setField("invoiceDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Paid date</Label>
              <Input
                type="date"
                value={form.paidDate}
                onChange={(e) => setField("paidDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Invoice number</Label>
            <Input
              value={form.invoiceNumber}
              onChange={(e) => setField("invoiceNumber", e.target.value)}
              placeholder="INV-001"
            />
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Internal notes…"
            />
          </div>

          {/* ── Linked Data ── */}
          <Separator />

          {/* Linked campaign */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Linked Campaign
            </p>
            {linkedCampaign ? (
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2 gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">
                    {linkedCampaign.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {linkedCampaign.partnerName || "No partner"} ·{" "}
                    {linkedCampaign.dealStatus}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {linkedCampaign.outreachStage}
                </Badge>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No campaign linked.
              </p>
            )}
          </div>

          {/* Linked brief */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Linked Content Brief
            </p>
            {linkedBrief ? (
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2 gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">
                    {linkedBrief.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {linkedBrief.contentType} · {linkedBrief.platform} · Due{" "}
                    {fmtDateDrawer(linkedBrief.dueDate)}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">
                  {linkedBrief.status}
                </Badge>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No content brief linked.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <p className="flex-1 text-sm text-foreground">
                Delete this entry?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                Confirm delete
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/40 hover:bg-destructive/10"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (entry) setForm(initCostForm(entry));
                  setConfirmDelete(false);
                }}
              >
                Discard
              </Button>
              <Button
                size="sm"
                className="bg-[#FF4FD8] hover:bg-[#e040c0] text-white"
                disabled={!form.description}
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCards({ entries }: { entries: CostEntry[] }) {
  const totalUSD = entries.reduce((s, e) => s + (e.amountUSD || 0), 0);
  const paid = entries
    .filter((e) => e.paymentStatus === "Paid")
    .reduce((s, e) => s + (e.amountUSD || 0), 0);
  const pending = entries
    .filter((e) => ["Pending", "Invoiced", "Partial"].includes(e.paymentStatus))
    .reduce((s, e) => s + (e.amountUSD || 0), 0);
  const overdue = entries
    .filter((e) => e.paymentStatus === "Overdue")
    .reduce((s, e) => s + (e.amountUSD || 0), 0);

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        {
          label: "Total spend (USD)",
          value: fmt(totalUSD),
          color: "text-foreground",
        },
        { label: "Paid", value: fmt(paid), color: "text-emerald-600" },
        {
          label: "Pending / Invoiced",
          value: fmt(pending),
          color: "text-amber-600",
        },
        { label: "Overdue", value: fmt(overdue), color: "text-red-600" },
      ].map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border/60 bg-card px-4 py-3 shadow-sm"
        >
          <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
          <p className={`text-xl font-semibold tabular-nums ${card.color}`}>
            ${card.value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Table View ───────────────────────────────────────────────────────────────

type SortKey =
  | "description"
  | "category"
  | "campaignTitle"
  | "contentBriefTitle"
  | "amount"
  | "amountUSD"
  | "paymentStatus"
  | "paymentMethod"
  | "dueDate"
  | "paidDate";
type SortDir = "asc" | "desc";

interface TableViewProps {
  entries: CostEntry[];
  highlightId: string | null;
  onSelect: (e: CostEntry) => void;
}

function TableView({ entries, highlightId, onSelect }: TableViewProps) {
  const [sortKey, setSortKey] = React.useState<SortKey>("description");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = React.useMemo(() => {
    return [...entries].sort((a, b) => {
      const av =
        sortKey === "amount" || sortKey === "amountUSD"
          ? (a[sortKey] ?? 0)
          : (a[sortKey] ?? "");
      const bv =
        sortKey === "amount" || sortKey === "amountUSD"
          ? (b[sortKey] ?? 0)
          : (b[sortKey] ?? "");
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [entries, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-[#FF4FD8]" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-[#FF4FD8]" />
    );
  }

  function Th({
    col,
    label,
    align = "left",
  }: {
    col: SortKey;
    label: string;
    align?: "left" | "right";
  }) {
    return (
      <th
        className={`py-3 px-4 text-${align} text-xs font-medium text-muted-foreground select-none cursor-pointer hover:text-foreground whitespace-nowrap`}
        onClick={() => handleSort(col)}
      >
        <span className="inline-flex items-center gap-0.5">
          {label}
          <SortIcon col={col} />
        </span>
      </th>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <DollarSign className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">No cost entries</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Add your first cost entry to start tracking campaign spend.
        </p>
      </div>
    );
  }

  const fmtDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "—";

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <Th col="description" label="Description" />
              <Th col="category" label="Category" />
              <Th col="campaignTitle" label="Campaign" />
              <Th col="contentBriefTitle" label="Content Brief" />
              <Th col="amount" label="Amount" align="right" />
              <Th col="amountUSD" label="USD Equiv." align="right" />
              <Th col="paymentStatus" label="Status" />
              <Th col="paymentMethod" label="Method" />
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
                Invoice #
              </th>
              <Th col="dueDate" label="Due" />
              <Th col="paidDate" label="Paid" />
              <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground w-20 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e) => (
              <tr
                key={e.id}
                className={`border-b border-border/20 last:border-0 transition-colors ${
                  e.id === highlightId ? "bg-[#FFF5FC]" : "hover:bg-muted/20"
                }`}
              >
                <td className="py-3 px-4 font-medium text-foreground max-w-52">
                  <button
                    onClick={() => onSelect(e)}
                    className="block truncate text-left hover:text-[#FF4FD8] transition-colors cursor-pointer"
                    title={e.description}
                  >
                    {e.description}
                  </button>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {e.category}
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground max-w-40">
                  <span className="block truncate" title={e.campaignTitle}>
                    {e.campaignTitle || "—"}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground max-w-40">
                  <span className="block truncate" title={e.contentBriefTitle}>
                    {e.contentBriefTitle || "—"}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-medium text-foreground whitespace-nowrap">
                  {e.amount > 0
                    ? `${e.currency} ${e.amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </td>
                <td className="py-3 px-4 text-right text-xs text-muted-foreground whitespace-nowrap">
                  {e.amountUSD > 0
                    ? `$${e.amountUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant="outline"
                    className={`text-[10px] whitespace-nowrap ${PAYMENT_STATUS_STYLE[e.paymentStatus]}`}
                  >
                    {e.paymentStatus}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {e.paymentMethod}
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {e.invoiceNumber || "—"}
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {fmtDate(e.dueDate)}
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                  {fmtDate(e.paidDate)}
                </td>
                <td className="py-3 px-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => onSelect(e)}
                  >
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border/40 bg-muted/10 px-4 py-2 text-xs text-muted-foreground">
        {sorted.length} {sorted.length === 1 ? "entry" : "entries"}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function CostPageInner() {
  const searchParams = useSearchParams();
  const { entries, highlightId, setHighlightId } = useCostStore();

  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterCategory, setFilterCategory] = React.useState("all");

  // Detail drawer
  const [selectedEntry, setSelectedEntry] = React.useState<CostEntry | null>(
    null,
  );

  // Create dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Auto-open if ?new=1
  React.useEffect(() => {
    if (searchParams.get("new") === "1") setDialogOpen(true);
  }, [searchParams]);

  // Clear highlight after 3s
  React.useEffect(() => {
    if (!highlightId) return;
    const t = setTimeout(() => setHighlightId(null), 3000);
    return () => clearTimeout(t);
  }, [highlightId, setHighlightId]);

  // Keep drawer in sync with store
  const drawerEntry = React.useMemo(
    () =>
      selectedEntry
        ? (entries.find((e) => e.id === selectedEntry.id) ?? null)
        : null,
    [entries, selectedEntry],
  );

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return entries.filter((e) => {
      if (
        q &&
        !e.description.toLowerCase().includes(q) &&
        !e.campaignTitle.toLowerCase().includes(q) &&
        !e.contentBriefTitle.toLowerCase().includes(q) &&
        !e.invoiceNumber.toLowerCase().includes(q)
      )
        return false;
      if (filterStatus !== "all" && e.paymentStatus !== filterStatus)
        return false;
      if (filterCategory !== "all" && e.category !== filterCategory)
        return false;
      return true;
    });
  }, [entries, search, filterStatus, filterCategory]);

  const activeFilters = [
    search !== "",
    filterStatus !== "all",
    filterCategory !== "all",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setFilterStatus("all");
    setFilterCategory("all");
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-6 bg-background min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Cost Tracker
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track spend across all KOL campaigns. Entries are linked to
            campaigns and partners.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-[#FF4FD8] hover:bg-[#e040c0] text-white mt-3 sm:mt-0"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add entry
        </Button>
      </div>

      {/* Summary cards */}
      <SummaryCards entries={entries} />

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by description, campaign, KOL, or invoice #…"
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <Badge className="ml-1 h-5 min-w-5 px-1 text-xs bg-[#FF4FD8] text-white hover:bg-[#FF4FD8]">
                  {activeFilters}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Filters</span>
              {activeFilters > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground font-medium">
                  Payment status
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {PAYMENT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground font-medium">
                  Category
                </label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {COST_CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Table */}
      <TableView
        entries={filtered}
        highlightId={highlightId}
        onSelect={setSelectedEntry}
      />

      {/* Create dialog */}
      <CostDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      {/* Detail drawer (edit / delete) */}
      <CostDetailDrawer
        entry={drawerEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}

export default function CostPage() {
  return (
    <Suspense>
      <CostPageInner />
    </Suspense>
  );
}
