"use client";

import * as React from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MessageCircle,
  X as XIcon,
  BadgeCheck,
  Globe,
  TrendingUp,
  Users,
  Eye,
  BarChart3,
  Calendar,
  Tag,
  DollarSign,
  Activity,
  CheckCircle2,
  Clock,
  PauseCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useCampaignStore,
  type DealStatus,
  type OutreachStage,
  type PlacementType,
  type Currency,
} from "@/lib/campaign-store";
import {
  KOL_DATA,
  formatFollowers,
  type KOLPlatform,
  type KOLRisk,
  type ContactMethod,
} from "@/lib/kol-data";

// ─── Inline deal dialog (Add to Campaign) ─────────────────────────────────────

const DEAL_STATUSES: DealStatus[] = [
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

interface AddToCampaignDialogProps {
  open: boolean;
  onClose: () => void;
  kolId: string;
  partnerName: string;
}

function AddToCampaignDialog({
  open,
  onClose,
  kolId,
  partnerName,
}: AddToCampaignDialogProps) {
  const { stages, addCampaign, setHighlightId } = useCampaignStore();
  const router = useRouter();
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);

  const [title, setTitle] = React.useState("");
  const [stageId, setStageId] = React.useState("");
  const [dealStatus, setDealStatus] = React.useState<DealStatus>("Active");
  const [outreachStage, setOutreachStage] =
    React.useState<OutreachStage>("Not Contacted");
  const [placementType, setPlacementType] =
    React.useState<PlacementType>("Sponsored Post");
  const [budget, setBudget] = React.useState("");
  const [currency, setCurrency] = React.useState<Currency>("USD");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [lastContact, setLastContact] = React.useState("");
  const [nextFollowUp, setNextFollowUp] = React.useState("");
  const [goal, setGoal] = React.useState("");
  const [negotiationNotes, setNegotiationNotes] = React.useState("");
  const [requirements, setRequirements] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTitle(partnerName);
      setStageId(sortedStages[0]?.id ?? "");
      setDealStatus("Active");
      setOutreachStage("Not Contacted");
      setPlacementType("Sponsored Post");
      setBudget("");
      setCurrency("USD");
      setStartDate("");
      setEndDate("");
      setLastContact("");
      setNextFollowUp("");
      setGoal("");
      setNegotiationNotes("");
      setRequirements("");
      setNotes("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !stageId) return;
    const id = addCampaign({
      title,
      kolId,
      partnerName,
      stageId,
      dealStatus,
      outreachStage,
      placementType,
      budget: Number(budget) || 0,
      currency,
      startDate,
      endDate,
      lastContact,
      nextFollowUp,
      goal,
      negotiationNotes,
      requirements,
      notes,
    });
    setHighlightId(id);
    onClose();
    router.push("/dashboard/campaign");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Campaign</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-1">
          {/* Partner (locked) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Partner</Label>
              <Input value={partnerName} disabled className="bg-muted/50" />
            </div>
            <div className="space-y-1.5">
              <Label>Stage</Label>
              <Select value={stageId} onValueChange={setStageId}>
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

          <div className="space-y-1.5">
            <Label>
              Deal name <span className="text-destructive">*</span>
            </Label>
            <Input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sponsored post — ilodiwow"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Outreach stage</Label>
              <Select
                value={outreachStage}
                onValueChange={(v) => setOutreachStage(v as OutreachStage)}
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
              <Label>Deal status</Label>
              <Select
                value={dealStatus}
                onValueChange={(v) => setDealStatus(v as DealStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEAL_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Placement type</Label>
              <Select
                value={placementType}
                onValueChange={(v) => setPlacementType(v as PlacementType)}
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
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select
                value={currency}
                onValueChange={(v) => setCurrency(v as Currency)}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Start date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>End date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Last contact</Label>
              <Input
                type="date"
                value={lastContact}
                onChange={(e) => setLastContact(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Next follow up</Label>
              <Input
                type="date"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-1.5">
            <Label>Goal</Label>
            <Textarea
              rows={2}
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe the campaign goal…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Negotiation notes</Label>
            <Textarea
              rows={2}
              value={negotiationNotes}
              onChange={(e) => setNegotiationNotes(e.target.value)}
              placeholder="Notes from negotiation…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Requirements</Label>
            <Textarea
              rows={2}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Content requirements…"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
              disabled={!title || !stageId}
            >
              Add to Campaign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

const PLATFORM_LABEL: Record<KOLPlatform, string> = {
  X: "X (Twitter)",
  YouTube: "YouTube",
  Instagram: "Instagram",
  TikTok: "TikTok",
  Telegram: "Telegram",
  Discord: "Discord",
};

const PLATFORM_COLOR: Record<KOLPlatform, string> = {
  X: "bg-black text-white",
  YouTube: "bg-red-600 text-white",
  Instagram: "bg-gradient-to-r from-purple-600 to-pink-500 text-white",
  TikTok: "bg-black text-white",
  Telegram: "bg-sky-500 text-white",
  Discord: "bg-indigo-600 text-white",
};

const RISK_STYLE: Record<KOLRisk, { badge: string; bar: string }> = {
  Low: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
  },
  Medium: {
    badge: "bg-yellow-50 text-yellow-700 border-yellow-200",
    bar: "bg-yellow-500",
  },
  High: { badge: "bg-red-50 text-red-700 border-red-200", bar: "bg-red-500" },
};

const CONTACT_ICON: Record<ContactMethod["type"], React.ReactNode> = {
  Email: <Mail className="h-3.5 w-3.5" />,
  Telegram: <MessageCircle className="h-3.5 w-3.5" />,
  Discord: <Activity className="h-3.5 w-3.5" />,
  "Twitter DM": <XIcon className="h-3.5 w-3.5" />,
  WhatsApp: <MessageCircle className="h-3.5 w-3.5" />,
};

const CAMPAIGN_STATUS_ICON = {
  Completed: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  Active: <Activity className="h-4 w-4 text-blue-500" />,
  Paused: <PauseCircle className="h-4 w-4 text-yellow-500" />,
};

const CAMPAIGN_STATUS_STYLE = {
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Active: "bg-blue-50 text-blue-700 border-blue-200",
  Paused: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-muted-foreground font-medium">{label}</p>
            <p className="text-xl font-bold text-foreground mt-0.5">{value}</p>
            {sub && (
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            )}
          </div>
          <div className="rounded-lg bg-[#FFF5FC] p-2 shrink-0">
            <Icon className="h-4 w-4 text-[#FF4FD8]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function KolDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const kol = KOL_DATA.find((k) => k.id === id);
  if (!kol) notFound();

  const [addToCampaignOpen, setAddToCampaignOpen] = React.useState(false);

  const initials = kol.name
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const totalCampaignReach = kol.campaigns.reduce((s, c) => s + c.reach, 0);
  const totalCampaignBudget = kol.campaigns.reduce((s, c) => s + c.budget, 0);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-background min-h-screen">
      {/* Back */}
      <div>
        <Link href="/dashboard/database-partner">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Database Partner
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="border border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-[#FF4FD8] to-[#A855F7] flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {initials}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground">
                  {kol.name}
                </h1>
                {kol.verified && (
                  <BadgeCheck className="h-5 w-5 text-[#FF4FD8]" />
                )}
                <Badge
                  variant="outline"
                  className={`text-xs ${RISK_STYLE[kol.risk].badge}`}
                >
                  {kol.risk} Risk
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                @{kol.username}
              </p>
              <p className="text-sm text-foreground leading-relaxed max-w-2xl">
                {kol.bio}
              </p>

              {/* Meta tags */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {kol.country}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {kol.niche}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined{" "}
                  {new Date(kol.joinedDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Last active{" "}
                  {new Date(kol.lastActivity).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>

              {/* Languages */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {kol.languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
                {kol.platforms.map((p) => (
                  <span
                    key={p}
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_COLOR[p]}`}
                  >
                    {PLATFORM_LABEL[p]}
                  </span>
                ))}
              </div>
            </div>

            {/* Contacts + Actions */}
            <div className="flex flex-col gap-3 min-w-45">
              <Button
                size="sm"
                className="gap-1.5 bg-[#FF4FD8] hover:bg-[#e040c0] text-white w-full"
                onClick={() => setAddToCampaignOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add to Campaign
              </Button>
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Contacts
                </p>
                {kol.contacts.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <span className="text-muted-foreground">
                      {CONTACT_ICON[c.type]}
                    </span>
                    <span className="text-xs">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          label="Total Followers"
          value={formatFollowers(kol.totalFollowers)}
          sub={`Primary: ${kol.primaryPlatform}`}
          icon={Users}
        />
        <StatCard
          label="Total Reach"
          value={formatFollowers(kol.totalReach)}
          sub="Across all platforms"
          icon={Eye}
        />
        <StatCard
          label="Avg Engagement"
          value={`${kol.avgEngagementRate}%`}
          sub="All platforms avg"
          icon={TrendingUp}
        />
        <StatCard
          label="Posts / Month"
          value={kol.totalPostsLastMonth.toString()}
          sub="Last 30 days"
          icon={BarChart3}
        />
        <StatCard
          label="Monthly Impressions"
          value={formatFollowers(kol.totalImpressionsLastMonth)}
          sub="Last 30 days"
          icon={Activity}
        />
        <StatCard
          label="Campaigns Done"
          value={kol.campaigns.length.toString()}
          sub={`$${totalCampaignBudget.toLocaleString()} total`}
          icon={DollarSign}
        />
      </div>

      {/* Two Column: Platform Stats + Audience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Platform Breakdown */}
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Platform Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {kol.platformStats.map((ps) => (
                <div key={ps.platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${PLATFORM_COLOR[ps.platform]}`}
                      >
                        {ps.platform}
                      </span>
                      <a
                        href={ps.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#FF4FD8] hover:underline"
                      >
                        {ps.handle}
                      </a>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {formatFollowers(ps.followers)} followers
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/40 p-2">
                      <p className="text-xs text-muted-foreground">Avg Views</p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatFollowers(ps.avgViews)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2">
                      <p className="text-xs text-muted-foreground">
                        Engagement
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {ps.engagementRate}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-2">
                      <p className="text-xs text-muted-foreground">Posts/mo</p>
                      <p className="text-sm font-semibold text-foreground">
                        {ps.postsPerMonth}
                      </p>
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Audience Demographics */}
        <div className="flex flex-col gap-5">
          {/* Age Groups */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                Audience Age Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {kol.audienceDemographics.map((d) => (
                <div key={d.ageGroup} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{d.ageGroup}</span>
                    <span className="font-medium text-foreground">
                      {d.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#FF4FD8] to-[#A855F7]"
                      style={{ width: `${d.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-foreground">
                Top Audience Countries
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {kol.topAudienceCountries.map((c) => (
                <div key={c.country} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{c.country}</span>
                    <span className="font-medium text-foreground">
                      {c.percentage}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-[#FF4FD8] to-[#A855F7]"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rate Card + Tags + Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Rate Card */}
        <Card className="border border-border/50 shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Rate Card
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                      Platform
                    </th>
                    <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                      Content Type
                    </th>
                    <th className="pb-2 text-right text-xs font-medium text-muted-foreground">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {kol.rateCard.map((r, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/20 last:border-0"
                    >
                      <td className="py-2.5">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold ${PLATFORM_COLOR[r.platform]}`}
                        >
                          {r.platform}
                        </span>
                      </td>
                      <td className="py-2.5 text-foreground">
                        {r.contentType}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-foreground">
                        {r.currency} {r.price.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tags + Notes */}
        <div className="flex flex-col gap-4">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                {kol.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {kol.notes}
              </p>
              {kol.riskReason && (
                <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-xs text-emerald-700">
                    <span className="font-semibold">Risk note: </span>
                    {kol.riskReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Campaign History */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground">
              Campaign History
            </CardTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>
                Total Reach:{" "}
                <span className="font-semibold text-foreground">
                  {formatFollowers(totalCampaignReach)}
                </span>
              </span>
              <span>
                Total Spend:{" "}
                <span className="font-semibold text-foreground">
                  ${totalCampaignBudget.toLocaleString()}
                </span>
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Campaign
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="pb-2 text-right text-xs font-medium text-muted-foreground">
                    Budget
                  </th>
                  <th className="pb-2 text-right text-xs font-medium text-muted-foreground">
                    Reach
                  </th>
                  <th className="pb-2 text-right text-xs font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {kol.campaigns.map((c, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/20 last:border-0"
                  >
                    <td className="py-2.5 font-medium text-foreground">
                      {c.campaignName}
                    </td>
                    <td className="py-2.5 text-muted-foreground">{c.client}</td>
                    <td className="py-2.5 text-muted-foreground">
                      {new Date(c.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 text-right font-medium text-foreground">
                      ${c.budget.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-right text-foreground">
                      {formatFollowers(c.reach)}
                    </td>
                    <td className="py-2.5 text-right">
                      <Badge
                        variant="outline"
                        className={`text-xs gap-1 ${CAMPAIGN_STATUS_STYLE[c.status]}`}
                      >
                        {CAMPAIGN_STATUS_ICON[c.status]}
                        {c.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add to Campaign dialog */}
      <AddToCampaignDialog
        open={addToCampaignOpen}
        onClose={() => setAddToCampaignOpen(false)}
        kolId={kol.id}
        partnerName={kol.name}
      />
    </div>
  );
}
