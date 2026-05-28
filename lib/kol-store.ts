import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  KOL_DATA,
  KOL_NICHES,
  KOL_PLATFORMS,
  formatFollowers,
  type KOL,
  type KOLNiche,
  type KOLPlatform,
  type KOLRisk,
  type ContactMethod,
  type PlatformStat,
  type RateCard,
  type CampaignHistory,
} from "./kol-data";

// Re-export everything consumers need so they can import from one place
export {
  KOL_NICHES,
  KOL_PLATFORMS,
  formatFollowers,
  type KOL,
  type KOLNiche,
  type KOLPlatform,
  type KOLRisk,
  type ContactMethod,
  type PlatformStat,
  type RateCard,
  type CampaignHistory,
};

// ─── Store ────────────────────────────────────────────────────────────────────

interface KOLState {
  kols: KOL[];

  addKOL: (data: Omit<KOL, "id">) => string;
  updateKOL: (id: string, data: Partial<KOL>) => void;
  deleteKOL: (id: string) => void;
  getKOL: (id: string) => KOL | undefined;
}

function uid() {
  return `kol-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useKOLStore = create<KOLState>()(
  persist(
    (set, get) => ({
      kols: KOL_DATA,

      addKOL: (data) => {
        const id = uid();
        const kol: KOL = { ...data, id };
        set((s) => ({ kols: [...s.kols, kol] }));
        return id;
      },

      updateKOL: (id, data) => {
        set((s) => ({
          kols: s.kols.map((k) => (k.id === id ? { ...k, ...data } : k)),
        }));
      },

      deleteKOL: (id) => {
        set((s) => ({ kols: s.kols.filter((k) => k.id !== id) }));
      },

      getKOL: (id) => get().kols.find((k) => k.id === id),
    }),
    {
      name: "tmx-kols",
      version: 1,
      // Merge persisted kols with any new seed entries added to KOL_DATA
      merge: (persisted, current) => {
        const stored = persisted as Partial<KOLState>;
        const storedIds = new Set((stored.kols ?? []).map((k) => k.id));
        const newSeeds = KOL_DATA.filter((k) => !storedIds.has(k.id));
        return {
          ...current,
          kols: [...(stored.kols ?? []), ...newSeeds],
        };
      },
    },
  ),
);
