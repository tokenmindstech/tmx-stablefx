"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  FileText,
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
  Link as LinkIcon,
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  useContentBriefStore,
  type ContentBrief,
  type BriefStage,
  type BriefStatus,
  type ContentType,
  type ContentPlatform,
} from "@/lib/content-brief-store";
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
import { useKOLStore } from "@/lib/kol-store";
import { useCampaignStore } from "@/lib/campaign-store";
import { useCostStore } from "@/lib/cost-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// ─── Constants ────────────────────────────────────────────────────────────────

const BRIEF_STATUSES: BriefStatus[] = [
  "Draft",
  "In Review",
  "Approved",
  "Sent to KOL",
  "Revisions Requested",
  "Completed",
  "Rejected",
];

const CONTENT_TYPES: ContentType[] = [
  "Sponsored Post",
  "Video Script",
  "Thread",
  "Newsletter",
  "Blog Post",
  "Press Release",
  "Podcast Script",
  "Infographic Brief",
  "AMA Script",
  "Other",
];

const CONTENT_PLATFORMS: ContentPlatform[] = [
  "Twitter / X",
  "YouTube",
  "Instagram",
  "TikTok",
  "LinkedIn",
  "Telegram",
  "Discord",
  "Medium",
  "Substack",
  "Other",
];

