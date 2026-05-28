"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  Megaphone,
  LayoutGrid,
  List,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  MoreHorizontal,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCampaignStore,
  type Campaign,
  type CampaignStage,
  type DealStatus,
  type OutreachStage,
  type PlacementType,
  type Currency,
} from "@/lib/campaign-store";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { KOL_DATA } from "@/lib/kol-data";

// ─── Constants ────────────────────────────────────────────────────────────────

const CAMPAIGN_STATUSES: DealStatus[] = [
  "Active",
  "On Hold",
  "Closed Won",
  "Closed Lost",
];
const OUTREACH_STAGES: OutreachStage[] = [
  "Not Contacted",
  "Contacted",
  "Negotiating",
  "Contract Sent",
  "Content in Progress",
  "Published",
];
const PLACEMENT_TYPES: PlacementType[] = [
  "Sponsored Post",
  "Listicle Inclusion",
  "Product Review",
  "Giveaway",
  "AMA",
  "Thread",
  "Video",
  "Podcast",
  "Newsletter",
  "Other",
];
const CURRENCIES: Currency[] = ["USD", "EUR", "GBP", "USDT", "BTC", "ETH"];

const CAMPAIGN_STATUS_STYLE: Record<DealStatus, string> = {
  Active: "bg-blue-50 text-blue-700 border-blue-200",
  "On Hold": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Closed Won": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Closed Lost": "bg-red-50 text-red-700 border-red-200",
};

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptyForm(
  overrides?: Partial<Campaign>,
): Omit<Campaign, "id" | "createdAt" | "updatedAt"> {
  return {
    title: "",
    kolId: "",
    partnerName: "",
    stageId: "",
    dealStatus: "Active",
    outreachStage: "Not Contacted",
    placementType: "Sponsored Post",
    budget: 0,
    currency: "USD",
    goal: "",
    notes: "",
    negotiationNotes: "",
    requirements: "",
    startDate: "",
    endDate: "",
    lastContact: "",
    nextFollowUp: "",
    ...overrides,
  };
}

// ─── Campaign Dialog ─────────────────────────────────────────────────────────

interface CampaignDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<Campaign>;
  lockedKolId?: string;
  editId?: string;
}

