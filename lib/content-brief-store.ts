import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────────────────────

export type BriefStatus =
  | "Draft"
  | "In Review"
  | "Approved"
  | "Sent to KOL"
  | "Revisions Requested"
  | "Completed"
  | "Rejected";

export type ContentType =
  | "Sponsored Post"
  | "Video Script"
  | "Thread"
  | "Newsletter"
  | "Blog Post"
  | "Press Release"
  | "Podcast Script"
  | "Infographic Brief"
  | "AMA Script"
  | "Other";

export type ContentPlatform =
  | "Twitter / X"
  | "YouTube"
  | "Instagram"
  | "TikTok"
  | "LinkedIn"
  | "Telegram"
  | "Discord"
  | "Medium"
  | "Substack"
  | "Other";

// ─── Brief Stage ─────────────────────────────────────────────────────────────

export interface BriefStage {
  id: string;
  name: string;
  color: string; // tailwind bg color class
  order: number;
}

export const DEFAULT_BRIEF_STAGES: BriefStage[] = [
  { id: "bs-1", name: "Briefing", color: "bg-slate-400", order: 0 },
  { id: "bs-2", name: "Writing / Recording", color: "bg-blue-400", order: 1 },
  { id: "bs-3", name: "Sent to KOL", color: "bg-amber-400", order: 2 },
  { id: "bs-4", name: "Internal Review", color: "bg-violet-400", order: 3 },
  { id: "bs-5", name: "Revisions", color: "bg-orange-400", order: 4 },
  { id: "bs-6", name: "Approved", color: "bg-teal-400", order: 5 },
  { id: "bs-7", name: "Published", color: "bg-emerald-400", order: 6 },
  { id: "bs-8", name: "Rejected", color: "bg-red-400", order: 7 },
];

// ─── Content Brief ────────────────────────────────────────────────────────────

export interface ContentBrief {
  id: string;

  // Core
  title: string;
  stageId: string;
  status: BriefStatus;
  contentType: ContentType;
  platform: ContentPlatform;

  // Linked entities (denormalized for display)
  campaignId: string;
  campaignTitle: string;
  kolId: string;
  kolName: string;

  // Brief body
  angle: string; // story angle / main narrative
  keyMessages: string; // key talking points / bullets
  requirements: string; // format/length/technical requirements
  callToAction: string; // desired CTA
  hashtags: string; // hashtags / mentions

  // Dates
  dueDate: string; // ISO YYYY-MM-DD
  submittedDate: string; // when KOL submitted draft
  publishedDate: string; // when content went live

  // Review
  revisionCount: number;
  reviewNotes: string;

  // Post-publish
  contentUrl: string; // link to published content

  // Internal
  notes: string;
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

// ─── Store interface ──────────────────────────────────────────────────────────

interface ContentBriefState {
  briefs: ContentBrief[];
  stages: BriefStage[];
  highlightId: string | null;

  // Brief CRUD
  addBrief: (
    data: Omit<ContentBrief, "id" | "createdAt" | "updatedAt">,
  ) => string;
  updateBrief: (id: string, data: Partial<ContentBrief>) => void;
  deleteBrief: (id: string) => void;
  moveBriefToStage: (id: string, stageId: string) => void;
  setHighlightId: (id: string | null) => void;

  // Stage CRUD
  addStage: (name: string) => void;
  updateStage: (
    id: string,
    data: Partial<Pick<BriefStage, "name" | "color">>,
  ) => void;
  deleteStage: (id: string) => void;
  reorderStage: (id: string, direction: "left" | "right") => void;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function uid() {
  return `cb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useContentBriefStore = create<ContentBriefState>()(
  persist(
    (set, get) => ({
      briefs: [],
      stages: DEFAULT_BRIEF_STAGES,
      highlightId: null,

      // ── Brief CRUD ─────────────────────────────────────────────────────────

      addBrief: (data) => {
        const id = uid();
        const now = new Date().toISOString();
        const brief: ContentBrief = {
          ...data,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ briefs: [...s.briefs, brief] }));
        return id;
      },

      updateBrief: (id, data) => {
        set((s) => ({
          briefs: s.briefs.map((b) =>
            b.id === id
              ? { ...b, ...data, updatedAt: new Date().toISOString() }
              : b,
          ),
        }));
      },

      deleteBrief: (id) => {
        set((s) => ({ briefs: s.briefs.filter((b) => b.id !== id) }));
      },

      moveBriefToStage: (id, stageId) => {
        set((s) => ({
          briefs: s.briefs.map((b) =>
            b.id === id
              ? { ...b, stageId, updatedAt: new Date().toISOString() }
              : b,
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
          "bg-cyan-400",
          "bg-lime-400",
          "bg-yellow-400",
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
        set((s) => {
          const remaining = s.stages.filter((st) => st.id !== id);
          const fallback = [...remaining].sort((a, b) => a.order - b.order)[0];
          return {
            stages: remaining,
            briefs: s.briefs.map((b) => {
              if (b.stageId !== id) return b;
              return fallback
                ? {
                    ...b,
                    stageId: fallback.id,
                    updatedAt: new Date().toISOString(),
                  }
                : b;
            }),
          };
        });
      },

      reorderStage: (id, direction) => {
        set((s) => {
          const sorted = [...s.stages].sort((a, b) => a.order - b.order);
          const idx = sorted.findIndex((st) => st.id === id);
          if (idx === -1) return s;
          const swapIdx = direction === "left" ? idx - 1 : idx + 1;
          if (swapIdx < 0 || swapIdx >= sorted.length) return s;
          const newStages = sorted.map((st, i) => {
            if (i === idx) return { ...st, order: sorted[swapIdx].order };
            if (i === swapIdx) return { ...st, order: sorted[idx].order };
            return st;
          });
          return { stages: newStages };
        });
      },
    }),
    {
      name: "tmx-content-briefs",
      version: 1,
    },
  ),
);
