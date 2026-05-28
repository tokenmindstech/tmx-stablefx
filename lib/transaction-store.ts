import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type StablecoinAsset } from "./rates";

export type TxType = "Transfer" | "Swap";
export type TxStatus = "Completed" | "Pending" | "Failed";

export interface TxRecord {
  id: string;
  hash: string;
  type: TxType;
  fromAsset: StablecoinAsset;
  toAsset: StablecoinAsset;
  fromAmount: number;
  toAmount: number;
  fromWallet: string;
  toVendor: string;
  status: TxStatus;
  date: string;
  tenor: string;
}

function fakeHash(): string {
  const h = () =>
    Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, "0");
  return `0x${h()}${h()}...${h()}${h()}`;
}

const SEED_TXS: TxRecord[] = [
  {
    id: "t1",
    hash: "0xabc1f3d2...def19a01",
    type: "Transfer",
    fromAsset: "USDC",
    toAsset: "USDC",
    fromAmount: 25000,
    toAmount: 25000,
    fromWallet: "Primary USDC Vault",
    toVendor: "James Cruz",
    status: "Completed",
    date: "2026-05-27",
    tenor: "instant",
  },
  {
    id: "t2",
    hash: "0xabc2e4c1...def28b02",
    type: "Swap",
    fromAsset: "USDC",
    toAsset: "EURC",
    fromAmount: 12000,
    toAmount: 10832.28,
    fromWallet: "Primary USDC Vault",
    toVendor: "Garcia & Partners LLC",
    status: "Completed",
    date: "2026-05-26",
    tenor: "t1",
  },
  {
    id: "t3",
    hash: "0xabc3d5b0...def37c03",
    type: "Swap",
    fromAsset: "USDC",
    toAsset: "MXNB",
    fromAmount: 20000,
    toAmount: 350000,
    fromWallet: "USDC Reserve",
    toVendor: "Grupo Comercial Reyes S.A.",
    status: "Pending",
    date: "2026-05-26",
    tenor: "t1",
  },
  {
    id: "t4",
    hash: "0xabc4c6af...def46d04",
    type: "Transfer",
    fromAsset: "USDC",
    toAsset: "USDC",
    fromAmount: 8000,
    toAmount: 8000,
    fromWallet: "USDC Reserve",
    toVendor: "Santos Logistics MX",
    status: "Completed",
    date: "2026-05-25",
    tenor: "instant",
  },
  {
    id: "t5",
    hash: "0xabc5b7ae...def55e05",
    type: "Swap",
    fromAsset: "USDC",
    toAsset: "QCAD",
    fromAmount: 11029,
    toAmount: 15000,
    fromWallet: "QCAD Vault",
    toVendor: "Michael Chen",
    status: "Completed",
    date: "2026-05-24",
    tenor: "t2",
  },
  {
    id: "t6",
    hash: "0xabc6a8ad...def64f06",
    type: "Transfer",
    fromAsset: "EURC",
    toAsset: "EURC",
    fromAmount: 5500,
    toAmount: 5500,
    fromWallet: "EURC Archive",
    toVendor: "Sarah Lim",
    status: "Failed",
    date: "2026-05-23",
    tenor: "instant",
  },
  {
    id: "t7",
    hash: "0xabc7998c...def73007",
    type: "Swap",
    fromAsset: "USDC",
    toAsset: "QCAD",
    fromAmount: 22058,
    toAmount: 30000,
    fromWallet: "Primary USDC Vault",
    toVendor: "Lee Capital Pte Ltd",
    status: "Completed",
    date: "2026-05-22",
    tenor: "t1",
  },
  {
    id: "t8",
    hash: "0xabc88a8b...def82108",
    type: "Swap",
    fromAsset: "USDC",
    toAsset: "MXNB",
    fromAmount: 12571,
    toAmount: 220000,
    fromWallet: "Primary USDC Vault",
    toVendor: "James Cruz",
    status: "Completed",
    date: "2026-05-21",
    tenor: "instant",
  },
  {
    id: "t9",
    hash: "0xabc97b8a...def91209",
    type: "Swap",
    fromAsset: "USDC",
    toAsset: "AUDF",
    fromAmount: 2703,
    toAmount: 4200,
    fromWallet: "Primary USDC Vault",
    toVendor: "Garcia & Partners LLC",
    status: "Pending",
    date: "2026-05-20",
    tenor: "t2",
  },
  {
    id: "t10",
    hash: "0xabca6c89...defa030a",
    type: "Transfer",
    fromAsset: "USDC",
    toAsset: "USDC",
    fromAmount: 12500,
    toAmount: 12500,
    fromWallet: "USDC Reserve",
    toVendor: "Santos Logistics MX",
    status: "Completed",
    date: "2026-05-19",
    tenor: "instant",
  },
];

interface TxStore {
  transactions: TxRecord[];
  addTransaction: (tx: Omit<TxRecord, "id" | "hash" | "date">) => void;
}

export const useTransactionStore = create<TxStore>()(
  persist(
    (set, get) => ({
      transactions: SEED_TXS,
      addTransaction: (tx) => {
        const record: TxRecord = {
          ...tx,
          id: `tx${Date.now()}`,
          hash: fakeHash(),
          date: new Date().toISOString().slice(0, 10),
        };
        set({ transactions: [record, ...get().transactions] });
      },
    }),
    {
      name: "tmx-transactions",
      // Merge seed data on first load so new seeds appear even with existing store
      merge: (persisted, current) => {
        const p = persisted as TxStore;
        const existingIds = new Set(p.transactions.map((t) => t.id));
        const newSeeds = SEED_TXS.filter((s) => !existingIds.has(s.id));
        return {
          ...current,
          ...p,
          transactions: [...p.transactions, ...newSeeds],
        };
      },
    },
  ),
);
