import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "./campaign-store";

// Re-export so consumers can import from one place
export type { Currency };

// ─── Types ───────────────────────────────────────────────────────────────────

export type CostCategory =
  | "KOL Fee"
  | "Content Production"
  | "Platform Fee"
  | "Ad Spend"
  | "Agency Fee"
  | "Legal / Compliance"
  | "Design"
  | "Tools & Software"
  | "Travel & Events"
  | "Miscellaneous";

export type PaymentStatus =
  | "Pending"
  | "Invoiced"
  | "Partial"
  | "Paid"
  | "Overdue"
  | "Cancelled";

export type PaymentMethod =
  | "Bank Transfer"
  | "Crypto"
  | "PayPal"
  | "Credit Card"
  | "Wise"
  | "Other";

export interface CostEntry {
  id: string;

  // Description
  description: string;
  category: CostCategory;

  // Linked entities (denormalized for display)
  campaignId: string;
  campaignTitle: string;
  contentBriefId: string;
  contentBriefTitle: string;

  // Amount
  amount: number;
  currency: Currency;
  /** Amount converted to USD for aggregation; set manually or left 0 */
  amountUSD: number;

  // Payment
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  invoiceNumber: string;
  invoiceDate: string; // ISO YYYY-MM-DD
  dueDate: string;
  paidDate: string;

  // Notes
  notes: string;

  createdAt: string; // ISO timestamp
  updatedAt: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface CostState {
  entries: CostEntry[];

  addEntry: (data: Omit<CostEntry, "id" | "createdAt" | "updatedAt">) => string;
  updateEntry: (id: string, data: Partial<CostEntry>) => void;
  deleteEntry: (id: string) => void;
  highlightId: string | null;
  setHighlightId: (id: string | null) => void;
}

function uid() {
  return `cost-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCostStore = create<CostState>()(
  persist(
    (set) => ({
      entries: [],
      highlightId: null,

      addEntry: (data) => {
        const id = uid();
        const now = new Date().toISOString();
        const entry: CostEntry = {
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ entries: [...s.entries, entry] }));
        return id;
      },

      updateEntry: (id, data) => {
        set((s) => ({
          entries: s.entries.map((e) =>
            e.id === id
              ? { ...e, ...data, updatedAt: new Date().toISOString() }
              : e,
          ),
        }));
      },

      deleteEntry: (id) => {
        set((s) => ({ entries: s.entries.filter((e) => e.id !== id) }));
      },

      setHighlightId: (id) => set({ highlightId: id }),
    }),
    {
      name: "tmx-costs",
      version: 1,
    },
  ),
);