function CampaignDialog({
  open,
  onClose,
  initial,
  lockedKolId,
  editId,
}: CampaignDialogProps) {
  const { stages, addCampaign, updateCampaign } = useCampaignStore();
  const router = useRouter();

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const [form, setForm] = React.useState<
    Omit<Campaign, "id" | "createdAt" | "updatedAt">
  >(
    emptyForm({
      stageId: sortedStages[0]?.id ?? "",
      ...initial,
    }),
  );

  React.useEffect(() => {
    if (open) {
      setForm(
        emptyForm({
          stageId: sortedStages[0]?.id ?? "",
          ...initial,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [kolSearch, setKolSearch] = React.useState("");

  const filteredKols = React.useMemo(() => {
    const q = kolSearch.toLowerCase();
    return KOL_DATA.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.username.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [kolSearch]);

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleKolSelect(kolId: string) {
    const kol = KOL_DATA.find((k) => k.id === kolId);
    if (!kol) return;
    setForm((f) => ({
      ...f,
      kolId,
      partnerName: kol.name,
      title: f.title || kol.name,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.stageId) return;
    if (editId) {
      updateCampaign(editId, form);
      onClose();
    } else {
      const id = addCampaign(form);
      useCampaignStore.getState().setHighlightId(id);
      onClose();
      router.push("/dashboard/campaign");
    }
  }

  const isLocked = !!lockedKolId;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editId ? "Edit campaign" : "New campaign"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Row 1: Partner + Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Partner</Label>
              {isLocked ? (
                <Input
                  value={form.partnerName}
                  disabled
                  className="bg-muted/50"
                />
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start font-normal"
                    >
                      {form.partnerName || "Select partner…"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-2">
                    <Input
                      placeholder="Search KOL…"
                      value={kolSearch}
                      onChange={(e) => setKolSearch(e.target.value)}
                      className="mb-2"
                    />
                    <div className="max-h-48 overflow-y-auto space-y-0.5">
                      {filteredKols.map((k) => (
                        <button
                          key={k.id}
                          type="button"
                          onClick={() => handleKolSelect(k.id)}
                          className="w-full text-left px-2 py-1.5 rounded text-sm hover:bg-muted flex items-center gap-2"
                        >
                          <div className="h-6 w-6 rounded-full bg-linear-to-br from-[#FF4FD8] to-[#A855F7] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {k.name[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{k.name}</div>
                            <div className="text-xs text-muted-foreground">
                              @{k.username}
                            </div>
                          </div>
                          {form.kolId === k.id && (
                            <Check className="h-4 w-4 text-[#FF4FD8] ml-auto" />
                          )}
                        </button>
                      ))}
                      {filteredKols.length === 0 && (
                        <p className="text-xs text-muted-foreground px-2 py-2">
                          No results
                        </p>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select
                value={form.stageId}
                onValueChange={(v) => setField("stageId", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {sortedStages.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Campaign name */}
          <div className="space-y-1.5">
            <Label>
              Campaign name <span className="text-destructive">*</span>
            </Label>
            <Input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. AI Banking Listicle — Web3 Listicle Publisher"
            />
          </div>

          {/* Row 2: Outreach stage + Campaign status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Outreach stage</Label>
              <Select
                value={form.outreachStage}
                onValueChange={(v) =>
                  setField("outreachStage", v as OutreachStage)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {OUTREACH_STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Campaign status</Label>
              <Select
                value={form.dealStatus}
                onValueChange={(v) => setField("dealStatus", v as DealStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Placement type + Budget + Currency */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Placement type</Label>
              <Select
                value={form.placementType}
                onValueChange={(v) =>
                  setField("placementType", v as PlacementType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PLACEMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Budget</Label>
              <Input
                type="number"
                min={0}
                value={form.budget || ""}
                onChange={(e) => setField("budget", Number(e.target.value))}
                placeholder="0"
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
          </div>

          {/* Row 4: Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start date</Label>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End date</Label>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Last contact</Label>
              <Input
                type="date"
                value={form.lastContact}
                onChange={(e) => setField("lastContact", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Next follow up</Label>
              <Input
                type="date"
                value={form.nextFollowUp}
                onChange={(e) => setField("nextFollowUp", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Goal */}
          <div className="space-y-1.5">
            <Label>Goal</Label>
            <Textarea
              rows={2}
              value={form.goal}
              onChange={(e) => setField("goal", e.target.value)}
              placeholder="Describe the campaign goal…"
            />
          </div>

          {/* Negotiation notes */}
          <div className="space-y-1.5">
            <Label>Negotiation notes</Label>
            <Textarea
              rows={2}
              value={form.negotiationNotes}
              onChange={(e) => setField("negotiationNotes", e.target.value)}
              placeholder="Notes from negotiation…"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-1.5">
            <Label>Requirements</Label>
            <Textarea
              rows={2}
              value={form.requirements}
              onChange={(e) => setField("requirements", e.target.value)}
              placeholder="Content requirements…"
            />
          </div>

          {/* Notes */}
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
              disabled={!form.title || !form.stageId}
            >
              {editId ? "Save changes" : "Create campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Stage Edit Dialog ────────────────────────────────────────────────────────

interface StageDialogProps {
  open: boolean;
  onClose: () => void;
  stage?: CampaignStage;
}

function StageDialog({ open, onClose, stage }: StageDialogProps) {
  const { addStage, updateStage } = useCampaignStore();
  const [name, setName] = React.useState("");

  React.useEffect(() => {
    if (open) setName(stage?.name ?? "");
  }, [open, stage]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (stage) {
      updateStage(stage.id, { name: name.trim() });
    } else {
      addStage(name.trim());
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{stage ? "Rename stage" : "Add stage"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>Stage name</Label>
            <Input
              autoFocus
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Stage name…"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FF4FD8] hover:bg-[#e040c0] text-white"
              disabled={!name.trim()}
            >
              {stage ? "Rename" : "Add stage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Campaign Card (Kanban) ───────────────────────────────────────────────────

interface CampaignCardProps {
  campaign: Campaign;
  highlight: boolean;
  stages: CampaignStage[];
  onEdit: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

function CampaignCard({
  campaign,
  highlight,
  stages,
  onEdit,
  onDelete,
  isDragging = false,
}: CampaignCardProps) {
  const { moveCampaignToStage } = useCampaignStore();
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  const idx = sortedStages.findIndex((s) => s.id === campaign.stageId);

  return (
    <div
      className={`rounded-lg border bg-background p-3 shadow-sm space-y-2 transition-all ${
        isDragging
          ? "opacity-60 rotate-1 scale-105 shadow-lg"
          : highlight
            ? "ring-2 ring-[#FF4FD8] border-[#FF4FD8]"
            : "border-border/50 hover:border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">
          {campaign.title}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0 -mr-1 -mt-0.5"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-3.5 w-3.5 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {campaign.partnerName && (
        <p className="text-xs text-muted-foreground">
          Partner: {campaign.partnerName}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="outline"
          className={`text-[10px] ${CAMPAIGN_STATUS_STYLE[campaign.dealStatus]}`}
        >
          {campaign.dealStatus}
        </Badge>
        {campaign.budget > 0 && (
          <span className="text-xs font-medium text-foreground">
            {campaign.currency} {campaign.budget.toLocaleString()}
          </span>
        )}
      </div>

      {/* Move between stages */}
      <div className="flex items-center gap-1 pt-0.5">
        <button
          onClick={() =>
            idx > 0 &&
            moveCampaignToStage(campaign.id, sortedStages[idx - 1].id)
          }
          disabled={idx <= 0}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed px-1"
          title="Move to previous stage"
        >
          ‹
        </button>
        <span className="flex-1 text-center text-[10px] text-muted-foreground truncate">
          {sortedStages[idx]?.name}
        </span>
        <button
          onClick={() =>
            idx < sortedStages.length - 1 &&
            moveCampaignToStage(campaign.id, sortedStages[idx + 1].id)
          }
          disabled={idx >= sortedStages.length - 1}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed px-1"
          title="Move to next stage"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Draggable Campaign Card ──────────────────────────────────────────────────

function DraggableCampaignCard(props: Omit<CampaignCardProps, "isDragging">) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.campaign.id,
    data: { campaign: props.campaign },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ touchAction: "none" }}
      className={isDragging ? "opacity-30" : ""}
    >
      <CampaignCard {...props} />
    </div>
  );
}

// ─── Droppable Column ─────────────────────────────────────────────────────────

function DroppableColumn({
  stageId,
  isOver,
  children,
}: {
  stageId: string;
  isOver: boolean;
  children: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({ id: stageId });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-2 min-h-30 rounded-lg p-1 -m-1 transition-colors ${
        isOver ? "bg-[#FFF5FC] ring-2 ring-[#FF4FD8]/30" : ""
      }`}
    >
      {children}
    </div>
  );
}

// ─── Kanban View ──────────────────────────────────────────────────────────────

interface KanbanViewProps {
  campaigns: Campaign[];
  allCampaigns: Campaign[];
  stages: CampaignStage[];
  highlightId: string | null;
  onEditCampaign: (c: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
  onEditStage: (s: CampaignStage) => void;
  onDeleteStage: (s: CampaignStage) => void;
  onAddStage: () => void;
}

const TINT_MAP: Record<string, string> = {
  "bg-slate-400": "bg-slate-50",
  "bg-blue-400": "bg-blue-50",
  "bg-amber-400": "bg-amber-50",
  "bg-violet-400": "bg-violet-50",
  "bg-pink-400": "bg-pink-50",
  "bg-emerald-400": "bg-emerald-50",
  "bg-teal-400": "bg-teal-50",
  "bg-red-400": "bg-red-50",
  "bg-indigo-400": "bg-indigo-50",
  "bg-orange-400": "bg-orange-50",
  "bg-cyan-400": "bg-cyan-50",
  "bg-lime-400": "bg-lime-50",
};

function KanbanView({
  campaigns,
  stages,
  highlightId,
  onEditCampaign,
  onDeleteCampaign,
  onEditStage,
  onDeleteStage,
  onAddStage,
}: KanbanViewProps) {
  const { reorderStage, moveCampaignToStage } = useCampaignStore();
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const [activeCampaign, setActiveCampaign] = React.useState<Campaign | null>(
    null,
  );
  const [overStageId, setOverStageId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const found = campaigns.find((c) => c.id === event.active.id);
    setActiveCampaign(found ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    setOverStageId(event.over ? String(event.over.id) : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCampaign(null);
    setOverStageId(null);
    if (!over) return;
    const campaignId = String(active.id);
    const targetStageId = String(over.id);
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (campaign && campaign.stageId !== targetStageId) {
      moveCampaignToStage(campaignId, targetStageId);
    }
  }

  function handleDragCancel() {
    setActiveCampaign(null);
    setOverStageId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {sortedStages.map((stage, i) => {
          const stageCampaigns = campaigns.filter(
            (c) => c.stageId === stage.id,
          );
          const isFirst = i === 0;
          const isLast = i === sortedStages.length - 1;
          const tintClass = TINT_MAP[stage.color] ?? "bg-muted/30";
          const isOver = overStageId === stage.id;

          return (
            <div key={stage.id} className="shrink-0 w-64 flex flex-col gap-2">
              {/* Column header */}
              <div
                className={`rounded-lg px-3 py-2 flex items-center gap-1.5 ${tintClass}`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${stage.color} shrink-0`}
                />
                <span className="flex-1 text-xs font-semibold text-foreground truncate">
                  {stage.name}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  ({stageCampaigns.length})
                </span>
                <div className="flex items-center gap-0.5 ml-1">
                  <button
                    onClick={() => reorderStage(stage.id, "left")}
                    disabled={isFirst}
                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move stage left"
                  >
                    <ChevronLeft className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => reorderStage(stage.id, "right")}
                    disabled={isLast}
                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move stage right"
                  >
                    <ChevronRight className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onEditStage(stage)}
                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-black/10"
                    title="Rename stage"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDeleteStage(stage)}
                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-black/10 text-red-600"
                    title="Delete stage"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Droppable card area */}
              <DroppableColumn stageId={stage.id} isOver={isOver}>
                {stageCampaigns.length === 0 && (
                  <div
                    className={`rounded-lg border border-dashed px-3 py-6 text-center transition-colors ${
                      isOver
                        ? "border-[#FF4FD8] bg-[#FFF5FC]"
                        : "border-border/60 bg-muted/10"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground">
                      {isOver ? "Drop here" : "Empty"}
                    </p>
                  </div>
                )}
                {stageCampaigns.map((c) => (
                  <DraggableCampaignCard
                    key={c.id}
                    campaign={c}
                    highlight={c.id === highlightId}
                    stages={stages}
                    onEdit={() => onEditCampaign(c)}
                    onDelete={() => onDeleteCampaign(c.id)}
                  />
                ))}
              </DroppableColumn>
            </div>
          );
        })}

        {/* Add stage */}
        <div className="shrink-0 w-48 flex flex-col gap-2">
          <button
            onClick={onAddStage}
            className="rounded-lg border border-dashed border-border/60 bg-muted/10 px-3 py-4 flex flex-col items-center gap-1 hover:bg-muted/20 transition-colors group"
          >
            <Plus className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
            <span className="text-xs text-muted-foreground group-hover:text-foreground">
              Add stage
            </span>
          </button>
        </div>
      </div>

      {/* Drag overlay — ghost card that follows cursor */}
      <DragOverlay dropAnimation={null}>
        {activeCampaign ? (
          <div className="w-64 rotate-2 scale-105 opacity-90 cursor-grabbing">
            <CampaignCard
              campaign={activeCampaign}
              highlight={false}
              stages={stages}
              onEdit={() => {}}
              onDelete={() => {}}
              isDragging
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

// ─── Table View ───────────────────────────────────────────────────────────────

type SortKey =
  | "title"
  | "partnerName"
  | "dealStatus"
  | "outreachStage"
  | "placementType"
  | "budget"
  | "startDate"
  | "endDate"
  | "nextFollowUp";
type SortDir = "asc" | "desc";

interface TableViewProps {
  campaigns: Campaign[];
  stages: CampaignStage[];
  highlightId: string | null;
  onEditCampaign: (c: Campaign) => void;
  onDeleteCampaign: (id: string) => void;
}

function TableView({
  campaigns,
  stages,
  highlightId,
  onEditCampaign,
  onDeleteCampaign,
}: TableViewProps) {
  const stageMap = Object.fromEntries(stages.map((s) => [s.id, s]));
  const [sortKey, setSortKey] = React.useState<SortKey>("title");
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
    return [...campaigns].sort((a, b) => {
      const av: string | number =
        sortKey === "budget" ? a.budget : (a[sortKey] ?? "");
      const bv: string | number =
        sortKey === "budget" ? b.budget : (b[sortKey] ?? "");
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [campaigns, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-[#FF4FD8]" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-[#FF4FD8]" />
    );
  }

  function SortableHeader({
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

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <Megaphone className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No campaigns found
        </p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Create a new campaign or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/30">
              <SortableHeader col="title" label="Campaign" />
              <SortableHeader col="partnerName" label="Partner" />
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
                Stage
              </th>
              <SortableHeader col="dealStatus" label="Status" />
              <SortableHeader col="outreachStage" label="Outreach" />
              <SortableHeader col="placementType" label="Placement" />
              <SortableHeader col="budget" label="Budget" align="right" />
              <SortableHeader col="startDate" label="Start" />
              <SortableHeader col="endDate" label="End" />
              <SortableHeader col="nextFollowUp" label="Next Follow-up" />
              <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground w-20 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => {
              const stage = stageMap[c.stageId];
              return (
                <tr
                  key={c.id}
                  className={`border-b border-border/20 last:border-0 transition-colors ${
                    c.id === highlightId ? "bg-[#FFF5FC]" : "hover:bg-muted/20"
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-foreground max-w-50">
                    <span className="block truncate" title={c.title}>
                      {c.title}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                    {c.partnerName || "—"}
                  </td>
                  <td className="py-3 px-4">
                    {stage ? (
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2 w-2 rounded-full shrink-0 ${stage.color}`}
                        />
                        <span className="text-xs text-foreground whitespace-nowrap">
                          {stage.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[10px] whitespace-nowrap ${CAMPAIGN_STATUS_STYLE[c.dealStatus]}`}
                    >
                      {c.dealStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {c.outreachStage}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {c.placementType}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-foreground whitespace-nowrap">
                    {c.budget > 0
                      ? `${c.currency} ${c.budget.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {c.startDate
                      ? new Date(c.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {c.endDate
                      ? new Date(c.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {c.nextFollowUp
                      ? new Date(c.nextFollowUp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onEditCampaign(c)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => onDeleteCampaign(c.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Row count footer */}
      <div className="border-t border-border/40 bg-muted/10 px-4 py-2 text-xs text-muted-foreground">
        {sorted.length} {sorted.length === 1 ? "campaign" : "campaigns"}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function CampaignPageInner() {
  const searchParams = useSearchParams();
  const { campaigns, stages, highlightId, deleteCampaign, setHighlightId } =
    useCampaignStore();

  const [view, setView] = React.useState<"kanban" | "table">("kanban");

  // Filters
  const [search, setSearch] = React.useState("");
  const [filterStage, setFilterStage] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");

  // Dialogs
  const [campaignDialogOpen, setCampaignDialogOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<Campaign | null>(
    null,
  );
  const [stageDialogOpen, setStageDialogOpen] = React.useState(false);
  const [editingStage, setEditingStage] = React.useState<CampaignStage | null>(
    null,
  );
  const [deleteStageTarget, setDeleteStageTarget] =
    React.useState<CampaignStage | null>(null);
  const [deleteCampaignTarget, setDeleteCampaignTarget] = React.useState<
    string | null
  >(null);

  // Auto-open dialog if ?new=1
  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setCampaignDialogOpen(true);
    }
  }, [searchParams]);

  // Clear highlight after 3s
  React.useEffect(() => {
    if (!highlightId) return;
    const t = setTimeout(() => setHighlightId(null), 3000);
    return () => clearTimeout(t);
  }, [highlightId, setHighlightId]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return campaigns.filter((c) => {
      if (
        q &&
        !c.title.toLowerCase().includes(q) &&
        !c.partnerName.toLowerCase().includes(q)
      )
        return false;
      if (filterStage !== "all" && c.stageId !== filterStage) return false;
      if (filterStatus !== "all" && c.dealStatus !== filterStatus) return false;
      return true;
    });
  }, [campaigns, search, filterStage, filterStatus]);

  const activeFilters = [
    search !== "",
    filterStage !== "all",
    filterStatus !== "all",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setFilterStage("all");
    setFilterStatus("all");
  }

  function handleEditCampaign(c: Campaign) {
    setEditingCampaign(c);
    setCampaignDialogOpen(true);
  }

  function handleDeleteCampaignConfirm() {
    if (deleteCampaignTarget) {
      deleteCampaign(deleteCampaignTarget);
      setDeleteCampaignTarget(null);
    }
  }

  function handleEditStage(s: CampaignStage) {
    setEditingStage(s);
    setStageDialogOpen(true);
  }

  function handleDeleteStageConfirm() {
    if (deleteStageTarget) {
      useCampaignStore.getState().deleteStage(deleteStageTarget.id);
      setDeleteStageTarget(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-6 bg-background min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Campaign Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Tracks outreach and campaign status per KOL. Content briefs live in
            the Content Pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0">
          {/* Kanban / Table toggle */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors ${
                view === "kanban"
                  ? "bg-[#FF4FD8] text-white"
                  : "bg-background text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-sm flex items-center gap-1.5 transition-colors border-l border-border ${
                view === "table"
                  ? "bg-[#FF4FD8] text-white"
                  : "bg-background text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <List className="h-4 w-4" />
              Table
            </button>
          </div>

          <Button
            size="sm"
            className="gap-1.5 bg-[#FF4FD8] hover:bg-[#e040c0] text-white"
            onClick={() => {
              setEditingCampaign(null);
              setCampaignDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New campaign
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns or partners…"
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
                  Stage
                </label>
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="All stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    {[...stages]
                      .sort((a, b) => a.order - b.order)
                      .map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground font-medium">
                  Campaign status
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {CAMPAIGN_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Content */}
      {view === "kanban" ? (
        <KanbanView
          campaigns={filtered}
          allCampaigns={campaigns}
          stages={stages}
          highlightId={highlightId}
          onEditCampaign={handleEditCampaign}
          onDeleteCampaign={(id) => setDeleteCampaignTarget(id)}
          onEditStage={handleEditStage}
          onDeleteStage={(s) => setDeleteStageTarget(s)}
          onAddStage={() => {
            setEditingStage(null);
            setStageDialogOpen(true);
          }}
        />
      ) : (
        <TableView
          campaigns={filtered}
          stages={stages}
          highlightId={highlightId}
          onEditCampaign={handleEditCampaign}
          onDeleteCampaign={(id) => setDeleteCampaignTarget(id)}
        />
      )}

      {/* ── Dialogs ── */}

      <CampaignDialog
        open={campaignDialogOpen}
        onClose={() => {
          setCampaignDialogOpen(false);
          setEditingCampaign(null);
        }}
        initial={editingCampaign ?? undefined}
        editId={editingCampaign?.id}
      />

      <StageDialog
        open={stageDialogOpen}
        onClose={() => {
          setStageDialogOpen(false);
          setEditingStage(null);
        }}
        stage={editingStage ?? undefined}
      />

      <AlertDialog
        open={!!deleteCampaignTarget}
        onOpenChange={(v) => !v && setDeleteCampaignTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The campaign will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCampaignConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteStageTarget}
        onOpenChange={(v) => !v && setDeleteStageTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete stage &quot;{deleteStageTarget?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Campaigns in this stage will be moved to the first available
              stage. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStageConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete stage
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function CampaignPage() {
  return (
    <Suspense>
      <CampaignPageInner />
    </Suspense>
  );
}