const STATUS_STYLE: Record<BriefStatus, string> = {
  Draft: "bg-slate-50 text-slate-700 border-slate-200",
  "In Review": "bg-blue-50 text-blue-700 border-blue-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Sent to KOL": "bg-amber-50 text-amber-700 border-amber-200",
  "Revisions Requested": "bg-orange-50 text-orange-700 border-orange-200",
  Completed: "bg-teal-50 text-teal-700 border-teal-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

// ─── Empty form ───────────────────────────────────────────────────────────────

function emptyForm(
  overrides?: Partial<ContentBrief>,
): Omit<ContentBrief, "id" | "createdAt" | "updatedAt"> {
  return {
    title: "",
    stageId: "",
    status: "Draft",
    contentType: "Sponsored Post",
    platform: "Twitter / X",
    campaignId: "",
    campaignTitle: "",
    kolId: "",
    kolName: "",
    angle: "",
    keyMessages: "",
    requirements: "",
    callToAction: "",
    hashtags: "",
    dueDate: "",
    submittedDate: "",
    publishedDate: "",
    revisionCount: 0,
    reviewNotes: "",
    contentUrl: "",
    notes: "",
    ...overrides,
  };
}

// ─── Brief Dialog ─────────────────────────────────────────────────────────────

interface BriefDialogProps {
  open: boolean;
  onClose: () => void;
  initial?: Partial<ContentBrief>;
  editId?: string;
}

function BriefDialog({ open, onClose, initial, editId }: BriefDialogProps) {
  const { stages, addBrief, updateBrief } = useContentBriefStore();
  const { kols } = useKOLStore();
  const { campaigns } = useCampaignStore();
  const router = useRouter();

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const [form, setForm] = React.useState<
    Omit<ContentBrief, "id" | "createdAt" | "updatedAt">
  >(emptyForm({ stageId: sortedStages[0]?.id ?? "", ...initial }));

  React.useEffect(() => {
    if (open) {
      setForm(emptyForm({ stageId: sortedStages[0]?.id ?? "", ...initial }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [kolOpen, setKolOpen] = React.useState(false);
  const [campaignOpen, setCampaignOpen] = React.useState(false);

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleKolSelect(kolId: string) {
    const kol = kols.find((k) => k.id === kolId);
    if (!kol) return;
    setForm((f) => ({
      ...f,
      kolId,
      kolName: kol.name,
      title: f.title || `${kol.name} — Content Brief`,
    }));
  }

  function handleCampaignSelect(campaignId: string) {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    setForm((f) => ({
      ...f,
      campaignId,
      campaignTitle: campaign.title,
      kolId: f.kolId || campaign.kolId,
      kolName: f.kolName || campaign.partnerName,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.stageId) return;
    if (editId) {
      updateBrief(editId, form);
      onClose();
    } else {
      const id = addBrief(form);
      useContentBriefStore.getState().setHighlightId(id);
      onClose();
      router.push("/dashboard/content-brief");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editId ? "Edit brief" : "New content brief"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Row 1: Campaign + Stage */}
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

          {/* KOL */}
          <div className="space-y-1.5">
            <Label>KOL / Partner</Label>
            <Popover open={kolOpen} onOpenChange={setKolOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  {form.kolName || "Select KOL…"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <Command className="max-h-80">
                  <CommandInput placeholder="Search KOL by name or username…" />
                  <CommandList>
                    <CommandEmpty>No KOLs found.</CommandEmpty>
                    <CommandGroup>
                      {kols.map((k) => (
                        <CommandItem
                          key={k.id}
                          value={`${k.name} ${k.username}`}
                          onSelect={() => {
                            handleKolSelect(k.id);
                            setKolOpen(false);
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <div className="h-6 w-6 rounded-full bg-linear-to-br from-[#FF4FD8] to-[#A855F7] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {k.name[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{k.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              @{k.username}
                            </div>
                          </div>
                          {form.kolId === k.id && (
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

          {/* Brief title */}
          <div className="space-y-1.5">
            <Label>
              Brief title <span className="text-destructive">*</span>
            </Label>
            <Input
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. AI Banking Thread — Web3 Influencer Brief"
            />
          </div>

          {/* Row: Content type + Platform + Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Content type</Label>
              <Select
                value={form.contentType}
                onValueChange={(v) => setField("contentType", v as ContentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) =>
                  setField("platform", v as ContentPlatform)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setField("status", v as BriefStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRIEF_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Submitted date</Label>
              <Input
                type="date"
                value={form.submittedDate}
                onChange={(e) => setField("submittedDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Published date</Label>
              <Input
                type="date"
                value={form.publishedDate}
                onChange={(e) => setField("publishedDate", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Brief body */}
          <div className="space-y-1.5">
            <Label>Angle / Narrative</Label>
            <Textarea
              rows={2}
              value={form.angle}
              onChange={(e) => setField("angle", e.target.value)}
              placeholder="The story angle, hook, or main narrative for this piece…"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Key messages / Talking points</Label>
            <Textarea
              rows={3}
              value={form.keyMessages}
              onChange={(e) => setField("keyMessages", e.target.value)}
              placeholder={"• Point 1\n• Point 2\n• Point 3"}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Requirements</Label>
            <Textarea
              rows={2}
              value={form.requirements}
              onChange={(e) => setField("requirements", e.target.value)}
              placeholder="Word count, format, tone, disclosure requirements…"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Call to action</Label>
              <Input
                value={form.callToAction}
                onChange={(e) => setField("callToAction", e.target.value)}
                placeholder="e.g. Sign up at tmx.com/launch"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hashtags / Mentions</Label>
              <Input
                value={form.hashtags}
                onChange={(e) => setField("hashtags", e.target.value)}
                placeholder="#TMX @TokenMinds"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Content URL (published)</Label>
              <Input
                value={form.contentUrl}
                onChange={(e) => setField("contentUrl", e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Revision count</Label>
              <Input
                type="number"
                min={0}
                value={form.revisionCount || ""}
                onChange={(e) =>
                  setField("revisionCount", Number(e.target.value))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Review notes</Label>
            <Textarea
              rows={2}
              value={form.reviewNotes}
              onChange={(e) => setField("reviewNotes", e.target.value)}
              placeholder="Feedback, revision requests…"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Internal notes</Label>
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
              {editId ? "Save changes" : "Create brief"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Brief Detail Drawer ─────────────────────────────────────────────────────

function initBriefForm(
  b: ContentBrief,
): Omit<ContentBrief, "id" | "createdAt" | "updatedAt"> {
  return {
    title: b.title,
    stageId: b.stageId,
    status: b.status,
    contentType: b.contentType,
    platform: b.platform,
    campaignId: b.campaignId,
    campaignTitle: b.campaignTitle,
    kolId: b.kolId,
    kolName: b.kolName,
    angle: b.angle,
    keyMessages: b.keyMessages,
    requirements: b.requirements,
    callToAction: b.callToAction,
    hashtags: b.hashtags,
    dueDate: b.dueDate,
    submittedDate: b.submittedDate,
    publishedDate: b.publishedDate,
    revisionCount: b.revisionCount,
    reviewNotes: b.reviewNotes,
    contentUrl: b.contentUrl,
    notes: b.notes,
  };
}

const fmtDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

function BriefDetailDrawer({
  brief,
  onClose,
}: {
  brief: ContentBrief | null;
  onClose: () => void;
}) {
  const { stages, updateBrief, deleteBrief } = useContentBriefStore();
  const { kols } = useKOLStore();
  const { campaigns } = useCampaignStore();
  const allCosts = useCostStore((s) => s.entries);

  const sortedStages = React.useMemo(
    () => [...stages].sort((a, b) => a.order - b.order),
    [stages],
  );

  const linkedCampaign = React.useMemo(
    () =>
      brief?.campaignId
        ? (campaigns.find((c) => c.id === brief.campaignId) ?? null)
        : null,
    [campaigns, brief?.campaignId],
  );
  const linkedCosts = React.useMemo(
    () => allCosts.filter((e) => e.contentBriefId === brief?.id),
    [allCosts, brief?.id],
  );
  const totalCostUSD = React.useMemo(
    () => linkedCosts.reduce((s, e) => s + (e.amountUSD || 0), 0),
    [linkedCosts],
  );

  const [form, setForm] = React.useState<
    Omit<ContentBrief, "id" | "createdAt" | "updatedAt">
  >(brief ? initBriefForm(brief) : emptyForm());
  const [kolOpen, setKolOpen] = React.useState(false);
  const [campaignOpen, setCampaignOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (brief) {
      setForm(initBriefForm(brief));
      setConfirmDelete(false);
    }
  }, [brief]);

  function setField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleKolSelect(kolId: string) {
    const kol = kols.find((k) => k.id === kolId);
    if (!kol) return;
    setForm((f) => ({ ...f, kolId, kolName: kol.name }));
  }

  function handleCampaignSelect(campaignId: string) {
    const campaign = campaigns.find((c) => c.id === campaignId);
    if (!campaign) return;
    setForm((f) => ({
      ...f,
      campaignId,
      campaignTitle: campaign.title,
      kolId: f.kolId || campaign.kolId,
      kolName: f.kolName || campaign.partnerName,
    }));
  }

  function handleSave() {
    if (!brief || !form.title) return;
    updateBrief(brief.id, form);
    onClose();
  }

  function handleDelete() {
    if (!brief) return;
    deleteBrief(brief.id);
    onClose();
  }

  return (
    <Sheet open={!!brief} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle className="truncate pr-6">
            {form.title || "Content Brief"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Campaign + Stage */}
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

          {/* KOL */}
          <div className="space-y-1.5">
            <Label>KOL / Partner</Label>
            <Popover open={kolOpen} onOpenChange={setKolOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  {form.kolName || "Select KOL…"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="start">
                <Command className="max-h-80">
                  <CommandInput placeholder="Search KOL…" />
                  <CommandList>
                    <CommandEmpty>No KOLs found.</CommandEmpty>
                    <CommandGroup>
                      {kols.map((k) => (
                        <CommandItem
                          key={k.id}
                          value={`${k.name} ${k.username}`}
                          onSelect={() => {
                            handleKolSelect(k.id);
                            setKolOpen(false);
                          }}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{k.name}</div>
                            <div className="text-xs text-muted-foreground">
                              @{k.username}
                            </div>
                          </div>
                          {form.kolId === k.id && (
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

          {/* Brief title */}
          <div className="space-y-1.5">
            <Label>
              Brief title <span className="text-destructive">*</span>
            </Label>
            <Input
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="Brief title…"
            />
          </div>

          {/* Type + Platform + Status */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Content type</Label>
              <Select
                value={form.contentType}
                onValueChange={(v) => setField("contentType", v as ContentType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) =>
                  setField("platform", v as ContentPlatform)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => setField("status", v as BriefStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRIEF_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Due date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setField("dueDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Submitted date</Label>
              <Input
                type="date"
                value={form.submittedDate}
                onChange={(e) => setField("submittedDate", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Published date</Label>
              <Input
                type="date"
                value={form.publishedDate}
                onChange={(e) => setField("publishedDate", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Angle / Narrative</Label>
            <Textarea
              rows={2}
              value={form.angle}
              onChange={(e) => setField("angle", e.target.value)}
              placeholder="The story angle…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Key messages</Label>
            <Textarea
              rows={3}
              value={form.keyMessages}
              onChange={(e) => setField("keyMessages", e.target.value)}
              placeholder={"\u2022 Point 1\n\u2022 Point 2"}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Requirements</Label>
            <Textarea
              rows={2}
              value={form.requirements}
              onChange={(e) => setField("requirements", e.target.value)}
              placeholder="Word count, format, tone…"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Call to action</Label>
              <Input
                value={form.callToAction}
                onChange={(e) => setField("callToAction", e.target.value)}
                placeholder="e.g. Sign up at tmx.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Hashtags / Mentions</Label>
              <Input
                value={form.hashtags}
                onChange={(e) => setField("hashtags", e.target.value)}
                placeholder="#TMX @TokenMinds"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Content URL</Label>
              <Input
                value={form.contentUrl}
                onChange={(e) => setField("contentUrl", e.target.value)}
                placeholder="https://…"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Revision count</Label>
              <Input
                type="number"
                min={0}
                value={form.revisionCount || ""}
                onChange={(e) =>
                  setField("revisionCount", Number(e.target.value))
                }
                placeholder="0"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Review notes</Label>
            <Textarea
              rows={2}
              value={form.reviewNotes}
              onChange={(e) => setField("reviewNotes", e.target.value)}
              placeholder="Feedback, revision requests…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Internal notes</Label>
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

          {/* Linked costs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Costs ({linkedCosts.length})
              </p>
              {totalCostUSD > 0 && (
                <span className="text-xs font-semibold text-foreground">
                  Total: $
                  {totalCostUSD.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </div>
            {linkedCosts.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No costs linked to this brief.
              </p>
            ) : (
              <div className="space-y-1.5">
                {linkedCosts.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2 gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">
                        {e.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {e.category} · Due {fmtDate(e.dueDate)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium">
                        {e.amount > 0
                          ? `${e.currency} ${e.amount.toLocaleString()}`
                          : "—"}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {e.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4 shrink-0">
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <p className="flex-1 text-sm text-foreground">
                Delete this brief?
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
                  if (brief) setForm(initBriefForm(brief));
                  setConfirmDelete(false);
                }}
              >
                Discard
              </Button>
              <Button
                size="sm"
                className="bg-[#FF4FD8] hover:bg-[#e040c0] text-white"
                disabled={!form.title || !form.stageId}
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

// ─── Stage Edit Dialog ────────────────────────────────────────────────────────

interface StageDialogProps {
  open: boolean;
  onClose: () => void;
  stage?: BriefStage;
}

function StageDialog({ open, onClose, stage }: StageDialogProps) {
  const { addStage, updateStage } = useContentBriefStore();
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

// ─── Brief Card (Kanban) ──────────────────────────────────────────────────────

interface BriefCardProps {
  brief: ContentBrief;
  highlight: boolean;
  stages: BriefStage[];
  onSelect: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

function BriefCard({
  brief,
  highlight,
  stages,
  onSelect,
  onDelete,
  isDragging = false,
}: BriefCardProps) {
  const { moveBriefToStage } = useContentBriefStore();
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  const idx = sortedStages.findIndex((s) => s.id === brief.stageId);

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
        <button
          onClick={onSelect}
          className="flex-1 text-left text-sm font-medium text-foreground leading-snug line-clamp-2 hover:text-[#FF4FD8] transition-colors cursor-pointer"
        >
          {brief.title}
        </button>
      </div>

      {brief.kolName && (
        <p className="text-xs text-muted-foreground truncate">
          KOL: {brief.kolName}
        </p>
      )}
      {brief.campaignTitle && (
        <p className="text-xs text-muted-foreground truncate">
          Campaign: {brief.campaignTitle}
        </p>
      )}

      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="outline"
          className={`text-[10px] ${STATUS_STYLE[brief.status]}`}
        >
          {brief.status}
        </Badge>
        <span className="text-[10px] text-muted-foreground bg-muted/60 rounded px-1.5 py-0.5">
          {brief.contentType}
        </span>
      </div>

      {brief.dueDate && (
        <p className="text-[10px] text-muted-foreground">
          Due:{" "}
          {new Date(brief.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      {/* Move between stages */}
      <div className="flex items-center gap-1 pt-0.5">
        <button
          onClick={() =>
            idx > 0 && moveBriefToStage(brief.id, sortedStages[idx - 1].id)
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
            moveBriefToStage(brief.id, sortedStages[idx + 1].id)
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

// ─── Draggable Brief Card ─────────────────────────────────────────────────────

function DraggableBriefCard(props: Omit<BriefCardProps, "isDragging">) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: props.brief.id,
    data: { brief: props.brief },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{ touchAction: "none" }}
      className={isDragging ? "opacity-30" : ""}
    >
      <BriefCard {...props} />
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

// ─── Tint map ─────────────────────────────────────────────────────────────────

const TINT_MAP: Record<string, string> = {
  "bg-slate-400": "bg-slate-50",
  "bg-blue-400": "bg-blue-50",
  "bg-amber-400": "bg-amber-50",
  "bg-violet-400": "bg-violet-50",
  "bg-orange-400": "bg-orange-50",
  "bg-pink-400": "bg-pink-50",
  "bg-emerald-400": "bg-emerald-50",
  "bg-teal-400": "bg-teal-50",
  "bg-red-400": "bg-red-50",
  "bg-indigo-400": "bg-indigo-50",
  "bg-cyan-400": "bg-cyan-50",
  "bg-lime-400": "bg-lime-50",
  "bg-yellow-400": "bg-yellow-50",
};

// ─── Kanban View ──────────────────────────────────────────────────────────────

interface KanbanViewProps {
  briefs: ContentBrief[];
  stages: BriefStage[];
  highlightId: string | null;
  onSelectBrief: (b: ContentBrief) => void;
  onEditStage: (s: BriefStage) => void;
  onDeleteStage: (s: BriefStage) => void;
  onAddStage: () => void;
}

function KanbanView({
  briefs,
  stages,
  highlightId,
  onSelectBrief,
  onEditStage,
  onDeleteStage,
  onAddStage,
}: KanbanViewProps) {
  const { reorderStage, moveBriefToStage } = useContentBriefStore();
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const [activeBrief, setActiveBrief] = React.useState<ContentBrief | null>(
    null,
  );
  const [overStageId, setOverStageId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  function handleDragStart(event: DragStartEvent) {
    const found = briefs.find((b) => b.id === event.active.id);
    setActiveBrief(found ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    setOverStageId(event.over ? String(event.over.id) : null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveBrief(null);
    setOverStageId(null);
    if (!over) return;
    const briefId = String(active.id);
    const targetStageId = String(over.id);
    const brief = briefs.find((b) => b.id === briefId);
    if (brief && brief.stageId !== targetStageId) {
      moveBriefToStage(briefId, targetStageId);
    }
  }

  function handleDragCancel() {
    setActiveBrief(null);
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
          const stageBriefs = briefs.filter((b) => b.stageId === stage.id);
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
                  ({stageBriefs.length})
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
                {stageBriefs.length === 0 && (
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
                {stageBriefs.map((b) => (
                  <DraggableBriefCard
                    key={b.id}
                    brief={b}
                    highlight={b.id === highlightId}
                    stages={stages}
                    onSelect={() => onSelectBrief(b)}
                    onDelete={() => {}}
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

      {/* Drag overlay */}
      <DragOverlay dropAnimation={null}>
        {activeBrief ? (
          <div className="w-64 rotate-2 scale-105 opacity-90 cursor-grabbing">
            <BriefCard
              brief={activeBrief}
              highlight={false}
              stages={stages}
              onSelect={() => {}}
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
  | "kolName"
  | "campaignTitle"
  | "status"
  | "contentType"
  | "platform"
  | "dueDate"
  | "publishedDate";
type SortDir = "asc" | "desc";

interface TableViewProps {
  briefs: ContentBrief[];
  stages: BriefStage[];
  highlightId: string | null;
  onSelectBrief: (b: ContentBrief) => void;
}

function TableView({
  briefs,
  stages,
  highlightId,
  onSelectBrief,
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
    return [...briefs].sort((a, b) => {
      const av: string = (a[sortKey] as string) ?? "";
      const bv: string = (b[sortKey] as string) ?? "";
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [briefs, sortKey, sortDir]);

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col)
      return <ArrowUpDown className="h-3 w-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 ml-1 text-[#FF4FD8]" />
    ) : (
      <ArrowDown className="h-3 w-3 ml-1 text-[#FF4FD8]" />
    );
  }

  function SortableHeader({ col, label }: { col: SortKey; label: string }) {
    return (
      <th
        className="py-3 px-4 text-left text-xs font-medium text-muted-foreground select-none cursor-pointer hover:text-foreground whitespace-nowrap"
        onClick={() => handleSort(col)}
      >
        <span className="inline-flex items-center gap-0.5">
          {label}
          <SortIcon col={col} />
        </span>
      </th>
    );
  }

  if (briefs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <FileText className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">No briefs found</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Create a new brief or adjust your filters.
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
              <SortableHeader col="title" label="Brief" />
              <SortableHeader col="kolName" label="KOL" />
              <SortableHeader col="campaignTitle" label="Campaign" />
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
                Stage
              </th>
              <SortableHeader col="status" label="Status" />
              <SortableHeader col="contentType" label="Content Type" />
              <SortableHeader col="platform" label="Platform" />
              <SortableHeader col="dueDate" label="Due" />
              <SortableHeader col="publishedDate" label="Published" />
              <th className="py-3 px-4 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">
                URL
              </th>
              <th className="py-3 px-4 text-right text-xs font-medium text-muted-foreground w-20 whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((b) => {
              const stage = stageMap[b.stageId];
              return (
                <tr
                  key={b.id}
                  className={`border-b border-border/20 last:border-0 transition-colors ${
                    b.id === highlightId ? "bg-[#FFF5FC]" : "hover:bg-muted/20"
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-foreground max-w-50">
                    <button
                      onClick={() => onSelectBrief(b)}
                      className="block truncate text-left hover:text-[#FF4FD8] transition-colors cursor-pointer"
                      title={b.title}
                    >
                      {b.title}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                    {b.kolName || "—"}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs max-w-40">
                    <span className="block truncate" title={b.campaignTitle}>
                      {b.campaignTitle || "—"}
                    </span>
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
                      className={`text-[10px] whitespace-nowrap ${STATUS_STYLE[b.status]}`}
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {b.contentType}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {b.platform}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {b.dueDate
                      ? new Date(b.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground text-xs whitespace-nowrap">
                    {b.publishedDate
                      ? new Date(b.publishedDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="py-3 px-4">
                    {b.contentUrl ? (
                      <a
                        href={b.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[#FF4FD8] hover:underline text-xs"
                      >
                        <LinkIcon className="h-3 w-3 shrink-0" />
                        View
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => onSelectBrief(b)}
                    >
                      Open
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="border-t border-border/40 bg-muted/10 px-4 py-2 text-xs text-muted-foreground">
        {sorted.length} {sorted.length === 1 ? "brief" : "briefs"}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function ContentBriefPageInner() {
  const searchParams = useSearchParams();
  const { briefs, stages, highlightId, setHighlightId } =
    useContentBriefStore();

  const [view, setView] = React.useState<"kanban" | "table">("kanban");

  // Detail drawer
  const [selectedBrief, setSelectedBrief] = React.useState<ContentBrief | null>(
    null,
  );

  // Filters
  const [search, setSearch] = React.useState("");
  const [filterStage, setFilterStage] = React.useState("all");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [filterType, setFilterType] = React.useState("all");

  // Create dialog
  const [briefDialogOpen, setBriefDialogOpen] = React.useState(false);

  // Stage dialogs
  const [stageDialogOpen, setStageDialogOpen] = React.useState(false);
  const [editingStage, setEditingStage] = React.useState<BriefStage | null>(
    null,
  );
  const [deleteStageTarget, setDeleteStageTarget] =
    React.useState<BriefStage | null>(null);

  // Auto-open dialog if ?new=1
  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setBriefDialogOpen(true);
    }
  }, [searchParams]);

  // Clear highlight after 3s
  React.useEffect(() => {
    if (!highlightId) return;
    const t = setTimeout(() => setHighlightId(null), 3000);
    return () => clearTimeout(t);
  }, [highlightId, setHighlightId]);

  // Keep drawer in sync with store
  const drawerBrief = React.useMemo(
    () =>
      selectedBrief
        ? (briefs.find((b) => b.id === selectedBrief.id) ?? null)
        : null,
    [briefs, selectedBrief],
  );

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    return briefs.filter((b) => {
      if (
        q &&
        !b.title.toLowerCase().includes(q) &&
        !b.kolName.toLowerCase().includes(q) &&
        !b.campaignTitle.toLowerCase().includes(q)
      )
        return false;
      if (filterStage !== "all" && b.stageId !== filterStage) return false;
      if (filterStatus !== "all" && b.status !== filterStatus) return false;
      if (filterType !== "all" && b.contentType !== filterType) return false;
      return true;
    });
  }, [briefs, search, filterStage, filterStatus, filterType]);

  const activeFilters = [
    search !== "",
    filterStage !== "all",
    filterStatus !== "all",
    filterType !== "all",
  ].filter(Boolean).length;

  function clearFilters() {
    setSearch("");
    setFilterStage("all");
    setFilterStatus("all");
    setFilterType("all");
  }

  function handleEditStage(s: BriefStage) {
    setEditingStage(s);
    setStageDialogOpen(true);
  }

  function handleDeleteStageConfirm() {
    if (deleteStageTarget) {
      useContentBriefStore.getState().deleteStage(deleteStageTarget.id);
      setDeleteStageTarget(null);
    }
  }

  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-1 flex-col gap-5 p-6 bg-background min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Content &amp; Briefs
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Draft, send, and track content briefs per KOL. Linked to campaigns
            and partners.
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
            onClick={() => setBriefDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New brief
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-50">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search briefs, KOLs, or campaigns…"
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    {sortedStages.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground font-medium">
                  Status
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {BRIEF_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground font-medium">
                  Content type
                </label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {CONTENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Views */}
      {view === "kanban" ? (
        <KanbanView
          briefs={filtered}
          stages={stages}
          highlightId={highlightId}
          onSelectBrief={setSelectedBrief}
          onEditStage={handleEditStage}
          onDeleteStage={(s) => setDeleteStageTarget(s)}
          onAddStage={() => {
            setEditingStage(null);
            setStageDialogOpen(true);
          }}
        />
      ) : (
        <TableView
          briefs={filtered}
          stages={stages}
          highlightId={highlightId}
          onSelectBrief={setSelectedBrief}
        />
      )}

      {/* Dialogs */}
      {/* Create-only dialog */}
      <BriefDialog
        open={briefDialogOpen}
        onClose={() => setBriefDialogOpen(false)}
      />

      {/* Detail drawer (edit / delete) */}
      <BriefDetailDrawer
        brief={drawerBrief}
        onClose={() => setSelectedBrief(null)}
      />

      <StageDialog
        open={stageDialogOpen}
        onClose={() => {
          setStageDialogOpen(false);
          setEditingStage(null);
        }}
        stage={editingStage ?? undefined}
      />

      {/* Delete stage confirm */}
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
              Briefs in this stage will be moved to the first available stage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStageConfirm}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ContentBriefPage() {
  return (
    <Suspense>
      <ContentBriefPageInner />
    </Suspense>
  );
}
