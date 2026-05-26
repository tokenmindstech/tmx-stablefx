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
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  Coins,
  LayoutDashboard,
  Settings,
  LifeBuoy,
  Bell,
  Search,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "GEO / KOL", icon: Megaphone, active: false },
  { label: "TGE", icon: Coins, active: false },
  { label: "Support", icon: LifeBuoy, active: false },
  { label: "Settings", icon: Settings, active: false },
];

const stats = [
  {
    title: "Total Partners",
    value: "2,847",
    change: "+12.5%",
    type: "positive" as const,
    icon: Users,
  },
  {
    title: "Active Campaigns",
    value: "24",
    change: "+4.2%",
    type: "positive" as const,
    icon: Activity,
  },
  {
    title: "Revenue",
    value: "$1.2M",
    change: "+18.7%",
    type: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    type: "negative" as const,
    icon: TrendingUp,
  },
];

const pipeline = [
  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, pct: 57, color: "#FF5BEF" },
  { stage: "Proposal", count: 45, pct: 29, color: "#E93DFF" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#C45BFF" },
  { stage: "Closed", count: 12, pct: 8, color: "#A855F7" },
];

export default function Layout3() {
  const [activeNav, setActiveNav] = React.useState("Dashboard");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-14 items-center gap-4 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#FF4FD8] text-white shrink-0">
              <span className="text-xs font-bold">TM</span>
            </div>
            <span className="font-semibold text-sm text-foreground hidden sm:block">
              TMX Marketing
            </span>
          </div>

          {/* Nav tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeNav === item.label
                    ? "bg-[#FFF5FC] text-[#FF4FD8]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                }`}
              >
                <item.icon className="size-3.5" />
                <span className="hidden md:block">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
            >
              <Search className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[#FFF5FC] hover:text-[#FF4FD8] relative"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#FF4FD8]" />
            </Button>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#FF4FD8] to-[#A855F7] flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 p-6 max-w-screen-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back! Here's your marketing overview.
            </p>
          </div>
          <Link
            href="/dashboard/layouts"
            className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4"
          >
            ← All layouts
          </Link>
        </div>

        {/* Stats - full width 4 columns */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
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
                  {s.type === "positive" ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs ${s.type === "positive" ? "text-emerald-600" : "text-red-500"}`}
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

        {/* Main content - wider charts benefit from no sidebar */}
        <div className="grid gap-4 xl:grid-cols-3 mb-6">
          <Card className="xl:col-span-2 border border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>
                    Track metrics across all active campaigns
                  </CardDescription>
                </div>
                <Badge className="bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/20 hover:bg-[#FFF5FC]">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  Full-width campaign analytics chart
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Pipeline Overview</CardTitle>
              <CardDescription>Current deal stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pipeline.map((p) => (
                  <div key={p.stage} className="space-y-1">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{p.stage}</span>
                      <span className="text-muted-foreground text-xs">
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom row - 3 columns, benefits from full width */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest pipeline updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  {
                    name: "New partner onboarded",
                    time: "2h ago",
                    badge: "Partner",
                  },
                  {
                    name: "Campaign launched",
                    time: "4h ago",
                    badge: "Campaign",
                  },
                  { name: "Deal closed", time: "1d ago", badge: "Deal" },
                  { name: "KYC approved", time: "2d ago", badge: "KYC" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FF4FD8] shrink-0" />
                    <span className="text-sm flex-1 truncate">{a.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>TGE Progress</CardTitle>
              <CardDescription>Token generation stats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: "Total Users", value: "12,847" },
                  { label: "KYC Verified", value: "9,234" },
                  { label: "Transactions", value: "45,678" },
                  { label: "Tokens Sold", value: "2.4M" },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex justify-between items-center text-sm py-0.5"
                  >
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-semibold">{r.value}</span>
                  </div>
                ))}
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "68%",
                      background: "linear-gradient(90deg, #FF4FD8, #A855F7)",
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  68% of target reached
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "New Campaign", icon: Megaphone },
                  { label: "Add Partner", icon: Users },
                  { label: "View Reports", icon: TrendingUp },
                  { label: "TGE Settings", icon: Coins },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border/60 hover:border-[#FF4FD8]/40 hover:bg-[#FFF5FC] transition-all text-center group"
                  >
                    <action.icon className="size-4 text-muted-foreground group-hover:text-[#FF4FD8] transition-colors" />
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-[#FF4FD8] transition-colors">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
