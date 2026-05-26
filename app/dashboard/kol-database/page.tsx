"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Upload,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  ChevronsLeft,
  ChevronsRight,
  BadgeCheck,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  KOL_DATA,
  KOL_NICHES,
  KOL_PLATFORMS,
  formatFollowers,
  type KOLNiche,
  type KOLPlatform,
  type KOLRisk,
} from "@/lib/kol-data";

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];

const PLATFORM_ICON: Record<KOLPlatform, string> = {
  X: "𝕏",
  YouTube: "▶",
  Instagram: "📷",
  TikTok: "♪",
  Telegram: "✈",
  Discord: "🎮",
};

const RISK_STYLE: Record<KOLRisk, string> = {
  Low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  High: "bg-red-50 text-red-700 border-red-200",
};

export default function KolDatabasePage() {
  const [search, setSearch] = React.useState("");
  const [niche, setNiche] = React.useState<string>("any");
  const [region, setRegion] = React.useState<string>("any");
  const [platform, setPlatform] = React.useState<string>("all");
  const [risk, setRisk] = React.useState<string>("all");
  const [minFollowers, setMinFollowers] = React.useState<string>("0");
  const [maxFollowers, setMaxFollowers] = React.useState<string>("");
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const regions = React.useMemo(() => {
    const r = new Set(KOL_DATA.map((k) => k.region));
    return Array.from(r).sort();
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    const min = parseInt(minFollowers) || 0;
    const max = maxFollowers ? parseInt(maxFollowers) : Infinity;

    return KOL_DATA.filter((kol) => {
      if (
        q &&
        !kol.name.toLowerCase().includes(q) &&
        !kol.languages.some((l) => l.toLowerCase().includes(q))
      )
        return false;
      if (niche !== "any" && kol.niche !== niche) return false;
      if (region !== "any" && kol.region !== region) return false;
      if (
        platform !== "all" &&
        !kol.platforms.includes(platform as KOLPlatform)
      )
        return false;
      if (risk !== "all" && kol.risk !== risk) return false;
      if (kol.totalFollowers < min) return false;
      if (kol.totalFollowers > max) return false;
      return true;
    });
  }, [search, niche, region, platform, risk, minFollowers, maxFollowers]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (p: number) =>
    setPage(Math.max(1, Math.min(p, totalPages)));

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-background min-h-screen">
              {/* Page Header */}
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    KOL Database
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    All KOLs across campaigns. Assign them to a campaign from
                    that campaign&apos;s detail page.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Upload className="h-4 w-4" />
                    Upload CSV
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 bg-[#FF4FD8] hover:bg-[#e040c0] text-white"
                  >
                    <Plus className="h-4 w-4" />
                    New KOL
                  </Button>
                </div>
              </div>

              {/* Search + Filters */}
              <div className="rounded-xl border border-border/60 bg-card p-4 shadow-sm">
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or language"
                    className="pl-9 bg-background"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                {/* Filter Row */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {/* Niche */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Niche
                    </label>
                    <Select
                      value={niche}
                      onValueChange={(v) => {
                        setNiche(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm bg-background">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {KOL_NICHES.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Region */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Region
                    </label>
                    <Select
                      value={region}
                      onValueChange={(v) => {
                        setRegion(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm bg-background">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        {regions.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Platform */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Platform
                    </label>
                    <Select
                      value={platform}
                      onValueChange={(v) => {
                        setPlatform(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm bg-background">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {KOL_PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Risk */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Risk
                    </label>
                    <Select
                      value={risk}
                      onValueChange={(v) => {
                        setRisk(v);
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 text-sm bg-background">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Min Followers */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Min followers
                    </label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      className="h-8 text-sm bg-background"
                      value={minFollowers}
                      onChange={(e) => {
                        setMinFollowers(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>

                  {/* Max Followers */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-muted-foreground font-medium">
                      Max followers
                    </label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="∞"
                      className="h-8 text-sm bg-background"
                      value={maxFollowers}
                      onChange={(e) => {
                        setMaxFollowers(e.target.value);
                        setPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/30">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">
                          #
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[160px]">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[140px]">
                          Niche
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[140px]">
                          Region
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[100px]">
                          Platforms
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[100px]">
                          Followers
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[80px]">
                          Risk
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground min-w-[120px]">
                          Contacts
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground w-20"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-4 py-12 text-center text-muted-foreground"
                          >
                            No KOLs found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        paginated.map((kol, i) => (
                          <tr
                            key={kol.id}
                            className="border-b border-border/40 hover:bg-muted/20 transition-colors"
                          >
                            {/* # */}
                            <td className="px-4 py-3 text-muted-foreground">
                              {(currentPage - 1) * rowsPerPage + i + 1}
                            </td>

                            {/* Name */}
                            <td className="px-4 py-3">
                              <Link
                                href={`/dashboard/kol-database/${kol.id}`}
                                className="group flex flex-col gap-0.5"
                              >
                                <span className="flex items-center gap-1.5 font-medium text-[#FF4FD8] group-hover:underline">
                                  {kol.name}
                                  {kol.verified && (
                                    <BadgeCheck className="h-3.5 w-3.5 text-[#FF4FD8]" />
                                  )}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {kol.username}
                                </span>
                              </Link>
                            </td>

                            {/* Niche */}
                            <td className="px-4 py-3 text-foreground">
                              {kol.niche}
                            </td>

                            {/* Region */}
                            <td className="px-4 py-3 text-foreground">
                              {kol.region}
                            </td>

                            {/* Platforms */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 flex-wrap">
                                {kol.platforms.map((p) => (
                                  <span
                                    key={p}
                                    className="text-xs font-semibold text-muted-foreground"
                                    title={p}
                                  >
                                    {PLATFORM_ICON[p]}
                                  </span>
                                ))}
                              </div>
                            </td>

                            {/* Followers */}
                            <td className="px-4 py-3">
                              <span
                                className="font-medium text-foreground underline decoration-dotted cursor-help"
                                title={`Total reach: ${formatFollowers(kol.totalReach)}`}
                              >
                                {formatFollowers(kol.totalFollowers)}
                              </span>
                            </td>

                            {/* Risk */}
                            <td className="px-4 py-3">
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium ${RISK_STYLE[kol.risk]}`}
                              >
                                {kol.risk}
                              </Badge>
                            </td>

                            {/* Contacts */}
                            <td className="px-4 py-3 text-muted-foreground text-xs">
                              {kol.contacts.length === 0
                                ? "0 methods"
                                : `${kol.contacts.length} method${kol.contacts.length > 1 ? "s" : ""}`}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Rows per page
                    </span>
                    <Select
                      value={rowsPerPage.toString()}
                      onValueChange={(v) => {
                        setRowsPerPage(parseInt(v));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="h-7 w-16 text-xs bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROWS_PER_PAGE_OPTIONS.map((n) => (
                          <SelectItem key={n} value={n.toString()}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">
                      {filtered.length === 0
                        ? "0 results"
                        : `${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, filtered.length)} of ${filtered.length}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </Button>
                    <span className="text-xs text-muted-foreground px-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
