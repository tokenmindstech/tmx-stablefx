"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Megaphone,
  Coins,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  HelpCircle,
  Database,
  GitBranch,
  FileText,
  ShieldCheck,
  ArrowRightLeft,
  Landmark,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  BookMarked,
  BarChart3,
  Zap,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

// ── Nav ──────────────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { id: "home", label: "Home", icon: Home, items: [] },
  { id: "bookmarks", label: "Bookmarks", icon: BookMarked, items: [] },
  {
    id: "geo-kol",
    label: "GEO / KOL",
    icon: Megaphone,
    items: [
      { label: "Database Partner", icon: Database },
      { label: "Campaign", icon: Megaphone },
      { label: "Pipeline", icon: GitBranch },
      { label: "Content / Brief", icon: FileText },
      { label: "Cost", icon: DollarSign },
    ],
  },
  {
    id: "tge",
    label: "TGE",
    icon: Coins,
    items: [
      { label: "Token Information", icon: Coins },
      { label: "User List", icon: Users },
      { label: "KYC List", icon: ShieldCheck },
      { label: "Transactions", icon: ArrowRightLeft },
      { label: "ICO / STO", icon: Landmark },
    ],
  },
  { id: "marketing", label: "Marketing", icon: TrendingUp, items: [] },
  { id: "analytics", label: "Analytics", icon: BarChart3, items: [] },
  { id: "automation", label: "Automation", icon: Zap, items: [] },
  { id: "reporting", label: "Reporting", icon: Activity, items: [] },
];

const NAV_BOTTOM = [
  { id: "help", label: "Help", icon: HelpCircle, items: [] },
  { id: "settings", label: "Settings", icon: Settings, items: [] },
];

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  {
    title: "Total Partners",
    value: "2,847",
    change: "+12.5%",
    up: true,
    icon: Users,
  },
  {
    title: "Active Campaigns",
    value: "24",
    change: "+4.2%",
    up: true,
    icon: Activity,
  },
  {
    title: "Revenue",
    value: "$1.2M",
    change: "+18.7%",
    up: true,
    icon: DollarSign,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    up: false,
    icon: TrendingUp,
  },
];

const activities = [
  { name: "New partner onboarded", time: "2 hours ago", badge: "Partner" },
  { name: "Campaign launched", time: "4 hours ago", badge: "Campaign" },
  { name: "KYC approved", time: "1 day ago", badge: "KYC" },
  { name: "Deal closed", time: "2 days ago", badge: "Deal" },
  { name: "Token sale started", time: "3 days ago", badge: "TGE" },
];

