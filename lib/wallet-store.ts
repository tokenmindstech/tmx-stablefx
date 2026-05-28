import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type StablecoinAsset } from "./rates";

export type WalletStatus = "active" | "inactive";

export interface Wallet {
  id: string;
  name: string;
  address: string;
  asset: StablecoinAsset;
  balance: number;
  status: WalletStatus;
  txnCount: number;
  lastActivityDaysAgo: number;
}

interface WalletStore {
  wallets: Wallet[];
  addWallet: (wallet: Omit<Wallet, "id">) => void;
  updateWallet: (id: string, patch: Partial<Omit<Wallet, "id">>) => void;
  deleteWallet: (id: string) => void;
}

const SEED_WALLETS: Wallet[] = [
  {
    id: "w1",
    name: "Primary USDC Vault",
    address: "0xF1a2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8f9A0",
    asset: "USDC",
    balance: 171578.5,
    status: "active",
    txnCount: 343,
    lastActivityDaysAgo: 7,
  },
  {
    id: "w2",
    name: "EURC Operations",
    address: "0xB1C2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8B9c0",
    asset: "EURC",
    balance: 118320,
    status: "active",
    txnCount: 189,
    lastActivityDaysAgo: 11,
  },
  {
    id: "w3",
    name: "USDC Reserve",
    address: "0xC1D2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8C9D0",
    asset: "USDC",
    balance: 50000,
    status: "active",
    txnCount: 56,
    lastActivityDaysAgo: 18,
  },
  {
    id: "w4",
    name: "EURC Archive",
    address: "0xD1E2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8D9e0",
    asset: "EURC",
    balance: 2100,
    status: "inactive",
    txnCount: 12,
    lastActivityDaysAgo: 89,
  },
  {
    id: "w5",
    name: "MXNB Operations",
    address: "0xE1F2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8E9F0",
    asset: "MXNB",
    balance: 875000,
    status: "active",
    txnCount: 74,
    lastActivityDaysAgo: 3,
  },
  {
    id: "w6",
    name: "QCAD Vault",
    address: "0xA1B2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8A9B0",
    asset: "QCAD",
    balance: 68100,
    status: "active",
    txnCount: 31,
    lastActivityDaysAgo: 24,
  },
];

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      wallets: SEED_WALLETS,
      addWallet: (wallet) =>
        set((s) => ({
          wallets: [...s.wallets, { ...wallet, id: `w${Date.now()}` }],
        })),
      updateWallet: (id, patch) =>
        set((s) => ({
          wallets: s.wallets.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        })),
      deleteWallet: (id) =>
        set((s) => ({ wallets: s.wallets.filter((w) => w.id !== id) })),
    }),
    { name: "tmx-wallets" },
  ),
);
