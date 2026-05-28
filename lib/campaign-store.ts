import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export type DealStatus = "Active" | "On Hold" | "Closed Won" | "Closed Lost";
export type OutreachStage =
  | "Not Contacted"
  | "Contacted"
  | "Negotiating"
  | "Contract Sent"
  | "Content in Progress"
  | "Published";
export type PlacementType =
  | "Sponsored Post"
  | "Listicle Inclusion"
  | "Product Review"
  | "Giveaway"
  | "AMA"
  | "Thread"
  | "Video"
  | "Podcast"
  | "Newsletter"
  | "Other";
export type Currency = "USD" | "EUR" | "GBP" | "USDT" | "BTC" | "ETH";

export interface CampaignStage {
  id: string;
  name: string;
  color: string; // tailwind bg color class
  order: number;
}

export interface Campaign {
  id: string;
  title: string;
  kolId: string;
  partnerName: string;
  stageId: string;
  dealStatus: DealStatus;
  outreachStage: OutreachStage;
  placementType: PlacementType;
  budget: number;
  currency: Currency;
  goal: string;
  notes: string;
  negotiationNotes: string;
  requirements: string;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string;
  lastContact: string;
  nextFollowUp: string;
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const DEFAULT_STAGES: CampaignStage[] = [
  { id: "stage-1", name: "Not Contacted", color: "bg-slate-400", order: 0 },
  { id: "stage-2", name: "Contacted", color: "bg-blue-400", order: 1 },
  { id: "stage-3", name: "Negotiating", color: "bg-amber-400", order: 2 },
  {
    id: "stage-4",
    name: "Content in Progress",
    color: "bg-violet-400",
    order: 3,
  },
  {
    id: "stage-5",
    name: "Long-term Candidate",
    color: "bg-pink-400",
    order: 4,
  },
  { id: "stage-6", name: "Closed", color: "bg-emerald-400", order: 5 },
  { id: "stage-7", name: "Completed", color: "bg-teal-400", order: 6 },
  { id: "stage-8", name: "Rejected", color: "bg-red-400", order: 7 },
];

// ─── Store ────────────────────────────────────────────────────────────────────

interface CampaignState {
  campaigns: Campaign[];
  stages: CampaignStage[];
  highlightId: string | null;

  // Campaign actions
  addCampaign: (
    data: Omit<Campaign, "id" | "createdAt" | "updatedAt">,
  ) => string;
  updateCampaign: (id: string, data: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  moveCampaignToStage: (id: string, stageId: string) => void;
  setHighlightId: (id: string | null) => void;

  // Stage actions
  addStage: (name: string) => void;
  updateStage: (
    id: string,
    data: Partial<Pick<CampaignStage, "name" | "color">>,
  ) => void;
  deleteStage: (id: string) => void;
  reorderStage: (id: string, direction: "left" | "right") => void;
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCampaignStore = create<CampaignState>()(
  persist(
    (set, get) => ({
      campaigns: [],
      stages: DEFAULT_STAGES,
      highlightId: null,

      // ── Campaign CRUD ──────────────────────────────────────────────────────

      addCampaign: (data) => {
        const id = uid();
        const now = new Date().toISOString();
        const campaign: Campaign = {
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ campaigns: [...s.campaigns, campaign] }));
        return id;
      },

      updateCampaign: (id, data) => {
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id
              ? { ...c, ...data, updatedAt: new Date().toISOString() }
              : c,
          ),
        }));
      },

      deleteCampaign: (id) => {
        set((s) => ({ campaigns: s.campaigns.filter((c) => c.id !== id) }));
      },

      moveCampaignToStage: (id, stageId) => {
        set((s) => ({
          campaigns: s.campaigns.map((c) =>
            c.id === id
              ? { ...c, stageId, updatedAt: new Date().toISOString() }
              : c,
          ),
        }));
      },

      setHighlightId: (id) => set({ highlightId: id }),

      // ── Stage CRUD ─────────────────────────────────────────────────────────

      addStage: (name) => {
        const stages = get().stages;
        const maxOrder = stages.reduce((m, s) => Math.max(m, s.order), -1);
        const colors = [
          "bg-pink-400",
          "bg-indigo-400",
          "bg-orange-400",
          "bg-cyan-400",
          "bg-lime-400",
        ];
        const color = colors[stages.length % colors.length];
        set((s) => ({
          stages: [
            ...s.stages,
            { id: uid(), name, color, order: maxOrder + 1 },
          ],
        }));
      },

      updateStage: (id, data) => {
        set((s) => ({
          stages: s.stages.map((stage) =>
            stage.id === id ? { ...stage, ...data } : stage,
          ),
        }));
      },

      deleteStage: (id) => {
        set((s) => ({
          stages: s.stages.filter((stage) => stage.id !== id),
          // Move orphaned campaigns to first remaining stage
          campaigns: s.campaigns.map((c) => {
            if (c.stageId !== id) return c;
            const remaining = s.stages.filter((st) => st.id !== id);
            const fallback = remaining.sort((a, b) => a.order - b.order)[0];
            return fallback
              ? {
                  ...c,
                  stageId: fallback.id,
                  updatedAt: new Date().toISOString(),
                }
              : c;
          }),
        }));
      },

      reorderStage: (id, direction) => {
        const stages = [...get().stages].sort((a, b) => a.order - b.order);
        const idx = stages.findIndex((s) => s.id === id);
        if (idx === -1) return;
        const swapIdx = direction === "left" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= stages.length) return;
        const newStages = stages.map((s, i) => {
          if (i === idx) return { ...s, order: stages[swapIdx].order };
          if (i === swapIdx) return { ...s, order: stages[idx].order };
          return s;
        });
        set({ stages: newStages });
      },
    }),
    {
      name: "tmx-campaigns",
      version: 1,
    },
  ),
);
