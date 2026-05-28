import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type StablecoinAsset } from "./rates";

export interface Vendor {
  id: string;
  name: string;
  bank: string;
  accountNumber: string;
  preferredAsset: StablecoinAsset;
}

interface VendorStore {
  vendors: Vendor[];
  addVendor: (vendor: Omit<Vendor, "id">) => void;
  deleteVendor: (id: string) => void;
}

const SEED_VENDORS: Vendor[] = [
  {
    id: "v1",
    name: "James Cruz",
    bank: "BBVA Mexico",
    accountNumber: "1234567890",
    preferredAsset: "MXNB",
  },
  {
    id: "v2",
    name: "Grupo Comercial Reyes S.A.",
    bank: "BBVA Mexico",
    accountNumber: "012345678901",
    preferredAsset: "MXNB",
  },
  {
    id: "v3",
    name: "Santos Logistics MX",
    bank: "Citibanamex",
    accountNumber: "002345678902",
    preferredAsset: "MXNB",
  },
  {
    id: "v4",
    name: "Garcia & Partners LLC",
    bank: "MUFG Bank",
    accountNumber: "756348921",
    preferredAsset: "USDC",
  },
  {
    id: "v5",
    name: "Lee Capital Pte Ltd",
    bank: "DBS Bank",
    accountNumber: "0720123456",
    preferredAsset: "QCAD",
  },
  {
    id: "v6",
    name: "Sarah Lim",
    bank: "OCBC Bank",
    accountNumber: "1234567890",
    preferredAsset: "QCAD",
  },
  {
    id: "v7",
    name: "Michael Chen",
    bank: "Royal Bank of Canada",
    accountNumber: "1234567890",
    preferredAsset: "QCAD",
  },
];

export const useVendorStore = create<VendorStore>()(
  persist(
    (set) => ({
      vendors: SEED_VENDORS,
      addVendor: (vendor) =>
        set((s) => ({
          vendors: [...s.vendors, { ...vendor, id: `v${Date.now()}` }],
        })),
      deleteVendor: (id) =>
        set((s) => ({ vendors: s.vendors.filter((v) => v.id !== id) })),
    }),
    { name: "tmx-vendors" },
  ),
);