const pipeline = [
  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, pct: 57, color: "#e879f9" },
  { stage: "Proposal", count: 45, pct: 29, color: "#d946ef" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#a855f7" },
  { stage: "Closed", count: 12, pct: 8, color: "#7c3aed" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Layout12() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("geo-kol");
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [flyoutY, setFlyoutY] = React.useState(0);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const sidebarW = collapsed ? 56 : 220;
  const allNav = [...NAV_MAIN, ...NAV_BOTTOM];
  const hoveredNav = allNav.find((i) => i.id === hoveredItem);
  const showFlyout = !!(hoveredNav && hoveredNav.items.length > 0);

  function openFlyout(id: string, e: React.MouseEvent) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFlyoutY(rect.top);
    setHoveredItem(id);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setHoveredItem(null), 150);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col border-r border-border bg-white shrink-0 z-40 transition-[width] duration-200"
        style={{ width: sidebarW }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-14 border-b border-border px-3 shrink-0 overflow-hidden"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 0 : 10,
          }}
        >
          <div
            className="size-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
          >
            TM
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              TMX Marketing
            </span>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-1.5 px-1.5">
          {NAV_MAIN.map((item) => {
            const isActive = activeItem === item.id;
            const hasChildren = item.items.length > 0;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={(e) => openFlyout(item.id, e)}
                onMouseLeave={scheduleClose}
                className={[
                  "w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors relative mb-0.5",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-[#FFF5FC] text-[#FF4FD8]"
                    : "text-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
                ].join(" ")}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                    {hasChildren && (
                      <ChevronRight className="size-3.5 shrink-0 opacity-40" />
                    )}
                  </>
                )}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: "#FF4FD8" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border pt-1.5 pb-2 px-1.5 space-y-0.5">
          {NAV_BOTTOM.map((item) => {
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={(e) => openFlyout(item.id, e)}
                onMouseLeave={scheduleClose}
                className={[
                  "w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-[#FFF5FC] text-[#FF4FD8]"
                    : "text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
                ].join(" ")}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            className={[
              "w-full flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8] transition-colors",
              collapsed ? "justify-center" : "",
            ].join(" ")}
          >
            {collapsed ? (
              <ChevronRight className="size-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="size-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* ── Flyout submenu (hover-triggered) ── */}
      {showFlyout && hoveredNav && (
        <div
          className="fixed z-50 bg-white border border-border rounded-lg shadow-xl overflow-hidden"
          style={{
            left: sidebarW + 4,
            top: flyoutY,
            minWidth: 208,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {hoveredNav.label}
            </span>
          </div>
          <div className="py-1">
            {hoveredNav.items.map((sub, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8] transition-colors"
              >
                <sub.icon className="size-3.5 shrink-0 text-muted-foreground" />
                <span>{sub.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-white flex items-center gap-3 px-4 shrink-0">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <input
              placeholder="Find or Ask..."
              className="w-full h-8 pl-8 pr-3 text-sm rounded-md border border-input bg-muted/40 focus:outline-none focus:ring-1 focus:ring-[#FF4FD8] focus:border-[#FF4FD8] transition-colors"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
              title="Help"
            >
              <HelpCircle className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8] relative"
              title="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#FF4FD8]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
              title="Settings"
            >
              <Settings className="size-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium ml-1 text-white border-0"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
              }}
            >
              <Sparkles className="size-3.5" />
              AI Assistant
            </Button>
            <div
              className="ml-1 size-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer shrink-0"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
              }}
              title="Profile"
            >
              A
            </div>
            <Link
              href="/dashboard/layouts"
              className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4 ml-3 whitespace-nowrap"
            >
              ← Layouts
            </Link>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back! Here&apos;s your marketing overview.
            </p>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.title} className="border border-border/50 shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.title}
                  </CardTitle>
                  <div className="rounded-lg bg-[#FFF5FC] p-2">
                    <s.icon className="h-4 w-4 text-[#FF4FD8]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    {s.up ? (
                      <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${s.up ? "text-emerald-600" : "text-red-500"}`}
                    >
                      {s.change}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      from last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chart + Activity */}
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4 border border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Campaign Performance</CardTitle>
                    <CardDescription>Monthly metrics</CardDescription>
                  </div>
                  <Badge className="bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/20 hover:bg-[#FFF5FC]">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-56 flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    Campaign analytics chart
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 border border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {activities.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="size-6 rounded-full bg-[#FFF5FC] flex items-center justify-center shrink-0">
                        <div className="size-1.5 rounded-full bg-[#FF4FD8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.time}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">
                        {a.badge}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline + TGE */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>Pipeline Overview</CardTitle>
                <CardDescription>Current deal stages</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pipeline.map((p) => (
                  <div key={p.stage} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{p.stage}</span>
                      <span className="text-muted-foreground">
                        {p.count} deals
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle>TGE Statistics</CardTitle>
                <CardDescription>Token generation progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "Total Users", value: "12,847" },
                  { label: "KYC Verified", value: "9,234" },
                  { label: "Transactions", value: "45,678" },
                  { label: "Tokens Sold", value: "2.4M" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex justify-between py-1 border-b border-border/40 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground">
                      {r.label}
                    </span>
                    <span className="text-sm font-semibold">{r.value}</span>
                  </div>
                ))}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Target progress</span>
                    <span className="font-medium" style={{ color: "#FF4FD8" }}>
                      68%
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "68%",
                        background: "linear-gradient(90deg, #FF4FD8, #7c3aed)",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
